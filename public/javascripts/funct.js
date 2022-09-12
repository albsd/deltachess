function fillValidKingMoves(board, color) {
    let solutionboard = new Array(9);
    for (i = 0; i <= 7; i++) {
        solutionboard[i] = new Array(9);
        for (j = 0; j <= 7; j++) {
            solutionboard[i][j] = 0;
        }
    }
    for (i = 0; i <= 7; i++) {
        for (j = 0; j <= 7; j++) {
            if (board[i][j] == 1 && color == "black") {
                pawnHelperW(solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 2 && color == "black") {
                horseHelper(solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 3 && color == "black") {
                bishopHelper(board, solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 4 && color == "black") {
                rookHelper(board, solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 5 && color == "black") {
                bishopHelper(board, solutionboard, i, j);
                rookHelper(board, solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 6 && color == "black") {
                kingHelper(solutionboard, i, j);
                continue;
            }

            if (board[i][j] == 7 && color == "white") {
                pawnHelperB(solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 8 && color == "white") {
                horseHelper(solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 9 && color == "white") {
                bishopHelper(board, solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 10 && color == "white") {
                rookHelper(board, solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 11 && color == "white") {
                bishopHelper(board, solutionboard, i, j);
                rookHelper(board, solutionboard, i, j);
                continue;
            }
            if (board[i][j] == 12 && color == "white") {
                kingHelper(solutionboard, i, j);
            }
        }
    }
    return solutionboard;
}

function pawnHelperB(solutionboard, i, j) {
    if (i + 1 <= 7 && j + 1 <= 7) {
        solutionboard[i + 1][j + 1] = 1;
    }

    if (i + 1 <= 7 && j - 1 >= 0) {
        solutionboard[i + 1][j - 1] = 1;
    }
}

function pawnHelperW(solutionboard, i, j) {
    if (i - 1 >= 0 && j + 1 <= 7) {
        solutionboard[i - 1][j + 1] = 1;
    }
    if (i - 1 >= 0 && j - 1 >= 0) {
        solutionboard[i - 1][j - 1] = 1;
    }
}

function pawnHelperMoveB(original_board, solutionboard, i, j) {
    if (i + 1 <= 7 && j + 1 <= 7 && original_board[i + 1][j + 1] != 0) {
        solutionboard[i + 1][j + 1] = 1;
    }

    if (i + 1 <= 7 && j - 1 >= 0 && original_board[i + 1][j - 1] != 0) {
        solutionboard[i + 1][j - 1] = 1;
    }

    if (i + 1 <= 7 && original_board[i + 1][j] == 0) {
        solutionboard[i + 1][j] = 1;
    }
    if (i == 1 && original_board[3][j] == 0 && original_board[2][j] == 0) {
        solutionboard[3][j] = 1;
    }

}

function pawnHelperMoveW(original_board, solutionboard, i, j) {
    if (i - 1 >= 0 && j + 1 <= 7 && original_board[i - 1][j + 1] != 0) {
        solutionboard[i - 1][j + 1] = 1;
    }
    if (i - 1 >= 0 && j - 1 >= 0 && original_board[i - 1][j - 1] != 0) {
        solutionboard[i - 1][j - 1] = 1;
    }

    if (i - 1 >= 0 && original_board[i - 1][j] == 0) {
        solutionboard[i - 1][j] = 1;
    }
    if (i == 6 && original_board[4][j] == 0 && original_board[5][j] == 0) {
        solutionboard[4][j] = 1;
    }
}

function horseHelper(solutionboard, i, j) {
    if (i - 1 >= 0 && j - 2 >= 0) {
        solutionboard[i - 1][j - 2] = 1;
    }
    if (i - 1 >= 0 && j + 2 <= 7) {
        solutionboard[i - 1][j + 2] = 1;
    }
    if (i + 1 <= 7 && j - 2 >= 0) {
        solutionboard[i + 1][j - 2] = 1;
    }
    if (i + 1 <= 7 && j + 2 <= 7) {
        solutionboard[i + 1][j + 2] = 1;
    }
    if (i - 2 >= 0 && j - 1 >= 0) {
        solutionboard[i - 2][j - 1] = 1;
    }
    if (i - 2 >= 0 && j + 1 <= 7) {
        solutionboard[i - 2][j + 1] = 1;
    }
    if (i + 2 <= 7 && j - 1 >= 0) {
        solutionboard[i + 2][j - 1] = 1;
    }
    if (i + 2 <= 7 && j + 1 <= 7) {
        solutionboard[i + 2][j + 1] = 1;
    }
}

function bishopHelper(original_board, solutionboard, i, j) {
    let cnt = 1;
    while (i - cnt >= 0) {
        if (j - cnt >= 0) {
            solutionboard[i - cnt][j - cnt] = 1;
            if (original_board[i - cnt][j - cnt] != 0) break;
        }
        cnt++;
    }
    cnt = 1;
    while (i - cnt >= 0) {
        if (j + cnt <= 7) {
            solutionboard[i - cnt][j + cnt] = 1;
            if (original_board[i - cnt][j + cnt] != 0) break;
        }
        cnt++;
    }
    cnt = 1;
    while (i + cnt <= 7) {
        if (j - cnt >= 0) {
            solutionboard[i + cnt][j - cnt] = 1;
            if (original_board[i + cnt][j - cnt] != 0) break;
        }
        cnt++;
    }
    cnt = 1;
    while (i + cnt <= 7) {
        if (j + cnt <= 7) {
            solutionboard[i + cnt][j + cnt] = 1;
            if (original_board[i + cnt][j + cnt] != 0) break;
        }
        cnt++;
    }
}

function rookHelper(original_board, solutionboard, i, j) {
    for (p = i + 1; p <= 7; p++) {
        solutionboard[p][j] = 1;
        if (original_board[p][j] != 0) break;
    }
    for (p = i - 1; p >= 0; p--) {
        solutionboard[p][j] = 1;
        if (original_board[p][j] != 0) break;
    }
    for (p = j + 1; p <= 7; p++) {
        solutionboard[i][p] = 1;
        if (original_board[i][p] != 0) break;
    }
    for (p = j - 1; p >= 0; p--) {
        solutionboard[i][p] = 1;
        if (original_board[i][p] != 0) break;
    }
}

function queenHelper(original_board, solutionboard, i, j) {
    rookHelper(original_board, solutionboard, i, j);
    bishopHelper(original_board, solutionboard, i, j);
}

function kingHelper(solutionboard, i, j) {
    if (i - 1 >= 0) {
        solutionboard[i - 1][j] = 1;
        if (j - 1 >= 0) {
            solutionboard[i - 1][j - 1] = 1;
            solutionboard[i][j - 1] = 1;
        }
        if (j + 1 <= 7) {
            solutionboard[i][j + 1] = 1;
            solutionboard[i - 1][j + 1] = 1;
        }
    }
    if (i + 1 <= 7) {
        solutionboard[i + 1][j] = 1;
        if (j - 1 >= 0) {
            solutionboard[i + 1][j - 1] = 1;
            solutionboard[i][j - 1] = 1;
        }
        if (j + 1 <= 7) {
            solutionboard[i][j + 1] = 1;
            solutionboard[i + 1][j + 1] = 1;
        }
    }
}

// WHITE IDs:
// PAWN - 1
// HORSE - 2
// BISHOP - 3
// ROOK - 4
// QUEEN - 5
// KING - 6
// BLACK IDs: WHITE ID + 6



function check_verify(board) {
    let xb = 0, yb = 0, xw = 0, yw = 0;
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (board[i][j] == 6) {
                xw = i;
                yw = j;
            }
            if (board[i][j] == 12) {
                xb = i;
                yb = j;
            }
        }
    }

    let invalidmoveswhite = fillValidKingMoves(board, "white");
    let invalidmovesblack = fillValidKingMoves(board, "black");
    if (invalidmoveswhite[xw][yw] == 1) {
        return "white";
    }
    if (invalidmovesblack[xb][yb] == 1) {
        return "black";
    }
    return "none";

}

function check_verify(board) {
    let xb = 0, yb = 0, xw = 0, yw = 0;
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (board[i][j] == 6) {
                xw = i;
                yw = j;
            }
            if (board[i][j] == 12) {
                xb = i;
                yb = j;
            }
        }
    }

    let invalidmoveswhite = fillValidKingMoves(board, "white");
    let invalidmovesblack = fillValidKingMoves(board, "black");
    if (invalidmoveswhite[xw][yw] == 1) {
        return "white";
    }
    if (invalidmovesblack[xb][yb] == 1) {
        return "black";
    }
    return "none";

}

// mate_verify checks whether there is a mate on the board

function mate_verify(board) {
    if (check_verify(board) == "white") {
        var x = 0, y = 0;
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                if (board[i][j] == 6) {
                    x = i;
                    y = j;
                }
            }
        }
        let string = String.fromCharCode(y + 97) + (8 - x);
        let v = main(string, board); 
        if (v.length == 0) {
            return true;
        }
    }
    if (check_verify(board) == "black") {
        let x = 0, y = 0;
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                if (board[i][j] == 12) {
                    x = i;
                    y = j;
                }
            }
        }
        let string = String.fromCharCode(y + 97) + (8 - x);
        let v = main(string, board); 
        if (v.length == 0) {
            return true;
        }
    }
    return false;
}

function castle_verify(board, color) {

    if (color == "white") {
        if (board[7][4] != 6) return false;

        invalidmoves = fillValidKingMoves(board, "white");
        if (invalidmoves[7][1] == 0 && invalidmoves[7][2] == 0 && invalidmoves[7][3] == 0) return true;
        if (invalidmoves[7][5] == 0 && invalidmoves[7][6] == 0) return true;
        return false;
    }
    if (color == "black") {
        if (board[0][4] != 12) return false;
        invalidmoves = fillValidKingMoves(board, "black");
        if (invalidmoves[0][1] == 0 && invalidmoves[0][2] == 0 && invalidmoves[0][3] == 0) return true;
        if (invalidmoves[0][5] == 0 && invalidmoves[0][6] == 0) return true;
        return false;
    }
}

function main (pos, board){

    let str = Array.from(pos);

    var a = 8 - parseInt(str[1], 10);
    var b = str[0].charCodeAt() - 97;
    let tempboard = new Array(9);

    for(i = 0; i <= 7; i++){
        tempboard[i] = new Array(9);
        for(j = 0; j <= 7; j++){
            tempboard[i][j] = 0;
        }
    }
    if(board[a][b] == 6){ // if king then ensure xy's validity
        let validmoves = fillValidKingMoves(board, "white");
        let v = [];
        kingHelper(tempboard, a, b);

        for(i = 0; i <= 7; i++){
            for(j = 0; j <= 7; j++){
                if(tempboard[i][j] == 1 && validmoves[i][j] == 0){
                    let string = String.fromCharCode(j + 97) + (8 - i);
                    v.push(string);
                }
            }
        }

        return v;
    } 
    if(board[a][b] == 12){ // if king then ensure xy's validity
        let validmoves = fillValidKingMoves(board, "black");
        let v = [];
        kingHelper(tempboard, a, b);

        for(i = 0; i <= 7; i++){
            for(j = 0; j <= 7; j++){
                if(tempboard[i][j] == 1 && validmoves[i][j] == 0){
                    let string = String.fromCharCode(j + 97) + (8 - i);
                    v.push(string);
                }
            }
        }

        return v;
    } 

    let validmoves = new Array(9);
    for(i = 0; i <= 7; i++){
        validmoves[i] = new Array(9);
        for(j = 0; j <= 7; j++){
            validmoves[i][j] = -1;
        }
    }

    if(board[a][b] == 1) {
        pawnHelperMoveW(board, validmoves, a, b);
        
    }
    if(board[a][b] == 7) {
        pawnHelperMoveB(board, validmoves, a, b);
       
    }
    if(board[a][b] == 2 || board[a][b] == 8) {
        horseHelper(validmoves, a, b);
       
    }
    if(board[a][b] == 3 || board[a][b] == 9) {
        bishopHelper(board, validmoves, a, b);
        
    }
    if(board[a][b] == 4 || board[a][b] == 10) {
        rookHelper(board, validmoves, a, b);
       
    }
    if(board[a][b] == 5 || board[a][b] == 11) {
        bishopHelper(board, validmoves, a, b);
        rookHelper(board, validmoves, a, b);
        
    }
    let v = new Array();

    for(i = 0; i <= 7; i++){
        for(j = 0; j <= 7; j++){
            if(board[i][j] == 6 || board[i][j] == 12) validmoves[i][j] = -1;

            let string =  String.fromCharCode(j + 97) + (8 - i);
        
            if(validmoves[i][j] == 1){
                v.push(string);
            }
        }
    }
    return v;
}