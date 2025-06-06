export class ControlPanel {
    isManualControl = false;
    isPumpOn = false;
    isLightOn = false;
    isAirOn = false;
    isFanOn = false;
    onControlPanelStateChanged = null;
    constructor(onControlPanelStateChanged) {
        this.onControlPanelStateChanged = onControlPanelStateChanged;
    }

    setControlPanelState(state) {
        let isChanged = false;
        if (this.isManualControl !== state.isManualControl) {
            isChanged = true;
        }
        this.isManualControl = state.isManualControl;
        if (!this.isManualControl) {
            if (this.isPumpOn || this.isLightOn || this.isAirOn || this.isFanOn) {
                isChanged = true;
            }

            this.isPumpOn = false;
            this.isLightOn = false;
            this.isAirOn = false;
            this.isFanOn = false;
        } else {
            if (typeof state.pump !== 'undefined') {
                if (this.isPumpOn !== state.pump) { isChanged = true; }
                this.isPumpOn = state.pump;
            }
            if (typeof state.light !== 'undefined') {
                if (this.isLightOn !== state.light) { isChanged = true; }
                this.isLightOn = state.light;
            }
            if (typeof state.air !== 'undefined') {
                if (this.isAirOn !== state.air) {
                    isChanged = true;
                }
                this.isAirOn = state.air;
            }
            if (typeof state.fan !== 'undefined') {
                if (this.isFanOn !== state.fan) {
                    isChanged = true;
                }
                this.isFanOn = state.fan;
            }
        }
        if (isChanged) {
            this.onControlPanelStateChanged(this.getState());
        }
    }

    getIsManualControl() {
        return this.isManualControl;
    }

    getState() {
        return {
            isManualControl: this.isManualControl,
            pump: this.isPumpOn,
            light: this.isLightOn,
            air: this.isAirOn,
            fan: this.isFanOn
        };
    }
}