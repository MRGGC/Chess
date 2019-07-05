class Board {

    constructor() {
        this.pieces = [];
        this.loadPieces();
    }

    findPiece(x, y) {
        let ans = -1;
        this.pieces.map((p, indx) => { if (p.position.gx == x && p.position.gy == y) ans = indx });
        return ans;
    }

    loadPieces() {

        /*  Loading Black Pieces  */
        this.pieces.push(new King(4, 7, 1));
        this.pieces.push(new Rook(0, 7, 1)); this.pieces.push(new Rook(7, 7, 1));
        this.pieces.push(new Knight(1, 7, 1)); this.pieces.push(new Knight(6, 7, 1));
        this.pieces.push(new Bishop(2, 7, 1)); this.pieces.push(new Bishop(5, 7, 1));
        this.pieces.push(new Queen(3, 7, 1));
        for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 6, 1));

        /*  Loading White Pieces  */
        this.pieces.push(new Rook(0, 0, 0)); this.pieces.push(new Rook(7, 0, 0));
        this.pieces.push(new Knight(1, 0, 0)); this.pieces.push(new Knight(6, 0, 0));
        this.pieces.push(new Bishop(2, 0, 0)); this.pieces.push(new Bishop(5, 0, 0));
        this.pieces.push(new Queen(3, 0, 0));
        for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 1, 0));
        this.pieces.push(new King(4, 0, 0));

    }

    drawPieces() {
        for (let i in this.pieces) {
            this.pieces[i].update();
            this.pieces[i].draw();
        }
    }

    showGrid() {
        let p = 0;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if ((j + p) % 2 == 0) {
                    fill(249, 222, 183);
                } else {
                    fill(168, 71, 30);
                }
                rect(j * tSize, i * tSize, tSize, tSize);
            }
            p++;
        }

        this.drawPieces();
    }

    isInBoard(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }

    change(c) {
        let coords = moves[moveIndex + c];
        let cmds = c ? [0, 1, 2, 3] : [2, 3, 0, 1];
        let i = board.findPiece(coords[cmds[0]], coords[cmds[1]]);

        if (i + 1) {
            board.pieces[i].position.gx = coords[cmds[2]];
            board.pieces[i].position.gy = coords[cmds[3]];
            if (board.pieces[i].letter == 'P') board.pieces[i].hasMoved += c ? 1 : -1;

            moveIndex += c ? 1 : -1;

            turn = !turn;
        }
    }

}
