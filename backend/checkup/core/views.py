from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import Token
from django.contrib import admin
from users.models import CustomUser
from django.contrib.auth.admin import UserAdmin

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import CustomUser  # or your app name

admin.site.unregister(CustomUser)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'is_active')


