var express = require('express');
var router = express.Router();

/* contains all the global stats about the ongoing server */ 
const serverStatus = require("../public/javascripts/stats");

/* This is the home page of the website : GET home page */ 
router.get('/', function(req, res) {
  res.render("splash.ejs",  {
    gamesDrawn: serverStatus.gamesDrawn,
    totalPlayerCount: serverStatus.playerTotal,
    totalMatchCount: serverStatus.gameTotal - 1
  });
});


/* This is the game page of the website : GET game page */ 
router.get('/play', function (req, res) {
  res.render("game.ejs", {
    gamesDrawn: serverStatus.gamesDrawn,
    totalPlayerCount: serverStatus.playerTotal + 1,
    totalMatchCount: serverStatus.gameTotal
  });
});

module.exports = router;
