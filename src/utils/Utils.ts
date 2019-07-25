/**
 * General utilities
 */
export class Utils {

    private static readonly HEX = '0123456789ABCDEF';

    public static toHexString(buffer: number | ArrayLike<number>, prefix: string = '', space: string = ' ') {

        if (typeof buffer == "number") {
            buffer = [buffer];
            space = '';
        }

        let s = '';
        new Uint8Array(buffer).forEach(v => s += prefix + Utils.HEX[v >> 4] + Utils.HEX[v & 15] + space);
        return s;
    }

}
