import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {config} from "../../config/Config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class HttpServerManager {
    constructor() {
        this.app = express();

        // API
        this.app.get('/api/status', (req, res) => {
            res.json({ ok: true, time: new Date() });
        });

        // SPA
        // const staticPath = path.join(__dirname, 'hpClient');
        const staticPath = config.getClientPath() ;
        this.app.use(express.static(staticPath ));
        this.app.use((req, res) => {
            res.sendFile(path.join(staticPath, 'index.html'));
        });

        return this.app;
    }
}