from django.db import models
from django.conf import settings
from django.utils import timezone


class Promise(models.Model):
    giver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='promises_given',
        on_delete=models.CASCADE
    )
    receivers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='PromiseReceiver',
        related_name='promises_received'
    )
    title =  models.TextField()
    description = models.TextField()
    resolution_date = models.DateTimeField()
    stake_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    resolved = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    dispute_open = models.BooleanField(default=False)
    majority_vote = models.BooleanField(default=False)
    failed = models.BooleanField(default=False)
    started = models.BooleanField(default=False)

    def __str__(self):
        receiver_names = ", ".join([u.username for u in self.receivers.all()])
        return f"{self.giver.username} → [{receiver_names}]: {self.description[:30]}"

class PromiseReceiver(models.Model):
    promise = models.ForeignKey(Promise, related_name="promise_receivers", on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    complete = models.BooleanField(default=False)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('promise', 'receiver')

    def __str__(self):
        status = "accepted" if self.accepted else "pending"
        return f"{self.receiver.username} → {self.promise.id} ({status})"
