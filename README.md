# WebPE.Js

### What is this? 
This is an implementation of the Minecraft: Bedrock Edition network protocol in Javascript. 
This package is intended to work on browsers with WebSocket communications built in. 

Keep in mind, this can __not__ *directly* connect to any Minecraft: Bedrock Edition servers because browsers do not 
support UDP (RakNet to be specific) connections. 


### What is this for? 
This is the network layer of the WebPE project, where it aims to connect to Minecraft Bedrock Edition servers 
through a proxy or a server side plugin. 


### Development

##### TODOs

- [ ] Decode FullChunkDataPacket
- [ ] NBT library
- [ ] Handshake sequence; ping server etc
- [ ] Use workers for websocket and chunk loading


##### Dependencies

| Package | Description/Usage |
|:--------|------:|
| base64-url | base64 encode for login packet |
| buffer | Packet serialization & deserialization |
| long | long datatype support |
| node-jose | Not used; encryption support |
| pako | zlib library |
| uuid | Not used yet; UUID |
