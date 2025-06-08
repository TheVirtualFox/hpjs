import { Iterator, File, } from "file";
import config from "mc/config";


/*


class FileManager {
    root = null;
    constructor() {
        this.root = config.file.root;

        получить список пресетов
        активный пресетов
        дата включения пресета
        пресет по id
    }



    exists(fileName) {
        return File.exists(this.root + fileName);
    }

    saveJSON(fileName, f) {
        const file = new File(this.root + fileName, true);
        file.write(JSON.stringify(f));
        file.close();
    }

    getFile(fileName) {
        File.exists(this.root + fileName);
        const file = new File(this.root + fileName);
        const string = file.read(String);
        file.close();
        return string;
    }

    getJSON(fileName) {
        // File.exists(this.root + fileName);
        // const file = new File(this.root + fileName);
        // getFile(fileName);
        return JSON.parse(this.getFile(fileName));
    }

    deleteFile(fileName) {
        File.delete(this.root + fileName);
    }
}

export class PresetManager {
    //
    currentPreset = null;
    onCurrentPresetChanged = null;
    onPresetListChanged = null;

    presetsList = [];
    fileManager = null;

    constructor(onCurrentPresetChanged, onPresetListChanged) {
        this.fileManager = new FileManager();
        this.onCurrentPresetChanged = onCurrentPresetChanged;
        this.onPresetListChanged = onPresetListChanged;

    }

    getCurrentPresetId() {
        const presetsList = this.getPresetsList();
        const currentPreset = presetsList.find((p) => p.isActive);
        return currentPreset?.id || null;
    }

    getCurrentPreset() {
        const presetsList = this.getPresetsList();
        const currentPreset = presetsList.find((p) => p.isActive);
        return this.fileManager.getJSON(`${currentPreset.id}.json`);
    }

    setPresetList(presetsList) {
        this.fileManager.saveJSON("presetList.json", presetsList);
        // this.presetsList = presetsList;
        this.onPresetListChanged(presetsList);
    }

    setCurrentPreset({ id }) { // переименовать в toggle и добавить setCurrentPreset
        if (this.getCurrentPresetId() === id) {
            const currentPreset = null;
            const presetList = this.getPresetsList().map((p) => {
                p.isActive = false;
                delete p.activeTimestamp;
                return p;
            });
            this.setPresetList(presetList);
            this.onCurrentPresetChanged(currentPreset);
        } else {
            const presetList = this.getPresetsList().map((p) => {
                if (p?.id === id) {
                    p.isActive = true;
                    p.activeTimestamp = this.getTimestamp();
                } else {
                    p.isActive = false;
                    delete p.activeTimestamp;
                }

                return p;
            });
            this.setPresetList(presetList);
            const currentPreset = this.fileManager.getJSON(`${id}.json`);

            this.onCurrentPresetChanged(currentPreset);
        }
    }

    savePreset(preset) { // сохранить или обновить
        // проверить что есть id
        const savedPreset = this.getPresetsList().find(({ id }) => id === preset?.id);
        const isNew = !savedPreset;

        if (isNew) {
            preset.timestamp = this.getTimestamp();
            this.fileManager.saveJSON(preset.id, preset);
            const presetList = this.getPresetsList();
            presetList.push({
                id: preset.id,
                label: preset.label,
                timestamp: preset.timestamp,
                isActive: false,
            });
            this.setPresetList(presetList);
        } else {
            this.fileManager.deleteFile(`${preset.id}.json`);
            this.fileManager.saveJSON(`${preset.id}.json`, preset);
            const updated = this.getPresetsList().map((p) => p.id === preset?.id ? {
                id: preset.id,
                label: preset.label,
                timestamp: p.timestamp,
                isActive: p.isActive,
            } : p);
            this.setPresetList(updated);
            if (this.getCurrentPresetId() === savedPreset?.id) {
                // this.currentPreset = preset;
                // this.currentPreset.activeTimestamp = this.getTimestamp();
                this.onCurrentPresetChanged(preset);
            }
        }
    }

    getPresetsList() {
        if (this.fileManager.exists("presetList.json")) {
            return this.fileManager.getJSON('presetList.json');
        }

        return [];
        // return this.presetsList.map(({ label, timestamp, id }) => ({ isActive: id === this.getCurrentPreset()?.id, label, timestamp, id }));
    }

    getTimestamp() {
        const d = new Date();
        return Math.floor(d.getTime() / 1000);
    }

    getPreset({ id }) {
        return this.fileManager.getJSON(`${id}.json`);
    }

    deletePreset({ id }) {
        // проверка на удаление current
        const presetList = this.getPresetsList().filter((p) => {
            return p.id !== id;
        });
        this.setPresetList(presetList);
        this.fileManager.deleteFile(`${id}.json`);


        if (this.getCurrentPresetId() === id) {
            this.onCurrentPresetChanged(null);
        }

    }

    // setCurrentPreset(presetId) {
    //     ;
    // }
}
*/























const FILES = {
    presetList: "presetList.json",
    presetFile: (id) => `${id}.json`,
};

export class FileManager {
    root = null;

    constructor() {
        this.root = config.file.root;
    }

    exists(fileName) {
        return File.exists(this.root + fileName);
    }

    saveJSON(fileName, data) {






        this.deleteFile(fileName);
        const file = new File(this.root + fileName, true);
        file.write(JSON.stringify(data));
        file.close();
    }


    getFile(fileName) {
        const path = this.root + fileName;
        if (!File.exists(path)) return null;
        const file = new File(path);
        const content = file.read(String);
        file.close();
        return content;
    }

    getJSON(fileName) {
        try {
            const text = this.getFile(fileName);
            trace(`DEBUG: reading JSON file "${fileName}", content:\n${text}\n`);
            return text ? JSON.parse(text) : null;
        } catch (e) {
            trace(`Ошибка чтения JSON из "${fileName}": ${e}\n`);
            return null;
        }
    }

    deleteFile(fileName) {
        const path = this.root + fileName;
        if (File.exists(path)) {
            File.delete(path);
        }
    }

    listPresetFiles() {
        const listFiles = [];
        for (const item of (new Iterator(this.root))) {
            if (undefined === item.length) {
                trace(`${item.name.padEnd(32)} directory\n`);
            } else {
                trace(`${item.name.padEnd(32)} file          ${item.length} bytes\n`);
                item.name.endsWith('.json') && listFiles.push(item.name);
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

    constructor(onCurrentPresetChanged, onPresetListChanged) {
        this.fileManager = new FileManager();
        this.onCurrentPresetChanged = onCurrentPresetChanged;
        this.onPresetListChanged = onPresetListChanged;
    }

    getPresetsList() {
        return this.fileManager.getJSON(FILES.presetList) || [];
    }

    updatePresetList(list) {
        this.fileManager.saveJSON(FILES.presetList, list);
        this.onPresetListChanged?.(list);

        const activeId = list.find(p => p.isActive)?.id;
        if (!activeId) {
            this.setCurrentPreset(null);
        }
    }

    getCurrentPresetId() {
        const list = this.getPresetsList();
        return list.find(p => p.isActive)?.id || null;
    }

    getCurrentPreset() {
        return this._cachedCurrentPreset;
    }

    setCurrentPreset(preset) {
        this._cachedCurrentPreset = preset;
        this.onCurrentPresetChanged?.(preset);
    }

    /**
     * Активирует или сбрасывает активный пресет. 
     * @param {{ id: string }} presetInfo 
     * @param {number} timestamp 
     * @returns {boolean} - true если активирован, false если сброшен
     */
    togglePreset({ id }, timestamp) {
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

        this.updatePresetList(updatedList);

        const activePreset = isActivating
            ? this.fileManager.getJSON(FILES.presetFile(id))
            : null;

        this.setCurrentPreset(activePreset);

        return isActivating;
    }

    /**
     * Сохраняет или обновляет пресет
     * @param {object} preset 
     * @param {number} timestamp 
     */
    savePreset(preset, timestamp) {
        if (!preset?.id) return;

        const list = this.getPresetsList();
        const index = list.findIndex(p => p.id === preset.id);
        const isNew = index === -1;

        preset.timestamp = isNew ? timestamp : list[index].timestamp;

        this.fileManager.saveJSON(FILES.presetFile(preset.id), preset);

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

        this.updatePresetList(list);

        if (this.getCurrentPresetId() === preset.id) {
            this.setCurrentPreset(preset);
        }
    }

    deletePreset({ id }) {
        const currentId = this.getCurrentPresetId();
        const updatedList = this.getPresetsList().filter(p => p.id !== id);

        this.updatePresetList(updatedList);
        this.fileManager.deleteFile(FILES.presetFile(id));

        if (currentId === id) {
            this.setCurrentPreset(null);
        }
    }

    getPreset({ id }) {
        return this.fileManager.getJSON(FILES.presetFile(id));
    }

    resetPresets() {
        const allPresetFiles = this.fileManager.listPresetFiles();
        allPresetFiles.forEach((name) => this.fileManager.deleteFile(name));
        this.updatePresetList([]);
        this.setCurrentPreset(null);
    }
}

