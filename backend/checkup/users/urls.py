from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("signup", views.signup , name='signup'),
    path("login", views.login , name='login'),
    path("logout", views.login , name='logout'),
    path("search_for_friends", views.search_for_friends, name="browse_friends"),
    path("send_friend_request", views.send_friend_request, name="submit_friend_request"),
    path("see_my_notifcations", views.my_notifications, name="notifcation_list")
]
