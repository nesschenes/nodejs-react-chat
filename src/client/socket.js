import socketio from "socket.io-client";

const socket = socketio("http://localhost:3001");

export default socket;
