


/**
 *
 *  Game states:
 *      - not started: 0
 *      - in progress: 1
 *      - finished: 2
 *
 *  Player color:
 *      - white: 0
 *      - black: 1
 * 
 *  Player turn:
 *      - white: 0
 *      - black: 1
 *
 */

function Game(id) {

    this.gameId = id;
    this.player1 = null;
    this.player2 = null;
    this.p1Color =  Math.floor((Math.random() * 50 )) % 2;
    this.p2Color = this.p1Color == 0 ? 1 : 0;
    //console.log(this.p1Color + " " + this.p2Color);
    this.state = 0;
    this.turn = undefined;


    this.pieceState = [
        [10, 8, 9, 11, 12, 9, 8, 10],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [4, 2, 3, 5, 6, 3, 2, 4]
    ];
   
    this.addPlayer = function (ws) {
        if (this.player1 != null) {
            this.player2 = ws; 
            return 1;
        }
        this.player1 = ws;
        return 0;
    }

    this.getp1Color = function () {
        return this.p1Color;
    }

    this.getp2Color = function () {
        return this.p2Color;
    }

    this.setState = function (s) {
        this.state = s;
        if (this.state == 0 && s == 1) {
            this.turn = 0;
        }
    }

    this.getPlayer1 = function () {
        return this.player1;
    }

    this.getPlayer2 = function () {
        return this.player2;
    }

    this.getPieceState = function () {
        return this.pieceState;
    }

    this.completeGame = function () {
        if (this.player1 != null && this.player2 != null) {
            return true;
        }
        return false;
    }

    this.updatePieceState = function (start, end) {

        let strStart = Array.from(start);
        let strEnd = Array.from(end);

        
        let x1 = 8 - parseInt(strStart[1], 10);
        let y1 = strStart[0].charCodeAt() - 97;
        let x2 = 8 - parseInt(strEnd[1], 10);
        let y2 = strEnd[0].charCodeAt() - 97;
        

        console.log(this.pieceState[x1][y1] + " " + this.pieceState[x2][y2]);

        this.pieceState[x2][y2] = this.pieceState[x1][y1];
        this.pieceState[x1][y1] = 0;


        console.log(this.pieceState[x1][y1] + " " + this.pieceState[x2][y2]);
    }    
}

module.exports = Game;
