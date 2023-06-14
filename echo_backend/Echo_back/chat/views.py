from django.shortcuts import render

# Create your views here.
# from django.shortcuts import render


def index(request):
    print(7865)
    return render(request, "chat/index.html")


def room(request, room_name):
    print(96754)
    return render(request, "chat/room.html", {"room_name": room_name})