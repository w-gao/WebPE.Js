import Long = require("long");
import Vector3 from "../math/Vector3";
import GameRule from "./GameRule";
import BlockPalette from "./BlockPalette";
import BlockVector3 from "../math/BlockVector3";

export default interface StartGameInfo {

    entityIdSelf: Long,
    runtimeEntityId: Long,
    playerGamemode: number,
    position: Vector3,
    yaw: number,
    pitch: number,
    seed: number,
    dimension: number,
    generator: number,
    gamemode: number,
    difficulty: number,
    spawn: BlockVector3,
    hasAchievementsDisabled: boolean,
    dayCycleStopTime: number,
    eduMode: boolean,
    hasEduFeaturesEnabled: boolean,
    rainLevel: number,
    lightningLevel: number,
    hasConfirmedPlatformLockedContent: boolean,
    isMultiplayer: boolean,
    broadcastToLan: boolean,
    xboxLiveBroadcastMode: number,
    platformBroadcastMode: number,
    enableCommands: boolean,
    isTexturepacksRequired: boolean,
    gameRules: GameRule[],
    bonusChest: boolean,
    mapEnabled: boolean,
    permissionLevel: number,
    serverChunkTickRange: number,
    hasLockedBehaviorPack: boolean,
    hasLockedResourcePack: boolean,
    isFromLockedWorldTemplate: boolean,
    useMsaGamertagsOnly: boolean,
    isFromWorldTemplate: boolean,
    isWorldTemplateOptionLocked: boolean,
    levelId: string,
    worldName: string,
    premiumWorldTemplateId: string,
    isTrial: boolean,
    currentTick: Long,
    enchantmentSeed: number,
    blockPalettes: BlockPalette[],
    multiplayerCorrelationId: string;
}
