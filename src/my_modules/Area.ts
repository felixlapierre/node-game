import { Player } from './Creatures/Player';
import { TextureMap, WallMap } from './map';
import { Enemy } from './Creatures/Enemy';
import { TargetDummy } from './Creatures/TargetDummy';
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
        // TODO: Inject special case EmptyWallMap.
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
            player.Behaviour.Update(elapsedTime / 1000, this.wallMap);

            payload.players[socketID] = player.GetDisplayInfo();

            const playerCenter = player.Hitbox.GetCenter();
            
            io.sockets.connected[socketID].emit('returnPlayerState', {x:playerCenter.x, y:playerCenter.y, bag:{contents:player.Bag.contents}});
        })

        this.enemies.forEach((enemy, ID) => {
            enemy.Update(elapsedTime);
            payload.enemies[ID] = enemy.getDisplayInfo();
        })

        io.to(this.ID).emit('areaState', payload);
    }

    setPlayerIntent(playerID: string, data: any) {
        const player = this.players.get(playerID);
		player.Behaviour.SetIntent(data);
    }
}