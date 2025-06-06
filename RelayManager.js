import { Relay } from './Relay';

export class RelayManager {
    pumpRelay = null;
    lightRelay = null;
    airRelay = null;
    fanRelay = null;

    onRelaysStateChanged = null;

    constructor(onRelaysStateChanged) {
        this.pumpRelay = new Relay('Насос', 1, false);
        this.lightRelay = new Relay('Свет', 2, false);
        this.airRelay = new Relay('Аэратор', 3, false);
        this.fanRelay = new Relay('Вентилятор', 4, false);
        this.onRelaysStateChanged = onRelaysStateChanged;
    }

    onPresetControl(secondsOfDay, currentPreset) {
        const pump = currentPreset?.pump.some(({ on, off }) => secondsOfDay >= on && secondsOfDay <= off);
        const light = currentPreset?.light.some(({ on, off }) => secondsOfDay >= on && secondsOfDay <= off);
        const air = currentPreset?.air.some(({ on, off }) => secondsOfDay >= on && secondsOfDay <= off);
        const fan = currentPreset?.fan.some(({ on, off }) => secondsOfDay >= on && secondsOfDay <= off);

        this.setState({ pump, light, air, fan });
    }

    onTimeChange(secondsOfDay, currentPreset) {
        this.onPresetControl(secondsOfDay, currentPreset);
    }

    getState() {
        return {
            pump: this.pumpRelay.getIsOn(),
            light: this.lightRelay.getIsOn(),
            air: this.airRelay.getIsOn(),
            fan: this.fanRelay.getIsOn(),
        };
    }

    setState({ pump, light, air, fan }) {
        const isPumpChanged = pump ? this.pumpRelay.on() : this.pumpRelay.off();
        const isLightChanged = light ? this.lightRelay.on() : this.lightRelay.off();
        const isAirChanged = air ? this.airRelay.on() : this.airRelay.off();
        const isFanChanged = fan ? this.fanRelay.on() : this.fanRelay.off();

        const isChanged = isPumpChanged || isLightChanged || isAirChanged || isFanChanged;
        if (isChanged) {
            this.onRelaysStateChanged(this.getState());
        }
    }
}