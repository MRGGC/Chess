const electron = require('electron');
const {ipcRenderer} = electron;

const socket = io.connect("http://localhost:8888");
let color, room;

const tSize = 64;
const size = 8;

let board;
let index = -1;
let turn = 1;

let spriteSize = 333;
let spriteSheet;

let moves = [];
let moveIndex = -1;

function preload() {
    ipcRenderer.send("get:data");

    ipcRenderer.on("data", (e, data) => {
        room = data.room;
        color = data.color;

        console.log(color);

        socket.emit("join", room);
    });

    spriteSheet = loadImage("assets/images/spritesheet.png");
}
