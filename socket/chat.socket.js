import Chat from "../models/chat.model.js";

let users = {}; // { userId: [socketId1, socketId2] }

const chatSocket = (io, socket) => {
  // Register user for a private chat
  socket.on("register", async ({ sender, receiver }) => {
    if (!sender || !receiver) return;

    if (!users[sender]) users[sender] = [];
    if (!users[sender].includes(socket.id)) users[sender].push(socket.id);

    //   console.log(`👤 User ${sender} registered to chat with ${receiver}`);

    // Fetch old chat history (sorted oldest → newest)
    const oldMessages = await Chat.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    socket.emit("oldMessages", oldMessages);
  });

  // Send a new message
  socket.on("newMessage", async ({ sender, receiver, content, attachment }) => {
    if (!sender || !receiver || (!content && !attachment)) return;

    let newMessage;
    if (attachment) {
      newMessage = new Chat({ sender, receiver, attachment, type: "FILE" });
    } else {
      newMessage = new Chat({ sender, receiver, content, type: "TEXT" });
    }

    await newMessage.save();

    // Emit message to both sender and receiver (if online)
    [sender, receiver].forEach((userId) => {
      const socketList = users[userId];
      if (socketList) {
        socketList.forEach((id) => {
          io.to(id).emit("newMessage", newMessage);
        });
      }
    });
  });

  // Typing indicator
  socket.on("typing", ({ sender, receiver }) => {
    const targetSockets = users[receiver];
    if (targetSockets) {
      targetSockets.forEach((id) => {
        io.to(id).emit("typing", { sender });
      });
    }
  });

  // Handle disconnects safely
  socket.on("disconnect", () => {
    console.log("🔴 User left the chat:", socket.id);
    for (const userId in users) {
      users[userId] = users[userId].filter((id) => id !== socket.id);
      if (users[userId].length === 0) delete users[userId];
    }
  });
};

export default chatSocket;
