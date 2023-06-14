from django.urls import path
from . import views
from .views import get_react_csrftoken

urlpatterns = [
    path('login', views.login_page),
    path('logout',views.logout_page),
    path('get_react_csrftoken', get_react_csrftoken, name='get_react_csrftoken'),
    path('users',views.get_all_users),
    path('create-group',views.create_group),
    path('groups-info',views.group_info),
    path('toggle-user-inGroup',views.toggle_user_in_group),
    path('get_users_not_in_group',views.get_users_not_in_group),
    path('delete-group',views.delete_group),
    path('add-users-to-group',views.add_users_to_group),
    path('groups',views.groups),
    path('group-chats',views.group_chats),
    path('get_username',views.get_username),
    path('create-user/',views.create_user)
]
