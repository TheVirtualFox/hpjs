import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export class DBManager {
    constructor() {
        const dbDir = path.resolve("./data");
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        const dbPath = path.join(dbDir, "presets.db");
        this.db = new Database(dbPath);

        this.db.pragma("journal_mode = WAL"); // ускоряет запись, повышает надежность

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS presets (
                id TEXT PRIMARY KEY,
                label TEXT,
                timestamp INTEGER,
                isActive INTEGER DEFAULT 0,
                content TEXT
            );
        `);
    }

    /** Получить список всех пресетов */
    getPresetsList() {
        return this.db
            .prepare("SELECT id, label, timestamp, isActive FROM presets ORDER BY timestamp DESC")
            .all();
    }

    /** Получить активный пресет */
    getActivePreset() {
        const row = this.db.prepare("SELECT content FROM presets WHERE isActive = 1").get();
        return row ? JSON.parse(row.content) : null;
    }

    /** Получить пресет по ID */
    getPreset(id) {
        const row = this.db.prepare("SELECT content FROM presets WHERE id = ?").get(id);
        return row ? JSON.parse(row.content) : null;
    }

    /** Сохранить или обновить пресет */
    savePreset(preset, timestamp) {
        const jsonContent = JSON.stringify(preset);
        this.db.prepare(`
            INSERT INTO presets (id, label, timestamp, content)
            VALUES (@id, @label, @timestamp, @content)
            ON CONFLICT(id) DO UPDATE SET
              label = excluded.label,
              content = excluded.content
        `).run({
            id: preset.id,
            label: preset.label,
            timestamp,
            content: jsonContent,
        });
    }

    /** Удалить пресет */
    deletePreset(id) {
        this.db.prepare("DELETE FROM presets WHERE id = ?").run(id);
    }

    deactivatePreset() {
        this.db.prepare("UPDATE presets SET isActive = 0").run();
    }

    /** Активировать пресет */
    activatePreset(id, timestamp) {
        this.db.prepare("UPDATE presets SET isActive = 0").run();
        this.db.prepare("UPDATE presets SET isActive = 1, timestamp = ? WHERE id = ?").run(timestamp, id);
    }



    /** Сбросить всё */
    resetPresets() {
        this.db.prepare("DELETE FROM presets").run();
    }
}
