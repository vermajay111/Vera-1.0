from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views.auth import *
from .views.friends import *
from .views.info import *
from .views.notfications import *


urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("signup", signup , name='signup'),
    path("login", login , name='login'),
    path("logout", login , name='logout'),
    path("search_for_friends", search_for_friends, name="browse_friends"),
    path("send_friend_request", send_friend_request, name="submit_friend_request"),
    path("see_my_notifcations", my_notifications, name="notifcation_list"),
    path("search_within_friends", search_within_friends, name="search_within_friends"),
    path("all_user_friends", all_user_friends, name="all_user_friends"),
    path("user_profile", user_profile_info),
    path("respond_to_friendrequest", respond_to_friend_request),
    path("update_settings", settings),
    path("user_dashboard", user_dashboard),
    path("unread_notfications", does_user_have_unread_notfications)
]
