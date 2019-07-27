import {ChunkSection} from "./ChunkSection";

export class Chunk {

    public static readonly SECTION_COUNT = 16;

    private cx: number;
    private cz: number;

    private isEmpty: boolean;

    private readonly _sections: ChunkSection[];

    constructor(cx: number, cz: number, isEmpty: boolean = false) {

        this.cx = cx;
        this.cz = cz;
        this.isEmpty = isEmpty;

        this._sections = [];
    }

    /**
     * @param x     chunk x (0 - 16)
     * @param y     y value on the axis (0 - 255)
     * @param z     chunk z (0 - 16)
     */
    public getBlock(x: number, y: number, z: number): number {

        let section = this.getChunkSection(y >> 4);
        if (section != undefined) {
            return section.getBlock(x, y & 0x0f, z);
        }
        return 0;
    }

    /**
     * @param y     y index between 0 and SECTION_COUNT
     * @param createNew
     */
    public getChunkSection(y: number, createNew: boolean = false): ChunkSection | undefined {

        let section = this._sections[y];
        if (section == undefined) {

            if (createNew) {
                this._sections[y] = new ChunkSection();
                section = this._sections[y];
            }
        }

        return section;
    }

    /**
     * @param y     y index between 0 and SECTION_COUNT
     * @param section
     */
    public setChunkSection(y: number, section: ChunkSection): void {

        this._sections[y] = section;
    }

}
