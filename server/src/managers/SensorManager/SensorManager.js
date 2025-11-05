import {W1Sensor} from "./Sensor.js";

export class SensorManager {
    tempSensor = null;

    onSensorStateChanged = null;

    constructor(onSensorStateChanged) {

        // 28-3ce10457ce0c
        this.tempSensor = new W1Sensor('28-3ce10457ce0c'); // 22
        this.onSensorStateChanged = onSensorStateChanged;
    }

    onTimeChange(secondsOfDay) {
        if (secondsOfDay % 60 === 0) {
            this.onSensorStateChanged?.(this.getState());
        }
    }

    getState() {
        return {
            temp: this.tempSensor.readTemperature(),
        };
    }
}