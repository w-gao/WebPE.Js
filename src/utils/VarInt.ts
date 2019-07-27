import Long = require("long");
import {int, long} from "../types";

/**
 * This is a direct port of the VarInt implemented by Nukkit
 * @see https://github.com/EaseCation/Nukkit/blob/v14/src/main/java/cn/nukkit/utils/VarInt.java
 */
export class VarInt {

    /**
     * @param v Signed int
     * @return Unsigned encoded int
     */
    public static encodeZigZag32(v: int): long {
        // Note:  the right-shift must be arithmetic
        return new Long((v << 1) ^ (v >> 31));
    }

    /**
     * @param v Unsigned encoded int
     * @return Signed decoded int
     */
    public static decodeZigZag32(v: long): int {
        return v.shiftRight(1).xor(-(v.and(1))).toInt();
    }

    /**
     * @param v Signed long
     * @return Unsigned encoded long
     */
    public static encodeZigZag64(v: long): long {
        return v.shiftLeft(1).xor(v.shiftLeft(63));
    }

    /**
     * @param v Signed encoded long
     * @return Unsigned decoded long
     */
    public static decodeZigZag64(v: long): long {
        return v.shiftRightUnsigned(1).xor(-v.and(1));
    }

}
