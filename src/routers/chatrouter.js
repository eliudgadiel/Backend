// Importa Server desde socket.io
import { Router } from 'express';
import { Server } from 'socket.io';

const router = Router();



router.get('/', (req, res) => {
    res.render('chat', {});
});


export function setupChat(io) {
   
    io.on('connection', (socket) => {
        console.log('Un cliente se ha conectado a través de WebSocket');

        socket.on('message', (message) => {
            io.emit('message', message);
        });
    });
}

export default router;

