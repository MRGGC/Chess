const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');

const app = express();
const urlEncodedParser = bodyParser.urlencoded({extended:false});

let rooms = {};
let socketRooms = {};

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/"));

app.get('/', (req, res) => {
    res.render("index");
});

app.get("/game", (req, res) => {
    res.render("game");
});

const server = app.listen(8888, () => {
    console.log("Server is running...");
});

const io = socket(server);

io.on('connection', socket => {

    console.log("Connection with Socket ID of " + socket.id);

    socket.on("enter", room => {
        let r = rooms[room];

        if (r == undefined || r < 1) {
            rooms[room] = (r == undefined || r == -1) ? 0 : rooms[room] + 1;
            socket.emit("new:game", {room: room, color: !rooms[room]});
        } else {
            socket.emit("room:busy", room);
        }
    });

    socket.on("join", (room) => {
        socket.join(room);
        socketRooms[socket.id] = room;
    });

    socket.on("game:change", (data) => {
        socket.broadcast.in(data.room).emit("game:change", data.c);
    });

    socket.on("new:pos", (data) => {
        socket.broadcast.in(data.room).emit("set:pos", data)
    });

    socket.on("disconnect", () => {
        rooms[socketRooms[socket.id]]--;
        socket.leave(socketRooms[socket.id]);
    });

});
