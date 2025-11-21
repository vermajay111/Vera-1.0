from django.contrib import admin
from .models import Promise, PromiseReceiver

admin.site.register(Promise)
admin.site.register(PromiseReceiver)