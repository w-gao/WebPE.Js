import {BatchPool, BinaryWriter, PacketPool} from "../utils";
import {ProtocolId} from "./Protocol";
import {MinecraftClient} from "../MinecraftClient";
import {byte, int} from "../types";
import {PlayerLocation} from "../math";
import Long = require("long");

/**
 * Anything relevant to sending data to the server
 *
 * Functionality/purpose should be implemented by subclasses
 */
export class OutBoundHandler {

    private readonly client: MinecraftClient;
    private readonly _batchPool: BatchPool;

    constructor(client: MinecraftClient) {

        this.client = client;
        this._batchPool = new BatchPool(this.client);
    }

    public sendResourcePackClientResponse(status: byte, ids?: string[]): void {

        /**
         * Status code constants
         * 1        REFUSED
         * 2        SEND_PACKS
         * 3        HAVE_ALL_PACKS
         * 4        COMPLETED
         */

        const packet = PacketPool.getPacket();
        packet.packUnsignedVarInt(ProtocolId.ResourcePackClientResponse);
        packet.packByte(status);
        if (ids == undefined) {
            packet.packShort(0);
        } else {
            packet.packShort(ids.length);
            ids.forEach(id => packet.packString(id));
        }
        this.sendPacket(packet);
    }

    public sendText(type: byte, primaryName: string, message: string) {

        const packet = PacketPool.getPacket();
        packet.packUnsignedVarInt(ProtocolId.Text);
        packet.packByte(1);     // type = CHAT
        packet.packBoolean(false);      // isLocalized
        packet.packString(primaryName);
        packet.packString(message);
        packet.packString("");      // sendersXUID
        packet.packString("");      // platformIdString

        this.sendPacket(packet);
    }

    public sendMovePlayer(loc: PlayerLocation, mode: byte = 0, onGround: boolean = true) {

        /**
         * Mode constants
         * 0        Normal
         * 1        Reset
         * 2        Teleport
         * 3        Rotation
         */

        const packet = PacketPool.getPacket();
        packet.packUnsignedVarInt(ProtocolId.MovePlayer);
        packet.packUnsignedVarLong(this.client.playerInfo.runtimeEntityId);
        packet.packLFloat(loc.x);
        packet.packLFloat(loc.y);
        packet.packLFloat(loc.z);
        packet.packLFloat(loc.pitch);
        packet.packLFloat(loc.yaw);
        packet.packLFloat(loc.headYaw);
        packet.packByte(mode);
        packet.packBoolean(onGround);
        packet.packUnsignedVarLong(new Long(0));      // otherRuntimeEntityId

        this.sendPacket(packet);
    }


    public sendRequestChunkRadius(radius: int): void {

        const packet = PacketPool.getPacket();
        packet.packUnsignedVarInt(ProtocolId.RequestChunkRadius);
        packet.packVarInt(radius);

        this.sendPacket(packet);
    }


    /**
     * Helper function
     */
    protected sendPacket(pk: BinaryWriter): void {

        this.client.sendPacket(pk.getBuffer())

        // this._batchPool.pushPacket(pk);
        //
        // // todo: when necessary, move this to an update function so we can actually batch packets
        // this._batchPool.processBatch();
    }

}
