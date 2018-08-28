const TILE_SIZE = 50;
  /*collide
    returns an object containing the x-y coordinates of player AFTER collision resolution
  */
  function collide(player, obstacle) {
    var coordinates= {x: player.x, y: player.y};

    if ((Math.abs(player.x-obstacle.x)<TILE_SIZE)&& (Math.abs(player.y-obstacle.y)<TILE_SIZE)){
     // taller than wide, shift horizontalLy
      if (Math.abs(player.x-obstacle.x)>Math.abs(player.y-obstacle.y)){
        coordinates.x=(player.x+(player.x-obstacle.x));
      }
      else { // if wider than tall, shift vertically
        coordinates.y=(player.y+(player.y-obstacle.y));
      }
    }
    return coordinates;
  }//end of function
module.exports.wall_collide = collide;
