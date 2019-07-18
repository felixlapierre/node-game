const fs = require('fs');

export interface Tile {
  sourceX: number,
  sourceY: number,
  destX0: number,
  destY0: number,
  destX1: number,
  destY1: number
}

export function loadTextureMap(path, callback) {
  fs.readFile(path, function(err, data) {
    if(err) {
      console.log(err);
      return {};
    } else {
      callback(readTextureMap(data));
    }
  });
}

export interface TextureMap {
  bounds: {
    x: number,
    y: number
  }
  spritesheet: string,
  tiles: Array<Tile>
}

function readTextureMap(data) {
  var map_data = data.toString();
  var rows = map_data.split("\n");

  var bounds = rows[1].split(" ");

  var returned = {
    spritesheet: rows[0],
    bounds: {
      x: parseInt(bounds[0], 10),
      y: parseInt(bounds[1], 10)
    },
    tiles: []
  }

  for(var i = 2; i < rows.length; i++) {
    var tileData = rows[i].split(" ").map(function(item) {
      return parseInt(item, 10);
    });
    returned.tiles.push({
      sourceX: tileData[0],
      sourceY: tileData[1],
      destX0: tileData[2],
      destY0: tileData[3],
      destX1: tileData[4],
      destY1: tileData[5]
    });
  }
  return returned;
}

export function loadWallMap(path, callback) {
  fs.readFile(path, function(err,data) {
    if(err) {
      console.log(err);
      return {};
    } else {
      callback(readWallMap(data));
    }
  });
}

export interface WallMap {
  bounds: {
    x: number,
    y: number
  }
  tiles: Array<Tile>
}

function readWallMap(data) {
  var map_data = data.toString();
  var rows = map_data.split("\n");
  var firstRow = rows[0].split(" ").map(function(item) {
    return parseInt(item);
  });
  
  var returned = {
    bounds: {
      x: firstRow[0],
      y: firstRow[1]
    },
    tiles: new Array(firstRow[0] / 50)
  }

  for(var i = 0; i < returned.bounds.x / 50; i++) {
    returned.tiles[i] = new Array(returned.bounds.y / 50);
  }

  for(var i = 1; i < rows.length; i++) {
    var row = rows[i].split(" ").map(function(item) {
      return parseInt(item);
    });

    for(var x = row[0]; x <= row[2]; x++) {
      for(var y = row[1]; y <= row[3]; y++) {
        returned.tiles[x][y] = 1;
      }
    }
  }

  return returned;
}