const TILE_SIZE = 50;
/*collide
returns an object containing the x-y coordinates of player AFTER collision resolution
*/
function wallCollide(playerX, playerY, obstacleX, obstacleY) {
  var coordinates= {x: playerX, y: playerY};

  if ((Math.abs(playerX-obstacleX)<TILE_SIZE)&& (Math.abs(playerY-obstacleY)<TILE_SIZE)){
    // taller than wide, shift horizontalLy
    if (Math.abs(playerX-obstacleX)>Math.abs(playerY-obstacleY)){
      console.log("horiz shift");
      console.log(playerX-obstacleX);
      coordinates.x=(playerX+(playerX-obstacleX));
    }
    else { // if wider than tall, shift vertically
      console.log("vert shift");
      console.log(playerY-obstacleY);
      coordinates.y=(playerY+(playerY-obstacleY));
    }
  }
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
    x: parseInt( (playerX-25)/TILE_SIZE),
    y: parseInt( (playerY-25)/TILE_SIZE)
  };

  //check boxes for walls
  for (var i=0; i<1; i++){
    for (var j=0; j<1; j++){
      if (wallMap[playerTile.x+i][playerTile.y+j]==1){
        return(  wallCollide( playerX, playerY, ( (playerTile.x*TILE_SIZE) +25), ( (playerTile.y*TILE_SIZE) +25) )  );
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
      if (playerX<25){
        coordinates.x=25;
      }else if (playerX>(bounds.x-25)){
        coordinates.x=(bounds.x-25);
      }
      // check vertical
      if(playerY<25){
        coordinates.y = 25;
      }
      else if(playerY>(bounds.y-25)){
        coordinates.y = (bounds.y-25);
      }
      return coordinates;
    }
    module.exports.boundsCheck = boundsCheck;
