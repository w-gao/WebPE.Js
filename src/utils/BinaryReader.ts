import {Buffer} from "buffer";

export default class BinaryReader {

    private readonly buffer: Buffer;
    private offset: number;

    constructor(raw: ArrayBufferLike) {
        this.buffer = new Buffer(raw);
        this.offset = 0;
    }

    public unreadBytes() {
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

    public unpackByte() {
        const i = this.offset;
        this.offset++;
        return this.buffer[i];
    }

    public unpackShort() {
        const i = this.offset;
        this.offset += 2;
        return ((this.buffer[i] & 255) << 8) + (this.buffer[i + 1] & 255)
    }

    public unpackInt() {
        const i = this.offset;
        this.offset += 4;
        return ((this.buffer[i] & 255) << 24)
            + ((this.buffer[i + 1] & 255) << 16)
            + ((this.buffer[i + 2] & 255) << 8)
            + ((this.buffer[i + 3] & 255))
    }

    public unpackFloat() {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readFloatLE(i);
    }

    public unpackDouble() {
        const i = this.offset;
        this.offset += 8;
        return this.buffer.readDoubleLE(i);
    }

    public unpackString() {

        const len = Math.min(this.unpackShort(), 1000);

        if (this.unreadBytes() < len) return undefined;
        let str = String();

        for (let i = 0; i < len; i++) {
            const char = this.unpackShort();
            char > 0 && (str += String.fromCharCode(char));
        }

        return str;
    }

}
