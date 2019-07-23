import pako = require("pako");
import {Buffer} from "buffer";
import BinaryWriter from "./BinaryWriter";
import BinaryReader from "./BinaryReader";

export class BatchPool {

    private batchPool: BinaryWriter[] = [];
    private processing = false;

    private readonly packet = new BinaryWriter(128 * 1024);
    private readonly websocket: WebSocket;

    constructor(ws: WebSocket) {

        this.websocket = ws;

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

        this.websocket.send(pk);

        // empty the list
        this.batchPool.length = 0;

        this.processing = false;
    }


    public pushPacket(pk: BinaryWriter, direct: boolean = false) {

        if (direct) {
            this.websocket.send(pk.getBuffer());
            pk.recycle();
        }

        this.batchPool.push(pk);
    }

}

export default class BatchUtils {

    /**
     * This method takes care of decoding the incoming batch packet.
     *
     * @return decoded packets
     */
    public static handleBatchPacket(pk: BinaryReader): BinaryWriter[] {


        return null;
    }
}
