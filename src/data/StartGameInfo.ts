import {Vector3} from "../math";
import {GameRule} from "./GameRule";
import {BlockPalette} from "./BlockPalette";
import {BlockVector3} from "../math";
import {float, int, long} from "../types";

export interface StartGameInfo {

    entityIdSelf: long,
    runtimeEntityId: long,
    playerGamemode: int,
    position: Vector3,
    yaw: float,
    pitch: float,
    seed: int,
    dimension: int,
    generator: int,
    gamemode: int,
    difficulty: int,
    spawn: BlockVector3,
    hasAchievementsDisabled: boolean,
    dayCycleStopTime: int,
    eduMode: boolean,
    hasEduFeaturesEnabled: boolean,
    rainLevel: float,
    lightningLevel: float,
    hasConfirmedPlatformLockedContent: boolean,
    isMultiplayer: boolean,
    broadcastToLan: boolean,
    xboxLiveBroadcastMode: int,
    platformBroadcastMode: int,
    enableCommands: boolean,
    isTexturepacksRequired: boolean,
    gameRules: GameRule[],
    bonusChest: boolean,
    mapEnabled: boolean,
    permissionLevel: int,
    serverChunkTickRange: int,
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
    currentTick: long,
    enchantmentSeed: int,
    blockPalettes: BlockPalette[],
    multiplayerCorrelationId: string;
}
