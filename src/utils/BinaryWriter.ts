import {Buffer} from "buffer";
import VarInt from "./VarInt";
import Long = require("long");
import Pool from "./Pool";


export default class BinaryWriter {

    private readonly buffer: Buffer;
    private readonly arrayBuffer: ArrayBuffer;
    public offset: number;

    constructor(size: number) {

        this.offset = 0;
        this.arrayBuffer = new ArrayBuffer(size);
        this.buffer = new Buffer(this.arrayBuffer);
    }

    public reset(): void {
        this.offset = 0;
    }

    public recycle(): void {
        PacketPool.bufferPool.recycle(this);
    }

    public getBuffer(): Uint8Array {
        return new Uint8Array(this.arrayBuffer, 0, this.offset);
    }

    public pack(buffer: Uint8Array): void {

        this.buffer.set(buffer, this.offset);
        this.offset += buffer.length;
    }

    public packByte(b): void {
        this.buffer[this.offset] = b & 255;
        this.offset++;
    }

    public packShort(s): void {
        this.buffer[this.offset] = (s >>> 8) & 255;
        this.buffer[this.offset + 1] = s & 255;
        this.offset += 2;
    }

    public packInt(i): void {
        this.buffer.writeUInt32BE(i, this.offset);
        this.offset += 4
    }

    public packLInt(i): void {
        this.buffer.writeInt32LE(i, this.offset);
        this.offset += 4
    }

    public packFloat(f): void {

        this.buffer.writeFloatLE(f, this.offset);
        this.offset += 4;
    }

    public packDouble(d): void {
        this.buffer.writeDoubleLE(d, this.offset);
        this.offset += 8;
    }

    public packString(s): void {
        this.packShort(s.length);
        for (let i = 0; i < s.length; i++) {
            this.packByte(s.charCodeAt(i))
        }
    }

    public packStringLEInt(s): void {

        // I think this is only used in LoginPacket?
        // Described by yawkat as string:int:le
        /** @see ./BinaryReader */

        this.packLInt(s.length);
        for (let i = 0; i < s.length; i++) {
            this.packByte(s.charCodeAt(i))
        }
    }

    public packUnsignedVarInt(value: number | Long): void {

        if (typeof value == "number") value = new Long(value);

        do {
            let temp = (value.and(0b01111111));
            value = value.shiftRightUnsigned(7);
            if (!value.equals(0)) {
                temp = temp.or(0b10000000);
            }
            this.packByte(temp);
        } while (!value.equals(0));
    }

    public packVarInt(value: number): void {
        this.packUnsignedVarInt(VarInt.encodeZigZag32(value));
    }

    public packUnsignedVarLong(value: Long): void {

        this.packUnsignedVarInt(value);
    }

    public packVarLong(value: Long): void {
        this.packUnsignedVarLong(VarInt.encodeZigZag64(value));
    }
}


export class PacketPool {

    public static bufferPool = new Pool<BinaryWriter>(() => new BinaryWriter(128 * 1024), 2);

    public static getPacket(): BinaryWriter {
        const packet = PacketPool.bufferPool.retrieve();
        packet.reset();
        return packet;
    }
}

