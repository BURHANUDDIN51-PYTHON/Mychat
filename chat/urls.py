from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path("chat_room/<str:room_name>/", views.room, name="room"),
    path("login", views.login, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register, name='register'),
    
]