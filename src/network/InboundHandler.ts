import {BinaryReader} from "../utils";
import {Utils} from "../utils";
import {BatchUtils} from "../utils";
import {ProtocolId} from "./Protocol";
import {MinecraftClient} from "../MinecraftClient";
import {ResourcePacksInfo} from "../data";
import {StartGameInfo} from "../data";

import nbt = require("nbt");


/**
 * Takes care of decoding all incoming messages including batch packets.
 *
 * Functionality/purpose should be implemented by subclasses
 */
export class InboundHandler {

    private readonly client: MinecraftClient;

    constructor(client: MinecraftClient) {

        this.client = client;
    }


    public handlePacket(pk: BinaryReader) {

        const pid: number = pk.unpackByte();
        const pidHex = Utils.toHexString(pid);
        pid != 0xfe && console.log(`Received packet ID: ${pidHex}, size=${pk.buffer.length}`);
        switch (pid) {

            case 0xfe:      // batch
                BatchUtils.handleBatchPacket(pk).forEach(pk => this.handlePacket(pk));
                break;
            case ProtocolId.PlayStatus:
                this.handlePlayStatus(pk);
                break;
            case ProtocolId.ResourcePacksInfo:
                this.handleResourcePacksInfo(pk);
                break;
            case ProtocolId.ResourcePackStack:
                this.handleResourcePackStack(pk);
                break;
            case ProtocolId.Text:
                this.handleText(pk);
                break;
            case ProtocolId.StartGame:
                this.handleStartGame(pk);
                break;

            case ProtocolId.FullChunkData:
                this.handleFullChunkData(pk);
                break;
        }


        if (pk.unreadBytes() != 0) {
            console.warn('[' + pidHex + '] Still has ' + pk.unreadBytes() + ' bytes to read!')

            let buff = pk.unpackAll();
            if (buff.length < 100) {
                console.log(Utils.toHexString(buff, '0x'));
            } else {
                console.log('too large to display.')
            }
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
                this.client.hasSpawned = true;
                console.log('PLAYER_SPAWN');
                break;
            default:
                // 4, 5, and 6 are known, but shouldn't be sent
                console.warn('Unknown Player Status sent from server.');
                break;
        }
    }

    public handleResourcePacksInfo(pk: BinaryReader) {

        let mustAccept = pk.unpackBoolean();
        let hasScripts = pk.unpackBoolean();

        console.log(`ResourcePacksInfo - mustAccept=${mustAccept},hasScripts=${hasScripts}`);

        let behaviorInfos: ResourcePacksInfo[] = pk.unpackResourcePacksInfo();
        if (behaviorInfos.length == 0) {
            console.log(`Received 0 behavior packs`);
        } else {
            behaviorInfos.forEach(info => {
                console.log(`Received pack ${info.packIdVersion.id} - ${info.packIdVersion.version}`);
            });
        }

        let resourceInfos: ResourcePacksInfo[] = pk.unpackResourcePacksInfo();
        if (resourceInfos.length == 0) {
            console.log(`Received 0 resource packs`);
            this.client.outboundHandler.sendResourcePackClientResponse(3);
        } else {

            let ids: string[] = [];

            resourceInfos.forEach(info => {
                console.log(`Received pack ${info.packIdVersion.id} - ${info.packIdVersion.version}`);
                ids.push(info.packIdVersion.id);
            });

            this.client.outboundHandler.sendResourcePackClientResponse(2, ids);
        }
    }

    public handleResourcePackStack(pk: BinaryReader) {

        let mustAccept = pk.unpackBoolean();
        let behaviorVersions = pk.unpackResourcePackVersion();
        let resourceVersions = pk.unpackResourcePackVersion();
        let isExperimental = pk.unpackBoolean();

        console.log(`Received pack stack mustAccept=${mustAccept},isExperimental=${isExperimental}`);

        this.client.outboundHandler.sendResourcePackClientResponse(4);
    }


    public handleText(pk: BinaryReader) {

        /**
         * Text type constants
         * 0        RAW
         * 1        CHAT
         * 2        TRANSLATION
         * 3        POPUP
         * 4        JUKE_BOX_POPUP
         * 5        TIP
         * 6        SYSTEM
         * 7        WHISPER
         * 8        ANNOUNCEMENT
         */

        let type = pk.unpackByte();
        let isLocalized = pk.unpackBoolean();

        let message: string;
        let parameters: string[] = [];
        let primaryName: string;

        switch (type) {
            case 0:
            case 5:
            case 6:
                message = pk.unpackString();
                break;
            case 1:
            case 7:
            case 8:
                primaryName = pk.unpackString();
                message = pk.unpackString();
                break;
            case 2:
            case 3:
            case 4:
                message = pk.unpackString();
                let count = pk.unpackVarInt();
                for (let i = 0; i < count; i++) {
                    parameters.push(pk.unpackString());
                }
                break;
        }

        let senderXUID = pk.unpackString();
        let platformIdString = pk.unpackString();

        console.log(`[TEXT - ${type}] ${primaryName}: ${message}`);
        console.log(parameters.join());
    }

    public handleStartGame(pk: BinaryReader) {

        let startGameInfo: StartGameInfo = {

            entityIdSelf: pk.unpackVarLong(),
            runtimeEntityId: pk.unpackUnsignedVarLong(),
            playerGamemode: pk.unpackVarInt(),
            position: pk.unpackVector3(),
            yaw: pk.unpackLFloat(),
            pitch: pk.unpackLFloat(),
            seed: pk.unpackVarInt(),
            dimension: pk.unpackVarInt(),
            generator: pk.unpackVarInt(),
            gamemode: pk.unpackVarInt(),
            difficulty: pk.unpackVarInt(),
            spawn: pk.unpackBlockVector3(),
            hasAchievementsDisabled: pk.unpackBoolean(),
            dayCycleStopTime: pk.unpackVarInt(),
            eduMode: pk.unpackBoolean(),
            hasEduFeaturesEnabled: pk.unpackBoolean(),
            rainLevel: pk.unpackLFloat(),
            lightningLevel: pk.unpackLFloat(),
            hasConfirmedPlatformLockedContent: pk.unpackBoolean(),
            isMultiplayer: pk.unpackBoolean(),
            broadcastToLan: pk.unpackBoolean(),
            xboxLiveBroadcastMode: pk.unpackVarInt(),
            platformBroadcastMode: pk.unpackVarInt(),
            enableCommands: pk.unpackBoolean(),
            isTexturepacksRequired: pk.unpackBoolean(),
            gameRules: pk.unpackGameRules(),
            bonusChest: pk.unpackBoolean(),
            mapEnabled: pk.unpackBoolean(),
            permissionLevel: pk.unpackVarInt(),
            serverChunkTickRange: pk.unpackLInt(),
            hasLockedBehaviorPack: pk.unpackBoolean(),
            hasLockedResourcePack: pk.unpackBoolean(),
            isFromLockedWorldTemplate: pk.unpackBoolean(),
            useMsaGamertagsOnly: pk.unpackBoolean(),
            isFromWorldTemplate: pk.unpackBoolean(),
            isWorldTemplateOptionLocked: pk.unpackBoolean(),
            levelId: pk.unpackString(),
            worldName: pk.unpackString(),
            premiumWorldTemplateId: pk.unpackString(),
            isTrial: pk.unpackBoolean(),
            currentTick: pk.unpackLLong(),
            enchantmentSeed: pk.unpackVarInt(),
            blockPalettes: pk.unpackBlockPalettes(),
            multiplayerCorrelationId: pk.unpackString()
        };

        console.log('START GAME');
        console.log(startGameInfo);

        //
    }

    private count = 0;

    public handleFullChunkData(pk: BinaryReader) {

        let cx: number = pk.unpackVarInt();
        let cz: number = pk.unpackVarInt();
        let length: number = pk.unpackUnsignedVarInt().toInt();     // we could use unpackByteArray

        console.log('Receiving FullChunk<' + cx + ',' + cz + '>');

        let count: number = pk.unpackByte();
        console.log(`count=${count}`);

        if (count < 1) {
            console.log('Empty Chunks');
        }

        for (let s = 0; s < count; s++) {

            let version = pk.unpackByte();
            console.log(`version=${version}`);

            if (version != 0) {

                // 1 and 8 are the newer chunk versions. Ideally we would be using them
                // because they support more blocks. However, neither Nukkit nor most
                // web based voxel engines support blocks beyond the 255 limit.

                console.log('Unsupported chunk version');

            } else {

                let blockIds: number[] = Array.from(pk.unpack(4096));
                let data: number[] = Array.from(pk.unpack(2048));

                // console.log(blockIds);
                // console.log(data);

                for (let x = 0; x < 16; x++) {
                    for (let z = 0; z < 16; z++) {
                        for (let y = 0; y < 16; y++) {

                            let idx: number = (x << 8) + (z << 4) + y;
                            let id: number = blockIds[idx];
                            let meta: number = data[idx];

                            // lol uncomment to crash ur client
                            // if (id != 0) console.log('<' + x + ',' + y + ',' + z + '> has block ' + id + ':' + meta);
                        }
                    }
                }



            }
        }

        this.count++;
        if (this.count == 3) this.client.disconnect();
    }

}
