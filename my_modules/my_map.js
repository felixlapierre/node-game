const fs = require('fs');
var exports = module.exports = {};

const tileSize = 50;

function load(path, callback) {
  fs.readFile(path, function(err, data) {
    if(err) {
      console.log(err);
      return {};
    } else {
      callback(convertToObject(data));
    }
  });
}

function convertToObject(data) {
  var returned = {};
  var map_data = data.toString();
  var rows = map_data.split("\n");

  //Row 1 contains the spritesheet name
  returned.spritesheet = rows[0];

  //Row 2 contains the bounds of the map
  var bounds = rows[1].split(" ");
  returned.bounds = {};
  returned.bounds.x = parseInt(bounds[0],10);
  returned.bounds.y = parseInt(bounds[1],10);

  //The rest of the file contains the map data
  returned.tiles = [];
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

exports.load = load;
