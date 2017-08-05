var uuid = require('uuid')
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

setInterval(tick, 30);

function tick() {
    // entities.push(new Base('123', '123', Math.random(-100, 100) * 1000, Math.random(100) * 1000));
    updateList = [entities, players];
    io.sockets.emit('tick', updateList);
}


io.sockets.on('connection',
    function(socket) {
        console.log("Client Connected: " + socket.id);

        // Create a new Player object associated with the socket ID
        player = new Player(socket.id);
        players.push(player);

        entities.push(new Base(uuid.v4(), player, 100, 100));  // Spawn the player's base

        socket.emit([entities, players])

        // Set the player name
        socket.on('name',
            function(data) {
                player.name = data;
            })

        // Spawn an Entity
        socket.on('spawn',
            function(data) {
                entities.push(new House(uuid.v4(), player, data['x'], data['y']));
                console.log(data['x'] + ' ' + data['y']);
                // TODO: Check for ownership, distance, etc. and Spawn object
            });

        // Move Entities
        socket.on('move',
            function(data) {
                // TODO: Check for ownership, movability, etc and set destination for data
            });
    });




function Player(id) {
    this.id = id;
    this.name = '';
}

function Base(id, owner, x, y) {
    this.id = id;
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.maxHealth = 1000;
    this.health = 1000;
}


function House(id, owner, x, y) {
    this.id = id;
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.maxHealth = 50;
    this.health = 50;
}


var socket;
var entities = [];
var players = [];
