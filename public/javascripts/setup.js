// global

king_moved = false;
possible_future_states = undefined;
board_global = undefined;
start_global = undefined;
functionality = undefined;
player_color = undefined;
home_addr = 'http://localhost:3000';
abort_condition = true; // true if you can abort, no otherwise

// global

function allowDrop(ev) {
    ev.preventDefault();
}


function changeDragState(state, color) {

    if (state == 0) { // deactivate cells

        if (color == "any") {
            const elem = document.querySelectorAll("img");
            Array.from(elem).forEach(function (el) {
                el.setAttribute("draggable", "false");
            })
        }
        const elem = document.querySelectorAll("img." + color);
        Array.from(elem).forEach(function (el) {
            el.setAttribute("draggable", "false");
        })
    }
    else { // activate cells
        if (color == "any") {
            const elem = document.querySelectorAll("img");
            Array.from(elem).forEach(function (el) {
                el.setAttribute("draggable", "true");
            })
        }
        const elem = document.querySelectorAll("img." + color);
        Array.from(elem).forEach(function (el) {
            el.setAttribute("draggable", "true");
        });
    }

}

function checkOK(val) {
    console.log(possible_future_states);
    for (let i = 0; i < possible_future_states.length; i++) {
        if (possible_future_states[i] == val) {
            return true; // the new position of the selected piece is ok
        }
    }
    return false; // the new position of the selected piece is bad
}

function checkPossibleCheckValidation(board, start, end) {
    // return true if the given change in state results in a check and false otherwise

    updatePieceState(start, end, board);
    return check_verify(board);
}

function produceCastle(startk, startr, endk, endr, socket) {
    let initialKing = document.getElementById(startk);
    let initialRook = document.getElementById(startr);
    let endKing = document.getElementById(endk);
    let endRook = document.getElementById(endr);

    // be aware to send two moves to the opponent socket

    endKing.appendChild(initialKing.firstChild);
    endRook.appendChild(initialRook.firstChild);

    // when you castle you have to move the king first so...
    socket.send(JSON.stringify(
        {
            "type": "end",
            "id": endk
        }
    ));

    // now send a whole rook move to the other player
    socket.send(JSON.stringify(
        {
            "type": "start",
            "id": startr
        }
    ));
    socket.send(JSON.stringify(
        {
            "type": "end",
            "id": endr
        }
    ));

    changeDragState(0, "any");
}

function addPiece(type, board, imgPath, id_pos, socket, color, cellcls = "wht") {

    var piece = document.createElement("div"); // needs to be appended
    piece.classList.add("cell");
    piece.classList.add(color);
    piece.classList.add(cellcls);
    piece.setAttribute("id", id_pos);
    piece.setAttribute("ondragover", "allowDrop(event)");
    piece.ondrop = function (ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var piece_img = document.getElementById(data);
        // check if the drop square is good
        let changed_board = board_global;

        let piece_color = undefined;
        if (piece_img.classList.contains("white")) {
            piece_color = "white";
        }
        else {
            piece_color = "black";
        }

        if (!king_moved && castle_verify(board_global, piece_color)) {
            console.log("YES!!! " + start_global + " " + ev.currentTarget.id);
            if (start_global == "e1" && ev.currentTarget.id == "g1") {
                //console.log("YES2222!!!");
                produceCastle("e1", "h1", "g1", "f1", socket);
                return;
            }
            if (start_global == "e1" && ev.currentTarget.id == "c1") {
                produceCastle("e1", "a1", "c1", "d1", socket);
                return;
            }
            if (start_global == "e8" && ev.currentTarget.id == "g8") {
                produceCastle("e8", "h8", "g8", "f8", socket);
                return;
            }
            if (start_global == "e8" && ev.currentTarget.id == "c8") {
                produceCastle("e8", "a8", "c8", "d8", socket);
                return;
            }
        }

        // check for possible future positions
        // it is important when to check this
        if (!checkOK(ev.currentTarget.id)) {
            console.log("position is not good");
            return; 
        }


        let decision_changed = checkPossibleCheckValidation(changed_board, start_global, ev.currentTarget.id);
        console.log("check decision: " + decision_changed + " from " + start_global + " to " + ev.currentTarget.id);
        if (piece_img.classList.contains(decision_changed)) {
            console.log("pl " + changed_board);
            console.log("this position produces a check");
            return;
        }

        temp_elem = document.getElementById(ev.currentTarget.id);
        if (temp_elem.firstChild) {
            temp_elem.removeChild(temp_elem.firstChild);
            ev.currentTarget.appendChild(document.getElementById(data));
            socket.send(JSON.stringify(
                {
                    "type": "end",
                    "id": ev.currentTarget.id,
                }
            ));
        }
        else {
            ev.currentTarget.appendChild(document.getElementById(data));
            socket.send(JSON.stringify(
                {
                    "type": "end",
                    "id": ev.currentTarget.id
                }
            ));
        }
        if (abort_condition) {
            abort_condition = false;
            let butt = document.getElementById("abortbtn");
            butt.src = "./images/alt_x_sprite.png";
        }
        changeDragState(0, "any");
    }
    if (type == 0) {
        board.appendChild(piece);
        return;
    }
    var img = document.createElement("img");
    img.classList.add("piece");
    img.classList.add(color);
    img.src = imgPath;
    img.setAttribute("id", id_pos + "x");
    img.ondragstart = function (event) {
        event.dataTransfer.setData("text", event.target.id);
        let temp = document.getElementById(event.target.id).parentElement;
        socket.send(JSON.stringify(
            {
                "type": "start",
                "id": temp.id
            }
        ));
    }
    img.setAttribute("draggable", "false");  //this is useful to not allow players to 
    //move when they are not allowed to 
    piece.appendChild(img);
    board.appendChild(piece);
}

function updatePieceState(start, end, board) {

    let strStart = Array.from(start);
    let strEnd = Array.from(end);


    let x1 = 8 - parseInt(strStart[1], 10);
    let y1 = strStart[0].charCodeAt() - 97;
    let x2 = 8 - parseInt(strEnd[1], 10);
    let y2 = strEnd[0].charCodeAt() - 97;


    console.log(board[x1][y1] + " " + board[x2][y2]);

    board[x2][y2] = board[x1][y1];
    board[x1][y1] = 0;


    console.log(board[x1][y1] + " " + board[x2][y2]);
}

function initWhiteBoard(positions, socket) {

    const board = document.getElementById("board");
    player_color = "white";

    // black pieces
    addPiece(4, board, "./images/black_rook.png", positions[0], socket, "black");
    addPiece(2, board, "./images/black_knight.png", positions[1], socket, "black", "blck");
    addPiece(3, board, "./images/black_bishop.png", positions[2], socket, "black");
    addPiece(5, board, "./images/black_queen.png", positions[3], socket, "black", "blck");
    addPiece(6, board, "./images/black_king.png", positions[4], socket, "black");
    addPiece(3, board, "./images/black_bishop.png", positions[5], socket, "black", "blck");
    addPiece(2, board, "./images/black_knight.png", positions[6], socket, "black");
    addPiece(4, board, "./images/black_rook.png", positions[7], socket, "black", "blck");

    // black pawn line
    for (let i = 8; i < 16; i++) {
        if (i % 2 == 0)
            addPiece(1, board, "./images/black_pawn.png", positions[i], socket, "black", "blck");
        else {
            addPiece(1, board, "./images/black_pawn.png", positions[i], socket, "black");
        }
    }

    for (let i = 16; i < 48; i++) {
        if (i < 24) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined);
            else {
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            }
        }
        else if (i < 32) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            else {
                addPiece(0, board, "...", positions[i], socket, undefined);
            }
        }
        else if (i < 40) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined);
            else {
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            }
        }
        else if (i < 48) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            else {
                addPiece(0, board, "...", positions[i], socket, undefined);
            }
        }   
    }

    // white pawn line
    for (let i = 48; i < 56; i++) {
        if (i % 2 == 0) {
            addPiece(1, board, "./images/white_pawn.png", positions[i], socket, "white");
        }
        else {
            addPiece(1, board, "./images/white_pawn.png", positions[i], socket, "white", "blck");
        }

    }

    // white pieces 
    addPiece(4, board, "./images/white_rook.png", positions[56], socket, "white", "blck");
    addPiece(2, board, "./images/white_knight.png", positions[57], socket, "white");
    addPiece(3, board, "./images/white_bishop.png", positions[58], socket, "white", "blck");
    addPiece(5, board, "./images/white_queen.png", positions[59], socket, "white");
    addPiece(6, board, "./images/white_king.png", positions[60], socket, "white", "blck");
    addPiece(3, board, "./images/white_bishop.png", positions[61], socket, "white");
    addPiece(2, board, "./images/white_knight.png", positions[62], socket, "white", "blck");
    addPiece(4, board, "./images/white_rook.png", positions[63], socket, "white");

}

function initBlackBoard(positions, socket) {

    const board = document.getElementById("board");
    player_color = "black";

    // white pieces
    addPiece(4, board, "./images/white_rook.png", positions[0], socket, "white", "blck");
    addPiece(2, board, "./images/white_knight.png", positions[1], socket, "white");
    addPiece(3, board, "./images/white_bishop.png", positions[2], socket, "white", "blck");
    addPiece(5, board, "./images/white_queen.png", positions[3], socket, "white");
    addPiece(6, board, "./images/white_king.png", positions[4], socket, "white", "blck");
    addPiece(3, board, "./images/white_bishop.png", positions[5], socket, "white");
    addPiece(2, board, "./images/white_knight.png", positions[6], socket, "white", "blck");
    addPiece(4, board, "./images/white_rook.png", positions[7], socket, "white");

    // black pawn line
    for (let i = 8; i < 16; i++) {
        if (i % 2 == 0) {
            addPiece(1, board, "./images/white_pawn.png", positions[i], socket, "white");
        }
        else {
            addPiece(1, board, "./images/white_pawn.png", positions[i], socket, "white", "blck");
        }
    }

    for (let i = 16; i < 48; i++) {
        if (i < 24) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            else {
                addPiece(0, board, "...", positions[i], socket, undefined);
            }
        }
        else if (i < 32) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined);
            else {
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            }
        }
        else if (i < 40) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            else {
                addPiece(0, board, "...", positions[i], socket, undefined);
            }
        }
        else if (i < 48) {
            if (i % 2 == 0)
                addPiece(0, board, "...", positions[i], socket, undefined);
            else {
                addPiece(0, board, "...", positions[i], socket, undefined, "blck");
            }
        }
    }

    // white pawn line
    for (let i = 48; i < 56; i++) {
        if (i % 2 == 0) {
            addPiece(1, board, "./images/black_pawn.png", positions[i], socket, "black", "blck");
        }
        else  {
            addPiece(1, board, "./images/black_pawn.png", positions[i], socket, "black");
        }
    }

    // white pieces 
    addPiece(4, board, "./images/black_rook.png", positions[56], socket, "black");
    addPiece(2, board, "./images/black_knight.png", positions[57], socket, "black", "blck");
    addPiece(3, board, "./images/black_bishop.png", positions[58], socket, "black");
    addPiece(5, board, "./images/black_queen.png", positions[59], socket, "black", "blck");
    addPiece(6, board, "./images/black_king.png", positions[60], socket, "black");
    addPiece(3, board, "./images/black_bishop.png", positions[61], socket, "black", "blck");
    addPiece(2, board, "./images/black_knight.png", positions[62], socket, "black");
    addPiece(4, board, "./images/black_rook.png", positions[63], socket, "black", "blck");

}

function moveOpponentPiece(start, end) {
    //console.log(start + " " + end);
    var elemStart = document.getElementById(start);
    var piece = elemStart.firstChild;
    elemStart.removeChild(piece);



    var elemEnd = document.getElementById(end);

    if (elemEnd.firstChild) { // capture a piece
        elemEnd.removeChild(elemEnd.firstChild);
    }

    elemEnd.appendChild(piece);

}


function waitScreen() {
    const mainBody = document.body;

    var message = document.createElement("p");
    message.id = "waitmss";
    message.innerHTML = "Wait for another player to join";
    mainBody.appendChild(message);
}

function removeWait() {

    var message = document.getElementById("blinkme");
    console.log("Blink me is " + message);
    message.remove();
}

/*function firstMoveMessage() {
    const mainBody = document.body;

    var message = document.createElement("p");
    message.id = "firstmss";
    message.innerHTML = "Please make the first move";
    mainBody.appendChild(message);
}*/

/*
 *
 *  setup page when user enters the game
 * */
(function setup() {

    positionsWhite = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
        "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
        "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
        "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
        "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
        "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
        "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
        "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]

    positionsBlack = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
        "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
        "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
        "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
        "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
        "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
        "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
        "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]

    const socket = new WebSocket("ws://localhost:3000");
    var player_color = undefined;
    var game = undefined;

    socket.onmessage = function (message) {

        //console.log(message + "socket message");

        //console.log(message);
        if (message.data == "white") {
            initWhiteBoard(positionsWhite, socket);
            player_color = "white";
        }
        else if (message.data == "black") {
            initBlackBoard(positionsBlack, socket);
            player_color = "black";
        }
        else if (message.data == "gs-white" || message.data == "gs-black") {
            if (document.getElementById("blinkme")) {
                removeWait();
            }
            if (message.data == "gs-white") {
                //firstMoveMessage(); 
                changeDragState(1, player_color); // TODO: only affect specific color pieces
            }
        }
        else if (message.data == "recorded_move") {
            changeDragState(0); // TODO: only affect specific color pieces
        }
        else if (message.data == "make_move") {
            changeDragState(1); // TODO: only affect specific color pieces
        }
        else {

            //console.log(message.data)
            try {
                jsonMsg = JSON.parse(message.data);
                console.log("good resign point");

                console.log(jsonMsg);
                if (jsonMsg.type == "move") {
                    moveOpponentPiece(jsonMsg.start, jsonMsg.end);
                    changeDragState(1, player_color); // let the player make the new move now
                }
                else if (jsonMsg.type == "future") {
                    //console.log("puls");
                    possible_future_states = jsonMsg.states;
                    start_global = jsonMsg.start;
                    board_global = jsonMsg.board;
                    //functionality = JSON.parse(jsonMsg.functionality);
                }
                else if (jsonMsg.type == "finished") {
                    changeDragState(0, "any");
                    //var body = document.body;
                    //var elem = document.createElement("p");
                    //elem.innerHTML = "The game is finished, you are the " + jsonMsg.player_result;
                    //body.appendChild(elem);
                    alert("The game is finished, you are the " + jsonMsg.player_result);
                    window.location.href = home_addr;
                }
                else if (jsonMsg.type == "king_first_move") {
                    console.log("The king was moved, no more castle allowed!");
                    king_moved = true;
                }
                else if (jsonMsg.type == "options_message") {
                    //console.log("plplplplp");
                    if (jsonMsg.message == "resigned") {
                        changeDragState(0, "any");
                        alert("The opponent resigned! You have won the match!");
                        window.location.href = home_addr;
                    }
                    else if (jsonMsg.message == "aborted") {
                        changeDragState(0, "any");
                        alert("The opponent aborted! You will be redirected to the main page");
                        window.location.href = home_addr;
                    }
                    else if (jsonMsg.message == "draw_request") {
                        if (window.confirm("Do you accept the draw request?")) {
                            changeDragState(0, "any");
                            socket.send(JSON.stringify({
                                "type": "options_message",
                                "message": "draw_accept"
                            }));
                            alert("You agreed to a draw!. You will be redirected to the home page.");
                            window.location.href = home_addr;
                        }
                        else {
                            socket.send(JSON.stringify({
                                "type": "options_message",
                                "message": "draw_reject"
                            }));
                        }
                    }
                    else if (jsonMsg.message == "draw_accepted") {
                        changeDragState(0, "any");
                        let optionsBody = document.getElementById("options");
                        optionsBody.removeChild(document.getElementById("draw_message"));
                        alert("The draw request was accepted! You will be redirected to the home page.");
                        window.location.href = home_addr;

                    }
                    else if (jsonMsg.message == "draw_rejected") {
                        let optionsBody = document.getElementById("options");
                        optionsBody.removeChild(document.getElementById("draw_message"));
                        alert("Your opponent declined the draw offer!");
                        changeDragState(1, player_color);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }

        if (message.data == "disconnected") {
            alert("The opponent has disconnected");
            window.location.href = home_addr;
        }

    }

    socket.onopen = function () {

    }

    // insert all the buttons on the game page

    let resign_button = document.createElement("img");
    let optionsBody = document.getElementById("options");
    resign_button.src = "./images/surrender_sprite.png";
    resign_button.id = "resignbtn";

    //resign_button.setAttribute("onclick", "window.location.href='http://localhost:3000/'");

    resign_button.addEventListener('click', function (e) {

        socket.send(JSON.stringify(
            {
                "type": "options_message",
                "message": "resign"
            }
        ));
        changeDragState(0, "any");
        alert("You have resigned. You will be redirected to the home page.");
        window.location.href = home_addr;
    });
    optionsBody.appendChild(resign_button);

    let draw_button = document.createElement("img");
    draw_button.src = "./images/draw_sprite.png";
    draw_button.id = "drawbtn";

    draw_button.addEventListener('click', function (e) {
        socket.send(JSON.stringify(
            {
                "type": "options_message",
                "message": "draw"
            }
        ));

        changeDragState(0, "any");

        let draw_message = document.createElement("p");
        draw_message.id = "draw_message";
        draw_message.innerHTML = "Waiting for the opponent's response...";
        optionsBody.appendChild(draw_message);

        alert("You have sent a draw request to the opponent!");
    })

    optionsBody.appendChild(draw_button);

    let abort_button = document.createElement("img");
    abort_button.src = "./images/x_sprite.png";
    abort_button.id = "abortbtn";

    abort_button.addEventListener('click', function (e) {

        if (!abort_condition) {
            alert("You already moved a piece. You cannot abort the game.");
            return;
        }

        socket.send(JSON.stringify(
            {
                "type": "options_message",
                "message": "abort"
            }
        ));
        changeDragState(0, "any");
        alert("You have aborted the game. You will be redirected to the home page.");
        window.location.href = home_addr;
    });

    optionsBody.appendChild(abort_button);
})();
