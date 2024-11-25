from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Messages(models.Model):
    message = models.CharField(max_length=255)
    sent_by = models.ForeignKey(User, models.DO_NOTHING, related_name='messages')
    timeStamp = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"{self.sent_by} {self.message} {self.timeStamp}"
    
class Room(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='create_by')
    number_of_users = models.ManyToManyField(User, related_name='users_joined', blank=True)
    messages = models.ManyToManyField(Messages, related_name='room_messages')
    
    def __str__(self):
        return f"{self.name}, {self.created_by}, {self.number_of_users}"