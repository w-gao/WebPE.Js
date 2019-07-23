import BinaryReader from "./utils/BinaryReader";
import InboundHandler from "./network/InboundHandler";
import OutBoundHandler from "./network/OutBoundHandler";

export default class MinecraftClient {

    private readonly _connectionString: string;
    private _websocket: WebSocket;

    private _inboundHandler: InboundHandler;
    private _outboundHandler: OutBoundHandler;

    // private _connectedToServer: boolean = false;        // Minecraft server; not WebSocket server
    private _hasSpawned: boolean = false;


    constructor(host?: string, port?: number) {

        host = host ? host : '0.0.0.0';
        port = port ? port : 19132;

        this._connectionString = 'ws://' + host + ':' + port;
    }

    public connect(inboundHandler?: InboundHandler, outboundHandler?: OutBoundHandler) {

        console.log('connecting to ' + this._connectionString);
        this._websocket = new WebSocket(this._connectionString);

        this._websocket.binaryType = 'arraybuffer';

        this._websocket.onopen = (ev: Event) => this.onOpen(ev);
        this._websocket.onmessage = (ev: MessageEvent) => this.onMessage(ev);
        this._websocket.onerror = (ev: ErrorEvent) => {
            console.log('onError');
            console.log(ev);
        };
        this._websocket.onclose = (ev: CloseEvent) => {
            console.log('onClose');
            console.log(ev);
        };

        this._inboundHandler = inboundHandler ? inboundHandler : new InboundHandler(this);
        this._outboundHandler = outboundHandler ? outboundHandler : new OutBoundHandler(this);

    }

    private onOpen(ev: Event) {

        console.log('onOpen');
        console.log(ev);

        // send login
        // todo: move this to onMessage once we implement our own handshake sequence
        this._outboundHandler.sendLogin();
    }


    private onMessage(ev: MessageEvent) {

        console.log('onMessage');

        // todo: check for MAGIC once we implement our own handshake sequence

        let pk = new BinaryReader(ev.data);         // no need to pool inbound packets for now, b/c they have fixed sizes

        // should be one packet per message
        this._inboundHandler.handlePacket(pk);
    }

    /**
     *
     * @param pk    packet should be recycled when necessary after calling sendPacket()
     */
    public sendPacket(pk: string | ArrayBufferLike | Blob | ArrayBufferView) {

        // pk shouldn't be string; however, we support it ;-)

        this._websocket.send(pk);
    }

    /* *** Getters & Setters **/

    get inboundHandler(): InboundHandler {
        return this._inboundHandler;
    }

    get outboundHandler(): OutBoundHandler {
        return this._outboundHandler;
    }


    // get connectedToServer(): boolean {
    //     return this._connectedToServer;
    // }

    get hasSpawned(): boolean {
        return this._hasSpawned;
    }

    set hasSpawned(value: boolean) {
        this._hasSpawned = value;
    }

}
