// socket.js
import { io } from "socket.io-client";

export const serverUrl = "http://localhost:8000";

export const socket = io(serverUrl, {
  withCredentials: true,
  autoConnect: false,
});