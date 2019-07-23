import Long = require("long");

/**
 * This is a direct port of the VarInt implemented by Nukkit
 * @see https://github.com/EaseCation/Nukkit/blob/v14/src/main/java/cn/nukkit/utils/VarInt.java
 */
export default class VarInt {

    /**
     * @param v Signed int
     * @return Unsigned encoded int
     */
    public static encodeZigZag32(v: number): Long {
        // Note:  the right-shift must be arithmetic
        return new Long((v << 1) ^ (v >> 31));
    }

    /**
     * @param v Unsigned encoded int
     * @return Signed decoded int
     */
    public static decodeZigZag32(v: Long): number {
        return v.shiftRight(1).xor(-(v.and(1))).toInt();
    }

    /**
     * @param v Signed long
     * @return Unsigned encoded long
     */
    public static encodeZigZag64(v: Long): Long {
        return v.shiftLeft(1).xor(v.shiftLeft(63));
    }

    /**
     * @param v Signed encoded long
     * @return Unsigned decoded long
     */
    public static decodeZigZag64(v: Long): Long {
        return v.shiftRightUnsigned(1).xor(-v.and(1));
    }

    // private static read(stream, maxSize: number): Long {
    //     let value: Long = new Long(0);
    //     let size: number = 0;
    //     let b: number;
    //     while (((b = stream.getByte()) & 0x80) == 0x80) {
    //         value = value.or((b & 0x7F) << (size++ * 7));
    //         if (size >= maxSize) {
    //             throw new Error("VarLong too big");
    //         }
    //     }
    //     return value.or((b & 0x7F) << (size * 7));
    // }

    // /**
    //  * @param stream BinaryStream
    //  * @return Signed int
    //  */
    // public static readVarInt(stream): number {
    //     return VarInt.decodeZigZag32(readUnsignedVarInt(stream));
    // }

// /**
//  * @param stream BinaryStream
//  * @return Unsigned int
//  */
// public static long readUnsignedVarInt(BinaryStream stream) {
//     return read(stream, 5);
// }
//
// /**
//  * @param stream BinaryStream
//  * @return Signed long
//  */
// public static long readVarLong(BinaryStream stream) {
//     return decodeZigZag64(readUnsignedVarLong(stream));
// }
//
// /**
//  * @param stream BinaryStream
//  * @return Unsigned long
//  */
// public static long readUnsignedVarLong(BinaryStream stream) {
//     return read(stream, 10);
// }
//
// /**
//  * @param stream BinaryStream
//  * @param value  Signed long
//  */
// public static void writeVarLong(BinaryStream stream, long value) {
//     writeUnsignedVarLong(stream, encodeZigZag64(value));
// }
//
// /**
//  * @param stream BinaryStream
//  * @param value  Unsigned long
//  */
// public static void writeUnsignedVarLong(BinaryStream stream, long value) {
//     write(stream, value);
// }
}
