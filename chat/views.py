from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponse
from .models import Messages, Room

# Create your views here.
def index(request):
    if not request.user.is_authenticated: 
        return redirect('login')
    
    # Get all the rooms available 
    rooms = [ {'name': room.name, 'id': room.id} for room in Room.objects.all() ]
    return render(request, "chat/index.html", {
        'rooms_list': rooms
    })

def room(request, room_name):
    # Check if the room exist then just re_open it 
    room_exists = Room.objects.filter(name=room_name).exists()
    room = Room.objects.filter(name=room_name).first()
    user = request.user
    if room_exists:
        messagesQuery = room.messages.all()
        messages.success(request, 'Room Joined Succesfully')
        return render(request, "chat/room.html", {
            "room_name": room_name,
            'room_messages': messagesQuery
            })
    
     # if Not create one and then open it 
    room = Room.objects.create(name=room_name, created_by=user)
    room.save()
    messages.success(request, 'Room Created Successful')
    return render(request, "chat/room.html", {"room_name": room_name})


def login(request):
    if (request.method == 'GET'):
        return render(request, "chat/login.html")
    
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            auth_login(request, user)
            messages.success(request, "You have successfully logged in!")
            return redirect('index')
        else:
            messages.error(request, "Invalid login credentials")
            return redirect('login')
        
        
# Logged out the user
def logout_user(request):
    logout(request)
    return redirect('login')


# Register a user
def register(request):
    if request.method == "GET":
        return render(request, './chat/register.html')

    if request.method == "POST":
        # Get the data of the user
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
        # Check if both the passwords matches or not
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return redirect('register')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'The User already exists')
            return redirect('register')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'The Email already registered')
            return redirect('register')
        
        # Register the user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        
        # Log in the user
        auth_login(request, user)
        messages.success(request, 'The user has been succesfully registered')
        return redirect('index')
        