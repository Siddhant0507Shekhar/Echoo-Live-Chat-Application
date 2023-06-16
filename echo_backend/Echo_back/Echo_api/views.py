from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
import json
from django.contrib.auth.models import User
from .models import Group_cht_user,GroupChat
from django.http import HttpResponseServerError
from urllib.parse import urlparse


# Create your views here.
def get_username(request):
    if request.user.is_authenticated:
        username = request.user.username
        print(username)
        return JsonResponse({"username": username})
    else:
        print("not_athenticated")
        return JsonResponse({"error": "User not authenticated"}, status=401)

def create_user(request):
    if request.method == 'POST' and request.user.is_authenticated:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Username or email already exists'}, status=409)
        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({'message': 'User created successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Invalid request method or not logged in'}, status=405)


def group_chats(request):
    if request.method == 'POST' and request.user.is_authenticated:
        access_key = json.loads(request.body).get('access_key')
        try:
            group_cht_user = Group_cht_user.objects.get(access_key=access_key)
            group_chats = GroupChat.objects.filter(group=group_cht_user).order_by('timestamp')
            chat_list = []
            for chat in group_chats:
                chat_data = {
                    'chatBy': chat.chatBy.username,
                    'chat_content': chat.content,
                    'chat_date': chat.timestamp
                }
                chat_list.append(chat_data)
            return JsonResponse(chat_list, safe=False)
        except Group_cht_user.DoesNotExist:
            return JsonResponse({'error': 'Group_cht_user not found'})
    else:
        return JsonResponse({'error': 'Invalid request method or not logged in'})


def groups(request):
    if request.method == 'POST' and request.user.is_authenticated:
        username = json.loads(request.body).get('username')
        user_groups = Group_cht_user.objects.all()
        groups_list = []
        for group in user_groups:
            if group.participants.filter(username=username).exists():
                group_data = {
                    'groupName': group.groupName,
                    'accessKey': group.access_key
                }
                groups_list.append(group_data)
        return JsonResponse(groups_list, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method or not logged in'})

    
def add_users_to_group(request) :
    if request.method == 'POST' and request.user.is_authenticated:
        access_key = json.loads(request.body).get('accessKey')
        selected_users = json.loads(request.body).get('users')
        participants_arr = [User.objects.get(username=participant) for participant in selected_users]
        # Find the group using the access key
        try:
            group = Group_cht_user.objects.get(access_key=access_key)
        except Group_cht_user.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Group not found'})

        # Add selected users to the group
        group.participants.add(*participants_arr)

        return JsonResponse({'status': 'success', 'message': 'Users added to group successfully'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method or not logged in'})


def delete_group(request):
    if request.method == 'POST' and request.user.is_authenticated:
        access_key = json.loads(request.body).get('Access_key')
        try:
            group = Group_cht_user.objects.get(access_key=access_key)
            group.delete()
            return HttpResponse(status=200)
        except Group_cht_user.DoesNotExist:
            return HttpResponse(status=500)
    return HttpResponseServerError()


def get_users_not_in_group(request):
    if request.method == 'POST' and request.user.is_authenticated:
        access_key = json.loads(request.body).get('Access_key')
        try:
            group = Group_cht_user.objects.get(access_key=access_key)
        except Group_cht_user.DoesNotExist:
            return JsonResponse({'error': 'Invalid access_key'}, status=400)
        
        users_not_in_group = User.objects.exclude(participants=group)
        user_list = [{'username': user.username, 'email': user.email} for user in users_not_in_group]
        return JsonResponse(user_list, safe=False)

    return JsonResponse({'error': 'Invalid request method or not logged in'}, status=400)


def toggle_user_in_group(request):
    if request.method == 'POST' and request.user.is_authenticated:
        data = json.loads(request.body)
        username = data.get('username')
        group_name = data.get('groupName')
        try:
            user = User.objects.get(username=username)
            group = Group_cht_user.objects.get(groupName=group_name)
            
            if user in group.participants.all():
                group.participants.remove(user)
                is_joined = False
            else:
                group.participants.add(user)
                is_joined = True
            
            return JsonResponse({'message': 'User toggled in group successfully', 'isJoined': is_joined})
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'})
        except Group_cht_user.DoesNotExist:
            return JsonResponse({'message': 'Group not found'})
    else:
        return JsonResponse({'message': 'Invalid request method or not logged in'})






def group_info(request):
    if request.method == 'POST' and request.user.is_authenticated:
        data = json.loads(request.body)
        username = data['username']
        by_user = User.objects.get(username=username)
        groups = Group_cht_user.objects.all()
        response_data = []
        for group in groups:
            created_by = str(group.createdBy)
            is_joined = group.participants.filter(username=by_user).exists()
            group_data = {
                'groupName': group.groupName,
                'createdBy': created_by,
                'isJoined': is_joined,
                'Access_key':group.access_key
            }
            response_data.append(group_data)
        return JsonResponse(response_data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method or not logged in'}, status=400)



def create_group(request):
    if request.method == 'POST' and request.user.is_authenticated:
        data = json.loads(request.body)
        group_name = data['groupName']
        participants = data['participants']
        if Group_cht_user.objects.filter(groupName=group_name).exists():
            return JsonResponse({'message':'Group Exists already'})
        participants_arr = [User.objects.get(username=participant) for participant in participants]
        # created_by_username = request.user.username
        created_by_username = data['createdBy']
        created_by_user = User.objects.get(username=created_by_username)
        print(data)
        print(created_by_user,created_by_username,group_name,participants)
        group = Group_cht_user.objects.create(groupName=group_name, createdBy=created_by_user)
        group.participants.add(*participants_arr)
        return JsonResponse({'message': 'Successful.', 'group_id': group.id})
    
    return JsonResponse({'message': 'Invalid request method'})

def get_all_users(request):
    if request.method == 'GET' and request.user.is_authenticated:
        users = User.objects.values_list('username', flat=True)
        return JsonResponse({'users': list(users)})

    return JsonResponse({'message': 'Invalid request method'}, status=405)


def get_react_csrftoken(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

def login_page(request):
    if request.user.is_authenticated:
        return JsonResponse({"message": "Already logged in"})

    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful"})
        else:
            return JsonResponse({"message": "Invalid credentials"})

    return JsonResponse({"message": "Invalid request"})


def logout_page(request):
    if request.user.is_authenticated:
        logout(request)

        # Extract the domain from the referring URL
        referer = request.META.get('HTTP_REFERER')
        domain = urlparse(referer).scheme + '://' + urlparse(referer).netloc if referer else None

        return redirect(domain if domain else '/')
    else:
        return JsonResponse({"error": "Not logged in"})

