
export const ProtocolId = {

    // From MiNET
    // https://github.com/NiclasOlofsson/MiNET/blob/master/src/MiNET/MiNET/Net/MCPE%20Protocol%20Documentation.md

    Login: 0x01,
    PlayStatus: 0x02,
    ServerToClientHandshake: 0x03,
    ClientToServerHandshake: 0x04,
    Disconnect: 0x05,
    // ResourcePacksInfo: 0x06,
    // ResourcePackStack: 0x07,
    // ResourcePackClientResponse: 0x08,
    // Text: 0x09,
    // SetTime: 0x0a,          // 10
    // Start Game	0x0b	11
    // Add Player	0x0c	12
    // Add Entity	0x0d	13
    // Remove Entity	0x0e	14
    // Add Item Entity	0x0f	15
    // Take Item Entity	0x11	17
    // Move Entity	0x12	18
    // Move Player	0x13	19
    // Rider Jump	0x14	20
    // Update Block	0x15	21
    // Add Painting	0x16	22
    // Explode	0x17	23
    // Level Sound Event Old	0x18	24
    // Level Event	0x19	25
    // Block Event	0x1a	26
    // Entity Event	0x1b	27
    // Mob Effect	0x1c	28
    // Update Attributes	0x1d	29
    // Inventory Transaction	0x1e	30
    // Mob Equipment	0x1f	31
    // Mob Armor Equipment	0x20	32
    // Interact	0x21	33
    // Block Pick Request	0x22	34
    // Entity Pick Request	0x23	35
    // Player Action	0x24	36
    // Entity Fall	0x25	37
    // Hurt Armor	0x26	38
    // Set Entity Data	0x27	39
    // Set Entity Motion	0x28	40
    // Set Entity Link	0x29	41

    // Set Health	0x2a	42
    // Set Spawn Position	0x2b	43

    // Animate	0x2c	44

    // Respawn	0x2d	45

    // Container Open	0x2e	46
    // Container Close	0x2f	47
    // Player Hotbar	0x30	48
    // Inventory Content	0x31	49
    // Inventory Slot	0x32	50
    // Container Set Data	0x33	51
    // Crafting Data	0x34	52
    // Crafting Event	0x35	53
    // Gui Data Pick Item	0x36	54
    // Adventure Settings	0x37	55
    // Block Entity Data	0x38	56
    // Player Input	0x39	57
    // Full Chunk Data	0x3a	58

    // Set Commands Enabled	0x3b	59
    // Set Difficulty	0x3c	60
    // Change Dimension	0x3d	61
    // Set Player Game Type	0x3e	62
    // Player List	0x3f	63

    // Simple Event	0x40	64
    // Telemetry Event	0x41	65
    // Spawn Experience Orb	0x42	66
    // Clientbound Map Item Data	0x43	67
    // Map Info Request	0x44	68
    RequestChunkRadius: 0x45,       // 69
    ChunkRadiusUpdate: 0x46, //      70
    // Item Frame Drop Item	0x47	71
    // Game Rules Changed	0x48	72
    // Camera	0x49	73
    // Boss Event	0x4a	74
    // Show Credits	0x4b	75
    // Available Commands	0x4c	76
    // Command Request	0x4d	77
    // Command Block Update	0x4e	78
    // Command Output	0x4f	79
    // Update Trade	0x50	80
    // Update Equipment	0x51	81
    // Resource Pack Data Info	0x52	82
    // Resource Pack Chunk Data	0x53	83
    // Resource Pack Chunk Request	0x54	84
    Transfer: 0x55, //      85
    // Play Sound	0x56	86
    // Stop Sound	0x57	87
    // Set Title	0x58	88
    // Add Behavior Tree	0x59	89
    // Structure Block Update	0x5a	90
    // Show Store Offer	0x5b	91
    // Purchase Receipt	0x5c	92
    // Player Skin	0x5d	93
    // Sub Client Login	0x5e	94
    // Initiate Web Socket Connection	0x5f	95
    // Set Last Hurt By	0x60	96
    // Book Edit	0x61	97
    // Npc Request	0x62	98
    // Photo Transfer	0x63	99
    // Modal Form Request	0x64	100
    // Modal Form Response	0x65	101
    // Server Settings Request	0x66	102
    // Server Settings Response	0x67	103
    // Show Profile	0x68	104
    SetDefaultGameType: 0x69,        // 105
    // Remove Objective	0x6a	106
    // Set Display Objective	0x6b	107
    // Set Score	0x6c	108
    // Lab Table	0x6d	109
    // Update Block Synced	0x6e	110
    // Move Entity Delta	0x6f	111
    // Set Scoreboard Identity Packet	0x70	112
    // Set Local Player As Initialized Packet	0x71	113
    // Update Soft Enum Packet	0x72	114
    // Network Stack Latency Packet	0x73	115
    // Script Custom Event Packet	0x75	117
    // Spawn Particle Effect	0x76	118
    // Available Entity Identifiers	0x77	119
    // Level Sound Event V2	0x78	120
    // Network Chunk Publisher Update	0x79	121
    // Biome Definition List	0x7a	122
    // Level Sound Event	0x7b	123
};
