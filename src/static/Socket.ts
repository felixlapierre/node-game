import { Input } from "./Input";
import { ClientStorage, AnimationInfo } from "./ClientStorage";

export class Socket {
    socket: SocketIOClient.Socket;
    constructor(private input: Input, private clientStorage: ClientStorage) {
        this.socket = io();
    }

    setupSockets() {
        this.socket.emit("new player");

        this.socket.on("mapdata", this.saveMapData.bind(this));

        this.socket.on("identity", this.savePlayerId.bind(this));

        this.socket.on("returnPlayerState", this.saveBag.bind(this));

        this.socket.on("areaState", this.saveState.bind(this));

        setInterval(this.sendIntentToServer.bind(this), 1000 / 60);
    }

    saveMapData(data) {
        this.clientStorage.map = data;
        this.clientStorage.spritesheet.src = "static/" + data.spritesheet;
    }

    savePlayerId(id) {
        this.clientStorage.playerId = id;
    }

    saveBag(data) {
        this.clientStorage.bag.contents = data.bag.contents;
    }

    saveState(state) {
        for (var id in state.players) {
            this.addOrUpdateCreature(id, state.players[id]);
        }

        for (var id in state.enemies) {
            this.addOrUpdateCreature(id, state.enemies[id]);
        }

        this.updateCamera();
    }

    addOrUpdateCreature(id, creature) {
        const creatures = this.clientStorage.creatures;
        if (creatures.has(id)) {
            creatures.get(id).creature = creature;
        } else {
            creatures.set(id, {
                creature: creature,
                animations: new Map<string, AnimationInfo>()
            });
        }
    }

    updateCamera() {
        const id = this.clientStorage.playerId;
        const creatures = this.clientStorage.creatures;
        const canvas = this.clientStorage.canvas;
        const topleft = this.clientStorage.topleft;
        
        if (id && creatures.has(id)) {
           topleft.x = creatures.get(id).creature.x - canvas.width / 2;
           topleft.y = creatures.get(id).creature.y - canvas.height / 2;
        }
    }

    sendIntentToServer() {
        this.calculateAngle();
        this.socket.emit("movement", this.input.getPlayerState());
    }

    calculateAngle() {
        var deltaX = this.input.mouse.x - this.clientStorage.canvas.width / 2 - this.clientStorage.canvas.offsetLeft;
        var deltaY = this.input.mouse.y - this.clientStorage.canvas.height / 2 - this.clientStorage.canvas.offsetTop;

        this.input.angle = Math.atan(deltaY / deltaX);
        if (deltaX < 0) {
            this.input.angle += Math.PI;
        }
    }
}