document.addEventListener('DOMContentLoaded', () => {
    //console.log('This is the index page')

    var roomName = document.getElementById('room-name')
    var button = document.getElementById('submit')
    var isCreate = false 
    
    // If the user select on of the existing groups 
    roomName.addEventListener('change', () => {
        if (roomName.value == 'new-room'){
            roomName.value = "";
            create();
            isCreate = true;
        }
    })

    function create(){
        document.getElementById('room-select').innerHTML =
        `
        <div class="mb-3">
            <label for="room-name" class="form-label">Create Room:</label>
            <input type="text" class="form-control" id="room-name" placeholder="Create Room">
        </div>
        `
    }
   
    

    button.addEventListener('click', (e) => {
       
        var roomData = JSON.parse(document.getElementById('room-data').textContent)
        var roomNameValue = roomName.value.trim()
        console.log(roomData)
        if (roomNameValue === ''){
            alert('Please select a room or Enter a valid Room')
            return;
        }
        if (isCreate){
            var exists = roomData.some(room => room.name === roomNameValue)
            if (exists){
                alert('Room already exists')
                roomName.value = ""
                return;
            }   
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