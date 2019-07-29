export enum EventType {

    /**
     * Calls before LoginPacket is sent
     *
     * Arguments
     * @param cred : LoginCredentials
     */
    PlayerLoginRequest,

    /**
     * Calls when client receives PlayerStatusPacket with PLAYER_SPAWN status
     *
     * Status code can be found at InboundHandler#handlePlayStatus
     * @see ../InboundHandler#handlePlayStatus
     */
    PlayerSpawn,

    /**
     * Calls when client receives a FullChunkDataPacket
     *
     * Arguments
     * @param cred : Chunk
     */
    ChunkReceive,


    /**
     * Calls when client disconnects from the server
     */
    PlayerDisconnect,

}
