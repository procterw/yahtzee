// Import the Express module
var express = require('express');
var _ = require('underscore');

// Import the 'path' module (packaged with Node.js)
var path = require('path');
var roomName = require('./roomNames.js');
var Game = require('./game.js');

// Create a new instance of Express
var app = express();

// Routing
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/public/js'));
app.use('/views', express.static(__dirname + '/public/views'));
app.use('/bower', express.static(__dirname + '/bower_components'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

// Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(8080, function() {
  console.log("listening at 8080");
});


// Initialize a new room
var Room = function() {
  this.players = [];
  this.playersReady = [];
  this.scores = [];
  this.gameRunning = false;
}

// List of open rooms
var rooms = {};

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// socket.broadcast.to(socket.room).emit --- all sockets EXCEPT sender
// io.sockets.in(socket.room).emit --- ALL sockets
// socket.emit --- just user

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {

  console.log("A connection was made!");

  socket.isReady = function() {
    return rooms[socket.room].playersReady.indexOf(socket.playerID) > -1;
  }

  function rjoin(room, name) {
    console.log(name + " joined room " + room);
    if (!socket.room) {
      socket.playerName = name;
      socket.room = room;
      socket.join(room);
      rooms[room].players.push(name);
      socket.playerID = rooms[room].players.length;
      // broadcast only to yourself that you joined
      socket.emit('youJoined', room, rooms[room], socket.playerID);
      // broadcast to others that room was joined 
      socket.broadcast.to(socket.room).emit('playerJoined', room, rooms[room], socket.playerID);
      console.log(rooms[room]);
    }
  }

  // When a player leaves remove them from the room. Emit the player, 
  // their id, and the new list of players
  function rleave() {
    if (socket.room) {
      console.log(socket.playerName + " left room " + socket.room);
      socket.leave(socket.room)
      rooms[socket.room].players.splice(socket.playerID-1, 1);
      socket.broadcast.to(socket.room).emit('playerLeft', socket.playerName, socket.playerID, rooms[socket.room].players);
      if (rooms[socket.room].players.length < 1) delete rooms[socket.room];
      socket.room = null;
    }
  }
    
  socket.on('createRoom', function(name) {
    var room = roomName.gen(Object.keys(rooms));
    rooms[room] = new Room();
    console.log(name + " created room " + room);
    rjoin(room, name);
  });

  socket.on('joinRoom', function(room, name) {
    // Does this room exist?
    if (Object.keys(rooms).indexOf(room) > -1) {
      rjoin(room, name);
    } else {
      console.log("SHIT");
    }
  });

  socket.on('leaveRoom', rleave);

  socket.on("disconnect", rleave);

  socket.on("isReady", function() {
    if (!socket.isReady()) {
      rooms[socket.room].playersReady.push(socket.playerID);
      io.sockets.in(socket.room).emit('playerReady', rooms[socket.room].playersReady.length);
      if (rooms[socket.room].playersReady.length === rooms[socket.room].players.length) {
        // Everyone is ready! 
        rooms[socket.room].playersReady = [];
        var game = new Game(rooms[socket.room].players);
        rooms[socket.room].game = game;
        io.sockets.in(socket.room).emit('allReady', game);
        
      }
    }
  });

  socket.on("sendChat", function(message) {
    io.sockets.in(socket.room).emit('chatSent', socket.playerName, message);
  });

  socket.on("startGame", function() {
    rooms[socket.room].gameRunning = true;
    // console.log("sending startGame to ", socket.playerName, ", id=", socket.playerID);
    socket.emit('gameStarted', rooms[socket.room].game, socket.playerID);
  });

  

  // GAME

  socket.on("rollDice", function(roll) {
    socket.broadcast.to(socket.room).emit('diceRolled', roll);
  });

  socket.on("toggleHold", function(index) {
    socket.broadcast.to(socket.room).emit('holdToggled', index);
  });

  socket.on("nextTurn", function(id) {
    id++;
    if (id > rooms[socket.room].players.length) id = 1;
    io.sockets.in(socket.room).emit('newTurn', id);
  });


  socket.on("endGame", function(score){
    rooms[socket.room].scores.push(score);
    io.sockets.in(socket.room).emit("gameEnded", rooms[socket.room].scores, 0);
  });

});




