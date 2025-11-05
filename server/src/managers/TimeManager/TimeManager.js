import { execSync } from "child_process";

export class TimeManager {
    constructor(onTimestampChanged = null, i2cBus = 0, i2cAddr = 0x68) {
        this.onTimestampChanged = onTimestampChanged;
        this.i2cBus = i2cBus;
        this.i2cAddr = i2cAddr;
    }

    // BCD -> Decimal
    bcd2dec(bcd) {
        return ((bcd >> 4) * 10) + (bcd & 0x0F);
    }

    // Decimal -> BCD
    dec2bcd(dec) {
        return ((Math.floor(dec / 10) << 4) | (dec % 10));
    }

    // Чтение регистров DS3231
    readRegs() {
        const regs = [];
        for (let reg = 0; reg <= 6; reg++) {
            const val = execSync(`i2cget -y ${this.i2cBus} ${this.i2cAddr} ${reg}`)
                .toString().trim();
            // убираем 0x и конвертируем
            regs[reg] = parseInt(val, 16);
        }
        return regs;
    }

    // Преобразование регистров в объект времени
    regsToTime(regs) {
        const sec = this.bcd2dec(regs[0] & 0x7F);
        const min = this.bcd2dec(regs[1] & 0x7F);
        const hour = this.bcd2dec(regs[2] & 0x3F);
        const day = this.bcd2dec(regs[4] & 0x3F);
        const month = this.bcd2dec(regs[5] & 0x1F);
        const year = 2000 + this.bcd2dec(regs[6]);
        return { year, month, day, hour, min, sec };
    }

    // Чтение времени с DS3231
    readRTC() {
        const regs = this.readRegs();
        return this.regsToTime(regs);
    }

    // Установка системного времени
    setSystemTime({ year, month, day, hour, min, sec }) {
        const formatted = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')} ` +
            `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
        execSync(`sudo date -s "${formatted}"`, { stdio: "inherit" });
    }

    // Запись времени в DS3231
    writeRTC({ year, month, day, hour, min, sec }) {
        const regs = [
            this.dec2bcd(sec),
            this.dec2bcd(min),
            this.dec2bcd(hour),
            0, // день недели (не критично)
            this.dec2bcd(day),
            this.dec2bcd(month),
            this.dec2bcd(year - 2000)
        ];

        for (let reg = 0; reg <= 6; reg++) {
            execSync(`i2cset -y ${this.i2cBus} ${this.i2cAddr} ${reg} ${regs[reg]}`);
        }
    }

    // Синхронизация: DS3231 -> системное время
    syncFromRTC() {
        const rtcTime = this.readRTC();
        this.setSystemTime(rtcTime);
        if (this.onTimestampChanged) {
            this.onTimestampChanged(this.getTimestamp());
        }
    }

    setTimestamp(isoDate) {
        try {
            // Парсим ISO-строку или берём текущую дату
            const dateObj = isoDate ? new Date(isoDate) : new Date();

            const timeObj = {
                year: dateObj.getFullYear(),
                month: dateObj.getMonth() + 1, // JS месяц: 0-11
                day: dateObj.getDate(),
                hour: dateObj.getHours(),
                min: dateObj.getMinutes(),
                sec: dateObj.getSeconds()
            };

            console.log(`⏰ Setting time from ISO: ${dateObj.toISOString()}`);

            // 1️⃣ Устанавливаем системное время
            this.setSystemTime(timeObj);

            // 2️⃣ Записываем в DS3231
            this.writeRTC(timeObj);

            // 3️⃣ Колбэк, если есть
            if (this.onTimestampChanged) {
                this.onTimestampChanged(Math.floor(dateObj.getTime() / 1000));
            }

            console.log("✅ Time set and RTC synchronized successfully.");
        } catch (err) {
            console.error("❌ Error setting time:", err.message);
        }
    }

    getSecondsOfDay() {
        const { seconds, minutes, hours } = this.getTime();
        return hours * 3600 + minutes * 60 + seconds;
    }

    // Возвращает объект текущего времени
    getTime() {
        const d = new Date();
        return {
            seconds: d.getSeconds(),
            minutes: d.getMinutes(),
            hours: d.getHours(),
            day: d.getDate(),
            month: d.getMonth() + 1,
            year: d.getFullYear()
        };
    }


    // Текущее время в Unix timestamp
    getTimestamp() {
        return Math.floor(Date.now() / 1000);
    }
}
