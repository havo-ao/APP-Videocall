import path from 'path';
import { createServer, Server } from 'http';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { getIO, initIO } from './socket';

const app = express();

app.use('/', express.static(path.join(__dirname, 'static')));

const httpServer: Server = createServer(app);

let port: number | string = process.env.PORT || 5000;

initIO(httpServer);

httpServer.listen(port, () => {
  console.log("Server started on", port);
});

getIO();
