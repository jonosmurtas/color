const players = [];

class Player {
  score = 0;
  wasHost = false;
  isHost = false;
  ready = false;
  selectedColor = "";
  constructor(id, username, room) {
    this.id = id;
    this.username = username;
    this.room = room;
  }

  wasHostSet() {
    this.wasHost = true;
  }

  reset() {
    this.score = 0;
    this.wasHost = false;
    this.isHost = false;
    this.ready = false;
  }
}

// Join users to chat
function playerJoin(id, username, room) {
  const player = new Player(id, username, room);
  if (!players.find((player) => player.username === username && player.room === room)) {
    players.push(player);
    return player;
  }
  return false;
}

// Get current user
function getCurrentPlayer(id) {
  return players.find((player) => player.id === id);
}

// User leaves chat
function playerLeave(id) {
  const index = players.findIndex((player) => player.id === id);
  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
}

// Get Room users
function getRoomPlayers(room) {
  return players.filter((player) => player.room === room);
}

function allStarted(room) {
  const players = getRoomPlayers(room);
  const allReady = !players.find((player) => player.ready === false);
  return allReady;
}

module.exports = {
  playerJoin,
  getCurrentPlayer,
  playerLeave,
  getRoomPlayers,
  allStarted,
};
