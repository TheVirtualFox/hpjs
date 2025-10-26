import {WebSocketServer} from 'ws'; // Изменение импорта на WebSocketServer

export class WebSocketManager {
    clients = [];
    onWebSocketRequest = null;
    onConnection = null;

    constructor(server, onConnection, onWebSocketRequest) {
        this.onConnection = onConnection;
        this.onWebSocketRequest = onWebSocketRequest;
        this.configServer(server);
    }

    configServer(server) {
        const self = this;
        // Создаем WebSocket сервер без 'noServer'
        const wss = new WebSocketServer({ server });

        wss.on('connection', (ws) => {
            console.log('Client connected');
            self.clients.push(ws);
            self.onConnection(ws);

            ws.on('message', async (message) => {
                console.log(`Received message: ${message}`);
                let parsedMessage;
                try {
                    parsedMessage = JSON.parse(message);
                } catch (err) {
                    return ws.send(JSON.stringify({
                        action: 'error',
                        requestId: null,
                        payload: { message: 'Invalid JSON' },
                    }));
                }

                const { action, requestId, payload } = parsedMessage;

                if (!action || !requestId) {
                    return ws.send(JSON.stringify({
                        type: 'error',
                        requestId: requestId ?? null,
                        payload,
                    }));
                }

                await self.onWebSocketRequest({ ws, message: parsedMessage });
            });

            ws.on('close', () => {
                console.log('Client disconnected');
                self.clients = self.clients.filter(client => client !== ws);
            });
        });
        //
        // server.listen(8080, () => {
        //     console.log('WebSocket server running on ws://localhost:8080');
        // });
    }

    broadcast(message) {
        this.clients = this.clients.filter((client) => {
            try {
                if (client.readyState === 1) {
                    client.send(message);
                    return true;
                }
            } catch (e) {
                console.error(`Error sending message to client: ${e}`);
            }
            return false;
        });
    }
}
