const TILE_SIZE = 50;
const HALF_TILE = 25;
/*collide
returns an object containing the x-y coordinates of player AFTER collision resolution
*/
function wallCollide(playerX, playerY, obstacleX, obstacleY) {
  console.log('player x: '+ playerX);
  console.log('player y: '+ playerY);
  console.log('obstacle x: '+ obstacleX);
  console.log('obstacle y: '+ obstacleY);
  console.log();
  var coordinates= {x: playerX, y: playerY};
    //if left bound of player is beyond right bound of obstacle
  if ((playerX-HALF_TILE)>(obstacleX+HALF_TILE)){
  coordinates.x = obstacleX+TILE_SIZE;
  }
  if ((playerX+HALF_TILE)>(obstacleX-HALF_TILE)){
  coordinates.x = obstacleX-TILE_SIZE;
  }
  /*if ((Math.abs(playerX-obstacleX)<TILE_SIZE)|| (Math.abs(playerY-obstacleY)<TILE_SIZE)){
  // wider
  if (Math.abs(playerX-obstacleX)>Math.abs(playerY-obstacleY)){
  console.log("horiz shift");
  console.log(playerX-obstacleX);
  coordinates.x=(playerX+(playerX-obstacleX));
}
else if(Math.abs(playerX-obstacleX)<Math.abs(playerY-obstacleY)){ // if wider than tall, shift vertically
console.log("vert shift");
console.log(playerY-obstacleY);
coordinates.y=(playerY+(playerY-obstacleY));
}
}*/

return coordinates;
}//end of function


/*
Collision check
Uses player location to determine which locations on wallMap to check
If collision, invoke wallCollide
returns new coordinates of player
*/

function wallCheck(wallMap, playerX, playerY){

  var coordinates= {
    x: playerX,
    y: playerY
  };


  var playerTile = {
    x: parseInt( (playerX-HALF_TILE)/TILE_SIZE),
    y: parseInt( (playerY-HALF_TILE)/TILE_SIZE)
  };

  //check boxes for walls
  for (var i=0; i<1; i++){
    for (var j=0; j<1; j++){
      if (wallMap[playerTile.x+i][playerTile.y+j]==1){
        return(  wallCollide( playerX, playerY, ( ((playerTile.x+i)*TILE_SIZE)), ( ((playerTile.y+j)*TILE_SIZE)) )  );
      }
      return coordinates;
    }
  }
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
