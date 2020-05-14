/**
 * Handle communication between the WebSocket client and the Proxy.
 *
 * String channels of the WebSocket is used for Web to Proxy communication.
 *
 * @author William Gao
 */
import {MinecraftClient} from "../MinecraftClient";

export enum ProxyProtocolId {

    /**
     * cReq;address;port;protocol
     *
     * C -> S
     */
    ConnectionRequest = "cReq",

    /**
     * cRes;status
     */
    ConnectionResponse = "cRes",

    /**
     * sLogin;username
     *
     * C -> S
     */
    SendLogin = "sLogin",

    /**
     * trans;address;port
     * S -> C
     */
    Transfer = "trans",

}

export default class ProxyClient {

    private mcClient: MinecraftClient;

    constructor(mcClient: MinecraftClient) {

        this.mcClient = mcClient;
    }

    public handleMessage(data: string) {

        console.log('[Proxy] onMessage');

        let payload = data.split(";");
        switch (payload[0]) {
            case ProxyProtocolId.ConnectionResponse:
                this.handleConnectionResponse(payload);
                break;
        }

    }


    /**
     * Request connection to the target Minecraft server.
     */
    public sendConnectionRequest(host: string, port: number) {

        this.sendMessage(ProxyProtocolId.ConnectionRequest, `${host};${port}`)
    }

    /**
     * Request Proxy to send Login information on the clients' behave.
     */
    public sendLogin(username: string) {

        this.sendMessage(ProxyProtocolId.SendLogin, username)
    }

    private handleConnectionResponse(payload: string[]) {

        if (payload.length < 2) {
            console.log('Invalid ConnectionResponse');
            return;
        }

        console.log(payload);

        if (payload[1] === "error") {
            console.log('[Proxy] Error received from proxy: ' + payload[2]);

            // ? no need to disconnect from proxy
            this.mcClient.disconnect();
            return;
        }

        console.log('[Proxy] Successfully connected to Bedrock server.')
        this.mcClient.onConnect();
    }

    private sendMessage(packetId: ProxyProtocolId, payload: string) {

        this.mcClient.sendPacket(`${packetId};${payload}`);
    }
}
