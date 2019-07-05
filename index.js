const socket = require('socket.io-client')('http://localhost:8888');

const electron = require('electron');
const url = require('url');
const path = require('path');
const funcs = require(__dirname + '/funcs');

const {app, BrowserWindow, Menu, ipcMain} = electron;

const h = process.platform == "darwin" ? 22 : 30;

const key = process.platform == "darwin" ? "Cmd" : "Ctrl";

let menuWindow, gameWindow;

let gameData;

app.on('ready', () => {
    menuWindow = new BrowserWindow({width: 64 * 5, height: 64 * 2 + h, resizable: false, fullscreenable: false});
    menuWindow.loadURL(funcs.getUrl("/"));

    funcs.createMenu(Menu, key, app);

    ipcMain.on("enter", (e, room) => {
        socket.emit("enter", room);
    });

    socket.on("room:busy", (r) => {
        menuWindow.webContents.send("room:busy", r);
    });

    socket.on("new:game", (data) => {
        gameWindow = new BrowserWindow({width: 64 * 8, height: 64 * 8 + h, resizable: false, fullscreenable: false});
        gameWindow.loadURL(funcs.getUrl("/game"));

        gameData = data;

        menuWindow.close();
        menuWindow = null;
    });

    ipcMain.on("get:data", () => {
        gameWindow.webContents.send("data", gameData);
    });
});
