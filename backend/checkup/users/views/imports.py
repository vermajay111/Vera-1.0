from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication


from ..serializers import UserSerializer, NotificationSerializer
from ..models import CustomUser, Notification
from ..pagination import FriendsPagination

from promises.models import Promise
from django.db import IntegrityError



User = get_user_model()
