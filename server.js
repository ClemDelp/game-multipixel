var express = require('express')
var _ = require('lodash')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Map = require('./map.js')
var Bot = require('./bot.js')
var utils = require('./utils.js')
var sendFileOpts = { root: path.join(path.dirname(__filename), 'www') }

app.use(express.static(__dirname + '/www'));
app.get('/', function(req, res) {
  res.sendFile('client.html', sendFileOpts);
});
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
// ----------------------------------------
var User = function(bob_updated,map) {
  this.id = utils.guid()
  this.color= "blue";
  this.name = 'Unknown User';
  this.type = "user"
  this.x = 0;
  this.y = 0;
  this.map = map;
  this.bob_updated = bob_updated
  return this
};
User.prototype = new Bot;
// ----------------------------------------
var Game = function(){
  this.gid = 1;
  this.map = new Map()
  this.map_width = 800//window.innerWidth
  this.map_height = 500//window.innerHeight
  this.bots = [] // A bob can be a user/monster/... all elements who can moving and interact with map and others bob
  // EVENTS
  this.bob_added = new Event();
  this.bob_updated = new Event();
  this.bob_removed = new Event();
  this.map_updated = new Event();
  //
  this.init = function(){
    this.map.init(this.map_width,this.map_height)
    this.bots = this.createBots(2,this.map,this.bob_updated)
    return this;
  }
  this.createBots = function(nbr,map,socket){
    var bots = []
    for(var i=0; i<nbr;i++){
      var position = this.map.getFreePlaceOnMap()
      this.map.addNewBotOnMap(2,position)
      bots.push(new Bot().init({
        cell_size : map.cell_size,
        id : i+"_bot",
        map : map,
        x : position.x,
        y : position.y,
        bob_updated : this.bob_updated
      }).move().getModel())
    }
    return bots
  }
}
var game = new Game().init()
// ----------------------------------------
// Client
// ----------------------------------------
io.of('client').on('connection', function(socket) {
  var user = new User(game.bob_updated,game.map);
  var position = game.map.getFreePlaceOnMap()
  game.map.addNewBotOnMap(2,position)
  user.x = position.x
  user.y = position.y

  // users.push(user);
  game.bots.push(user.getModel())

  // dispatch the new user to all listeners
  game.bob_added.dispatch(user.getModel());
  
  socket.emit('init-map', {
    // user: user.getModel(),
    map : game.map.matrix,
    bots : game.bots
  });
  // -------------------------------
  // LISTEN ON EVENTS
  // -------------------------------
  var registeredEvents = [];
  
  registeredEvents.push(game.bob_updated.listen(function(bob) {
    socket.emit('bob-updated', bob);
  }));

  registeredEvents.push(game.bob_added.listen(function(bot) {
    socket.emit('bob-added', bot);
  }));

  registeredEvents.push(game.bob_removed.listen(function(bob) {
    socket.emit('bob-removed', bob);
  }));

  // registeredEvents.push(map_updated.listen(function(map) {
  //   socket.emit('map-updated', map);
  // }));
  // // -------------------------------
  // // USER EVENT
  // // -------------------------------
  socket.on('want-update-position', function(direction) {
    // user.name = name;
    // dispatch information
    // bob_updated.dispatch(user)
    user[direction](function(user){
      if(user != false) bob_updated.dispatch(user)  
    })
    
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
    game.bob_removed.dispatch(user.getModel());
    game.bots = _.filter(game.bots, function(bot) { 
      if(bot.id != user.id) return bot; 
    });
  });

});
// ----------------------------------------
// Listens
// ----------------------------------------

http.listen(4000, function(){
  console.log('listening on *:4000');
});