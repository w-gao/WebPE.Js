import Long = require("long");

export default interface ResourcePacksInfo {

    packIdVersion: PackIdVersion,
    size: Long,
    hasScripts: boolean;
}

export interface PackIdVersion {
    id: string,
    version: string,
    unknown: string;
}
