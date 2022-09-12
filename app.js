const express = require("express");
const http = require("http");
const websocket = require("ws");
const serverTrack = require("./public/javascripts/stats");
const router = require('./routes/index.js');
const game = require("./public/javascripts/game.js");
const functionality = require("./public/javascripts/functionality.js");

const port = process.argv[2];
const app = express();
app.use(express.static(__dirname + "/public"));
app.get("/", router);
app.get("/play", router);
const server = http.createServer(app);
server.listen(port);
//server.listen(80, '192.168.0.137');


// websocket server
const wss = new websocket.Server({ server }); // wss is the websocket server
let g = new game(serverTrack.gameTotal++); // first game
const functional = new functionality();
const games = {}; // contains all the games
let deleted = []; // contains all the deleted games

/*
 * clean the websockets at a certain time interval 
 */

setInterval(function () {
  for (let webs in games) {
    if (Object.prototype.hasOwnProperty.call(games, webs)) {
      let gameObj = games[webs];
      /* if the game state is 2, then the game finished, so we delete the players from the
        socket list */
      if (gameObj.state == 2) {
        delete games[webs];
        if (!deleted.includes(gameObj)) {
          serverTrack.gamesGoing--;
          deleted.push(gameObj);
        }
        console.log("Websocket " + webs + " has been deleted " + gameObj.state);

      }
    }
  }
}, 500000);

wss.on("connection", function connection(ws) {

  let startMove = undefined;  // the start position of the move
  let endMove = undefined;   // the end position of the move
  let kingMoved = false;    // if the king has moved

  /*
   * two players required to start the game
   * */

  const connect = ws; // the socket that is connected
  connect["id"] = serverTrack.playerTotal++; // assign a unique id to each player
  var stat = g.addPlayer(connect);
  games[connect["id"]] = g; // keep track of the game for each connection
  var color = undefined; // color of the player
  /*
   * send a message to the client that specifies the board configuration 
   * the board looks different for every player in the game.
   * */

  color = stat == 0 ? g.getp1Color() : g.getp2Color();
  connect.send(color == 0 ? "white" : "black");
  if (stat == 1) {
    g.setState(1); // the game starts

    games[g.getPlayer1()["id"]] = g;
    games[g.getPlayer2()["id"]] = g;

    var pwhite = g.getp1Color() == 0 ? g.getPlayer1() : g.getPlayer2();
    var pblack = g.getp1Color() == 1 ? g.getPlayer1() : g.getPlayer2();

    pwhite.send("gs-white"); // tell white the game started and that it needs to make the first move
    pblack.send("gs-black"); // tell black the game started as well

    // start a new game as this one is full
    g = new game(serverTrack.gameTotal++);
  }
  else {
    connect.send("wait"); // wait for another player to join the match.
  }
  connect.on("message", function incoming(message) {
    jsonMsg = JSON.parse(message); // the messages to the server need to be JSON
    if (jsonMsg.type == "start") {
      startMove = jsonMsg.id;
      // send the user all the good future positions of the piece
      future_states = functional.main(startMove, games[connect["id"]].getPieceState());
      connect.send(JSON.stringify(
        {
          "type": "future",
          "states": future_states,
          "start": startMove,
          "board": games[connect["id"]].getPieceState(),
          "functionality": JSON.stringify(functional)
        }
      ));
    }
    else if (jsonMsg.type == "end") {   // end turn
      endMove = jsonMsg.id;
      let temp_g = games[connect["id"]]; // current game in temp_g
      let opponent = undefined; // opponent of the current player
      if (connect == temp_g.getPlayer1()) {
        opponent = temp_g.getPlayer2();
      }
      else {
        opponent = temp_g.getPlayer1();
      }
      opponent.send(JSON.stringify(
        {
          "type": "move",
          "start": startMove,
          "end": endMove,
          "status": "continue"
        }
      ));
      if (color == "white" && startMove == "e1") {
        if (!kingMoved) {
          kingMoved = true;
          connect.send(JSON.stringify(
            {
              "type": "king_first_move"
            }
          ));
        }
      }
      if (color == "black" && startMove == "e8") {
        if (!kingMoved) {
          kingMoved = true;
          connect.send(JSON.stringify(
            {
              "type": "king_first_move"
            }
          ));
        }
      }
      // update the pieceState matrix in the game object
      temp_g.updatePieceState(startMove, endMove);
      if (functional.mate_verify(temp_g.getPieceState())) {
        serverTrack.gamesGoing--;
        temp_g.setState(2);
        connect.send(JSON.stringify(
          {
            "type": "finished",
            "player_result": "winner"
          }
        ));

        opponent.send(JSON.stringify(
          {
            "type": "finished",
            "player_result": "loser"
          }
        ));
      }
    }

    if (jsonMsg.type == "options_message") {
      let temp_g = games[connect["id"]];
      let opponent = undefined;
      if (connect == temp_g.getPlayer1()) {
        opponent = temp_g.getPlayer2();
      }
      else {
        opponent = temp_g.getPlayer1();
      }
      if (jsonMsg.message == "resign") {

        temp_g.setState(2);


        opponent.send(JSON.stringify({
          "type": "options_message",
          "message": "resigned"
        }));


      }
      else if (jsonMsg.message == "abort") {
        temp_g.setState(2);

        opponent.send(JSON.stringify({
          "type": "options_message",
          "message": "aborted"
        }));
      }

      else if (jsonMsg.message == "draw") {
        opponent.send(JSON.stringify({
          "type": "options_message",
          "message": "draw_request"
        }));
      }

      else if (jsonMsg.message == "draw_accept") {
        temp_g.setState(2);
        serverTrack.gamesDrawn++;
        opponent.send(JSON.stringify({
          "type": "options_message",
          "message": "draw_accepted"
        }));
      }
      else if (jsonMsg.message == "draw_reject") {
        opponent.send(JSON.stringify({
          "type": "options_message",
          "message": "draw_rejected"
        }));
      }

      games[connect["id"]] = temp_g;
      games[opponent["id"]] = temp_g;
    }
  });


});
