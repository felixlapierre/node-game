import { Player } from './player';
import { TextureMap, WallMap } from './map';
import { wallCheck, boundsCheck } from './collision';
import { Enemy } from './Enemies/Enemy';
import { TargetDummy } from './Enemies/TargetDummy';
import { Point } from './Utils/Geometry';

export class Area {
    private players: Map<string, Player>;
    private enemies: Array<Enemy>;
    public textureMap: TextureMap;
    private wallMap: WallMap;
    public loaded: boolean;

    constructor(public ID, onLoad) {
        this.players = new Map<string, Player>();
        this.enemies = new Array<Enemy>();
        this.enemies.push(new TargetDummy(new Point(50, 50)));
        Promise.all([
            TextureMap.load("./src/maps/" + ID + ".txt"),
            WallMap.load("./src/maps/" + ID + "_walls.txt")
          ])
          .then(([textureMap, wallMap]) => {
            this.textureMap = textureMap;
            this.wallMap = wallMap;
            this.loaded = true;
      
            //Give the map to everyone in the room
            this.players.forEach((player, id, map) => {
                onLoad(id);
            })
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
        const payload = {
            players: {},
            enemies: this.enemies
        };

        this.players.forEach((player, socketID, map) => {
            player.update(elapsedTime);
            const deltaT = elapsedTime / 1000;

            let newCenter = player.getCenter();

            if(player.intent.left) {newCenter.x -= 300 * deltaT;}
            if(player.intent.up) {newCenter.y -= 300 * deltaT;}
            if(player.intent.right) {newCenter.x += 300 * deltaT}
            if(player.intent.down) {newCenter.y += 300 * deltaT;}
    
            // collision checks
            newCenter = boundsCheck(newCenter.x, newCenter.y, this.wallMap.bounds);
            newCenter = wallCheck(this.wallMap.tiles, newCenter.x, newCenter.y);

            player.setCenter(newCenter);

            payload.players[socketID] = player;

            io.sockets.connected[socketID].emit('returnPlayerState', {x:newCenter.x, y:newCenter.y, bag:{contents:player.bag.contents}});
        })

        this.enemies.forEach((enemy) => {
            enemy.Update(elapsedTime);
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