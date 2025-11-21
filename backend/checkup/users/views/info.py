from .imports import *
from django.utils import timezone

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_profile_info(request):
    

    query = request.query_params.get("id", "").strip()
    user = get_object_or_404(CustomUser, id=query)
    avatar_url = user.avatar.url if user.avatar else user.deafult_avatar_url
    num_friends = user.friends.count()

    all_promises = Promise.objects.filter(
        Q(giver=user) | Q(receivers=user)
    ).distinct()

    completed_promises = all_promises.filter(completed=True, failed=False).count()
    failed_promises = all_promises.filter(failed=True).count()
    total_promises = all_promises.count()

    reliability_score = 0
    if total_promises > 0:
        reliability_score = round((completed_promises / total_promises) * 100, 2)

    account_created = user.date_joined.strftime("%Y-%m")

    info = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "bio": user.bio,
        "avatar_url": avatar_url,
        "num_friends": num_friends,
        "promises_completed": completed_promises,
        "promises_failed": failed_promises,
        "reliability_score": reliability_score,
        "account_created": account_created
    }

    return Response({"user": info})
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def settings(request):
    user = request.user 
    fields = {
        "first_name": request.data.get("first_name", user.first_name),
        "last_name": request.data.get("last_name", user.last_name),
        "username": request.data.get("username", user.username),
        "email": request.data.get("email", user.email),
        "bio": request.data.get("bio", user.bio),
    }
    unchanged = all(
        getattr(user, key) == value
        for key, value in fields.items()
    )
    if unchanged:
        return Response({"error": "Nothing to save"}, status=400)

    for key, value in fields.items():
        setattr(user, key, value)

    try:
        user.save()
    except IntegrityError as e:
        if "username" in str(e):
            return Response({"error": "Failed to save: username already taken"}, status=400)
        if "email" in str(e):
            return Response({"error": "Failed to save: email already taken"}, status=400)
        return Response({"error": "Failed to save user"}, status=400)
    return Response({"success": "Successfully saved"})

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    user = request.user
    now = timezone.now()

    active_promises_qs = Promise.objects.filter(
        giver=user,
        completed=False,
        failed=False
    ).order_by('resolution_date')

    active_promises = []
    for promise in active_promises_qs:
        
        total_duration = (promise.resolution_date - promise.created_at).total_seconds()
        remaining_duration = (promise.resolution_date - now).total_seconds()
        time_remaining_percent = max(min((remaining_duration / total_duration) * 100, 100), 0) if total_duration > 0 else 0

        active_promises.append({
            "id": promise.id,
            "title": promise.title,
            "stake_amount": float(promise.stake_amount),
            "resolution_date": promise.resolution_date,
            "time_remaining_percent": round(time_remaining_percent, 2)
        })

    all_promises = Promise.objects.filter(giver=user)
    total_promises = all_promises.count()
    completed_promises = all_promises.filter(completed=True, failed=False).count()

    reliability_score = 0
    if total_promises > 0:
        reliability_score = round((completed_promises / total_promises) * 100, 2)

    dashboard_data = {
        "active_promises": active_promises,
        "stats": {
            "total_completed_promises": completed_promises,
            "current_stake_balance": float(user.currency),
            "total_promises_started": total_promises,
            "reliability_score_percent": reliability_score
        }
    }

    return Response(dashboard_data)
