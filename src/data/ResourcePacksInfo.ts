import {long} from "../types";

export interface ResourcePacksInfo {

    packIdVersion: PackIdVersion,
    size: long,
    hasScripts: boolean;
}

export interface PackIdVersion {
    id: string,
    version: string,
    unknown: string;
}
