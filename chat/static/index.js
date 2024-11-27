document.addEventListener('DOMContentLoaded', () => {
    //console.log('This is the index page')

    var roomName = document.getElementById('room-name')
    var button = document.getElementById('submit')
    var isCreate = false 
    
    // If the user select on of the existing groups 
    roomName.addEventListener('change', () => {
        if (roomName.value == 'new-room'){
            roomName.value == ""
            create();
            isCreate = true;
        }
    })

    function create(){
        document.getElementById('room-select').innerHTML =
        `
        <div class="mb-3">
            <label for="room-name" class="form-label">Create Room:</label>
            <input type="text" class="form-control" id="enter-room" placeholder="Create Room">
        </div>
        `
    }
   
    

    button.addEventListener('click', (e) => {
       
        var roomData = JSON.parse(document.getElementById('room-data').textContent)

        // This thing is going to be two way one way when user enter a existing room and another when the user creates one

        // When the user opt for creating a new room
        if (isCreate){
            var enterRoom = document.getElementById('enter-room')
            var enterRoomValue = enterRoom.value.trim()
            if (enterRoomValue === ''){
                alert('Please select a room or Enter a valid Room')
                return;
            }
            var exists = roomData.some(room => room.name === enterRoomValue)
            if (exists){
                alert('Room already exists')
                enterRoom.value = ""
                return; 
            }  
            console.log(enterRoom.value)
            window.location.pathname = '/chat_room/' + enterRoomValue + '/';
            return;
        }

        // When a user enters an existing room
        var roomNameValue = roomName.value.trim()
        if (roomNameValue === ''){
            alert('Please select a room or Enter a valid Room')
            return;
        }
        window.location.pathname = '/chat_room/' + roomNameValue + '/';
    })

    function disappearMessage() {
        const messageElement = document.getElementById('message');
        messageElement.style.opacity = '0'; // Fade out the message
        setTimeout(() => {
            messageElement.style.display = 'none'; // Remove from display after fading out
        }, 500); // Wait for the fade-out transition to complete
    }

    // Call the function after 3 seconds
    setTimeout(disappearMessage, 3000);

})