import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer | null = null;

// No-op emitter for serverless environments where Socket.IO is unavailable
const noopEmitter = {
  emit: () => noopEmitter,
  to: () => noopEmitter,
  in: () => noopEmitter,
};

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_role_room", (role) =>
      socket.join(role === "admin" ? "admin_room" : "medical_room"),
    );
    socket.on("notify_user_created", () => {
      console.log(`notify_user_created from ${socket.id}`);
      // broadcast to everyone except sender
      socket.emit("notify_user_created");
    });
  });
  return io;
};

export const getIO = (): any => {
  if (!io) {
    // Return a no-op emitter in serverless environments
    return noopEmitter;
  }
  return io;
};
