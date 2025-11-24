from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Promise, PromiseReceiver
from .serializers import PromiseSerializer
from users.models import Notification, CustomUser
from django.db import IntegrityError
from django.db.models import F
from django.db import transaction


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_promise(request):

    giver = request.user
    title = request.data.get("title")
    receiver_ids = request.data.get("receiver_ids", [])
    description = request.data.get("description")
    resolution_date = request.data.get("resolution_date")
    majority_vote = request.data.get("majority_vote")
    stake_amount = request.data.get("stake_amount", 0)

    if not receiver_ids or not isinstance(receiver_ids, list):
        return Response({"error": "receiver_ids must be a list of user IDs."}, status=status.HTTP_400_BAD_REQUEST)

    if giver.id in receiver_ids:
        return Response({"error": "You cannot send a promise to yourself."}, status=status.HTTP_400_BAD_REQUEST)

    if not description or not resolution_date:
        return Response({"error": "Both description and resolution_date are required."}, status=status.HTTP_400_BAD_REQUEST)

    receivers = CustomUser.objects.filter(id__in=receiver_ids)
    if not receivers.exists():
        return Response({"error": "No valid receivers found."}, status=status.HTTP_400_BAD_REQUEST)

    giver_friend_ids = set(giver.friends.values_list('id', flat=True))
    
 
    invalid_receivers = [
        {"id": r.id, "username": r.username}
        for r in receivers if r.id not in giver_friend_ids
    ]

    if invalid_receivers:
        return Response(
            {
                "error": "You can only send promises to users who are your friends.",
                "invalid_receivers": invalid_receivers
            },
            status=status.HTTP_403_FORBIDDEN,
        )
    
    promise = Promise.objects.create(
        title=title,
        giver=giver,
        description=description,
        resolution_date=resolution_date,
        stake_amount=stake_amount,
        majority_vote=majority_vote
    )

    for receiver in receivers:
        PromiseReceiver.objects.create(promise=promise, receiver=receiver)
        Notification.objects.create(
            user=receiver,
            sender=giver,
            message=f"{giver.username} sent you a promise request: '{description[:50]}'",
        )

    serializer = PromiseSerializer(promise)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_promise(request, promise_id):

    user = request.user
    accept = request.data.get("accept")

    promise_receiver = get_object_or_404(PromiseReceiver, promise_id=promise_id, receiver=user)

    promise_receiver.accepted = bool(accept)
    promise_receiver.responded_at = timezone.now()
    promise_receiver.save()
    promise = promise_receiver.promise

    Notification.objects.create(
        user=promise.giver,
        sender=user,
        message=f"{user.username} {'accepted' if accept else 'declined'} your promise: '{promise.description[:50]}'"
    )

    if promise.all_accepted:
        
        total_participants = [promise.giver] + list(promise.receivers.all())
        for participant in total_participants:
            if participant.currency < promise.stake_amount:
                Notification.objects.create(
                    user=participant,
                    sender=None,
                    message=f"Promise '{promise.description[:50]}' could not start because {participant.username} has insufficient funds."
                )
                return Response(
                    {"error": f"{participant.username} has insufficient funds to start the promise."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        for participant in total_participants:
            participant.currency -= promise.stake_amount
            participant.save()

        promise.resolved = False
        promise.completed = False
        
        promise.save()
        for participant in total_participants:
            Notification.objects.create(
                user=participant,
                sender=None,
                message=f"Promise started! Everyone accepted '{promise.description[:50]}'. Each participant has staked {promise.stake_amount} currency."
            )

    serializer = PromiseSerializer(promise)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_promise(request):
    promise_id = request.data.get("promise_id")
    if not promise_id:
        return Response({"error": "Promise ID is required"}, status=400)
    
    promise = get_object_or_404(Promise, id=promise_id)
    promise_receiver = get_object_or_404(
        PromiseReceiver,
        receiver=request.user,
        promise=promise
    )

    with transaction.atomic():
        if not promise_receiver.complete:
            promise_receiver.complete = True
            promise_receiver.save()
            Notification.objects.create(
                user=promise.giver,
                sender=request.user,
                message=f"{request.user.username} resolved the promise from their end!"
            )

        all_receivers = promise.promise_receivers.select_related('receiver').all()
        total = all_receivers.count()
        completed_count = all_receivers.filter(complete=True).count()

        promise_fully_resolved = False

        if not promise.majority_vote:
            if completed_count < total:
                return Response({"info": "Promise has been completed from your end!"})
            promise_fully_resolved = True

        elif completed_count / total > 0.5:
            promise_fully_resolved = True

        if promise_fully_resolved:
            promise.completed = True
            promise.resolved = True
            promise.save()

            all_receivers.update(currency=F('currency') + promise.stake_amount)

            notifications = [
                Notification(
                    user=pr.receiver,
                    sender=promise.giver,
                    message=f"The promise '{promise.title}' has been fully resolved!"
                )
                for pr in all_receivers
            ]
            Notification.objects.bulk_create(notifications)
            return Response({"info": "Promise fully resolved and all receivers notified!"})
    return Response({"info": "Promise has been completed from your end!"})
    

@api_view(['GET'])
def get_usernames(request):
    """
    Returns all users in the database as a mapping of username -> id
    """
    users = CustomUser.objects.all()
    username_to_id = {user.username: user.id for user in users}
    return Response(username_to_id, status=200)
