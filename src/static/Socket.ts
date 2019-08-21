import { Input } from "./Input";
import { ClientStorage, AnimationInfo } from "./ClientStorage";

export class Socket {
    socket: SocketIOClient.Socket;
    myPlayerId;
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
        this.myPlayerId = id;
    }

    saveBag(data) {
        this.clientStorage.bag.contents = data.bag.contents;
    }

    saveState(state) {
        for (var id in state.players) {
            if (this.clientStorage.creatures.has(id)) {
                this.clientStorage.creatures.get(id).creature = state.players[id];
            } else {
                this.clientStorage.creatures.set(id, {
                    creature: state.players[id],
                    animations: new Map<string, AnimationInfo>()
                });
            }
        }

        for (var id in state.enemies) {
            if (this.clientStorage.creatures.has(id)) {
                this.clientStorage.creatures.get(id).creature = state.enemies[id];
            } else {
                this.clientStorage.creatures.set(id, {
                    creature: state.enemies[id],
                    animations: new Map<string, AnimationInfo>()
                });
            }
        }

        if (this.myPlayerId && this.clientStorage.creatures.has(this.myPlayerId)) {
            this.clientStorage.topleft.x = this.clientStorage.creatures.get(this.myPlayerId).creature.x - this.clientStorage.canvas.width / 2;
            this.clientStorage.topleft.y = this.clientStorage.creatures.get(this.myPlayerId).creature.y - this.clientStorage.canvas.height / 2;
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