import {Chunk} from "./Chunk";
import {BlockVector3} from "../math";
import {BlockPalette, GameRule} from "../data";
import {float, int} from "../types";

export interface WorldInfo {
    spawn: BlockVector3,
    seed: int,
    rainLevel: float,
    lightningLevel: float,
    gameRules: GameRule[],
    bonusChest: boolean,
    serverChunkTickRange: int,
    levelId: string,
    worldName: string,
    premiumWorldTemplateId: string,
    blockPalettes: BlockPalette[],
}

export class World {

    private readonly chunks: Chunk[];
    public worldInfo: WorldInfo;

    constructor(info: WorldInfo) {
        this.chunks = [];
        this.worldInfo = info;
    }

    /**
     * @param x     x value on the axis
     * @param y     y value on the axis (0 - 255)
     * @param z     z value on the axis
     */
    public getBlock(x: number, y: number, z: number): number {

        let block = 0;

        if (y >= 0 && y < 256) {

            let cx = x >> 4;
            let cz = z >> 4;

            let chunk = this.getChunk(cx, cz);
            if (chunk != undefined) {
                block = chunk.getBlock(x & 0x0f, y, z & 0x0f);
            }
        }

        return block;
    }

    public getChunk(cx: number, cz: number): Chunk | undefined {
        return this.chunks[(cx << 8) + cz];
    }

    public setChunk(cx: number, cz: number, chunk: Chunk) {
        if (this.chunks[(cx << 8) + cz] != undefined) {
            console.warn(`[World] Replacing chunk ${cx}:${cz}!`);
        } else {
            console.log(`[World] Chunk ${cx}:${cz} set!`);
        }

        this.chunks[(cx << 8) + cz] = chunk;
    }

    // /**
    //  * Call this when the player's teleported to another world
    //  */
    // public reset() {
    //
    // }

}
