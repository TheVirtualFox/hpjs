export class Relay {
    pin = null;
    isOn = false;
    label = null;

    constructor(label, pin, isOn) {
        this.pin = pin;
        this.isOn = isOn;
        this.label = label;
    }

    on() {
        if (this.isOn) {
            return false;
        }
        this.isOn = true;
        return true;
    }

    off() {
        if (!this.isOn) {
            return false;
        }
        this.isOn = false;
        return true;
    }

    getIsOn() {
        return this.isOn;
    }
}