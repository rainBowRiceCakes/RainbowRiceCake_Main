import { io } from "socket.io-client";
const SOCKET_URL = process.env.NODE_ENV === "dev" ? "http://localhost:3000" : import.meta.env.VITE_SOCKET_URL; // 서버 주소
export const socket = io(SOCKET_URL, { autoConnect: false });