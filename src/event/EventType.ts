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
     * @param runtimeEntityId : long
     * @param location : PlayerLocation
     * @param speed : Vector3
     */
    PlayerAdd,

    /**
     * Calls when MovePlayerPacket is received
     *
     * Arguments
     * @param runtimeEntityId : long
     * @param location : PlayerLocation
     * @param mode : byte
     * @param onGround : boolean
     * @param otherRuntimeEntityId : long
     *
     * Mode constants can be found at InboundHandler#handleMovePlayer
     * @see ../InboundHandler#handleMovePlayer
     */
    PlayerMove,

    /**
     * Calls when MoveEntityPacket is received
     *
     * Arguments
     * @param runtimeEntityId : long
     * @param location : PlayerLocation
     * @param teleport : boolean
     * @param onGround : boolean
     */
    EntityMove,

    /**
     * Calls when EntityRemovePacket is received
     *
     * Arguments
     * @param entityUniqueID : long
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
