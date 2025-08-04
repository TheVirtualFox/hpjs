import Timer from "timer";
import WiFi from "wifi";
import { Server } from "websocket"
import Net from "net"
import MDNS from "mdns";

const HTML_TITLE = "Set SSID";
const AP_NAME = "myAccessPointHP";
const AP_PASSWORD = "12345678";


export class WebSocketManager {
    clients = [];
    onWebSocketRequest = null;
    onConnection = null;

    constructor(dict, onConnection, onWebSocketRequest) {
        this.dict = dict;
        this.onConnection = onConnection;
        this.onWebSocketRequest = onWebSocketRequest;
        this.configAP();
    }

    advertiseServer() {
        trace(`advertiseServer ${this.dict.name}\n`);
        this.mdns = new MDNS({ hostName: this.dict.name }, function (message, value) {
            if (1 === message) {
                if ('' != value && undefined !== this.owner) {
                    this.owner.dict.name = value;
                }
            }
        });
        this.mdns.owner = this;
    }

    configServer() {
        trace(`configServer\n`);
        // this.head = `<html><head><title>${HTML_TITLE}</title>777</head>`;

        this.apServer = new Server();
        const self = this;
        this.apServer.callback = function (message, value) {
            switch (message) {
                case Server.connect:
                    trace("main.js: socket connect.\n");

                    break;

                case Server.handshake:
                    trace("main.js: websocket handshake success\n");
                    self.clients.push(this);
                    self.onConnection(this);
                    break;

                case Server.receive:
                    trace(`main.js: websocket message received: ${value}\n`);
                    // this.write(value);		// echo


                    let message;
                    try {
                        message = JSON.parse(value);
                    } catch (err) {
                        return this.write({
                            action: 'error',
                            requestId: null,
                            payload: { message: 'Неверный JSON' },
                        });
                    }

                    const { action, requestId, payload } = message;

                    if (!action || !requestId) {
                        return this.write({
                            type: 'error',
                            requestId: requestId ?? null,
                            payload,
                        });
                    }

                    self.onWebSocketRequest({ ws: this, message });

                    break;

                case Server.disconnect:
                    trace("main.js: websocket close\n");
                    self.clients = self.clients.filter((c) => c !== this);
                    break;
            }
        }
        // this.apServer.owner = this;

        this.advertiseServer();
    }


    onMessage() {

    }

    unconfigServer() {
        this.mdns?.close();
        delete this.mdns;

        this.apServer?.close();
        delete this.apServer;
    }

    configAP() {
        trace(`configAP\n`);
        WiFi.accessPoint({
            ssid: AP_NAME,
            password: AP_PASSWORD
        });
        this.configServer();
    }

    broadcast(message) {

        this.clients = this.clients.filter((client) => {
            try {
                if (client?.write && client.state === 3) {
                    client.write(message);
                    return true; // оставить в списке
                }
            } catch (e) {
                trace(`Ошибка при отправке клиенту: ${e}\n`);
            }
            return false; // удалить клиента
        });


        // try {
        //     for (const client of this.clients) {
        //         if (client && typeof client.write === 'function' && client.state === 3) {
        //             client.write(message);
        //         } else {
        //             trace(`Невалидный клиент в broadcast: ${client}\n`);
        //         }
        //     }
        // } catch (e) {
        //     trace(JSON.stringify(client));
        // }
    }
}












function restart() @"do_restart";

function doRestart() {
    trace(`restarting in 1 second.\n`);
    Timer.delay(1000);
    restart();
}