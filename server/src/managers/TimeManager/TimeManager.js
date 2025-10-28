import {execSync} from "child_process";

export class TimeManager { // DS3231
    onTimestampChanged = null;

    constructor(onTimestampChanged) {
        this.onTimestampChanged = onTimestampChanged;
    }

    /**
     * Синхронизирует RTC1, RTC0 и системное время
     * @param {number} [timestamp] - Unix timestamp в секундах. Если не указан, берётся текущее время.
     */

    setTimestamp(timestamp) {

        try {
            let dateObj;
            if (timestamp) {
                dateObj = new Date(timestamp * 1000);
            } else {
                dateObj = new Date();
                timestamp = Math.floor(dateObj.getTime() / 1000);
            }

            // Формат YYYY-MM-DD HH:MM:SS
            const formatted = dateObj.toISOString().replace("T", " ").split(".")[0];
            console.log(`⏰ Setting time: ${formatted} (Unix: ${timestamp})`);

            // 1️⃣ Устанавливаем системное время по timestamp
            execSync(`sudo date -s "${formatted}"`, {stdio: "inherit"});

            // 2️⃣ Записываем системное время в внешний RTC (/dev/rtc1)
            execSync("sudo hwclock -w -f /dev/rtc1", {stdio: "inherit"});

            // 3️⃣ Синхронизируем встроенный RTC (/dev/rtc0) с внешним RTC
            execSync("sudo hwclock -s -f /dev/rtc1", {stdio: "inherit"}); // подтягиваем время в систему
            execSync("sudo hwclock -w -f /dev/rtc0", {stdio: "inherit"}); // пишем в RTC0

            console.log("✅ All clocks synchronized successfully.");
        } catch (err) {
            console.error("❌ Error synchronizing clocks:", err.message);
        }
    }

    getTime() {
        const date = new Date();
        // const date = new Date(Date.UTC(d.getFullYear(), d.getMonth() - 1, d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()));
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
        const {seconds, minutes, hours} = this.getTime();
        return hours * 3600 + minutes * 60 + seconds;
    }

    getTimestamp() {
        const {seconds, minutes, hours, day, month, year} = this.getTime();

        // JavaScript Date: месяц от 0 до 11, поэтому month - 1
        // const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
        const date = new Date(year, month - 1, day, hours, minutes, seconds);
        return Math.floor(date.getTime() / 1000); // Возврат timestamp в секундах
    }
}

