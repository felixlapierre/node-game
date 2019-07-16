var exports = module.exports = {};
const map = require('./my_map.js');
const PLAYER = require('./my_player.js');
var areas = {};
var socket_rooms = {};

function moveSocketTo(socket, areaID, callToDeliverMap) {

  var previousAreaID = socket_rooms[socket.id];
  if(previousAreaID != undefined) {
    //If leaving the previous area will empty it, unload the previous area
    //(TODO: make them persist a bit?)
    if(Object.keys(areas[previousAreaID].players).length == 1) {
      delete areas[previousAreaID];
    }

    //Remove socket from the room it was in previously
    socket.leave(previousAreaID);
  }

  //Add socket to its new room
  socket.join(areaID);
  socket_rooms[socket.id] = areaID;

  //If new room was empty, load the room
  if(!areas.hasOwnProperty(areaID)) {
    //Create the new area
    areas[areaID] = {
      players : {
      },
      loaded: false,
      textureMap: undefined,
      wallMap: undefined
    }
    areas[areaID].players[socket.id] = PLAYER.create();
    //TODO: Load maps

    //NOTE: this might be incorrect pathing
    map.loadTextureMap("./src/maps/" + areaID + ".txt", function(data) {
      areas[areaID].textureMap = data;
      map.loadWallMap("./src/maps/" + areaID + "_walls.txt", function(data) {
        areas[areaID].wallMap = data;
        areas[areaID].loaded = true;
        //Give the map to everyone in the room
        for(var player in areas[areaID].players) {
          callToDeliverMap(player);
        }
      });
    });
  } else {
    areas[areaID].players[socket.id] = PLAYER.create();
  }
  if(areas[areaID].loaded) {
    callToDeliverMap(socket.id);
  }
}

function getAreaOfSocketID(socketID) {
  return areas[socket_rooms[socketID]];
}

function getAreaByID(areaID) {
  return areas[areaID];
}

function removePlayer(socketID) {
  delete areas[socket_rooms[socketID]].players[socketID];
  delete socket_rooms[socketID];
}

function forEachAreaID(callback) {
  for(var areaID in areas) {
    callback(areaID);
  }
}

exports.moveSocketTo = moveSocketTo;
exports.getAreaOfSocketID = getAreaOfSocketID;
exports.getAreaByID = getAreaByID;
exports.removePlayer = removePlayer;
exports.forEachAreaID = forEachAreaID;