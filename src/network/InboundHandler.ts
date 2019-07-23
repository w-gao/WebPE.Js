import BinaryReader from "../utils/BinaryReader";
import Utils from "../utils/Utils";
import BatchUtils from "../utils/BatchUtils";
import {ProtocolId} from "./Protocol";
import MinecraftClient from "../MinecraftClient";


/**
 * Takes care of decoding all incoming messages including batch packets.
 *
 * Functionality/purpose should be implemented by subclasses
 */
export default class InboundHandler {

    private readonly client: MinecraftClient;

    constructor(client: MinecraftClient) {

        this.client = client;
    }


    public handlePacket(pk: BinaryReader) {

        const pid: number = pk.unpackByte();
        const pidHex = Utils.toHexString(pid);
        console.log('Received packet ID: ' + pidHex);
        switch (pid) {

            case 0xfe:      // batch
                BatchUtils.handleBatchPacket(pk).forEach(pk => this.handlePacket(pk));
                break;

            case ProtocolId.PlayStatus:

                this.handlePlayStatus(pk);
                break;
        }


        if (pk.unreadBytes() != 0) {
            console.warn('[' + pidHex + '] Still has ' + pk.unreadBytes() + ' bytes to read!')

            let buff = pk.unpackAll();
            console.log(Utils.toHexString(buff, '0x'));
        }
    }

    public handlePlayStatus(pk: BinaryReader) {

        /**
         * Status code constants
         * 0        LOGIN_SUCCESS
         * 1        LOGIN_FAILED_CLIENT
         * 2        LOGIN_FAILED_SERVER
         * 3        PLAYER_SPAWN
         */
        let status = pk.unpackInt();
        switch (status) {
            case 0:
                console.log('LOGIN_SUCCESS');
                break;
            case 1:
                console.log('LOGIN_FAILED_CLIENT');
                break;
            case 2:
                console.log('LOGIN_FAILED_SERVER');
                break;
            case 3:
                console.log('PLAYER_SPAWN');
                break;
            default:
                console.warn('Unknown status code sent from server.');
                break;
        }

        // respond

    }

}
