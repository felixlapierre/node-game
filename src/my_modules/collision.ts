const TILE_SIZE = 50;
const HALF_TILE = 25;
/*collide
returns an object containing the x-y coordinates of player AFTER collision resolution
*/
function wallCollide(playerX, playerY, obstacleX, obstacleY) {
  var newLocation = {x: playerX, y: playerY};
  var deltaX = playerX - obstacleX;
  var deltaY = playerY - obstacleY;

  //Check if collision is occuring
  if ((Math.abs(deltaX)<TILE_SIZE)&& (Math.abs(deltaY)<TILE_SIZE)){
    //DeltaX bigger: horizontal shift
    if (Math.abs(deltaX)>Math.abs(deltaY)){
      //DeltaX positive: shift right
      if(deltaX > 0) {
        newLocation.x = obstacleX + TILE_SIZE;
      //DeltaX negative: shift left
      } else {
        newLocation.x = obstacleX - TILE_SIZE;
      }
    }
    //DeltaY bigger: vertical shift
    else {
      //DeltaY positive: shift downwards
      if(deltaY > 0) {
        newLocation.y = obstacleY + TILE_SIZE;

      //DeltaY negative: shift upwards
      } else {
        newLocation.y = obstacleY - TILE_SIZE;
      }
    }
  }
  return newLocation;
}//end of function


/*
Collision check
Uses player location to determine which locations on wallMap to check
If collision, invoke wallCollide
returns new coordinates of player
*/

function wallCheck(wallMap, playerX, playerY){

  var newLocation = {
    x: playerX,
    y: playerY
  };


  var playerTile = {
    x: Math.floor((playerX-HALF_TILE)/TILE_SIZE),
    y: Math.floor((playerY-HALF_TILE)/TILE_SIZE)
  };

  //check boxes for walls
  for (var i=0; i<=1; i++){
    for (var j=0; j<=1; j++){
      if (wallMap[playerTile.x+i][playerTile.y+j]==1){
        //Pass newlocation data to take into account a previously checked tile's collision resolution
        newLocation = wallCollide(newLocation.x, newLocation.y, ((playerTile.x + i)*TILE_SIZE) + HALF_TILE, ((playerTile.y + j)*TILE_SIZE) +HALF_TILE);
      }
    }
  }
  return newLocation;
}
module.exports.wallCheck = wallCheck;

/*
boundsCheck
checks if player is out of bounds. If out of bounds, player is pushed to closest
*/
function boundsCheck(playerX, playerY, bounds){
  var coordinates= {x: playerX, y: playerY};
  // check horizontal
  if (playerX<HALF_TILE){
    coordinates.x=HALF_TILE;
  }else if (playerX>(bounds.x-HALF_TILE)){
    coordinates.x=(bounds.x-HALF_TILE);
  }
  // check vertical
  if(playerY<HALF_TILE){
    coordinates.y = HALF_TILE;
  }
  else if(playerY>(bounds.y-HALF_TILE)){
    coordinates.y = (bounds.y-HALF_TILE);
  }
  return coordinates;
}
module.exports.boundsCheck = boundsCheck;
