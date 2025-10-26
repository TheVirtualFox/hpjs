import fs from 'fs';
import path from 'path';

const FILES = {
    presetList: "presetList.json",
    presetFile: (id) => `${id}.json`,
};

export class FileManager {
    root = null;

    constructor() {
        this.root = path.resolve('./data');  // Путь к каталогу с файлами (можно настроить)
    }

    async exists(fileName) {
        try {
            await fs.promises.access(path.join(this.root, fileName));
            return true;
        } catch (e) {
            return false;
        }
    }

    async saveJSON(fileName, data) {
        await this.deleteFile(fileName);
        const filePath = path.join(this.root, fileName);
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    async getFile(fileName) {
        const filePath = path.join(this.root, fileName);
        if (!await this.exists(fileName)) return null;
        return await fs.promises.readFile(filePath, 'utf-8');
    }

    async getFileOrCreate(fileName, defaultContent = '') {
        const filePath = path.join(this.root, fileName);

        // Проверяем, существует ли файл
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
        } catch {
            // Если не существует — создаём с дефолтным содержимым
            await fs.promises.writeFile(filePath, defaultContent, 'utf-8');
        }

        // Читаем и возвращаем содержимое
        return await fs.promises.readFile(filePath, 'utf-8');
    }

    getFileOrCreateSync(fileName, defaultContent = '') {
        const filePath = path.join(this.root, fileName);

        // Проверяем, существует ли файл
        if (!fs.existsSync(filePath)) {
            // Если не существует — создаём с дефолтным содержимым
            fs.writeFileSync(filePath, defaultContent, 'utf-8');
        }

        // Читаем и возвращаем содержимое
        return fs.readFileSync(filePath, 'utf-8');
    }

    async getJSON(fileName) {
        try {
            const text = await this.getFile(fileName);
            console.debug(`DEBUG: reading JSON file "${fileName}", content:\n${text}\n`);
            return text ? JSON.parse(text) : null;
        } catch (e) {
            console.error(`Ошибка чтения JSON из "${fileName}": ${e}`);
            return null;
        }
    }

    async deleteFile(fileName) {
        const filePath = path.join(this.root, fileName);
        if (await this.exists(fileName)) {
            await fs.promises.unlink(filePath);
        }
    }

    async listPresetFiles() {
        const listFiles = [];
        const files = await fs.promises.readdir(this.root);

        for (const file of files) {
            const filePath = path.join(this.root, file);
            const stats = await fs.promises.stat(filePath);
            if (stats.isFile() && file.endsWith('.json')) {
                console.log(`${file.padEnd(32)} file          ${stats.size} bytes`);
                listFiles.push(file);
            } else if (stats.isDirectory()) {
                console.log(`${file.padEnd(32)} directory`);
            }
        }

        return listFiles;
    }
}

export class PresetManager {
    onCurrentPresetChanged = null;
    onPresetListChanged = null;
    fileManager = null;

    _cachedCurrentPreset = null;
    _cachedPresetList = null;

    constructor(onCurrentPresetChanged, onPresetListChanged) {
        this.fileManager = new FileManager();
        this.onCurrentPresetChanged = onCurrentPresetChanged;
        this.onPresetListChanged = onPresetListChanged;

        // Загрузка списка пресетов в кеш
        this._cachedPresetList = JSON.parse(this.fileManager.getFileOrCreateSync(FILES.presetList, '[]'));

        // Устанавливаем текущий пресет
        const activeId = this.getCurrentPresetId();
        if (activeId) {
            const activePreset = this.fileManager.getJSON(FILES.presetFile(activeId));
            this.setCurrentPreset(activePreset);
        }
    }

    getPresetsList() {
        return this._cachedPresetList;
    }

    async updatePresetList(list) {
        this._cachedPresetList = list;
        await this.fileManager.saveJSON(FILES.presetList, list);
        this.onPresetListChanged?.(list);

        const activeId = list.find(p => p.isActive)?.id;
        if (!activeId) {
            this.setCurrentPreset(null);
        }
    }

    getCurrentPresetId() {
        const list = this.getPresetsList()
        return list?.find(p => p.isActive)?.id || null;
    }

    getCurrentPreset() {
        return this._cachedCurrentPreset;
    }

    setCurrentPreset(preset) {
        this._cachedCurrentPreset = preset;
        this.onCurrentPresetChanged?.(preset);
    }

    async togglePreset({ id }, timestamp) {
        const currentId = this.getCurrentPresetId();
        const isActivating = currentId !== id;

        const updatedList = this.getPresetsList().map((p) => {
            if (p.id === id) {
                p.isActive = isActivating;
                if (isActivating) {
                    p.activeTimestamp = timestamp;
                } else {
                    delete p.activeTimestamp;
                }
            } else {
                p.isActive = false;
                delete p.activeTimestamp;
            }
            return p;
        });

        await this.updatePresetList(updatedList);

        const activePreset = isActivating
            ? await this.fileManager.getJSON(FILES.presetFile(id))
            : null;

        this.setCurrentPreset(activePreset);

        return isActivating;
    }

    async savePreset(preset, timestamp) {
        if (!preset?.id) return;

        const list = this.getPresetsList();
        const index = list.findIndex(p => p.id === preset.id);
        const isNew = index === -1;

        preset.timestamp = isNew ? timestamp : list[index].timestamp;

        await this.fileManager.saveJSON(FILES.presetFile(preset.id), preset);

        if (isNew) {
            list.push({
                id: preset.id,
                label: preset.label,
                timestamp: preset.timestamp,
                isActive: false,
            });
        } else {
            list[index].label = preset.label;
        }

        await this.updatePresetList(list);

        if (this.getCurrentPresetId() === preset.id) {
            this.setCurrentPreset(preset);
        }
    }

    async deletePreset({ id }) {
        const currentId = this.getCurrentPresetId();
        const updatedList = this.getPresetsList().filter(p => p.id !== id);

        await this.updatePresetList(updatedList);
        await this.fileManager.deleteFile(FILES.presetFile(id));

        if (currentId === id) {
            this.setCurrentPreset(null);
        }
    }

    async getPreset({ id }) {
        return await this.fileManager.getJSON(FILES.presetFile(id));
    }

    async resetPresets() {
        const allPresetFiles = await this.fileManager.listPresetFiles();
        for (const name of allPresetFiles) {
            await this.fileManager.deleteFile(name);
        }
        await this.updatePresetList([]);
        this.setCurrentPreset(null);
    }
}
