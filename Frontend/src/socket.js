import { io } from "socket.io-client";

export const serverUrl = "https://food-delivery-appp-1.onrender.com";

export const socket = io(serverUrl, {
  withCredentials: true,
  autoConnect: false,
});