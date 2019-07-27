export class ChunkSection {

    private _blockIds: number[];
    private _blockData: number[];

    constructor() {

        this._blockIds = [];
        this._blockData = [];
    }

    /**
     * @param x     chunk x (0 - 16)
     * @param y     chunk y (0 - 16)
     * @param z     chunk z (0 - 16)
     */
    public getBlock(x: number, y: number, z: number): number {

        let idx: number = (x << 8) + (z << 4) + y;

        let block = this._blockIds[idx];
        let data = this._blockData[idx];

        return block;
        // return ((block & 0xff) << 4) | data;
    }

    set blockIds(value: number[]) {
        this._blockIds = value;
    }

    set blockData(value: number[]) {
        this._blockData = value;
    }

}
