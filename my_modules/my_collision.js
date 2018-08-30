const TILE_SIZE = 50;
const HALF_TILE = 25;
/*
    Wall Collide
    determines how collision will be resolved (horiz vs vert)
    returns new coordinates of player
*/
function wallCollide(playerX, playerY, obstacleX, obstacleY) {
  console.log('player x: '+ playerX);
  console.log('player y: '+ playerY);
  console.log('obstacle x: '+ obstacleX);
  console.log('obstacle y: '+ obstacleY);
  console.log();

  var coordinates= {x: playerX, y: playerY};
console.log('coordinates: ');
console.log(coordinates);
  if((playerX+TILE_SIZE)>obstacleX){ coordinates.y= obstacleY-HALF_TILE;  }

  else if(playerX<(obstacleX+TILE_SIZE)){  coordinates.y= obstacleX+HALF_TILE;}

  else if((playerY+TILE_SIZE)>obstacleY){ coordinates.x= obstacleX-HALF_TILE;}

  else if(playerY<(obstacleY+TILE_SIZE)){coordinates.x= obstacleX+HALF_TILE;  }

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
console.log('coordinates: ');
console.log(coordinates);
console.log();
return coordinates;
}//end of function


/*
 Wall check
Determine which tiles to check based on player location
checks tiles for walls and invokes collision if necessary
returns new coordinates of player
*/

function wallCheck(tiles, playerX, playerY){

  var coordinates= {
    x: playerX,
    y: playerY
  };

  var playerTile = {
    x: parseInt( (playerX-HALF_TILE)/TILE_SIZE),
    y: parseInt( (playerY-HALF_TILE)/TILE_SIZE)
  };

  for (var i=0; i<1; i++){
    for (var j=0; j<1; j++){
      if (tiles[playerTile.x+i][playerTile.y+j]==1){
        return(  wallCollide( playerX-HALF_TILE , playerY-HALF_TILE, ( playerTile.x+i)*TILE_SIZE, ( playerTile.y+j)*TILE_SIZE ));
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
