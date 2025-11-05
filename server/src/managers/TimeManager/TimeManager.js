import { execSync } from "child_process";

export class TimeManager {
    constructor(onTimestampChanged = null, i2cBus = 0, i2cAddr = 0x68) {
        this.onTimestampChanged = onTimestampChanged;
        this.i2cBus = i2cBus;
        this.i2cAddr = i2cAddr;
    }

    bcd2dec(bcd) {
        return ((bcd >> 4) * 10) + (bcd & 0x0F);
    }

    dec2bcd(dec) {
        return ((Math.floor(dec / 10) << 4) | (dec % 10));
    }

    readRegs() {
        const regs = [];
        for (let reg = 0; reg <= 6; reg++) {
            const val = execSync(`i2cget -y ${this.i2cBus} ${this.i2cAddr} ${reg}`)
                .toString().trim();
            regs[reg] = parseInt(val, 16);
        }
        return regs;
    }

    regsToTime(regs) {
        const sec = this.bcd2dec(regs[0] & 0x7F);
        const min = this.bcd2dec(regs[1] & 0x7F);
        const hour = this.bcd2dec(regs[2] & 0x3F);
        const day = this.bcd2dec(regs[4] & 0x3F);
        const month = this.bcd2dec(regs[5] & 0x1F);
        const year = 2000 + this.bcd2dec(regs[6]);
        return { year, month, day, hour, min, sec };
    }

    readRTC() {
        return this.regsToTime(this.readRegs());
    }

    setSystemTime({ year, month, day, hour, min, sec }) {
        const formatted = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')} ` +
            `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
        // Убедимся, что NTP выключен
        try { execSync("sudo timedatectl set-ntp 0"); } catch {}
        execSync(`sudo date -s "${formatted}"`, { stdio: "inherit" });
    }

    writeRTC({ year, month, day, hour, min, sec }) {
        const regs = [
            this.dec2bcd(sec),
            this.dec2bcd(min),
            this.dec2bcd(hour),
            0, // день недели
            this.dec2bcd(day),
            this.dec2bcd(month),
            this.dec2bcd(year - 2000)
        ];

        for (let reg = 0; reg <= 6; reg++) {
            execSync(`i2cset -y ${this.i2cBus} ${this.i2cAddr} ${reg} ${regs[reg]}`);
        }
    }

    syncFromRTC() {
        const rtcTime = this.readRTC();
        this.setSystemTime(rtcTime);
        if (this.onTimestampChanged) {
            this.onTimestampChanged(this.getTimestamp());
        }
    }

    setTimestamp(isoDate) {
        try {
            const dateObj = isoDate ? new Date(isoDate) : new Date();

            const timeObj = {
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                min: dateObj.getUTCMinutes(),
                sec: dateObj.getUTCSeconds()
            };

            console.log(`⏰ Setting system time to: ${dateObj.toISOString()}`);

            // Ставим системное время
            this.setSystemTime(timeObj);

            // Записываем в RTC
            this.writeRTC(timeObj);

            if (this.onTimestampChanged) {
                this.onTimestampChanged(Math.floor(dateObj.getTime() / 1000));
            }

            console.log("✅ Time and RTC synchronized successfully.");
        } catch (err) {
            console.error("❌ Error setting time:", err.message);
        }
    }

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

    getSecondsOfDay() {
        const { hours, minutes, seconds } = this.getTime();
        return hours * 3600 + minutes * 60 + seconds;
    }

    getTimestamp() {
        return Math.floor(Date.now() / 1000);
    }
}
