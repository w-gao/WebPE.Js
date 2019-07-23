import {Buffer} from "buffer";
import VarInt from "./VarInt";
import ResourcePacksInfo, {PackIdVersion} from "../data/ResourcePacksInfo";
import Long = require("long");

export default class BinaryReader {

    public readonly buffer: Buffer;
    public offset: number;

    constructor(raw: ArrayBufferLike) {
        this.buffer = new Buffer(raw);
        this.offset = 0;
    }

    public unreadBytes(): number {
        return Math.max(0, this.buffer.length - this.offset);
    }

    /**
     * Credits to Jonas Konrad / yawkat and CubeCraft, unfortunately the wiki is no longer available.
     *
     * | Type         | Description
     * ------------------------------
     * | byte        | 1 byte
     * | short       | 2 bytes
     * | int         | 4 bytes
     * | long        | 8 bytes
     * | uuid        | 16 bytes
     * | float       | 4 bytes
     * | NBT         | NBT data in PE is always little-endian. This endianness includes short, int, long, float, double tags and the length headers for arrays, strings and lists.
     * | stack       | First short is the item ID. If this is not 0, then follows the item count ubyte. If this is also not 0, then follows the item data short and a little-endian short denoting the length of the following NBT data, or 0 for no NBT. Then follows an NBT tag described above of that length.
     * | vector      | 3 floats (x, y, z)
     * | vector:int  | 3 ints (x, y, z)
     * | block pos   | 2 ints (x, z) then an unsigned byte (y)
     * | string      | short and then that many bytes (presumably UTF-8 but maybe just Latin-1)
     * | string:int:le | LE-int and then that many bytes (presumably UTF-8 but maybe just Latin-1)
     */

    public unpack(len?: number): Uint8Array {

        if (len == undefined || len == 0) {
            len = this.buffer.length;
        } else {
            len += this.offset;
        }

        if (len > this.buffer.length) {

            console.warn('Reached end of packet before finish!');
            return new Uint8Array([]);
        }

        const i = this.offset;
        this.offset = len;
        return this.buffer.slice(i, len);
    }

    // equivalent to pk.unpack()
    public unpackAll(): Uint8Array {
        return this.unpack();
    }

    public unpackByte(): number {
        const i = this.offset;
        this.offset++;
        return this.buffer[i];
    }

    public unpackByteArray(): Uint8Array {
        return this.unpack(this.unpackUnsignedVarInt().toInt());
    }

    public unpackBoolean(): boolean {
        const i = this.offset;
        this.offset++;
        return this.buffer[i] != 0;
    }

    public unpackShort(): number {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readUInt16BE(i);
    }

    public unpackLShort(): number {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readUInt16LE(i);
    }

    public unpackSignedShort(): number {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readInt16BE(i);
    }

    public unpackSignedLShort(): number {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readInt16LE(i);
    }

    public unpackInt(): number {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readInt32BE(i);
    }

    public unpackLInt(): number {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readInt32LE(i);
    }

    public unpackFloat(): number {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readFloatBE(i);
    }

    public unpackLFloat(): number {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readFloatLE(i);
    }

    public unpackDouble(): number {
        const i = this.offset;
        this.offset += 8;
        return this.buffer.readDoubleBE(i);
    }

    public unpackLDouble(): number {
        const i = this.offset;
        this.offset += 8;
        return this.buffer.readDoubleLE(i);
    }

    public unpackLong(): Long {
        return Long.fromBytesBE(Array.from(this.unpack(8)));
    }

    public unpackLLong(): Long {
        return Long.fromBytesLE(Array.from(this.unpack(8)));
    }

    public unpackString(): string {
        return this.unpack(this.unpackUnsignedVarInt().toInt()).toString();
    }

    public unpackUnsignedVarInt(): Long {

        const MAX_SIZE = 5;

        let value: Long = new Long(0);
        let size: number = 0;
        let b: number;
        while (((b = this.unpackByte()) & 0x80) == 0x80) {
            value = value.or((b & 0x7F) << (size++ * 7));
            if (size >= MAX_SIZE) throw new Error("VarInt too big");
        }
        return value.or((b & 0x7F) << (size * 7));
    }

    public unpackVarInt(): number {
        return VarInt.decodeZigZag32(this.unpackUnsignedVarInt());
    }

    public unpackUnsignedVarLong(): Long {

        const MAX_SIZE = 10;

        let value: Long = new Long(0);
        let size: number = 0;
        let b: number;
        while (((b = this.unpackByte()) & 0x80) == 0x80) {
            value = value.or((b & 0x7F) << (size++ * 7));
            if (size >= MAX_SIZE) throw new Error("VarLong too big");
        }
        return value.or((b & 0x7F) << (size * 7));
    }

    public unpackVarLong(): Long {
        return VarInt.decodeZigZag64(this.unpackUnsignedVarLong());
    }


    // Minecraft datatype


    public unpackResourcePacksInfo(): ResourcePacksInfo[] {

        let count: number = this.unpackLShort(); // LE

        const packInfos: ResourcePacksInfo[] = [];
        for (let i = 0; i < count; i++) {
            const id = this.unpackString();
            const version = this.unpackString();
            const size = this.unpackLong();
            const encryptionKey = this.unpackString();
            const subpackName = this.unpackString();
            const contentIdentity = this.unpackString();
            const hasScripts = this.unpackBoolean();

            const info: ResourcePacksInfo = {
                packIdVersion: {
                    id: id,
                    version: version,
                    unknown: ''
                },
                size: size,
                hasScripts: hasScripts
            };
            packInfos.push(info);
        }

        return packInfos;
    }

    public unpackResourcePackVersion(): PackIdVersion[] {

        let count: number = this.unpackUnsignedVarInt().toInt();

        const infos: PackIdVersion[] = [];

        for (let i = 0; i < count; i++) {
            infos.push({
                id: this.unpackString(),
                version: this.unpackString(),
                unknown: this.unpackString()
            });
        }

        return infos;
    }

}
