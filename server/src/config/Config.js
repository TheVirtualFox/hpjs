import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Config {
    constructor() {
        this.port = Number(process.env.PORT) || 3000;
        this.clientPath = process.env.CLIENT_PATH || path.join(__dirname, '../../../client/dist');
    }
    getClientPath() {
        return this.clientPath;
    }
}


export const config = new Config();