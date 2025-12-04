import Chat from "../models/chat.model.js";
import File from "../models/file.model.js";

let projectRooms = {}; // { projectId: [socketIds] }

const projectChatSocket = (io, socket) => {
  // Join project room
  socket.on("joinProject", async ({ projectId, sender }) => {
    socket.join(projectId);

    if (!projectRooms[projectId]) projectRooms[projectId] = [];
    projectRooms[projectId].push(socket.id);

    console.log(`🟢📦 ${sender} joined project ${projectId}`);

    await Chat.updateMany(
      {
        project: projectId,
        readBy: { $ne: sender },
      },
      { $addToSet: { readBy: sender } }
    );

    const oldProjectMessages = await Chat.find({ project: projectId })
      .populate("sender", "-password")
      .populate("project")
      .populate("attachment")
      .sort({ createdAt: 1 });

    socket.emit("oldProjectMessages", oldProjectMessages);
  });

  // Send message in project chat
  socket.on(
    "projectMessage",
    async ({ projectId, sender, content, attachment, type }) => {
      let populatedMsg;

      if (type === "FILE" && attachment) {
        const file = await File.create({
          name: attachment.name,
          url: attachment.url,
          project: projectId,
          uploadedBy: sender,
        });

        const chatData = {
          sender,
          project: projectId,
          attachment: file._id,
          type,
        };
        const chatCreate = await Chat.create(chatData);

        populatedMsg = await Chat.findById(chatCreate._id)
          .populate("sender", "-password")
          .populate("project")
          .populate("attachment");
      } else {
        const message = await Chat.create({
          sender,
          project: projectId,
          content,
        });

        populatedMsg = await Chat.findById(message._id)
          .populate("sender", "-password")
          .populate("project");
      }

      // send to all in project room
      io.to(projectId).emit("projectMessage", populatedMsg);
    }
  );

  //Typing indicator
  socket.on("typing", ({ projectId, user }) => {
    socket.to(projectId).emit("typing", user);
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
