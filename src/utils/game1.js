const { playerJoin, getCurrentPlayer, playerLeave, getRoomPlayers, allStarted } = require("./player");

class Room {
  guessDuration = 60;
  color = "";
  running = true;

  constructor(players, room) {
    this.players = players;
    this.room = room;
  }

  generateColor() {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    this.color = color;
    return color;
  }

  getHost() {
    const host = this.players.find((player) => player.wasHost === false);
    if (host) {
      host.wasHostSet();
      return host;
    } else {
      return false;
    }
  }
}

module.exports = { Room };
