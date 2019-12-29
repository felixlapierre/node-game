export class SocketFacade {
    private static instance: SocketFacade;

    private constructor(private io: SocketIO.Server) {

    }

    public static Initialize(socketIO: SocketIO.Server) {
        if (SocketFacade.instance) {
            throw new Error("Attempted to initialize socket facade twice");
        } else {
            SocketFacade.instance = new SocketFacade(socketIO);
        }
    }

    public static GetInstance() {
        return SocketFacade.instance;
    }

    public OnConnection(callback) {
        this.io.on('connection', callback);
    }

    public SendToSocket(socketId: string, message: string, payload: any) {
        if(this.io.sockets.connected[socketId]) {
            this.io.sockets.connected[socketId].emit(message, payload);
        }
    }

    public SendToArea(areaId: string, message: string, payload: any) {
       this.io.to(areaId).emit(message, payload);
    }
}