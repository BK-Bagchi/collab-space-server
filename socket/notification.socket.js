import { users } from "./active.socket.js";

export const sendNotification = (io, memberIds, notifications) => {
  memberIds.forEach((memberId) => {
    const sockets = users[memberId.toString()] || [];
    sockets.forEach((socketId) => {
      io.to(socketId).emit("notification", notifications);
    });
  });
};
