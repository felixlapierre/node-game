var exports = module.exports = {};

var areas = {};
var socket_rooms = {};

function moveSocketTo(socket, areaID) {

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
      players : {},
      loaded: false,
      tileMap: undefined,
      wallMap: undefined
    }
    //TODO: Load maps
  }
  areas[areaID].players[socket.id] = {
    //TODO: Remove placeholder values
    x:300,
    y:300,
    angle:0
  }
}
