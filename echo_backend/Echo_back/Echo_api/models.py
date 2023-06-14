import random
import string
from django.db import models
from django.contrib.auth.models import User

def generate_access_key():
    first_char = random.choice(string.ascii_uppercase)
    remaining_chars = random.choices(string.ascii_uppercase + string.digits, k=6)
    return first_char + ''.join(remaining_chars)


class Group_cht_user(models.Model):
    groupName = models.CharField(max_length=100)
    createdBy = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User, related_name='participants')
    access_key = models.CharField(max_length=7, default=generate_access_key, unique=True)

    def __str__(self):
        return self.groupName



class GroupChat(models.Model):
    group = models.ForeignKey(Group_cht_user, on_delete=models.CASCADE)
    chatBy = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    liked_by = models.ManyToManyField(User, related_name='liked_chats', blank=True)
    unique_key = models.CharField(max_length=7, default=generate_access_key, unique=True)

    def __str__(self):
        return self.unique_key
    
    def save(self, *args, **kwargs):
        if self.chatBy not in self.group.participants.all():
            raise ValueError("User is not a participant of this group")
        super().save(*args, **kwargs)