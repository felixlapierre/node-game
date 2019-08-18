import { Player } from './player';
import { TextureMap, WallMap } from './map';
import { wallCheck, boundsCheck } from './collision';

export class Area {
    private players: Map<string, Player>;
    private textureMap: TextureMap;
    private wallMap: WallMap;
    public loaded: boolean;

    constructor(public ID, onLoad) {
        this.players = new Map<string, Player>();
        Promise.all([
            TextureMap.load("./src/maps/" + ID + ".txt"),
            WallMap.load("./src/maps/" + ID + "_walls.txt")
          ])
          .then(([textureMap, wallMap]) => {
            this.textureMap = textureMap;
            this.wallMap = wallMap;
            this.loaded = true;
      
            //Give the map to everyone in the room
            for (var player in this.players) {
              onLoad(player);
            }
          });
    }

    newPlayer(playerId: string) {
        this.players.set(playerId, new Player(300, 300));
    }

    addPlayer(playerId: string, player: Player) {
        this.players.set(playerId, player);
    }

    removePlayer(playerId: string) {
        this.players.delete(playerId);
    }

    isEmpty() {
        return this.players.size;
    }

    update(elapsedTime: number, io: SocketIO.Server) {
        if(!this.loaded)
            return;
        const payload = {};
        this.players.forEach((player, socketID, map) => {
            player.update(elapsedTime);
            const deltaT = elapsedTime / 1000;

            if(player.intent.left) {player.x -= 300 * deltaT;}
            if(player.intent.up) {player.y -= 300 * deltaT;}
            if(player.intent.right) {player.x += 300 * deltaT}
            if(player.intent.down) {player.y += 300 * deltaT;}
    
            // collision checks
            var updatedCoord= boundsCheck(player.x, player.y, this.wallMap.bounds);
            player.x = updatedCoord.x;
            player.y = updatedCoord.y;
            updatedCoord = wallCheck(this.wallMap.tiles,player.x, player.y);
            player.x = updatedCoord.x;
            player.y = updatedCoord.y;

            payload[socketID] = player;

            io.sockets.connected[socketID].emit('returnPlayerState', {x:player.x, y:player.y, bag:{contents:player.bag.contents}});
        })

        io.to(this.ID).emit('areaState', payload);
    }

    setPlayerIntent(playerID: string, data: any) {
        const player = this.players.get(playerID);
		player.intent.left = data.left;
		player.intent.right = data.right;
		player.intent.up = data.up;
		player.intent.down = data.down;
		player.intent.click = data.click;
		player.angle = data.angle;
        player.bag.selected = data.selected;
    }
}