"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
let sockets = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    sockets.push(socket);
    socket.on('offer', (offer) => {
        sockets.forEach((s) => {
            if (s !== socket) {
                s.emit('offer', offer);
            }
        });
    });
    socket.on('answer', (answer) => {
        sockets.forEach((s) => {
            if (s !== socket) {
                s.emit('answer', answer);
            }
        });
    });
    socket.on('candidate', (candidate) => {
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
    console.log('listening on port:5000');
});
