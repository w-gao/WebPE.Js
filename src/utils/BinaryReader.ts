import {Buffer} from "buffer";
import {VarInt} from "./VarInt";
import {BlockPalette, GameRule, PackIdVersion, ResourcePacksInfo} from "../data";
import {BlockVector3, Vector3} from "../math";
import {byte, double, float, int, long, short} from "../types";
import Long = require("long");
import UUID = require('uuid-parse');

export class BinaryReader {

    public readonly buffer: Buffer;
    public offset: number;

    constructor(raw: ArrayBufferLike) {
        this.buffer = new Buffer(raw);
        this.offset = 0;
    }

    public unreadBytes(): number {
        return Math.max(0, this.buffer.length - this.offset);
    }

    public unpack(len?: number): Uint8Array {

        if (len == undefined) {
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

    public unpackByte(): byte {
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
        if (this.buffer[i] != 0 && this.buffer[i] != 1) console.warn('Unexpected boolean');
        return this.buffer[i] != 0;
    }

    public unpackShort(): short {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readUInt16BE(i);
    }

    public unpackLShort(): short {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readUInt16LE(i);
    }

    public unpackSignedShort(): short {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readInt16BE(i);
    }

    public unpackSignedLShort(): short {
        const i = this.offset;
        this.offset += 2;
        return this.buffer.readInt16LE(i);
    }

    public unpackInt(): int {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readInt32BE(i);
    }

    public unpackLInt(): int {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readInt32LE(i);
    }

    public unpackFloat(): float {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readFloatBE(i);
    }

    public unpackLFloat(): float {
        const i = this.offset;
        this.offset += 4;
        return this.buffer.readFloatLE(i);
    }

    public unpackDouble(): double {
        const i = this.offset;
        this.offset += 8;
        return this.buffer.readDoubleBE(i);
    }

    public unpackLDouble(): double {
        const i = this.offset;
        this.offset += 8;
        return this.buffer.readDoubleLE(i);
    }

    public unpackLong(): long {
        return Long.fromBytesBE(Array.from(this.unpack(8)));
    }

    public unpackLLong(): long {
        return Long.fromBytesLE(Array.from(this.unpack(8)));
    }

    public unpackString(): string {
        return this.unpack(this.unpackUnsignedVarInt().toInt()).toString();
    }

    /**
     * @return      Returns a Long object for further manipulation
     */
    public unpackUnsignedVarInt(): long {

        let numRead = 0;
        let result = Long.fromInt(0, true);
        let read;
        do {
            read = this.unpackByte();
            result = result.or(Long.fromInt(read & 0b01111111, true).shiftLeft(7 * numRead));

            numRead++;
            if (numRead > 5) {
                throw new Error("VarInt is too big");
            }
        } while ((read & 0b10000000) != 0);

        return result;
    }

    public unpackVarInt(): int {

        let numRead = 0;
        let result = Long.fromInt(0, false);
        let read;
        do {
            read = this.unpackByte();
            result = result.or(Long.fromInt(read & 0b01111111, false).shiftLeft(7 * numRead));

            numRead++;
            if (numRead > 5) {
                throw new Error("VarInt is too big");
            }
        } while ((read & 0b10000000) != 0);

        return VarInt.decodeZigZag32(result);
    }

    public unpackUnsignedVarLong(): long {

        let numRead = 0;
        let result = Long.fromInt(0, true);
        let read;
        do {
            read = this.unpackByte();
            result = result.or(Long.fromInt(read & 0b01111111, true).shiftLeft(7 * numRead));

            numRead++;
            if (numRead > 10) {
                throw new Error("VarLong is too big");
            }
        } while ((read & 0b10000000) != 0);

        return result;
    }

    public unpackVarLong(): long {

        let numRead = 0;
        let result = Long.fromInt(0, false);
        let read;
        do {
            read = this.unpackByte();
            result = result.or(Long.fromInt(read & 0b01111111, false).shiftLeft(7 * numRead));

            numRead++;
            if (numRead > 10) {
                throw new Error("VarLong is too big");
            }
        } while ((read & 0b10000000) != 0);

        return VarInt.decodeZigZag64(result);
    }


    // Minecraft datatype


    public unpackResourcePacksInfo(): ResourcePacksInfo[] {

        let count = this.unpackLShort(); // LE

        const packInfos = [];
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

        let count = this.unpackUnsignedVarInt().toInt();

        const infos = [];

        for (let i = 0; i < count; i++) {
            infos.push({
                id: this.unpackString(),
                version: this.unpackString(),
                unknown: this.unpackString()
            });
        }

        return infos;
    }

    public unpackBlockVector3(): BlockVector3 {

        return new BlockVector3(this.unpackVarInt(), this.unpackUnsignedVarInt().toInt(), this.unpackVarInt());
    }

    public unpackVector3(): Vector3 {

        return new Vector3(this.unpackLFloat(), this.unpackLFloat(), this.unpackLFloat());
    }

    public unpackGameRules(): GameRule[] {

        let count = this.unpackUnsignedVarInt().toInt();

        const gameRules = [];

        for (let i = 0; i < count; i++) {
            let name = this.unpackString();
            let type = this.unpackUnsignedVarInt().toInt();

            switch (type) {
                case 1: {
                    gameRules.push(new GameRule(name, type, this.unpackBoolean()));
                    break;
                }
                case 2: {
                    gameRules.push(new GameRule(name, type, this.unpackVarInt()));
                    break;
                }
                case 3: {
                    gameRules.push(new GameRule(name, type, this.unpackFloat()));
                    break;
                }
            }
        }

        return gameRules;
    }

    public unpackBlockPalettes(): BlockPalette[] {

        let count = this.unpackUnsignedVarInt().toInt();

        const blockPalettes = [];

        for (let i = 0; i < count; i++) {
            blockPalettes.push({
                id: -1,
                runtimeId: i,
                name: this.unpackString(),
                data: this.unpackShort()
            });
        }

        return blockPalettes;
    }

    public unpackUUID(): string {

        return UUID.unparse(this.unpack(16));
    }


}
