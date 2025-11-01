from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, Token
from .serializers import UserSerializer, NotificationSerializer
from .models import CustomUser, Notification
from django.contrib.auth import get_user_model


User = get_user_model()

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Set password
        user.set_password(request.data['password'])
        
        # Ensure default avatar URL is set if missing
        if not user.avatar and not user.deafult_avatar_url:
            first = user.first_name or "User"
            last = user.last_name or "Default"
            user.deafult_avatar_url = f"https://api.dicebear.com/9.x/initials/svg?seed={first}_{last}"
        
        user.save()  # Save all changes, including default avatar

        # Generate refresh token
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

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response("missing user", status=status.HTTP_404_NOT_FOUND)
    refresh = RefreshToken.for_user(user)
    return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'user': {"username": user.username}})

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
    sender_username = request.data.get('sender_id')
    action = request.data.get('action')
    
    if not sender_username or action not in ['accept', 'reject']:
        return Response({"error": "Invalid data"}, status=400)
    try:
        sender = CustomUser.objects.get(username=sender_username)
        notification = Notification.objects.get(user=request.user, sender=sender, read=False, message__icontains='friend request')
    except (CustomUser.DoesNotExist, Notification.DoesNotExist):
        return Response({"error": "Friend request not found"}, status=404)
    
    if action == "accept":
        request.user.friends.add(sender)
        sender.friends.add(request.user)
        notification.read = True
        notification.save()
        return Response({"info": f"You are now friends with {sender.username}"})
    
    elif action == "reject":
        notification.read = True
        notification.save()
        return Response({"info": f"Friend request from {sender.username} rejected"})
    

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    user = request.user
    notifications = Notification.objects.filter(user=user).order_by('-created_at')
    notifications.update(read=True)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


"""
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")
    

"""