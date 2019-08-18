import { TextureMap, WallMap } from "./map";
import { Player } from "./player";
import { Area } from './Area';
var areas = new Map<string, Area>();
var socket_rooms = {};

export function moveSocketTo(socket, areaID, callToDeliverMap) {
  var previousAreaID = socket_rooms[socket.id];
  if (previousAreaID != undefined) {
    areas.get(previousAreaID).removePlayer(socket.id);
    if (areas.get(previousAreaID).isEmpty()) {
      areas.delete(previousAreaID);
    }

    //Remove socket from the room it was in previously
    socket.leave(previousAreaID);
  }

  //Add socket to its new room
  socket.join(areaID);
  socket_rooms[socket.id] = areaID;

  //If new room was empty, load the room
  if (!areas.has(areaID)) {
    //Create the new area
    areas.set(areaID, new Area(areaID, callToDeliverMap));
    areas.get(areaID).newPlayer(socket.id);
  } else {
    areas.get(areaID).newPlayer(socket.id);
  }
  if (areas.get(areaID).loaded) {
    callToDeliverMap(socket.id);
  }
}

export function getAreaOfSocketID(socketID) {
  return areas.get(socket_rooms[socketID]);
}

export function getAreaByID(areaID) {
  return areas.get(areaID);
}

export function removePlayer(socketID) {
  areas.get(socket_rooms[socketID]).removePlayer(socketID);
  delete socket_rooms[socketID];
}

export function forEachAreaID(callback) {
  areas.forEach((value, key, map) => {
    callback(key);
  })
}

export function updateAllAreas(elapsedTime: number, io: SocketIO.Server) {
  areas.forEach((area, ID, map) => {
    area.update(elapsedTime, io);
  })
}

export function onPlayerIntentChanged(data, playerID: string) {
  const area = areas.get(socket_rooms[playerID]);
  if(area) {
    area.setPlayerIntent(playerID, data);
  } else {
    throw new Error('Cannot update intent of player that is not in a room');
  }
}
