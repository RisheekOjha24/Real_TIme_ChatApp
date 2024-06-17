const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const Message = require("./models/messageModel");

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

// This code initializes a Socket.IO instance by passing the HTTP server instance (server) to the socket function.
// The io variable now represents the Socket.IO instance, which is attached to the existing HTTP server.
const io = socket(server, {
  cors: {
    origin: process.env.FRONT_END_URL,
    credentials: true,
  },
});

global.io=io;
global.onlineUsers = new Map();
io.on("connection", (socket) => {
 
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);

    // Broadcast updated online users data to all connected clients
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });


  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);// checking if user to whom mssages is sended is online. i.e. wherther available in online users or not
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        msg:data.msg,
        from:data.from
      });
    }
  });
});


function deleteMessagesAfterDelay() {
  setInterval(async () => {
    try {
      const result = await Message.deleteMany({});

      if(result.deletedCount>0)
      console.log(`${result.deletedCount} messages deleted.`);
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  }, (10*60*1000)); // 10 min after message will be deleted
}

// Start the deletion process
deleteMessagesAfterDelay();