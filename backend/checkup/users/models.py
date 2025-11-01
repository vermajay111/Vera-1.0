from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    word_score = models.IntegerField(default=0)
    karma = models.IntegerField(default=0)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    deafult_avatar_url = models.URLField(blank=True, null=True)
    currency = models.IntegerField(default=1000)

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, related_name='notifications', on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
