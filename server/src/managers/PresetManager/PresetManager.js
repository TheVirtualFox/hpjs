import { DBManager } from "../DBManager/DBManager.js";

export class PresetManager {
    onCurrentPresetChanged = null;
    onPresetListChanged = null;
    db = null;

    constructor(onCurrentPresetChanged, onPresetListChanged) {
        this.db = new DBManager();
        this.onCurrentPresetChanged = onCurrentPresetChanged;
        this.onPresetListChanged = onPresetListChanged;
    }

    getPresetsList() {
        return this.db.getPresetsList();
    }

    getCurrentPreset() {
        return this.db.getActivePreset();
    }

    setCurrentPreset(preset) {
        this.onCurrentPresetChanged?.(preset);
    }

    async togglePreset({ id }, timestamp) {
        const active = this.getCurrentPreset();
        const isActivating = !active || active.id !== id;

        if (isActivating) {
            this.db.activatePreset(id, timestamp);
        } else {
            this.db.prepare("UPDATE presets SET isActive = 0").run();
        }

        const newPreset = isActivating ? this.db.getPreset(id) : null;
        this.setCurrentPreset(newPreset);
        this.onPresetListChanged?.(this.getPresetsList());

        return isActivating;
    }

    async savePreset(preset, timestamp) {
        if (!preset?.id) return;
        this.db.savePreset(preset, timestamp);
        this.onPresetListChanged?.(this.getPresetsList());

        const current = this.getCurrentPreset();
        if (current?.id === preset.id) {
            this.setCurrentPreset(preset);
        }
    }

    async deletePreset({ id }) {
        const current = this.getCurrentPreset();
        this.db.deletePreset(id);
        this.onPresetListChanged?.(this.getPresetsList());


        if (current?.id === id) {
            this.setCurrentPreset(null);
        }
    }

    async getPreset({ id }) {
        return this.db.getPreset(id);
    }

    async resetPresets() {
        this.db.resetPresets();
        this.onPresetListChanged?.([]);
        this.setCurrentPreset(null);
    }
}
