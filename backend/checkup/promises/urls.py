from django.urls import path
from .views import send_promise, respond_to_promise, get_usernames, resolve_promise

urlpatterns = [
    path('send/', send_promise, name='send_promise'),
    path('<int:promise_id>/respond/', respond_to_promise, name='respond_to_promise'),
    path('test_users', get_usernames),
    path('resolve_promise', resolve_promise)

]