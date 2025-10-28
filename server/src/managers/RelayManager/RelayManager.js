import { Relay } from './Relay.js';

export class RelayManager {
    pumpRelay = null;
    lightRelay = null;
    airRelay = null;
    fanRelay = null;

    onRelaysStateChanged = null;

    constructor(onRelaysStateChanged) {
        this.pumpRelay = new Relay('Насос', 354, false); // 8 // pl02
        this.lightRelay = new Relay('Свет', 355, false); // 10 // pl03
        this.airRelay = new Relay('Аэратор', 114, false); // 12 // pd18
        this.fanRelay = new Relay('Вентилятор', 111, false); // 16 // pd15
        this.onRelaysStateChanged = onRelaysStateChanged;
    }

    onPresetControl(secondsOfDay, currentPreset) {
        const some = ({ on, off }) => {
            const timeOffset = Number((currentPreset?.timeOffset || 0) * 60);
            return secondsOfDay >= on + timeOffset && secondsOfDay <= off + timeOffset;
        }
        const pump = currentPreset?.pump?.some(some);
        const light = currentPreset?.light?.some(some);
        const air = currentPreset?.air?.some(some);
        const fan = currentPreset?.fan?.some(some);

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