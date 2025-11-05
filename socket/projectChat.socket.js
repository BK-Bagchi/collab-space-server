import Chat from "../models/chat.model.js";

let projectRooms = {}; // { projectId: [socketIds] }

const projectChatSocket = (io, socket) => {
  // Join project room
  socket.on("joinProject", async ({ projectId, userId }) => {
    socket.join(projectId);
    if (!projectRooms[projectId]) projectRooms[projectId] = [];
    projectRooms[projectId].push(socket.id);

    console.log(`🟢📦 ${userId} joined project ${projectId}`);

    const oldProjectMessages = await Chat.find({ project: projectId }).sort({
      createdAt: 1,
    });

    socket.emit("oldProjectMessages", oldProjectMessages);
  });

  // Send message in project chat
  socket.on("projectMessage", async ({ projectId, sender, content }) => {
    const message = new ProjectChat({
      sender,
      project: projectId,
      content,
    });
    await message.save();

    // send to all in project room
    io.to(projectId).emit("projectMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Project Chat Disconnected:", socket.id);
    for (let project in projectRooms) {
      projectRooms[project] = projectRooms[project].filter(
        (id) => id !== socket.id
      );
      if (projectRooms[project].length === 0) delete projectRooms[project];
    }
  });
};

export default projectChatSocket;
