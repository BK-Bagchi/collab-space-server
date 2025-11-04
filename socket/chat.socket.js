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
};

export default chatSocket;
