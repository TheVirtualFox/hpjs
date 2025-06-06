export class PresetManager {
    //
    currentPreset = null;
    onCurrentPresetChanged = null;
    onPresetListChanged = null;

    presetsList = [];

    constructor(onCurrentPresetChanged, onPresetListChanged) {
        this.onCurrentPresetChanged = onCurrentPresetChanged;
        this.onPresetListChanged = onPresetListChanged;
    }

    getCurrentPreset() {
        return this.currentPreset;
    }

    setPresetList(presetsList) {
        this.presetsList = presetsList;
        this.onPresetListChanged(this.getPresetsList());
    }

    setCurrentPreset({ id }) { // переименовать в toggle и добавить setCurrentPreset
        if (this.currentPreset?.id === id) {
            this.currentPreset = null;
        } else {
            const preset = this.presetsList.find((p) => p.id === id);
            this.currentPreset = preset;
            this.currentPreset.activeTimestamp = this.getTimestamp();
        }
        this.onCurrentPresetChanged(this.currentPreset);
        this.onPresetListChanged(this.getPresetsList());
    }

    savePreset(preset) { // сохранить или обновить
        const savedPreset = this.getPresetsList().find(({ id }) => id === preset?.id);
        const isNew = !savedPreset;
        preset.timestamp = this.getTimestamp();
        if (isNew) {
            this.setPresetList([...this.presetsList, preset]);
        } else {
            const updated = this.presetsList.map((p) => p.id === preset?.id ? preset : p);
            this.setPresetList(updated);
            if (this.getCurrentPreset()?.id === savedPreset?.id) {
                this.currentPreset = preset;
                this.currentPreset.activeTimestamp = this.getTimestamp();
                this.onCurrentPresetChanged(this.getCurrentPreset());
            }
        }
    }

    getPresetsList() {
        return this.presetsList.map(({ label, timestamp, id }) => ({ isActive: id === this.getCurrentPreset()?.id, label, timestamp, id }));
    }

    getTimestamp() {
        const d = new Date();
        return Math.floor(d.getTime() / 1000);
    }

    getPreset({ id }) {
        return this.presetsList.find(({ id: idid }) => idid === id);
    }

    deletePreset({ id }) {
        // проверка на удаление current
        if (this.getCurrentPreset()?.id === id) {
            this.currentPreset = null;
            this.onCurrentPresetChanged(null);
        }
        this.setPresetList(this.presetsList.filter(({ id: idid }) => id !== idid));
    }

    // setCurrentPreset(presetId) {
    //     ;
    // }
}