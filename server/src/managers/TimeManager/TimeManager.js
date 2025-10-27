import { execSync } from "child_process";

export class TimeManager { // DS3231
    onTimestampChanged = null;
    constructor(onTimestampChanged) {
        this.onTimestampChanged = onTimestampChanged;
    }

    setTimestamp(timestamp) {
        try {
            // 1. Преобразуем timestamp в формат YYYY-MM-DD HH:MM:SS
            const date = new Date(timestamp * 1000);
            const formatted = date.toISOString().replace("T", " ").split(".")[0];
            console.log(`Setting system time to: ${formatted}`);
            // 2. Устанавливаем системное время
            execSync(`sudo date -s "${formatted}"`, { stdio: "inherit" });
            // 3. Записываем это время в RTC1
            execSync("sudo hwclock -w -f /dev/rtc1", { stdio: "inherit" });
            // 4. Синхронизируем системное время снова из RTC1
            execSync("sudo hwclock -s -f /dev/rtc1", { stdio: "inherit" });

            console.log("✅ RTC1 and system time synchronized successfully.");
            this.onTimestampChanged(timestamp);
        } catch (err) {
            console.error("❌ Failed to set RTC/system time:", err.message);
        }


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

