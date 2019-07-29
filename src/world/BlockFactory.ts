import {BlockPalette} from "../data";

export class BlockFactory {

    public static palettes: BlockPalette[] = [];

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
