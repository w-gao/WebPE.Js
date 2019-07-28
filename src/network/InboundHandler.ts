import {BatchUtils, BinaryReader, Utils} from "../utils";
import {ProtocolId} from "./Protocol";
import {MinecraftClient} from "../MinecraftClient";
import {ResourcePacksInfo, StartGameInfo} from "../data";
import {BlockFactory, Chunk, ChunkSection, World, WorldInfo} from "../world";
import {PlayerLocation} from "../math";


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


    // completely temporary
    private static logPacket(pid: number): boolean {

        return pid != ProtocolId.UpdateBlock && pid != ProtocolId.SetEntityData && pid != ProtocolId.AddEntity && pid != ProtocolId.MoveEntityDelta;
    }

    public handlePacket(pk: BinaryReader): void {

        const pid = pk.unpackByte();

        if (pid == 0xfe) {        // batch
            BatchUtils.handleBatchPacket(pk).forEach(pk => this.handlePacket(pk));
            return;
        }

        const pidHex = Utils.toHexString(pid);

        InboundHandler.logPacket(pid) && console.log(`Received packet ID: ${pidHex}, size=${pk.buffer.length}`);
        switch (pid) {
            case ProtocolId.PlayStatus:
                this.handlePlayStatus(pk);
                break;
            case ProtocolId.Disconnect:
                this.handleDisconnect(pk);
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
            case ProtocolId.AddPlayer:
                // this.handleAddPlayer(pk);
                break;
            case ProtocolId.MovePlayer:
                // this.handleMovePlayer(pk);
                break;
            case ProtocolId.FullChunkData:
                this.handleFullChunkData(pk);
                break;
            case ProtocolId.ChunkRadiusUpdate:
                this.handleChunkRadiusUpdate(pk);
                break;
        }


        if (pk.unreadBytes() != 0 && InboundHandler.logPacket(pid)) {
            console.warn('[' + pidHex + '] Still has ' + pk.unreadBytes() + ' bytes to read!');

            let buff = pk.unpackAll();
            if (buff.length < 100) {
                console.log(Utils.toHexString(buff, '0x'));
            } else {
                console.log('too large to display.')
            }
        }
    }

    public handlePlayStatus(pk: BinaryReader): void {

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
                this.client.outboundHandler.sendMovePlayer(this.client.currentLocation);
                break;
            default:
                // 4, 5, and 6 are known, but shouldn't be sent
                console.warn('Unknown Player Status sent from server.');
                break;
        }
    }

    public handleDisconnect(pk: BinaryReader): void {

        let hideDisconnectReason = pk.unpackBoolean();
        let message = pk.unpackString();

        console.log('Disconnect');
        !hideDisconnectReason && console.log(`message=${message}`);

        this.client.disconnect(true);
    }

    public handleResourcePacksInfo(pk: BinaryReader): void {

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

            let ids = [];

            resourceInfos.forEach(info => {
                console.log(`Received pack ${info.packIdVersion.id} - ${info.packIdVersion.version}`);
                ids.push(info.packIdVersion.id);
            });

            this.client.outboundHandler.sendResourcePackClientResponse(2, ids);
        }
    }

    public handleResourcePackStack(pk: BinaryReader): void {

        let mustAccept = pk.unpackBoolean();
        let behaviorVersions = pk.unpackResourcePackVersion();
        let resourceVersions = pk.unpackResourcePackVersion();
        let isExperimental = pk.unpackBoolean();

        console.log(`Received pack stack mustAccept=${mustAccept},isExperimental=${isExperimental}`);

        this.client.outboundHandler.sendResourcePackClientResponse(4);
    }


    public handleText(pk: BinaryReader): void {

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
                let count = pk.unpackUnsignedVarInt().toInt();
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

    public handleStartGame(pk: BinaryReader): void {

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
        this.client.startGameInfo = startGameInfo;

        this.client.currentLocation = PlayerLocation.from(
            startGameInfo.position,
            startGameInfo.yaw,
            startGameInfo.pitch,
            startGameInfo.yaw
        );


        let worldInfo: WorldInfo = {
            spawn: startGameInfo.spawn,
            seed: startGameInfo.seed,
            rainLevel: startGameInfo.rainLevel,
            lightningLevel: startGameInfo.lightningLevel,
            gameRules: startGameInfo.gameRules,
            bonusChest: startGameInfo.bonusChest,
            serverChunkTickRange: startGameInfo.serverChunkTickRange,
            levelId: startGameInfo.levelId,
            worldName: startGameInfo.worldName,
            premiumWorldTemplateId: startGameInfo.premiumWorldTemplateId,
            blockPalettes: startGameInfo.blockPalettes
        };

        this.client.world = new World(worldInfo);

        this.client.outboundHandler.sendRequestChunkRadius(5);
    }


    public handleFullChunkData(pk: BinaryReader): void {

        let cx = pk.unpackVarInt();
        let cz = pk.unpackVarInt();
        let length = pk.unpackUnsignedVarInt().toInt();     // we could use unpackByteArray

        // if (cx <= 7 || cx >= 9) return;
        // if (cz <= 7 || cz >= 9) return;

        console.log('Receiving FullChunk<' + cx + ',' + cz + '>');

        let count = pk.unpackByte();
        console.log(`count=${count}`);

        let chunk: Chunk = new Chunk(cx, cz);
        let blockNames = new Set();         // for testing
        let palettes = this.client.startGameInfo.blockPalettes;

        if (count < 1) {
            console.log('Empty Chunks');

            // if (this.client.world.getChunk(cx, cz) == undefined)
            //     this.client.world.setChunk(cx, cz, chunk);
            return;     // !! Might have other info to read??
        }

        for (let s = 0; s < count; s++) {

            let version = pk.unpackByte();
            console.log(`version=${version}`);

            let section = new ChunkSection();
            section.version = version;

            if (version == 1 || version == 8) {

                // New chunk format is defined at https://gist.github.com/Tomcc/a96af509e275b1af483b25c543cfbf37

                console.log('Using new chunk format!');

                let storageSize = 1;
                if (version == 8) storageSize = pk.unpackByte();

                for (let storage = 0; storage < storageSize; storage++) {

                    let paletteAndFlag = pk.unpackByte();
                    let isRuntime = (paletteAndFlag & 1) != 0;
                    let bitsPerBlock = paletteAndFlag >> 1;
                    let blocksPerWord = Math.floor(32 / bitsPerBlock);
                    let wordCount = Math.ceil(4096 / blocksPerWord);

                    let words = new Array(wordCount);
                    for (let w = 0; w < wordCount; w++) {
                        words[w] = pk.unpackLInt();
                    }

                    let palette = [];

                    if (isRuntime) {

                        let paletteSize = pk.unpackVarInt();
                        palette = new Array(paletteSize);

                        for (let paletteId = 0; paletteId < palette.length; paletteId++) {
                            palette[paletteId] = pk.unpackVarInt();
                        }

                        if (paletteSize == 0) {
                            console.log('Palette size is 0');
                            continue;
                        }
                    }

                    let position = 0;
                    for (let w = 0; w < wordCount; w++) {
                        let word = words[w];
                        for (let block = 0; block < blocksPerWord; block++) {
                            if (position >= 4096) break;

                            let state = (word >> ((position % blocksPerWord) * bitsPerBlock)) & ((1 << bitsPerBlock) - 1);

                            let x = (position >> 8) & 0xF;
                            let y = position & 0xF;
                            let z = (position >> 4) & 0xF;

                            if (state >= palette.length) continue;

                            let result = palettes.find(p => p.runtimeId == palette[state]);
                            if (result) {
                                blockNames.add(y + ': ' + result.name);
                                section.setBlock(x, y, z, BlockFactory.nameToId(result.name));
                            }

                            position++;
                        }

                        if (position >= 4096) break;
                    }
                }

            } else {

                let blockIds = Array.from(pk.unpack(4096));
                let data = Array.from(pk.unpack(2048));

                section.blockIds = blockIds;
                section.blockData = data;
            }

            chunk.setChunkSection(s, section);
            console.log(blockNames);
        }

        this.client.world.setChunk(cx, cz, chunk);


    }

    public handleChunkRadiusUpdate(pk: BinaryReader): void {

        let radius = pk.unpackVarInt();

        console.log('ChunkRadiusUpdate');
        console.log(`radius=${radius}`);
    }

}
