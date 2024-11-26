import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import User, Messages, Room
from django.utils.timesince import timesince


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope['user']
        
        # Join room group
        await self.get_room()
        # add the user to the room
        await self.add_user()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Send the count to the user
        print(self.get_user_count())
        await self.send_count()
        # accept the connection
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the room
        await self.remove_user()
        
        # Send the count to the web socket
        await self.send_count()
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json.get('type')
        message = text_data_json.get("message")
        user = text_data_json['user']
        user_id = text_data_json['user_id']
        
        # Create a new message
        
        if type == 'message':
            new_message = await self.create_message(message, user_id, self.room_name)            
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "chat_message", 
                    "message": message,
                    "user_id": user_id,
                    "user": user,
                    'timeStamp' : timesince(new_message.timeStamp),
                    }
            )
        elif type == 'typing':
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "writing_active",
                    "user_id": user_id,
                    "user": user
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        type = event['type']
        user_id = event['user_id']
        message = event["message"]
        user = event['user']
        timeStamp = event['timeStamp']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': type,
            "message": message,
            'user_id': user_id,
            'user': user,
            'timeStamp': timeStamp
            }))
        
        
        
    async def writing_active(self, event):
        type = event['type']
        user_id = event['user_id']
        user = event['user']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': type,
            'user_id': user_id,
            'user': user,
            }))
      
        
    # Send the count to the web socket
    async def send_count(self):
        user_count = await self.get_user_count()
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': "user_count",
                'count': user_count,
            }
        )
        
    async def user_count(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'count': event['count'],
        }))
          
          
    @sync_to_async
    def get_room(self):
        self.room = Room.objects.get(name=self.room_name)
        
    @sync_to_async
    def create_message(self, message, user_id, room_name):
        # Create a new message
        user = User.objects.get(pk=user_id)
        message = Messages.objects.create(message=message, sent_by=user)
        
        message.save()
        self.room.messages.add(message)
        
        return message
    
    @sync_to_async
    def add_user(self):
        self.room.number_of_users.add(self.user)
        
    @sync_to_async
    def remove_user(self):
        self.room.number_of_users.remove(self.user)
        
    @sync_to_async
    def get_user_count(self):
        return self.room.number_of_users.count()