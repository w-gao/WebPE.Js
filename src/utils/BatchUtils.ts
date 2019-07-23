import pako = require("pako");
import {Buffer} from "buffer";
import BinaryWriter from "./BinaryWriter";
import BinaryReader from "./BinaryReader";
import MinecraftClient from "../MinecraftClient";

export class BatchPool {

    private batchPool: BinaryWriter[] = [];
    private processing = false;

    private readonly client: MinecraftClient;
    private readonly packet = new BinaryWriter(128 * 1024);

    constructor(client: MinecraftClient) {

        this.client = client;

        (window as any).batch = this;
    }

    public processBatch() {

        if (this.processing) {
            return;
        }

        if (this.batchPool.length == 0) {
            return;
        }

        this.processing = true;

        this.packet.reset();
        this.batchPool.forEach(pk => {

            let buffer = pk.getBuffer();
            this.packet.packUnsignedVarInt(buffer.length);
            this.packet.pack(buffer);
            pk.recycle();
        });

        let compressed = pako.deflate(this.packet.getBuffer());

        /* append batch packet pid */
        let pk = new Buffer(compressed.length + 1);
        pk.set([0xfe]);         // packet id
        pk.set(compressed, 1);      // data
        /* --- */

        this.client.sendPacket(pk);

        // empty the list
        this.batchPool.length = 0;

        this.processing = false;
    }


    public pushPacket(pk: BinaryWriter, direct: boolean = false) {

        if (direct) {
            this.client.sendPacket(pk.getBuffer());
            pk.recycle();
        }

        this.batchPool.push(pk);
    }

}

export default class BatchUtils {

    /**
     * This method takes care of decoding the incoming batch packet.
     *
     * @return decoded packets (pid is unread)
     */
    public static handleBatchPacket(pk: BinaryReader): BinaryReader[] {

        // first byte (packet id) should already be read

        let packets: BinaryReader[] = [];

        let data = new BinaryReader(pako.inflate(pk.unpackAll()));
        while (data.unreadBytes() != 0) {

            let len: number = data.unpackUnsignedVarInt().toInt();
            packets.push(new BinaryReader(data.unpack(len)));
        }

        if (packets.length == 0) {
            console.warn('0 packets in batch packet. ')
        }

        return packets;
    }
}
