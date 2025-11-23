export let users = {};
const activeSocket = (io, socket) => {
  socket.on("becomeActive", ({ userId }) => {
    if (!users[userId]) users[userId] = [];
    users[userId].push(socket.id);

    console.log(`🟢 ${userId} is online`);
    io.emit("activeUsers", Object.keys(users));
  });

  socket.on("setup", (userId) => {
    socket.join(userId.toString());
    console.log(`🔥 User ${userId} joined room`, [...socket.rooms]);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User went offline:", socket.id);
    for (let userId in users) {
      users[userId] = users[userId].filter((id) => id !== socket.id);
      if (users[userId].length === 0) delete users[userId];
    }

    io.emit("activeUsers", Object.keys(users));
  });
};

export default activeSocket;
