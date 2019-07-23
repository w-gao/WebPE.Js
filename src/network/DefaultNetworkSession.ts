import MinecraftClient from "../MinecraftClient";
import NetworkSession from "./NetworkSession";

export default class DefaultNetworkSession extends NetworkSession {

    constructor(client: MinecraftClient) {
        super(client);
    }


}
