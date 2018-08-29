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

  function collisionCheck(wallMap, playerX, playerY){
console.log(playerX);
console.log(playerY);

    var coordinates= {
      x: playerX,
      y: playerY
    };
/*console.log(parseInt(playerX/TILE_SIZE));
console.log(parseInt(playerY/TILE_SIZE));*/

    var playerLocation = {
      x: parseInt(playerX/TILE_SIZE),
      y: parseInt(playerY/TILE_SIZE)
    };

    var quadrantInfo= {
      x: (playerX%50),
      y: (playerX%50)
    };
    var mapbox = [playerLocation];


//Determine which 4 locations to be checked for walls
/*console.log("box of player");
  console.log(mapbox[0].x);
    console.log(mapbox[0].y);
    console.log();*/
    if (quadrantInfo.x<25){ // player in left
      //check top left
      if (quadrantInfo.y<=25){
        mapbox[1] = {x: playerLocation.x-1, y: playerLocation.y};//to the left
        mapbox[2] = {x: playerLocation.x-1, y: playerLocation.y-1};//left diag up
        mapbox[3] = {x: playerLocation.x, y: playerLocation.y-1};//up
      }
      //check bottom left
      else {
        mapbox[1] = {x: playerLocation.x-1, y: playerLocation.y};//to the left
        mapbox[2] = {x: playerLocation.x-1, y: playerLocation.y+1};//left diag down
        mapbox[3] = {x: playerLocation.x, y: playerLocation.y+1};//down
      }
    }

    else if (quadrantInfo.x>25){ //in right
      //check top right
      if (quadrantInfo.y<=25){
        mapbox[1] = {x: playerLocation.x+1, y: playerLocation.y};//to the right
        mapbox[2] = {x: playerLocation.x+1, y: playerLocation.y-1};//right diag up
        mapbox[3] = {x: playerLocation.x, y: playerLocation.y-1};//up
      }
      //check bottom right
      else {
        mapbox[1] = {x: playerLocation.x+1, y: playerLocation.y};//to the right
        mapbox[2] = {x: playerLocation.x+1, y: playerLocation.y+1};//right diag down
        mapbox[3] = {x: playerLocation.x, y: playerLocation.y+1};//down
      }

    }
    else{ //player is in middle
      return coordinates;
    }

//check boxes for walls
    for (var i=0; i<4; i++){
      console.log(i);
      console.log(mapbox[i].x );
      console.log(mapbox[i].y );
      if (wallMap[ mapbox[i].x ][ mapbox[i].y ]==1){
        return( wallCollide(playerX, playerY, ((playerLocation.x*TILE_SIZE)+25), ((playerLocation.y*TILE_SIZE)+25)));
      }
    }
    return coordinates;
  }
  module.exports.wallCheck = collisionCheck;

/*
  boundsCollision
  checks if player is out of bounds. If out of bounds, player is pushed to closest
*/
  function boundsCollision(playerX, playerY, bounds){
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
      else if(playerY>(bounds.Y-25)){
        coordinates.y = (bounds.y-25);
      }
      return coordinates;
  }
  module.exports.boundsCheck = boundsCollision;
