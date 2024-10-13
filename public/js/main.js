const roomName = document.getElementById("room-name");
const playerList = document.querySelector(".Players-list");
const startBtn = document.querySelector(".start-btn");
const choicesText = document.querySelector(".choiches-Text");
const colorContainer = document.querySelector(".color-container");
const choicesContainer = document.querySelector(".choices-container");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.on("gameOver", () => {
  choicesText.innerText = "Press start to play";
  colorContainer.classList.remove("host");
  colorContainer.innerHTML = `<button class="start-btn retry">Start</button>`;
  document.querySelector(".retry").addEventListener("click", (e) => {
    socket.emit("start", { username });
  });
});

socket.emit("joinRoom", { username, room });

socket.on("roomPlayers", ({ room, players }) => renderPlayers({ room, players }));

socket.on("hostInfo", (color) => {
  console.log(color);
  loadHostColor(color);
});

socket.on("guesserInfo", (colors) => {
  loadGuessingWindow(colors);
});

startBtn.addEventListener("click", (e) => {
  socket.emit("start", { username });
});

// DOM manipulation

colorContainer.addEventListener("click", (e) => {
  if (e.target.classList == "color") {
    if (document.querySelector(".choosen")) {
      document.querySelector(".choosen").classList = "color";
    }
    e.target.classList.add("choosen");
    socket.emit("colorPick", e.target.id);
  }
});

function renderPlayers({ room, players }) {
  roomName.innerText = room;
  playerList.innerHTML = `${players
    .map((player) => {
      return `<div class="player-box">
              <p class="player-name">${player.username}</p>
              <p class="player-score">${player.score}</p>
            </div>`;
    })
    .join("")}`;
}

function loadHostColor(color) {
  choicesText.innerText = "Main color";
  colorContainer.classList = "color-container host";
  colorContainer.innerHTML = `<div class="main"  style="background-color: #${color}"></div>`;
}

function loadGuessingWindow(colors) {
  choicesText.innerText = "Choose a Color";
  colorContainer.classList = "color-container";

  colorContainer.innerHTML = `${colors
    .map((color) => {
      return `<div class="color" id=${color} style="background-color: #${color}"></div>`;
    })
    .join("")}`;
}
