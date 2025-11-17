from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Notification

User = get_user_model()  # ensures it uses your CustomUser if set in settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    class Meta:
        model = Notification
        fields = ['id', 'sender_username', 'message', 'created_at', 'read']