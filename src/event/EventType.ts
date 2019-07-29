export enum EventType {

    /**
     * Calls before LoginPacket is sent
     *
     * Arguments
     * @param cred : LoginCredentials
     */
    PlayerLoginRequest,

    /**
     * Calls when client disconnects from the server
     */
    PlayerDisconnect,

    /**
     * Calls when client receives PlayerStatusPacket with PLAYER_SPAWN status
     *
     * Status code can be found at InboundHandler#handlePlayStatus
     * @see ../InboundHandler#handlePlayStatus
     */
    LocalPlayerSpawn,


    /**
     * Calls when AddPlayerPacket is received
     *
     * Arguments
     * @param entityIdSelf : long
     * @param position : Vector3
     * @param speed : Vector3
     * @param rotation : Vector3       pitch, yaw, head yaw
     */
    PlayerAdd,

    /**
     * Calls when MovePlayerPacket is received
     */
    PlayerMove,

    /**
     * Calls when EntityRemovePacket is received
     */
    EntityRemove,


    /**
     * Calls when client receives a FullChunkDataPacket
     *
     * Arguments
     * @param cred : Chunk
     */
    ChunkReceive,



}
