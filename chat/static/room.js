document.addEventListener('DOMContentLoaded', () => {
     // Function to make the message disappear
     function disappearMessage() {
        const messageElement = document.getElementById('message-box');
        messageElement.style.opacity = '0'; // Fade out the message
        setTimeout(() => {
            messageElement.style.display = 'none'; // Remove from display after fading out
        }, 500); // Wait for the fade-out transition to complete
    }

    // Call the function after 3 seconds
    setTimeout(disappearMessage, 3000);


    // load all the variables 
    const inputMessage = document.getElementById('chat-message-input')
    const submitMessage = document.getElementById('chat-message-submit')
    const chatLog = document.getElementById('chat-log')
    const usersOnline = document.getElementById('users-online')
    // scroll to bottom
    function scrollToBottom() {
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Creating the neccessary function for send and onchat message
    function sendMessage(){
        const sendData = {
            'type': 'message',
            'message': inputMessage.value,
            'user': document.getElementById('username').textContent.replaceAll('"', ''),
            'user_id': document.getElementById('user_id').textContent.replaceAll('"', ''),
        }
        chatSocket.send(JSON.stringify(sendData))
        inputMessage.value = ''
    }   

    function onChatMessage(data){
        const currentUser = document.getElementById('user_id').textContent.replaceAll('"', '')
        if (data.type == 'chat_message'){
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }
            if (currentUser == data.user_id){
                
                chatLog.innerHTML += `
                    <div class="message receiver-message">
                            <div>
                                
                                <span>${data.message}</span>
                            </div>
                            <div class="message-time">
                                <span><small>${data.timeStamp} ago...</small></span>
                            </div>
                        </div>
                `
            } else { 
                chatLog.innerHTML += 
                `
                    <div class="message sender-message">
                        <div>
                            <span><small>${data.user}:</small></span>
                        </div>
                        <hr style="width: 100%; margin: 0;">
                        <div>
                            <span>${data.message}</span>
                        </div>
                        <div class="message-time">
                            <span><small>${data.timeStamp} ago...</small></span>
                        </div>
                    </div> 
                `
            }
        } else if (data.type == 'writing_active'){
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }
            if (data.user_id !== currentUser){

                chatLog.innerHTML += `
                 <div class="message sender-message tmp-info">
                        <div>
                            <span><small>${data.user}:</small></span>
                        </div>
                        
                        <div>
                            <span>Typing...</span>
                        </div>
                        <div class="message-time">
                            
                        </div>
                </div> 
                `  
                
            } 
        } else if (data.type == 'user_count'){
            console.log(data)
            usersOnline.innerHTML = `Users Online: ${data.count}`
        }
        scrollToBottom();
    }
    
    const roomName = JSON.parse(document.getElementById('room-name').textContent)
    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/chat/'
        + roomName
        + '/'
    )
    // Three major function onmessage, onclose, onopen    
    // On message
    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        console.log(data);
        // Now append the data based on the user
        onChatMessage(data);
    }

    chatSocket.onopen = (e) => {
        scrollToBottom()
        console.log("Chat Socket connection open")
    }
    chatSocket.onclose = (e) => {console.log("Chat Socket connection closed")}


    inputMessage.onkeyup = function(e){e.key == 'Enter' ? submitMessage.click(): ""}

    submitMessage.onclick =  (e) => {
        // Checks
        if (inputMessage.value === '') {
            return;
        }
        e.preventDefault();
        // Send the message
        sendMessage();
        return false;
    }

    inputMessage.onfocus = function(e) {
        const sendData = {
            'type': 'typing',
            'user': document.getElementById('username').textContent.replaceAll('"', ''),
            'user_id': document.getElementById('user_id').textContent.replaceAll('"', ''),
        }
        chatSocket.send(JSON.stringify(sendData))
    }
    
    inputMessage.onblur = function(e){
        let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }
    }

   
})