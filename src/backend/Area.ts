import { TextureMap, WallMap } from './map';
import { Point } from './Utils/Geometry';
import { Creature } from './Creatures/Creature';
import { TargetDummyBuilder } from './Creatures/TargetDummy';
import { GoblinBuilder } from './Creatures/Goblin';
import { PlayerBuilder } from './Creatures/Player';
import { PlayerInputBehaviour } from './Creatures/Behaviours/PlayerInputBehaviour';
import { SocketFacade } from './SocketFacade';

export class Area {
    private players: Map<string, PlayerInputBehaviour>;
    private creatures: Map<string, Creature>;

    //Maps socket ID to player ID
    private playerIdMap: Map<string, string>;

    public textureMap: TextureMap;
    private wallMap: WallMap;
    public loaded: boolean;

    constructor(public ID, onLoad) {
        this.players = new Map<string, PlayerInputBehaviour>();
        this.creatures = new Map<string, Creature>();
        this.playerIdMap = new Map<string, string>();
        this.addEnemy(TargetDummyBuilder.CreateTargetDummy(new Point(50, 50)));
        this.addEnemy(GoblinBuilder.CreateGoblin(new Point(500, 500), this.creatures));
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

    newPlayer(socketId: string) {
        // TODO: Inject special case EmptyWallMap.
        const playerData = PlayerBuilder.CreatePlayer(300, 300);
        const player = playerData.Player;

        this.players.set(socketId, playerData.Behaviour);
        this.creatures.set(player.ID, player);

        this.playerIdMap.set(socketId, player.ID);
        SocketFacade.GetInstance().SendToSocket(socketId, 'identity', player.ID);
    }

    addEnemy(enemy: Creature) {
        this.creatures.set(enemy.ID, enemy);
    }

    removePlayer(socketId: string) {
        this.players.delete(socketId);
        this.creatures.delete(this.playerIdMap.get(socketId));
        this.playerIdMap.delete(socketId);
    }

    isEmpty() {
        return this.players.size;
    }

    update(elapsedTimeMilliseconds: number) {
        if(!this.loaded)
            return;
        const payload = {};

        this.players.forEach((player, socketID, map) => {
            SocketFacade.GetInstance().SendToSocket(socketID, 'returnPlayerState', {bag:{contents:player.Bag.contents}});
        })

        this.creatures.forEach((creature, ID) => {
            creature.Behaviour.Update(elapsedTimeMilliseconds, this.wallMap);

            this.creatures.forEach((otherCreature) => {
                creature.Weapon.handleHit(otherCreature);
            })
            payload[ID] = creature.GetDisplayInfo();
        })

        SocketFacade.GetInstance().SendToArea(this.ID, 'areaState', payload);
    }

    setPlayerIntent(playerID: string, data: any) {
        const player = this.players.get(playerID);
		player.SetIntent(data);
    }
}