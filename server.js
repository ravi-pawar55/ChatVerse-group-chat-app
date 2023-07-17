const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { setUser, getUser, getAllUser, deleteUser } = require('./userbase/users');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname + "/public/script.js");
  });

io.on('connection', (socket) => {

  socket.on("new-user-joining", (userName) => {
    if(getUser(userName)!==undefined){
      socket.emit("user-already-exists", userName);
      return;
    }

    setUser(userName, socket);
    io.emit("joined",userName);
    io.emit("user-joined",Object.keys(getAllUser()));

    // socket.on('typing', (userName) => {
    //   console.log(userName);
    //   io.emit('user-typing',userName);
    // });
     

  socket.on("disconnect", () => {
    io.emit("left",userName);
    deleteUser(userName);
    io.emit("user-disconnected", userName);
  });

});

  socket.on("chat-msg",(obj)=>{
    io.emit("chat-msg",obj);
  });

  socket.on('private-msg',(obj)=>{
    socket.to(getUser(obj.users)).emit('private-msg',obj);
    socket.emit('private-msg',obj);
  });
  
});

 
server.listen(3000, () => {
  console.log('listening on port : 3000 ');
});