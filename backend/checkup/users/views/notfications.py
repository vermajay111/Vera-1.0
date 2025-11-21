from .imports import *

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
def does_user_have_unread_notfications(request):
    user = request.user
    has_unread = (
        Notification.objects
        .filter(user=user, read=False)
        .only("id")  
        .exists()    
    )

    return Response({"info": has_unread})

    