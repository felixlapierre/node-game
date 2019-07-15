const collision = require('./my_collision');

var wallMap =[
  [0,0,0,1],
  [0,1,0,1],
  [0,0,0,1],
  [0,1,0,0]
];
var player = {x: 25, y: 25};
console.log("player at");
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
console.log();

player = {x: 26, y: 110};
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
console.log();

player = {x: 76, y: 110};
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
console.log();

player = {x: 126, y: 110};
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
console.log();
/*
player = {x: 110, y: 140};
console.log("bottom left of 33");
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
console.log();

player = {x: 140, y: 140};
console.log("bottom right 33 ");
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
console.log();

player = {x: 140, y: 110};
console.log("top right 33 ");
console.log(player);
collision.collisionCheck(wallMap, player.x, player.y);
*/
