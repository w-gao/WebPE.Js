import {BinaryReader} from "./utils";
import {InboundHandler} from "./network";
import {OutBoundHandler} from "./network";
import {World} from "./world";
import {EventType} from "./event";
import EventEmitter = require("events");

export class MinecraftClient {

    private readonly _connectionString: string;
    private _websocket: WebSocket;

    private _inboundHandler: InboundHandler;
    private _outboundHandler: OutBoundHandler;

    // Events
    private eventEmitter: EventEmitter = new EventEmitter();

    private _isConnected: boolean = false;
    private _hasSpawned: boolean = false;

    private _world: World = null;


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
            this.isConnected = false;
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

        this.isConnected = true;
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
    public sendPacket(pk: string | ArrayBufferLike | Blob | ArrayBufferView): void {

        // pk shouldn't be string; however, we support it ;-)

        this._websocket.send(pk);
    }

    public disconnect(serverInitiated: boolean = false, notify: boolean = true): void {

        if (serverInitiated) {
            // WebSocket should be closed by the server
            return;
        }

        this._websocket.close(1000, 'client disconnect');
    }

    /**
     * Register an event listener
     */
    public on(ev: EventType, callback: (...arg) => void) {
        this.eventEmitter.on(ev, callback);
    }

    /* *** Getters & Setters **/

    get inboundHandler(): InboundHandler {
        return this._inboundHandler;
    }

    get outboundHandler(): OutBoundHandler {
        return this._outboundHandler;
    }

    get isConnected(): boolean {
        return this._isConnected;
    }

    set isConnected(value: boolean) {
        this._isConnected = value;
        if (!value) this.eventEmitter.emit(EventType.PlayerDisconnect);
    }

    get hasSpawned(): boolean {
        return this._hasSpawned;
    }

    set hasSpawned(value: boolean) {
        this._hasSpawned = value;
        if (value) this.eventEmitter.emit(EventType.PlayerSpawn);
    }

    get world(): World {
        return this._world;
    }

    set world(value: World) {
        this._world = value;
    }

}
