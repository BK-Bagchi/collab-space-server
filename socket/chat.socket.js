const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected", socket.id);
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
