const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const { Room } = require("./utils/game1");
const { playerJoin, getCurrentPlayer, playerLeave, getRoomPlayers, allStarted } = require("./utils/player");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

const botName = "Vergas";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const player = playerJoin(socket.id, username, room);

    if (player) {
      socket.join(player.room);

      /* socket.emit("message", formatMessage(botName, "Welcome to ChatCord!")); */

      // Broadcast when a user connects
      /* socket.broadcast.to(player.room).emit("message", formatMessage(botName, `A ${player.username} has joined the chat`)); */

      // send users and room info
      io.to(player.room).emit("roomPlayers", {
        room: player.room,
        players: getRoomPlayers(player.room),
      });
    } else {
      socket.emit("error", "couldnt connect");
    }
  });

  // Set color pick for player
  socket.on("colorPick", (color) => {
    getCurrentPlayer(socket.id).selectedColor = color;
  });

  socket.on("start", () => {
    const player = getCurrentPlayer(socket.id);
    if (!player) return;
    player.ready = true;
    console.log(player);
    if (allStarted(player.room)) {
      startGame(player.room);
    }
  });

  // Listen for chat message
  /* socket.on("chatMessage", (msg) => {
    const player = getCurrentPlayer(socket.id);
    io.to(player.room).emit("message", formatMessage(player.username, msg));
  }); */

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const player = playerLeave(socket.id);

    if (player) {
      /* io.to(player.room).emit("message", formatMessage(botName, `A ${player.username} has left the chat`)); */

      // send users and room info
      io.to(player.room).emit("roomPlayers", {
        room: player.room,
        players: getRoomPlayers(player.room),
      });
    }
  });

  function startGame(roomName) {
    const room = new Room(getRoomPlayers(roomName), roomName);
    oneCycle(room);
    calculateScore(room.players, room.color);
    var mainLoop = setInterval(() => {
      calculateScore(room.players, room.color);
      oneCycle(room, mainLoop);
    }, 30000);
  }

  function oneCycle(room, mainLoop) {
    const host = room.getHost();
    if (host) {
      // Host info emit
      const color = room.generateColor();
      io.to(host.id).emit("hostInfo", color);

      // Guesser info emit
      io.to(room.room)
        .except(host.id)
        .emit("guesserInfo", ["ae5861", "2941fa", "b0b1ff", `${color}`, "95539e", "475f76"]);
    } else {
      clearInterval(mainLoop);
      io.to(room.room).emit("gameOver");
      resetGame(room);
    }
  }

  function calculateScore(players, correctColor) {
    players.forEach((player) => {
      if (player.selectedColor === correctColor) {
        player.score += 1;
        player.selectedColor = "";
      }
    });
    io.to(players[0].room).emit("roomPlayers", {
      room: players[0].room,
      players: players.sort((a, b) => b.score - a.score),
    });
  }

  function resetGame(room) {
    room.color = "";
    room.players.forEach((player) => player.reset());
  }
});

server.listen(port, () => {
  console.log("connected");
});
