import MinecraftClient from "../MinecraftClient";
import BinaryReader from "../utils/BinaryReader";

/**
 * Takes care of decoding all incoming messages including batch packets.
 * Functionality/purpose should be implemented by subclasses
 */
export default abstract class NetworkSession {

    private client: MinecraftClient;

    protected constructor(client: MinecraftClient) {

        this.client = client;
    }


    public handlePacket(pk: BinaryReader) {

        const pid = pk.unpackByte();
        console.log('Received packet ID: ' + pid);
        // switch (pid) {
        //
        // }

        if (pk.unreadBytes() != 0) {
            console.warn('Still has ' + pk.unreadBytes() + ' bytes to read!')
        }
    }

    public handleBatchPacket(pk) {

    }

}
