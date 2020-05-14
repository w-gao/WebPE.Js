/*
 * Copyright (c) 2019-2020 w-gao
 * All Rights Reserved.
 */

import {BinaryReader} from "./utils";
import {InboundHandler, OutBoundHandler} from "./network";
import {World} from "./world";
import {EventType} from "./event";
import {PlayerLocation} from "./math";
import {PlayerInfo} from "./player/PlayerInfo";
import ProxyClient from "./network/ProxyClient";
import EventEmitter = require("events");
import {LoginCredentials} from "./data";

export class MinecraftClient {

    private readonly _connectionString: string;
    private _websocket: WebSocket;

    private _proxyClient: ProxyClient;

    private _inboundHandler: InboundHandler;
    private _outboundHandler: OutBoundHandler;

    // Events
    private eventEmitter: EventEmitter = new EventEmitter();

    private _isConnected: boolean = false;
    private _hasSpawned: boolean = false;

    private _currentLocation: PlayerLocation;
    private _playerInfo: PlayerInfo;
    private _world: World = null;


    constructor(host?: string, port?: number) {

        host = host || '127.0.0.1';
        port = port || 19132;

        this._connectionString = `ws://${host}:${port}`;
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
        this._websocket.onclose = (ev: CloseEvent) => this.onClose(ev);

        this._proxyClient = new ProxyClient(this);

        this._inboundHandler = inboundHandler || new InboundHandler(this);
        this._outboundHandler = outboundHandler || new OutBoundHandler(this);
    }

    /**
     * WebSocket connection to the Proxy is established.
     */
    private onOpen(ev: Event) {

        console.log('onOpen');
        console.log(ev);

        // emit event
        let target = {
            host: '127.0.0.1',
            port: 19132
        }

        this.emit(EventType.ProxyConnectionRequest, target);

        this._proxyClient.sendConnectionRequest(target.host, target.port);
    }

    /**
     * Proxy has connected to the target Minecraft server.
     */
    public onConnect() {

        console.log('onConnect')

        let cred: LoginCredentials = {displayName: 'WebPE'}
        this.emit(EventType.PlayerLoginRequest, cred);

        this._proxyClient.sendLogin(cred.displayName);
    }

    private onMessage(ev: MessageEvent) {

        if (typeof ev.data === "string") {
            // string channel
            this._proxyClient.handleMessage(ev.data);
            return;
        }

        console.log('onMessage');
        let pk = new BinaryReader(ev.data);

        this._inboundHandler.handlePacket(pk);
    }

    private onClose(ev: CloseEvent) {
        console.log('onClose');
        console.log(ev);

        if (this.isConnected) {
            this.disconnect(true);
        }
    }

    /**
     *
     * @param pk    packet should be recycled when necessary after calling sendPacket()
     */
    public sendPacket(pk: string | ArrayBufferLike | Blob | ArrayBufferView): void {

        this._websocket.send(pk);
    }

    public disconnect(serverInitiated: boolean = false, notify: boolean = true, reason?: string): void {

        this.isConnected = false;
        this.eventEmitter.emit(EventType.PlayerDisconnect, reason);

        if (serverInitiated) {
            // WebSocket should be closed by the server
            return;
        } else if (notify) {
            // this.outboundHandler.sendDisconnect();
        }

        this._websocket.close(1000, reason ? reason : 'client disconnect');
    }

    /**
     * Register an event listener
     */
    public on(ev: EventType, callback: (...args) => void) {
        this.eventEmitter.on(ev, callback);
    }

    /**
     * Dispatch an event
     */
    public emit(ev: EventType, ...args) {
        this.eventEmitter.emit(ev, ...args);
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
    }

    get hasSpawned(): boolean {
        return this._hasSpawned;
    }

    set hasSpawned(value: boolean) {
        this._hasSpawned = value;
        if (value) this.eventEmitter.emit(EventType.LocalPlayerSpawn);
    }

    get currentLocation(): PlayerLocation {
        return this._currentLocation;
    }

    set currentLocation(value: PlayerLocation) {
        this._currentLocation = value;
    }

    get playerInfo(): PlayerInfo {
        return this._playerInfo;
    }

    get world(): World {
        return this._world;
    }

    // Internal method
    _setStartGameInfo(playerInfo: PlayerInfo, world: World) {
        this._playerInfo = playerInfo;
        this._world = world;
    }

}
