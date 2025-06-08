import { TimeManager } from "./TimeManager";
import { ControlPanel } from "./ControlPanel";
import { PresetManager } from "./PresetManager";
import { RelayManager } from "./RelayManager";
import { WebSocketManager } from "./WebSocketManager";
import Timer from "timer";


const CLIENT_ACTIONS = {

    // SET_TIME: 'SET_TIME',
    SAVE_PRESET_REQ: 'SAVE_PRESET_REQ',
    DELETE_PRESET_REQ: 'DELETE_PRESET_REQ',
    GET_PRESET_REQ: 'GET_PRESET_REQ',

    SET_CONTROL_PANEL_REQ: 'SET_CONTROL_PANEL_REQ',
    SET_CURRENT_PRESET_REQ: 'SET_CURRENT_PRESET_REQ',
    SET_TIMESTAMP_REQ: 'SET_TIMESTAMP_REQ',
    DELETE_ALL_PRESETS_REQ: 'DELETE_ALL_PRESETS_REQ'
}

const SERVER_ACTIONS = {
    SAVE_PRESET_RES: 'SAVE_PRESET_RES',
    PRESETS_LIST_CHANGED: 'PRESETS_LIST_CHANGED',
    GET_PRESET_RES: 'GET_PRESET_RES',
    DELETE_ALL_PRESETS_RES: 'DELETE_ALL_PRESETS_RES',

    SET_CURRENT_PRESET_RES: 'SET_CURRENT_PRESET_RES',
    CURRENT_PRESET_UPDATED: 'CURRENT_PRESET_UPDATED',
    DELETE_PRESET_RES: 'DELETE_PRESET_RES',

    SET_CONTROL_PANEL_RES: 'SET_CONTROL_PANEL_RES',
    CONTROL_PANEL_CHANGED: 'CONTROL_PANEL_CHANGED',

    SET_TIMESTAMP_RES: 'SET_TIMESTAMP_RES',
    TIMESTAMP_CHANGED: 'TIMESTAMP_CHANGED',
    RELAYS_STATE_UPDATED: 'RELAYS_STATE_UPDATED',
    MINUTE_UPDATE: 'MINUTE_UPDATE',
    CLIENT_CONNECTED: 'CLIENT_CONNECTED'
}

export class HydroponicManager {
    presetManager = null;
    relayManager = null;
    timeManager = null;
    webSocketManager = null;

    constructor() {
        this.timeManager = new TimeManager(this.onTimestampChanged.bind(this));
        this.webSocketManager = new WebSocketManager({ name: "hpserver" }, this.onClientConnected.bind(this), this.onRequest.bind(this));
        this.presetManager = new PresetManager(this.onCurrentPresetChanged.bind(this), this.onPresetListChanged.bind(this));
        // this.presetManager.setCurrentPreset(preset);
        this.presetManager.resetPresets();
        this.controlPanel = new ControlPanel(this.onControlPanelChanged.bind(this));
        this.relayManager = new RelayManager(this.onRelaysStateChanged.bind(this));
        // setInterval(this.onSecondChange.bind(this), 1000);
        const onSecondChange = this.onSecondChange.bind(this);
        Timer.repeat(onSecondChange, 1000);
    }

    onClientConnected(ws) {
        const message = {
            action: SERVER_ACTIONS.CLIENT_CONNECTED,
            payload: {
                currentPreset: this.presetManager.getCurrentPreset(),
                controlPanel: this.controlPanel.getState(),
                relaysState: this.relayManager.getState(),
                timestamp: this.timeManager.getTimestamp(),
                presetsList: this.presetManager.getPresetsList()
            }
        };
        // ws.write(JSON.stringify(message));
        this.webSocketRequest(ws, message);
    }

    webSocketRequest(ws, message) {
        ws.write(JSON.stringify(message));
    }
    webSocketBroadcast(message) {
        this.webSocketManager.broadcast(JSON.stringify(message));
    }

    onRequest({ ws, message }) {
        const { action, requestId, payload } = message;

        switch (action) {
            case CLIENT_ACTIONS.SAVE_PRESET_REQ:
                // const payload = {id: '', title: "", desc: "", pump: [], light: [], air: [], fan: [] };
                this.presetManager.savePreset(payload, this.timeManager.getTimestamp());
                this.webSocketRequest(ws, {
                    action: SERVER_ACTIONS.SAVE_PRESET_RES,
                    requestId,
                    payload,
                });
                break;
            case CLIENT_ACTIONS.SET_CURRENT_PRESET_REQ:
                // const payload = {id: ''};
                this.presetManager.togglePreset(payload, this.timeManager.getTimestamp());
                this.webSocketRequest(ws, {
                    action: SERVER_ACTIONS.SET_CURRENT_PRESET_RES,
                    requestId,
                    payload,
                });
                break;
            case CLIENT_ACTIONS.DELETE_PRESET_REQ:
                this.presetManager.deletePreset(payload);
                this.webSocketRequest(ws, {
                    action: SERVER_ACTIONS.DELETE_PRESET_RES,
                    requestId,
                    payload,
                });
                break;
            case CLIENT_ACTIONS.SET_CONTROL_PANEL_REQ:
                this.controlPanel.setControlPanelState(payload);
                // const payload = {isManualControl: false, pump: false, light: false, air: false, fan: false};
                this.webSocketRequest(ws, { // ?
                    action: SERVER_ACTIONS.SET_CONTROL_PANEL_RES,
                    requestId,
                    payload,
                });
                break;
            case CLIENT_ACTIONS.SET_TIMESTAMP_REQ:
                const { timestamp } = payload;
                this.timeManager.setTimestamp(timestamp);

                this.webSocketRequest(ws, { // ?
                    action: SERVER_ACTIONS.SET_TIMESTAMP_RES,
                    requestId,
                    payload,
                });
                break;
            case CLIENT_ACTIONS.GET_PRESET_REQ:
                this.webSocketRequest(ws, { // ?
                    action: SERVER_ACTIONS.GET_PRESET_RES,
                    requestId,
                    payload: this.presetManager.getPreset(payload)
                });
                break;
            case CLIENT_ACTIONS.DELETE_ALL_PRESETS_REQ:
                this.webSocketRequest(ws, { // ?
                    action: SERVER_ACTIONS.DELETE_ALL_PRESETS_RES,
                    requestId,
                    payload: this.presetManager.resetPresets(payload)
                });
                break;
            default:
                return this.webSocketRequest(ws, {
                    action: 'error',
                    requestId,
                    payload: { message: `Неизвестный тип запроса: ${action}` },
                });
        }
    }
    // при изменении списка пресетов
    onPresetListChanged(presets) {
        this.webSocketBroadcast({
            action: SERVER_ACTIONS.PRESETS_LIST_CHANGED,
            payload: presets, // новый список пресетов
        });
    }

    // и изменении текущего пресета
    onCurrentPresetChanged(preset) {
        // const secondsOfDay = this.timeManager.getSecondsOfDay();
        // console.log(secondsOfDay, 'обновление пресета', preset);
        this.webSocketBroadcast({
            action: SERVER_ACTIONS.CURRENT_PRESET_UPDATED,
            payload: preset,
        });
    }

    //  при изменения состояния панели управления
    onControlPanelChanged(controlPanel) {
        const { isManualControl, ...state } = controlPanel;
        // console.log("обновление панели управле", controlPanel);
        if (isManualControl) {
            this.relayManager.setState(state);
        }

        this.webSocketBroadcast({
            action: SERVER_ACTIONS.CONTROL_PANEL_CHANGED,
            payload: controlPanel, // новое состояние панели управления
        });
    }

    // при обновлении состояния реле
    onRelaysStateChanged(state) {
        // console.log("обновление реле", state);
        this.webSocketBroadcast({
            action: SERVER_ACTIONS.RELAYS_STATE_UPDATED,
            payload: state, // новый список пресетов
        });
    }

    // вызывается каждую минуту для оповещения клиентов
    onMinuteChanged(timestamp) {
        // console.log("обновление времени", timestamp);
        this.webSocketBroadcast({
            action: SERVER_ACTIONS.MINUTE_UPDATE,
            payload: { timestamp }, // новый список пресетов
        });
    }

    // было установленно новое значение времени
    onTimestampChanged(timestamp) { // обновление времени
        // console.log("обновление времени", timestamp);
        this.webSocketBroadcast({
            action: SERVER_ACTIONS.TIMESTAMP_CHANGED,
            payload: { timestamp }, // новое время
        });
    }

    // цикл по секундам для обновление реле и датчиков
    onSecondChange() {
        const secondsOfDay = this.timeManager.getSecondsOfDay();
        if (!this.controlPanel.getIsManualControl()) {
            this.relayManager.onTimeChange(secondsOfDay, this.presetManager.getCurrentPreset());
        }
        if (secondsOfDay % 60 === 0) {
            this.onMinuteChanged(this.timeManager.getTimestamp());
        }
        // this.timeManager.addSecondsOfDay();
    }
}