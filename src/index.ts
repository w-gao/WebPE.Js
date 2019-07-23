import MinecraftClient from "./MinecraftClient";
import DefaultNetworkSession from "./network/DefaultNetworkSession";

let client = new MinecraftClient(undefined, 19133);
client.connect(
    new DefaultNetworkSession(client)
);
