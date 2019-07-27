/**
 * The `entry.ts` file is only used by @webpejs/network for testing
 * purposes. It will not be exported as a module.
 */

import {MinecraftClient} from "./MinecraftClient";
import {InboundHandler} from "./network";
import {OutBoundHandler} from "./network";


class DefaultInboundHandler extends InboundHandler {

    constructor(client: MinecraftClient) {
        super(client);
    }


}

class DefaultOutboundHandler extends OutBoundHandler {

    constructor(client: MinecraftClient) {
        super(client);
    }



}


let client = new MinecraftClient(undefined, 19133);

// connect to server!
client.connect(
    new DefaultInboundHandler(client),
    new DefaultOutboundHandler(client)
);
