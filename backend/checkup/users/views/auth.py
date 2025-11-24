from .imports import *
from rest_framework_simplejwt.tokens import RefreshToken, Token

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    user.set_password(request.data['password'])

    user.deafult_avatar_url = f"https://api.dicebear.com/9.x/initials/svg?seed={user.first_name}_{user.last_name}"

    user.save()
    refresh = RefreshToken.for_user(user)
    avatar_url = user.deafult_avatar_url

    response_data = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar_url': avatar_url,
            'word_score': user.word_score,
            'bio': user.bio,
            'token_count': user.currency
        }
    }
    return Response(response_data)


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
    avatar_url = user.avatar_url or user.deafult_avatar_url
    

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "avatar_url": avatar_url,
            "bio": user.bio,
            "token_count": user.currency
        }
    })


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def logout_view(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    token_key = auth_header.replace('token ', '')

    try:
        token = Token.objects.get(key=token_key)
        token.delete()
        return Response({"info": "Logged out successfully"})
    except Token.DoesNotExist:
        return Response({"error": "Token does not exist"})
    except Exception as e:
        return Response({"error": str(e)})
