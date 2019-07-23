import MinecraftClient from "./MinecraftClient";
import InboundHandler from "./network/InboundHandler";
import OutBoundHandler from "./network/OutBoundHandler";


class DefaultInboundHandler extends InboundHandler {

    constructor(client) {
        super(client);
    }


}

class DefaultOutboundHandler extends OutBoundHandler {

    constructor(client) {
        super(client);
    }



}


let client = new MinecraftClient(undefined, 19133);

// connect to server!
client.connect(
    new DefaultInboundHandler(client),
    new DefaultOutboundHandler(client)
);
