from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Promise, PromiseReceiver
from .serializers import PromiseSerializer
from users.models import Notification, CustomUser


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_promise(request):

    giver = request.user
    receiver_ids = request.data.get("receiver_ids", [])
    description = request.data.get("description")
    resolution_date = request.data.get("resolution_date")
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
        giver=giver,
        description=description,
        resolution_date=resolution_date,
        stake_amount=stake_amount,
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


