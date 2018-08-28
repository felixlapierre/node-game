const TILE_SIZE = 50;
  /*collide
    returns an object containing the x-y coordinates of player AFTER collision resolution
  */
  function wallCollide(playerX, playerY, obstacleX, obstacleY) {
    var coordinates= {x: playerX, y: playerY};

    if ((Math.abs(playerX-obstacleX)<TILE_SIZE)&& (Math.abs(playerY-obstacleY)<TILE_SIZE)){
     // taller than wide, shift horizontalLy
      if (Math.abs(playerX-obstacleX)>Math.abs(playerY-obstacleY)){
        coordinates.x=(playerX+(playerX-obstacleX));
      }
      else { // if wider than tall, shift vertically
        coordinates.y=(playerY+(playerY-obstacleY));
      }
    }
    return coordinates;
  }//end of function


/*
  Collision check
  Uses player location to determine which locations on wallMap to check
  If collision, invoke wallCollide
*/

  function collisionCheck(wallMap, playerX, playerY){
    var playerLocation = {x: (playerX/TILE_SIZE), y: (playerY/TILE_SIZE)};
    if((wallMap[playerLocation.x][playerLocation.y])==1){
      console.log(wallCollide(playerX, playerY, (playerLocation.x*TILE_SIZE), (playerLocation.y*TILE_SIZE)));
    }
    if((wallMap[playerLocation.x+1][playerLocation.y])==1){
      console.log(wallCollide(playerX, playerY, ((playerLocation.x+1)*TILE_SIZE), (playerLocation.y*TILE_SIZE)));
    }
    if((wallMap[playerLocation.x][playerLocation.y+1])==1){
      console.log(wallCollide(playerX, playerY, (playerLocation.x*TILE_SIZE), ((playerLocation.y+1)*TILE_SIZE)));
    }
    if((wallMap[playerLocation.x+1][playerLocation.y+1])==1){
      console.log(wallCollide(playerX, playerY, ((playerLocation.x+1)*TILE_SIZE), ((playerLocation.y+1)*TILE_SIZE)));
    }
  }
  module.exports.collisionCheck = collisionCheck;

  function boundsCollision(bounds, playerX, playerY){
    var coordinates= {x: playerX, y: playerY};

      if (playerX<0){
        coordinates.x=0;
      }
      if(playerY<0){
        coordinates.y = 0;
      }
      if (playerX>bounds.x){
        coordinates.x=(bounds.x-TILE_SIZE);
      }
      if(playerY>bounds.y){
        coordinates.y = (bounds.y-TILE_SIZE);
      }
      return coordinates;
  }
  module.exports.boundsCollision = boundsCollision;
