const collision = require('./my_collision');
var player = {x: 50, y: 50};

var wallMap =[
  [0,0,0,1],
  [0,1,0,1],
  [0,0,0,1],
  [0,1,0,0]
];
var player = {x: 0, y: 0};
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);

var player = {x: 50, y: 50};
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);

var player = {x: 30, y: 50};
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
var player = {x: 80, y: 50};
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
