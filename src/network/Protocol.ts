
export const ProtocolId = {

    // From MiNET
    // https://github.com/NiclasOlofsson/MiNET/blob/master/src/MiNET/MiNET/Net/MCPE%20Protocol%20Documentation.md

    Login: 0x01,
    PlayStatus: 0x02,
    ServerToClientHandshake: 0x03,
    ClientToServerHandshake: 0x04,
    Disconnect: 0x05,
    ResourcePacksInfo: 0x06,
    ResourcePackStack: 0x07,
    ResourcePackClientResponse: 0x08,
    Text: 0x09,
    SetTime: 0x0a,                          // 10
    StartGame: 0x0b,                        // 11
    AddPlayer: 0x0c,                        // 12
    AddEntity: 0x0d,                        // 13
    RemoveEntity: 0x0e,                     // 14       // todo
    AddItemEntity: 0x0f,                    // 15

    TakeItemEntity: 0x11,                   // 17
    MoveEntity: 0x12,                       // 18
    MovePlayer: 0x13,                       // 19       // todo
    RiderJump: 0x14,                        // 20
    UpdateBlock: 0x15,                      // 21       // todo
    AddPainting: 0x16,                      // 22
    Explode: 0x17,                          // 23
    // LevelSoundEventOld: 0x18,            // 24
    LevelEvent: 0x19,                       // 25
    BlockEvent: 0x1a,                       // 26       // todo
    EntityEvent: 0x1b,                      // 27
    MobEffect: 0x1c,                        // 28
    UpdateAttributes: 0x1d,                 // 29
    InventoryTransaction: 0x1e,             // 30
    MobEquipment: 0x1f,                     // 31

    MobArmorEquipment: 0x20,                // 32
    Interact: 0x21,                         // 33
    BlockPickRequest: 0x22,                 // 34
    EntityPickRequest: 0x23,                // 35
    PlayerAction: 0x24,                     // 36
    EntityFall: 0x25,                       // 37
    HurtArmor: 0x26,                        // 38
    SetEntityData: 0x27,                    // 39
    SetEntityMotion: 0x28,                  // 40
    SetEntityLink: 0x29,                    // 41
    SetHealth: 0x2a,                        // 42
    SetSpawnPosition: 0x2b,                 // 43
    Animate: 0x2c,                          // 44
    Respawn: 0x2d,                          // 45       // todo
    ContainerOpen: 0x2e,                    // 46
    ContainerClose: 0x2f,                   // 47

    PlayerHotbar: 0x30,                     // 48
    InventoryContent: 0x31,                 // 49
    InventorySlot: 0x32,                    // 50
    ContainerSetData: 0x33,                 // 51
    CraftingData: 0x34,                     // 52
    CraftingEvent: 0x35,                    // 53
    GuiDataPickItem: 0x36,                  // 54
    AdventureSettings: 0x37,                // 55
    BlockEntityData: 0x38,                  // 56
    PlayerInput: 0x39,                      // 57
    FullChunkData: 0x3a,                    // 58
    SetCommandsEnabled: 0x3b,               // 59
    SetDifficulty: 0x3c,                    // 60
    ChangeDimension: 0x3d,                  // 61
    SetPlayerGameType: 0x3e,                // 62
    PlayerList: 0x3f,                       // 63

    SimpleEvent: 0x40,                      // 64
    TelemetryEvent: 0x41,                   // 65
    SpawnExperienceOrb: 0x42,               // 66
    ClientboundMapItemData: 0x43,           // 67
    MapInfoRequest: 0x44,                   // 68
    RequestChunkRadius: 0x45,               // 69
    ChunkRadiusUpdate: 0x46,                // 70
    ItemFrameDropItem: 0x47,                // 71
    GameRulesChanged: 0x48,                 // 72
    Camera: 0x49,                           // 73
    BossEvent: 0x4a,                        // 74
    ShowCredits: 0x4b,                      // 75
    AvailableCommands: 0x4c,                // 76
    CommandRequest: 0x4d,                   // 77
    CommandBlockUpdate: 0x4e,               // 78
    CommandOutput: 0x4f,                    // 79

    UpdateTrade: 0x50,                      // 80
    UpdateEquipment: 0x51,                  // 81
    ResourcePackDataInfo: 0x52,             // 82
    ResourcePackChunkData: 0x53,            // 83
    ResourcePackChunkRequest: 0x54,         // 84
    Transfer: 0x55,                         // 85
    PlaySound: 0x56,                        // 86
    StopSound: 0x57,                        // 87
    SetTitle: 0x58,                         // 88
    AddBehaviorTree: 0x59,                  // 89
    StructureBlockUpdate: 0x5a,             // 90
    ShowStoreOffer: 0x5b,                   // 91
    PurchaseReceipt: 0x5c,                  // 92
    PlayerSkin: 0x5d,                       // 93
    SubClientLogin: 0x5e,                   // 94
    InitiateWebSocketConnection: 0x5f,      // 95

    SetLastHurtBy: 0x60,                    // 96
    BookEdit: 0x61,                         // 97
    NpcRequest: 0x62,                       // 98
    PhotoTransfer: 0x63,                    // 99
    ModalFormRequest: 0x64,                 // 100
    ModalFormResponse: 0x65,                // 101
    ServerSettingsRequest: 0x66,            // 102
    ServerSettingsResponse: 0x67,           // 103
    ShowProfile: 0x68,                      // 104
    SetDefaultGameType: 0x69,               // 105
    RemoveObjective: 0x6a,                  // 106
    SetDisplayObjective: 0x6b,              // 107
    SetScore: 0x6c,                         // 108
    LabTable: 0x6d,                         // 109
    UpdateBlockSynced: 0x6e,                // 110
    MoveEntityDelta: 0x6f,                  // 111

    SetScoreboardIdentityPacket: 0x70,          // 112
    SetLocalPlayerAsInitializedPacket: 0x71,    // 113
    UpdateSoftEnumPacket: 0x72,                 // 114
    NetworkStackLatencyPacket: 0x73,            // 115
    ScriptCustomEventPacket: 0x75,              // 117
    SpawnParticleEffect: 0x76,                  // 118
    AvailableEntityIdentifiers: 0x77,           // 119
    LevelSoundEventV2: 0x78,                    // 120
    NetworkChunkPublisherUpdate: 0x79,          // 121
    BiomeDefinitionList: 0x7a,                  // 122
    LevelSoundEvent: 0x7b,                      // 123
};
