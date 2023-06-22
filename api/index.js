"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_1 = require("./socket");
const app = (0, express_1.default)();
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'static')));
const httpServer = (0, http_1.createServer)(app);
let port = process.env.PORT || 5000;
(0, socket_1.initIO)(httpServer);
httpServer.listen(port, () => {
    console.log("Server started on", port);
});
(0, socket_1.getIO)();
