from django.contrib import admin
from .models import Group_cht_user, GroupChat
# Register your models here.
admin.register(Group_cht_user)
admin.site.register(Group_cht_user)
admin.register(GroupChat)
admin.site.register(GroupChat)
