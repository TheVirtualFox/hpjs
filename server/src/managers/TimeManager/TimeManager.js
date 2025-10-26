
export class TimeManager { // DS3231
    onTimestampChanged = null;
    constructor(onTimestampChanged) {
        this.onTimestampChanged = onTimestampChanged;
    }

    setTimestamp(timestamp) {
        // Преобразуем timestamp в дату UTC
        const date = new Date(timestamp * 1000);

        this.setTime({
            seconds: date.getUTCSeconds(),
            minutes: date.getUTCMinutes(),
            hours: date.getUTCHours(),
            day: date.getUTCDate(),
            month: date.getUTCMonth() + 1,
            year: date.getUTCFullYear()
        });
        this.onTimestampChanged(timestamp);
    }

    setTime({ seconds, minutes, hours, day, month, year }) {
    }

    getTime() {
        const date = new Date();

        return {
            seconds: date.getSeconds(),
            minutes: date.getMinutes(),
            hours: date.getHours(),
            day: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear()
        };
    }

    getSecondsOfDay() {
        const { hours, minutes, seconds } = this.getTime();
        return hours * 3600 + minutes * 60 + seconds;
    }

    getTimestamp() {
        const { seconds, minutes, hours, day, month, year } = this.getTime();

        // JavaScript Date: месяц от 0 до 11, поэтому month - 1
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
        return Math.floor(date.getTime() / 1000); // Возврат timestamp в секундах
    }
}

