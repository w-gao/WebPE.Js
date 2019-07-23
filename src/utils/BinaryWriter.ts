import {Buffer} from "buffer";
import VarInt from "./VarInt";
import Long = require("long");
import Pool, {PoolObject} from "./Pool";


export default class BinaryWriter extends PoolObject {

    private readonly buffer: Buffer;
    private readonly arrayBuffer: ArrayBuffer;
    public offset: number;

    constructor(size: number) {
        super();

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

    public pack(value: ArrayLike<number>): void {

        this.buffer.set(value, this.offset);
        this.offset += value.length;
    }

    public packByte(value): void {
        this.buffer[this.offset] = value & 255;
        this.offset++;
    }

    public packByteArray(value: number[]): void {

        this.packUnsignedVarInt(value.length);
        this.pack(value);
    }

    public packBoolean(value: boolean): void {
        this.packByte(value ? 0x01 : 0x00);
    }

    public packShort(value: number): void {
        this.buffer.writeUInt16BE(value, this.offset);
        this.offset += 2;
    }

    public packLShort(value: number): void {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    public packSignedShort(value: number): void {
        this.buffer.writeInt16BE(value, this.offset);
        this.offset += 2;
    }

    public packSignedLShort(value: number): void {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    public packInt(value: number): void {
        this.buffer.writeUInt32BE(value, this.offset);
        this.offset += 4;
    }

    public packLInt(value: number): void {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    public packFloat(value: number): void {

        this.buffer.writeFloatBE(value, this.offset);
        this.offset += 4;
    }

    public packLFloat(value: number): void {

        this.buffer.writeFloatLE(value, this.offset);
        this.offset += 4;
    }

    public packDouble(value: number): void {
        this.buffer.writeDoubleBE(value, this.offset);
        this.offset += 8;
    }

    public packLDouble(value: number): void {
        this.buffer.writeDoubleLE(value, this.offset);
        this.offset += 8;
    }

    public packLong(value: Long): void {

        this.pack(value.toBytesBE());
    }

    public packLLong(value: Long): void {

        this.pack(value.toBytesLE());
    }

    public packString(value: string): void {
        this.packUnsignedVarInt(value.length);
        this.buffer.write(value, this.offset);
        this.offset += value.length;
    }

    public packLIntString(value: string): void {

        // I think this is only used in LoginPacket?
        // Described by yawkat as string:int:le
        /** @see ./BinaryReader */

        this.packLInt(value.length);
        this.buffer.write(value, this.offset);
        this.offset += value.length;
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

