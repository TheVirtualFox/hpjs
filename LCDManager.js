import Timer from "timer";
import I2C from "pins/i2c";

const DEFAULT_ADDRESS = 0x27; // Попробуйте 0x3F если не работает

export class LCDManager {
    constructor(options = {}) {
        // Настройки I2C по умолчанию для ESP32
        const config = {
            sda: options.sda || 21,
            scl: options.scl || 22,
            hz: options.hz || 100000,
            address: options.address || DEFAULT_ADDRESS
        };

        this.i2c = new I2C(config);
        this.backlight = 0x08; // Фоновая подсветка включена по умолчанию
        this.initStep = 0;
        this.onReady = options.onReady;

        // Запуск последовательности инициализации
        this.initSequence();
    }

    // Запись 4 бит в расширитель портов
    write4bits(value) {
        this.expanderWrite(value);
        this.pulseEnable(value);
    }

    // Запись байта в расширитель портов
    expanderWrite(data) {
        try {
            this.i2c.write(new Uint8Array([data | this.backlight]).buffer);
        } catch (e) {
            trace("I2C write error:", e, "\n");
        }
    }

    // Импульс включения для записи данных
    pulseEnable(data) {
        this.expanderWrite(data | 0x04); // Установка EN в 1
        Timer.delay(1);
        this.expanderWrite(data & ~0x04); // Установка EN в 0
        Timer.delay(1);
    }

    // Отправка команды или данных
    send(value, mode) {
        const highNibble = (value & 0xF0) | (mode ? 0x01 : 0x00);
        const lowNibble = ((value << 4) & 0xF0) | (mode ? 0x01 : 0x00);

        this.write4bits(highNibble);
        this.write4bits(lowNibble);
    }

    // Отправка команды
    command(cmd) {
        this.send(cmd, 0);
    }

    // Отправка символа
    write(char) {
        this.send(char.charCodeAt(0), 1);
    }

    // Печать строки
    print(str) {
        for (let i = 0; i < str.length; i++) {
            this.write(str[i]);
        }
    }

    printTimestamp(timestamp = Date.now()) {
        const date = new Date(timestamp * 1000);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Формирование строки в формате ДД/ММ/ГГ ЧЧ:ММ:СС
        const timestampStr = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

        // Вывод на дисплей
        this.printLine(0, timestampStr);
    }

    printBoolean(val) {
        return val ? 'ON' : 'OFF';
    }

    printRelays({
        pump,
        light,
        air,
        fan,
    }) {
        this.printLine(2, `pump: ${this.printBoolean(pump)} light: ${this.printBoolean(light)}`);
        this.printLine(3, `air: ${this.printBoolean(air)} fan: ${this.printBoolean(fan)}`);
    }

    printControlPanel({
        isManualControl
    }) {
        this.printLine(1, isManualControl ? 'Manual' : 'Auto');
    }

    // Печать строки на указанной строке дисплея
    printLine(line, text) {
        this.setCursor(0, line);
        this.print(text.substring(0, 20).padEnd(20));
    }

    // Установка позиции курсора
    setCursor(col, row) {
        const rowOffsets = [0x00, 0x40, 0x14, 0x54];
        this.command(0x80 | (col + (rowOffsets[row] || 0)));
    }

    // Очистка дисплея
    clear() {
        this.command(0x01);
        Timer.delay(2);
    }

    // Включение/выключение подсветки
    setBacklight(state) {
        this.backlight = state ? 0x08 : 0x00;
        this.expanderWrite(0);
    }

    // Последовательность инициализации
    initSequence() {
        const steps = [
            { action: () => this.write4bits(0x30), delay: 50 },
            { action: () => this.write4bits(0x30), delay: 10 },
            { action: () => this.write4bits(0x30), delay: 10 },
            { action: () => this.write4bits(0x20), delay: 10 }, // 4-битный режим
            { action: () => this.command(0x28), delay: 10 },    // 2 строки, 5x8 точек
            { action: () => this.command(0x0C), delay: 10 },    // Дисплей вкл, курсор выкл
            { action: () => this.command(0x06), delay: 10 },    // Автоинкремент курсора
            { action: () => this.clear(), delay: 10 },
            { action: () => this.onReady?.(this), delay: 0 }
        ];

        const nextStep = () => {
            if (this.initStep < steps.length) {
                const step = steps[this.initStep++];
                step.action();
                if (this.initStep < steps.length) {
                    Timer.set(nextStep, step.delay);
                }
            }
        };

        nextStep();
    }
}