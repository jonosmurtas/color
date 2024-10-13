/* const { Socket } = require("engine.io");

const Games = [];

class Game {
  running = true;
  _correctColor = this.generateColor();
  host = this.selectHost();
  questionsAmount = 2;
  guessduration = 60;
  timeout = false;

  constructor(socket, io) {
    this.players = players;
    this.room = room;
  }

  selectHost() {
    const host = this.players.find((player) => player.wasHost === false);
    if (host) {
      return host;
    } else {
      return false;
    }
  }

  selectPlayerToAsk() {
    const playerToAsk = this.players.find((player) => player.questionsLeft > 0);
    if (playerToAsk) {
      return playerToAsk;
    } else {
      return false;
    }
  }
A
  generateColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
  }

  async countdown(time) {
    setInterval(() => (time -= 1), 1000);
  }

  couldown(duration) {
    this.timeout = true;
    const time = duration;
    if (time > 0) {
      setInterval(() => (time -= 1), 1000);
    } else {
      this.timeout = false;
    }
  }


  }
}
 */
