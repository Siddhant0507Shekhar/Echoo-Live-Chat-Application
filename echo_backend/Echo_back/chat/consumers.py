# chat/consumers.py
import json,time
from django.utils import timezone

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from Echo_api.models import GroupChat, Group_cht_user
from django.contrib.auth.models import User

from datetime import datetime

def current_dt():
    current_datetime = datetime.now()
    formatted_datetime = current_datetime.strftime("%m/%d/%Y, %I:%M:%S %p")
    return formatted_datetime


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        # print(text_data_json)
        # print(message)
        # print(type(message))
        # for i in message:
        #     print(i,message[i])
        #     d = str(i)
            # print(d,message[d])
        group_name = message["group_name"]
        chatBy = message["chatBy"]
        chat_content = message["chat_content"]
        if len(chat_content)==0:
            return 1
        date_time = current_dt()
        group = Group_cht_user.objects.get(groupName=group_name)
        user_ = User.objects.get(username=chatBy)
        print(message)
        if group and user_:
            new_grp_cht = GroupChat.objects.create(
                group=group,
                chatBy=user_,
                content=chat_content,
                timestamp=date_time
            )
            new_grp_cht.save()
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {"type": "chat_message", "message": {"chatBy":chatBy,"chat_content":chat_content,"chat_date":date_time}}
                )
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {"type": "chat_message", "message": {"chatBy":"error","chat_content":"error","chat_date":"error"}}
                )

        

        # Send message to room group
        

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        print(message)
        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))