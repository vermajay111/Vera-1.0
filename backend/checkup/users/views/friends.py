from .imports import *

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def search_for_friends(request):

    search_query = request.query_params.get("username", "").strip()

    friend_ids = request.user.friends.values_list("id", flat=True)

    users_qs = CustomUser.objects.exclude(id=request.user.id).exclude(id__in=friend_ids)

    if search_query:
        users_qs = users_qs.filter(username__icontains=search_query)

    paginator = FriendsPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(users_qs, request)

    sent_requests = Notification.objects.filter(
        sender=request.user,
        message__icontains="friend request",
        read=False
    ).values_list("user_id", flat=True)

    results = []
    for user in result_page:
        results.append({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "default_avatar": user.deafult_avatar_url,
            "avatar": user.avatar_url,     # Updated
            "friend_request_sent": user.id in sent_requests
        })

    return paginator.get_paginated_response(results)



@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    recipient_username = request.data.get('username', '').strip()

    if not recipient_username:
        return Response({"error": "No recipient username provided"}, status=400)

    try:
        recipient = CustomUser.objects.get(username=recipient_username)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if recipient == request.user:
        return Response({"error": "You cannot send a friend request to yourself"}, status=400)

    if recipient in request.user.friends.all():
        return Response({"error": "You are already friends"}, status=400)

    existing_request = Notification.objects.filter(
        user=recipient,
        sender=request.user,
        message__icontains="friend request",
        read=False
    ).first()

    if existing_request:
        return Response({"error": "Friend request already sent"}, status=400)

    Notification.objects.create(
        user=recipient,
        sender=request.user,
        message=f"{request.user.username} sent you a friend request",
        read=False
    )

    return Response({"info": f"Friend request sent to {recipient.username}"})


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def respond_to_friend_request(request):
    notification_id = request.data.get("notification_id")
    action = request.data.get("action")

    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    sender = notification.sender

    if action == "accept":
        request.user.friends.add(sender)
        sender.friends.add(request.user)
        notification.delete()
        return Response({"info": f"You are now friends with {sender.username}"}, status=200)

    # Reject
    notification.delete()
    return Response({"info": f"Friend request from {sender.username} rejected"}, status=200)



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def search_within_friends(request):
    user = request.user
    query = request.query_params.get("search", "").strip()

    friends_qs = user.friends.all()

    if query:
        friends_qs = friends_qs.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(username__icontains=query)
        )

    friends_qs = friends_qs[:5]

    friends_list = []
    for friend in friends_qs:
        friends_list.append({
            "id": friend.id,
            "first_name": friend.first_name,
            "last_name": friend.last_name,
            "username": friend.username,
            "avatar": friend.avatar_url,     # Updated
            "default_avatar": friend.deafult_avatar_url,
        })

    return Response({"results": friends_list})



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def all_user_friends(request):
    user = request.user
    friends_qs = user.friends.all()

    paginator = FriendsPagination()
    result_page = paginator.paginate_queryset(friends_qs, request)

    friends_list = []
    for friend in result_page:
        friends_list.append({
            "id": friend.id,
            "first_name": friend.first_name,
            "last_name": friend.last_name,
            "username": friend.username,
            "avatar": friend.avatar_url,      # Updated
            "default_avatar": friend.deafult_avatar_url,
        })

    return paginator.get_paginated_response(friends_list)
