import { createServer } from 'http';
import { HttpServerManager } from './HttpServerManager.js';
import { WebSocketManager } from './WebSocketManager.js';

export class Server {
    webSocketManager = null;
    constructor(onConnection, onWebSocketRequest) {
        const app = new HttpServerManager();
        const server = createServer(app);

        this.webSocketManager = new WebSocketManager(server, onConnection, onWebSocketRequest);
        server.listen(8080, () => console.log('Server on http://localhost:8080'));
    }

    getWebSocketManager() {
        return this.webSocketManager;
    }
}
