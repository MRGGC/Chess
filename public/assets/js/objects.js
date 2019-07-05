class Piece {

    constructor(x, y, color) { // 1 -> WHITE | 0 -> BLACK
        this.color = color;
        this.taken = 0;
        this.size = tSize;
        this.position = {
            gx: x, gy: y,
            cx: x * tSize, cy: y * tSize,
            sx: 0, sy: Math.abs(this.color-1),
        }
    }

    update() {
        if (this.taken) {
            this.position.cx = mouseX - tSize / 2;
            this.position.cy = mouseY - tSize / 2;
        } else {
            this.position.cx = this.position.gx * tSize;
            this.position.cy = this.position.gy * tSize;
        }
    }

    movingThroughPieces(x, y) {
        let deltaX = 0, deltaY = 0;
        if (x - this.position.gx) deltaX = (x - this.position.gx) / Math.abs(x - this.position.gx);
        if (y - this.position.gy) deltaY = (y - this.position.gy) / Math.abs(y - this.position.gy);

        let _x = this.position.gx + deltaX, _y = this.position.gy + deltaY;

        let c = 0;

        while ((_x != x || _y != y) && c < 9) {
            if (board.findPiece(_x, _y) + 1) return 1;

            _x += deltaX;
            _y += deltaY;

            c++;
        }

        return c > 8;
    }

    setPos(x, y) {
        let K = board.pieces[!this.color * (board.pieces.length - 1)];
        let oldX = this.position.gx, oldY = this.position.gy;

        let check1 = this.canMove(x, y) && board.isInBoard(x, y) && this.color == turn;
        this.position.gx = x;
        this.position.gy = y;
        let check2 = (this.letter == 'K' ? 1 : K.isCheck(K.position.gx, K.position.gy));
        this.position.gx = oldX;
        this.position.gy = oldY;

        if (check1 && (!check2 || (this.isEating(x, y) && board.findPiece(x, y) + 1))) {
            this.eat(x, y);
            turn = !turn;
            this.position.gx = x;
            this.position.gy = y;

            moves.splice(moveIndex + 1, moves.length - (moveIndex + 1));

            moves.push([oldX, oldY, x, y]);
            moveIndex++;
        }
    }

    isEating(x, y) {
        let indx = board.findPiece(x, y);
        if (indx + 1) {
            if (board.pieces[indx].color == this.color) {
                return 0;
            }
        }
        return 1;
    }

    eat(x, y) {
        let i = board.findPiece(x, y);
        if (i + 1) board.pieces.splice(i, 1);
    }

    draw() {
        image(spriteSheet, this.position.cx, this.position.cy, this.size, this.size, this.position.sx * spriteSize, this.position.sy * spriteSize, spriteSize, spriteSize);
    }

}

class King extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.position.sx = 0;
        this.letter = 'K';
    }

    canMove(x, y) {
        return !this.movingThroughPieces(x, y) && !this.isCheck(x, y) && Math.abs(this.position.gx - x) <= 1 && Math.abs(this.position.gy - y) <= 1 && this.isEating(x, y);
    }

    isCheck(x, y) {
        for (let i = 1; i < board.pieces.length - 1; i++) {
            if (board.pieces[i].canMove(x, y, 0) && board.pieces[i].color != this.color) return 1;
        }
        return 0;
    }
}

class Queen extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.position.sx = 1;
        this.letter = 'Q';
    }

    canMove(x, y) {
        return !this.movingThroughPieces(x, y) && (Math.abs(x - this.position.gx) == Math.abs(y - this.position.gy) || x == this.position.gx || y == this.position.gy) && this.isEating(x, y);
    }
}

class Knight extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.position.sx = 3;
        this.letter = 'Kn';
    }

    canMove(x, y) {
        return this.isEating(x, y) && ( (Math.abs(x - this.position.gx) == 1 && Math.abs(y - this.position.gy) == 2) || (Math.abs(x - this.position.gx) == 2 && Math.abs(y - this.position.gy) == 1));
    }
}

class Bishop extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.position.sx = 2;
        this.letter = 'B';
    }

    canMove(x, y) {
        return !this.movingThroughPieces(x, y) && this.isEating(x, y) && Math.abs(y - this.position.gy) == Math.abs(x - this.position.gx);
    }
}

class Rook extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.position.sx = 4;
        this.letter = 'R';
    }

    canMove(x, y) {
        return !this.movingThroughPieces(x, y) && this.isEating(x, y) && (this.position.gx == x || this.position.gy == y);
    }
}

class Pawn extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.hasMoved = 0;
        this.position.sx = 5;
        this.letter = 'P';
    }

    canMove(x, y, c = 1) {
        let deltaY = this.color ? this.position.gy - y : y - this.position.gy, deltaX = Math.abs(this.position.gx - x);
        let res = !this.movingThroughPieces(x, y) && (deltaY == 2 ? deltaX == 0 && !this.hasMoved && c : (deltaY == 1 ? (deltaX == 1 ? board.findPiece(x, y) + 1 : deltaX == 0 && board.findPiece(x, y) == -1) : 0));

        if (res && (this.position.gy != y || this.position.position.gx != x)) this.hasMoved = Math.max(0, this.hasMoved + 1);
        return res;
    }
}
