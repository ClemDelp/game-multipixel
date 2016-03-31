var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var Map = require('./map.js')
var Bot = require('./bot.js')

var sendFileOpts = { root: path.join(path.dirname(__filename), 'www') }
app.use(express.static(__dirname + '/www'));
// ----------------------------------------
// VARIABLE
var gid = 1;

var User = function(socket) {
  this.id = gid++;
  this.color= "blue";
  this.name = 'Unknown User';
	this.socket = socket;
  this.x = 0;
  this.y = 0;
};
User.prototype = new Bot;

var users = []; 
var map = new Map()
var map_width = 800//window.innerWidth
var map_height = 500//window.innerHeight
map.init(map_width,map_height)

// ----------------------------------------
var Event = function() {
  var listeners = [];

  this.dispatch = function(data) {
    listeners.forEach(function(callback) {
      callback(data);
    });
  }

  this.listen = function(callback) {
    listeners.push(callback);
    // return unregister
    return function() {
      var index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
};
// A bob can be a user/monster/... all elements who can moving and interact with map and others bob
var bob_added = new Event();
var bob_updated = new Event();
var bob_removed = new Event();
var map_updated = new Event();
// ----------------------------------------
var createBots = function(nbr,map,socket){
  var bots = []
  for(var i=0; i<nbr;i++){
      var x = 0
      var y = 0
      while(map.matrix[y][x] != 0){
        x = Math.round(Math.random()*map.cols)
        if(x == map.cols) x--
        y = Math.round(Math.random()*map.rows)
        if(y==map.rows) y--
      }
      bots.push(new Bot().init({
        cell_size : map.cell_size,
        id : i+"_bot",
        map : map,
        x : x,
        y : y,
        bob_updated : bob_updated
      }).move().getModel())
      map.matrix[y][x] = 2
    }
    return bots
}
// create bots
var bots = createBots(10,map,bob_updated)
// ----------------------------------------
// Client
// ----------------------------------------
app.get('/', function(req, res) {
  res.sendFile('client.html', sendFileOpts);
});

io.of('client').on('connection', function(socket) {
  var user = new User(socket);
  console.log('New user connected : ',user.id);
  users.push(user);
  // dispatch the new user to all listeners
  // bob_added.dispatch(user);
  socket.emit('init-map', {
    user: user.getModel(),
    map : map.matrix,
    bots : bots
  });
  // -------------------------------
  // LISTEN ON EVENTS
  // -------------------------------
  var registeredEvents = [];
  
  registeredEvents.push(bob_updated.listen(function(bob) {
    socket.emit('bob-updated', bob);
  }));

  // registeredEvents.push(bob_updated.listen(function(bob) {
  //   socket.emit('bob-updated', bob);
  // }));

  // registeredEvents.push(bob_removed.listen(function(bob) {
  //   socket.emit('bob-removed', bob);
  // }));

  // registeredEvents.push(map_updated.listen(function(map) {
  //   socket.emit('map-updated', map);
  // }));
  // // -------------------------------
  // // USER EVENT
  // // -------------------------------
  socket.on('want-update-position', function(direction) {
    console.log(user.name+' change to update his position to ' + direction);
    // user.name = name;
    // dispatch information
    // bob_updated.dispatch(user)
  });

  // socket.on('change-my-position', function(position) {
  //   console.log(user.name+' move to ' + position);
  //   user.x = position.x;
  // 	user.y = position.y;
  //   // dispatch information
  //   bob_updated.dispatch(bob)
  // });

  socket.on('disconnect', function() {
    console.log('client '+user.id+' disconnected...')
    // call the callback to unregister user from all his registred events
    registeredEvents.forEach(function (unregister) { unregister() });
    // dispatch the removed bob to all listeners
    bob_removed.dispatch(user);
    var index = users.indexOf(user);
    if (index > -1) {
    	users.splice(index, 1);
    }
  });
  
});
// ----------------------------------------
// Listens
// ----------------------------------------

http.listen(4000, function(){
  console.log('listening on *:4000');
});