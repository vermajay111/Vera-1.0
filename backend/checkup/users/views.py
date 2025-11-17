from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, Token

from .serializers import UserSerializer, NotificationSerializer
from .models import CustomUser, Notification
from .pagination import FriendsPagination

from promises.models import Promise


User = get_user_model()

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        

        if not user.avatar and not user.deafult_avatar_url:
            first = user.first_name or "User"
            last = user.last_name or "Default"
            user.deafult_avatar_url = f"https://api.dicebear.com/9.x/initials/svg?seed={first}_{last}"
        
        user.save()


        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'deafult_avatar_url': user.deafult_avatar_url,
                'avatar': request.build_absolute_uri(user.avatar.url) if user.avatar else None,
                'karma': user.karma,
                'word_score': user.word_score
            }
        }
        return Response(response_data)
    
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, username=username)

    if not user.check_password(password):
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    })

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def logout_view(request):
    raw_auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    user_token = raw_auth_header.replace('token ', '')
    try:
        token = Token.objects.get(key=user_token)
        print(token)
        token.delete()
        return Response({"info": "logged out successfully"})
    except Token.DoesNotExist:
        return Response({"error": "Token does not exist"})
    except Exception as e:
        return Response({"error": str(e)})
    
    
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def search_for_friends(request):
    
    search_query = request.query_params.get("username")
    if not search_query:
        return Response({"error": "No username provided"}, status=400)
    users = CustomUser.objects.filter(username__icontains=search_query).exclude(id=request.user.id)
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "deafult_avatar": user.deafult_avatar_url,
            "avatar": request.build_absolute_uri(user.avatar.url) if user.avatar else None
        })
    
    return Response({"results": result})


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
        message__icontains='friend request',
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
    else:
        notification.delete()
        return Response({"info": f"Friend request from {sender.username} rejected"}, status=200)

    

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    user = request.user
    notifications = Notification.objects.filter(user=user).order_by('-created_at')
    notifications.update(read=True)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

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
            "avatar": request.build_absolute_uri(friend.avatar.url)
                      if friend.avatar else None,
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
            "avatar": request.build_absolute_uri(friend.avatar.url) if friend.avatar else None,
            "default_avatar": friend.deafult_avatar_url,
        })

    return paginator.get_paginated_response(friends_list)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_profile_info(request):
    

    query = request.query_params.get("id", "").strip()
    user = get_object_or_404(CustomUser, id=query)
    avatar_url = user.avatar.url if user.avatar else user.deafult_avatar_url
    num_friends = user.friends.count()

    all_promises = Promise.objects.filter(
        Q(giver=user) | Q(receivers=user)
    ).distinct()

    completed_promises = all_promises.filter(completed=True, failed=False).count()
    failed_promises = all_promises.filter(failed=True).count()
    total_promises = all_promises.count()

    reliability_score = 0
    if total_promises > 0:
        reliability_score = round((completed_promises / total_promises) * 100, 2)

    account_created = user.date_joined.strftime("%Y-%m")

    info = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "bio": user.bio,
        "avatar_url": avatar_url,
        "num_friends": num_friends,
        "promises_completed": completed_promises,
        "promises_failed": failed_promises,
        "reliability_score": reliability_score,
        "account_created": account_created
    }

    return Response({"user": info})
    

"""
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")
    

"""