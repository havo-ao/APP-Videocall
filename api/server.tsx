import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

let sockets: Socket[] = [];

io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    sockets.push(socket);

    socket.on('offer', (offer: RTCSessionDescriptionInit) => {
        sockets.forEach((s) => {
            if (s !== socket) {
                s.emit('offer', offer);
            }
        });
    });

    socket.on('answer', (answer: RTCSessionDescriptionInit) => {
        sockets.forEach((s) => {
            if (s !== socket) {
                s.emit('answer', answer);
            }
        });
    });

    socket.on('candidate', (candidate: RTCIceCandidateInit) => {
        sockets.forEach((s) => {
            if (s !== socket) {
                s.emit('candidate', candidate);
            }
        });
    });

    socket.on('disconnect', () => {
        sockets = sockets.filter((s) => s !== socket);
        console.log('user disconnected');
    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});
