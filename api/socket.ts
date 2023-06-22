import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

interface CustomSocket extends Socket {
  user: string;
}

let IO: Server<CustomSocket>;

export const initIO = (httpServer: HttpServer): void => {
  IO = new Server<CustomSocket>(httpServer);

  IO.use((socket: any, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      socket.user = callerId;
      next();
    }
  });

  IO.on("connection", (socket: any) => {
    console.log(socket.user, "Connected");
    socket.join(socket.user);

    socket.on("call", (data: { calleeId: string; rtcMessage: string }) => {
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on(
      "answerCall",
      (data: { callerId: string; rtcMessage: string }) => {
        let callerId = data.callerId;
        let rtcMessage = data.rtcMessage;

        socket.to(callerId).emit("callAnswered", {
          callee: socket.user,
          rtcMessage: rtcMessage,
        });
      }
    );

    socket.on(
      "ICEcandidate",
      (data: { calleeId: string; rtcMessage: string }) => {
        console.log("ICEcandidate data.calleeId", data.calleeId);
        let calleeId = data.calleeId;
        let rtcMessage = data.rtcMessage;

        socket.to(calleeId).emit("ICEcandidate", {
          sender: socket.user,
          rtcMessage: rtcMessage,
        });
      }
    );
  });
};

export const getIO = (): Server<CustomSocket> => {
  if (!IO) {
    throw new Error("IO not initialized.");
  } else {
    return IO;
  }
};
