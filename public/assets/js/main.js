function setup() {
    createCanvas(size * tSize, size * tSize);
    frameRate(60);

    board = new Board();
}

function draw() {
    clear();
    noStroke();
    board.showGrid();
}

socket.on("set:pos", data => {
    board.pieces[data.index].setPos(data.x, data.y);
});

socket.on("game:change", c => {
    board.change(c);
});

function mousePressed() {
    let x = Math.floor( map(mouseX, 0, tSize * size, 0, 8) );
    let y = Math.floor( map(mouseY, 0, tSize * size, 0, 8) );

    if (index + 1) {
        board.pieces[index].taken = 0;
        board.pieces[index].setPos(x, y);
        socket.emit("new:pos", {room: room, index: index, x: x, y: y});
        index = -1;
    } else {
        index = board.findPiece(x, y);

        if (index + 1) {
            if (board.pieces[index].color == color) {
                board.pieces[index].taken = 1;
            } else {
                index = -1;
            }
        }
    }
}

function keyPressed() {
    if (keyCode == 90) {board.change(0); socket.emit("game:change", {room: room, c: 0});}
    if (keyCode == 89) {board.change(1); socket.emit("game:change", {room: room, c: 1});};
}
