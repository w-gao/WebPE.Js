import Long = require("long");

export interface ResourcePacksInfo {

    packIdVersion: PackIdVersion,
    size: Long,
    hasScripts: boolean;
}

export interface PackIdVersion {
    id: string,
    version: string,
    unknown: string;
}
