Swal.fire({
    title: 'Autenticación',
    input: 'text',
    text: 'Establecer nombre de usuario para el Chat',
    inputValidator: value => {
        return !value.trim() && 'Please write a valid username'
    },
    allowOutsideClick: false
}).then(result => {
    const user = result.value
    document.getElementById('username').innerHTML = user
    let socket = io()
    
    let chatBox = document.getElementById('chatBox')
    chatBox.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            if (chatBox.value.trim().length > 0) {
                socket.emit('message', {
                    user,
                    message: chatBox.value
                })
                chatBox.value = ''
            }
        }
    })

    let sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', () => {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', {
                user,
                message: chatBox.value
            })
            chatBox.value = ''
        }
    });
    socket.on('logs', data => {
        const divLogs = document.getElementById('messagesLogs');
        divLogs.innerHTML = '';
        data.forEach(message => {
            const messageElement = document.createElement('p');
            messageElement.innerHTML = `<i>${message.user}</i>: ${message.message}`;
            divLogs.appendChild(messageElement);
        });
     
        divLogs.scrollTop = divLogs.scrollHeight;
    });
    
    

    socket.on('alerta', () => {
        alert('Un nuevo usuario se ha conectado...')
    })
})

