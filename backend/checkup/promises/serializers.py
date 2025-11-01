from rest_framework import serializers
from .models import Promise, PromiseReceiver


class PromiseReceiverSerializer(serializers.ModelSerializer):
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = PromiseReceiver
        fields = ['receiver', 'receiver_username', 'accepted', 'responded_at']


class PromiseSerializer(serializers.ModelSerializer):
    giver_username = serializers.CharField(source="giver.username", read_only=True)
    receivers_status = PromiseReceiverSerializer(source='promise_receivers', many=True, read_only=True)
    all_accepted = serializers.BooleanField(read_only=True)

    class Meta:
        model = Promise
        fields = [
            "id",
            "giver",
            "giver_username",
            "description",
            "resolution_date",
            "stake_amount",
            "resolved",
            "completed",
            "dispute_open",
            "created_at",
            "all_accepted",
            "receivers_status",
        ]
        read_only_fields = ["giver", "created_at", "resolved", "completed", "dispute_open", "all_accepted"]
