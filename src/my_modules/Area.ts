import { Player } from './player';
import { TextureMap, WallMap } from './map';
import { wallCheck, boundsCheck } from './collision';
import { Enemy } from './Enemies/Enemy';
import { TargetDummy } from './Enemies/TargetDummy';
import { Point } from './Utils/Geometry';

export class Area {
    private players: Map<string, Player>;
    private enemies: Map<string, Enemy>;
    public textureMap: TextureMap;
    private wallMap: WallMap;
    public loaded: boolean;

    constructor(public ID, onLoad) {
        this.players = new Map<string, Player>();
        this.enemies = new Map<string, Enemy>();
        this.addEnemy(new TargetDummy(new Point(50, 50)));
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

    addEnemy(enemy: Enemy) {
        this.enemies.set(enemy.ID, enemy);
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
            enemies: {}
        };

        this.players.forEach((player, socketID, map) => {
            player.update(elapsedTime);
            const deltaT = elapsedTime / 1000;

            let center = player.getCenter();

            if(player.intent.left) {center.x -= 300 * deltaT;}
            if(player.intent.up) {center.y -= 300 * deltaT;}
            if(player.intent.right) {center.x += 300 * deltaT}
            if(player.intent.down) {center.y += 300 * deltaT;}
    
            // collision checks
            center = boundsCheck(center.x, center.y, this.wallMap.bounds);
            center = wallCheck(this.wallMap.tiles, center.x, center.y);

            player.setCenter(center);

            payload.players[socketID] = player.GetDisplayInfo();

            io.sockets.connected[socketID].emit('returnPlayerState', {x:center.x, y:center.y, bag:{contents:player.bag.contents}});
        })

        this.enemies.forEach((enemy, ID) => {
            enemy.Update(elapsedTime);
            payload.enemies[ID] = enemy.getDisplayInfo();
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