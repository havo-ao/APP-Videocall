"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initIO = void 0;
const socket_io_1 = require("socket.io");
let IO;
const initIO = (httpServer) => {
    IO = new socket_io_1.Server(httpServer);
    IO.use((socket, next) => {
        if (socket.handshake.query) {
            let callerId = socket.handshake.query.callerId;
            socket.user = callerId;
            next();
        }
    });
    IO.on("connection", (socket) => {
        console.log(socket.user, "Connected");
        socket.join(socket.user);
        socket.on("call", (data) => {
            let calleeId = data.calleeId;
            let rtcMessage = data.rtcMessage;
            socket.to(calleeId).emit("newCall", {
                callerId: socket.user,
                rtcMessage: rtcMessage,
            });
        });
        socket.on("answerCall", (data) => {
            let callerId = data.callerId;
            let rtcMessage = data.rtcMessage;
            socket.to(callerId).emit("callAnswered", {
                callee: socket.user,
                rtcMessage: rtcMessage,
            });
        });
        socket.on("ICEcandidate", (data) => {
            console.log("ICEcandidate data.calleeId", data.calleeId);
            let calleeId = data.calleeId;
            let rtcMessage = data.rtcMessage;
            socket.to(calleeId).emit("ICEcandidate", {
                sender: socket.user,
                rtcMessage: rtcMessage,
            });
        });
    });
};
exports.initIO = initIO;
const getIO = () => {
    if (!IO) {
        throw new Error("IO not initialized.");
    }
    else {
        return IO;
    }
};
exports.getIO = getIO;
