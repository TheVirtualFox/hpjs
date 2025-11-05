import { readFileSync } from "fs";

export class W1Sensor {
    deviceId = null;

    constructor(deviceId) {
        this.deviceId = deviceId;
        this.devicePath = `/sys/bus/w1/devices/${deviceId}/w1_slave`;
    }

    readRaw() {
        try {
            return readFileSync(this.devicePath, "utf8").trim();
        } catch (err) {
            console.error(`❌ Ошибка чтения ${this.devicePath}:`, err.message);
            return null;
        }
    }

    parseTemperature(rawData) {
        if (!rawData) return null;

        const lines = rawData.split("\n");
        if (lines.length < 2 || !lines[0].includes("YES")) {
            console.warn(`⚠️ Ошибка CRC у датчика ${this.deviceId}`);
            return null;
        }

        const match = lines[1].match(/t=(-?\d+)/);
        if (!match) {
            console.warn(`⚠️ Не удалось извлечь температуру из данных ${this.deviceId}`);
            return null;
        }

        return parseInt(match[1]) / 1000; // °C
    }

    readTemperature() {
        const raw = this.readRaw();
        const temp = this.parseTemperature(raw);
        if (temp !== null) {
            console.log(`🌡 ${this.deviceId}: ${temp.toFixed(3)} °C`);
        }
        return temp;
    }
}
