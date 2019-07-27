import {Buffer} from "buffer";
import {VarInt} from "./VarInt";
import Long = require("long");
import {Pool, PoolObject} from "./Pool";
import {byte, double, float, int, long, short} from "../types";


export class BinaryWriter extends PoolObject {

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

    public pack(value: ArrayLike<byte>): void {

        this.buffer.set(value, this.offset);
        this.offset += value.length;
    }

    public packByte(value: byte): void {
        this.buffer[this.offset] = value & 255;
        this.offset++;
    }

    public packByteArray(value: byte[]): void {

        this.packUnsignedVarInt(value.length);
        this.pack(value);
    }

    public packBoolean(value: boolean): void {
        this.packByte(value ? 0x01 : 0x00);
    }

    public packShort(value: short): void {
        this.buffer.writeUInt16BE(value, this.offset);
        this.offset += 2;
    }

    public packLShort(value: short): void {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    public packSignedShort(value: short): void {
        this.buffer.writeInt16BE(value, this.offset);
        this.offset += 2;
    }

    public packSignedLShort(value: short): void {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    public packInt(value: int): void {
        this.buffer.writeUInt32BE(value, this.offset);
        this.offset += 4;
    }

    public packLInt(value: int): void {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    public packFloat(value: float): void {

        this.buffer.writeFloatBE(value, this.offset);
        this.offset += 4;
    }

    public packLFloat(value: float): void {

        this.buffer.writeFloatLE(value, this.offset);
        this.offset += 4;
    }

    public packDouble(value: double): void {
        this.buffer.writeDoubleBE(value, this.offset);
        this.offset += 8;
    }

    public packLDouble(value: double): void {
        this.buffer.writeDoubleLE(value, this.offset);
        this.offset += 8;
    }

    public packLong(value: long): void {

        this.pack(value.toBytesBE());
    }

    public packLLong(value: long): void {

        this.pack(value.toBytesLE());
    }

    public packString(value: string): void {
        this.packUnsignedVarInt(value.length);
        this.buffer.write(value, this.offset);
        this.offset += value.length;
    }

    public packLIntString(value: string): void {

        // Fixed size string; used in LoginPacket

        this.packLInt(value.length);
        this.buffer.write(value, this.offset);
        this.offset += value.length;
    }

    public packUnsignedVarInt(value: int | long): void {

        if (typeof value == "number") value = new Long(value);

        do {
            let temp = value.and(0b01111111);
            value = value.shiftRightUnsigned(7);
            if (!value.equals(0)) {
                temp = temp.or(0b10000000);
            }
            this.packByte(temp.toInt());
        } while (!value.equals(0));
    }

    public packVarInt(value: int): void {
        this.packUnsignedVarInt(VarInt.encodeZigZag32(value));
    }

    public packUnsignedVarLong(value: long): void {

        this.packUnsignedVarInt(value);
    }

    public packVarLong(value: long): void {
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

