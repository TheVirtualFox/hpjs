export class TimeManager {
    secondsOfDay = 0;
    onTimestampChanged = null;
    constructor(onTimestampChanged) {
        this.onTimestampChanged = onTimestampChanged;
    }

    setTimestamp(timestamp) {
        this.secondsOfDay = timestamp;
        this.onTimestampChanged(timestamp);
    }

    setSecondsOfDay(secondsOfDay) {
        this.secondsOfDay = secondsOfDay;
    }

    addSecondsOfDay() {
        this.secondsOfDay++;
    };

    getSecondsOfDay() {
        return this.secondsOfDay;
    }

    getTimestamp() {
        return this.secondsOfDay;
    }

}



import I2C from "pins/i2c";

class DS3231 {
    static ADDRESS = 0x68;

    constructor({ sda = 21, scl = 22, hz = 400000 } = {}) {
        this.i2c = new I2C({ sda, scl, hz });
    }

    decToBcd(val) {
        return ((val / 10) << 4) | (val % 10);
    }

    bcdToDec(bcd) {
        return ((bcd >> 4) * 10 + (bcd & 0x0F));
    }

    setTime({ seconds, minutes, hours, day, month, year }) {
        const yearShort = year % 100;

        const data = Uint8Array.of(
            0x00,
            this.decToBcd(seconds),
            this.decToBcd(minutes),
            this.decToBcd(hours),
            0, // День недели
            this.decToBcd(day),
            this.decToBcd(month),
            this.decToBcd(yearShort)
        );

        this.i2c.write(DS3231.ADDRESS, data);
    }

    getTime() {
        this.i2c.write(Uint8Array.of(0x00));
        const data = this.i2c.read(DS3231.ADDRESS, 7);

        return {
            seconds: this.bcdToDec(data[0] & 0x7F),
            minutes: this.bcdToDec(data[1]),
            hours: this.bcdToDec(data[2] & 0x3F),
            day: this.bcdToDec(data[4]),
            month: this.bcdToDec(data[5] & 0x1F),
            year: 2000 + this.bcdToDec(data[6])
        };
    }

    getSecondsSinceMidnight() {
        const { hours, minutes, seconds } = this.getTime();
        return hours * 3600 + minutes * 60 + seconds;
    }
}

export default DS3231;
