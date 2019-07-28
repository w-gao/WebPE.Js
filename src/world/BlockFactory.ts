export class BlockFactory {

    // private static palettes: BlockPalette[];
    //
    // public static setBlockPalette(palettes: BlockPalette[]) {
    //     this.palettes = palettes;
    // }

    public static nameToId(name: string): number {

        // Not recommended, but it works for now

        if (name.startsWith('minecraft:')) name = name.substr(10);
        switch (name) {
            case 'stone':
                return 1;
            case 'grass':
                return 2;
            case 'dirt':
                return 3;
            case 'bedrock':
                return 7;
            case 'snow':
                return 80;
        }

        return 0;
    }

}
