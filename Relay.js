import Digital from "pins/digital";

export class Relay {
    pin = null;
    isOn = false;
    label = null;
    digital = null;

    constructor(label, pin, isOn) {
        this.pin = pin;
        this.isOn = isOn;
        this.label = label;

        this.digital = new Digital(pin, Digital.Output);
        this.digital.write(!this.isOn);
    }

    on() {
        if (this.isOn) {
            return false;
        }
        this.isOn = true;
        this.digital.write(!this.isOn);
        return true;
    }

    off() {
        if (!this.isOn) {
            return false;
        }
        this.isOn = false;
        this.digital.write(!this.isOn);
        return true;
    }

    getIsOn() {
        return this.isOn;
    }
}