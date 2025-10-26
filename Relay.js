import { Gpio } from 'onoff';

export class Relay {
    pin = null;
    isOn = false;
    label = null;
    digital = null;

    constructor(label, pin, isOn) {
        this.pin = pin;
        this.isOn = isOn;
        this.label = label;

        try {
            // Создаем объект Gpio для управления пином
            this.digital = new Gpio(pin, 'out');  // 'out' - это режим вывода

            // Устанавливаем начальное состояние реле
            this.digital.writeSync(this.isOn ? 1 : 0);
        } catch (e) {
            console.error(e)
        }

    }

    // Включаем реле
    on() {
        if (this.isOn) {
            return false; // Уже включено
        }
        this.isOn = true;
        try {
            this.digital.writeSync(1);  // Включаем (1 - HIGH)
        } catch (e) {
            console.error(e)
        }
        return true;
    }

    // Выключаем реле
    off() {
        if (!this.isOn) {
            return false; // Уже выключено
        }
        this.isOn = false;
        try {
            this.digital.writeSync(0);  // Выключаем (0 - LOW)
        } catch (e) {
            console.error(e)
        }
        return true;
    }

    // Получаем состояние реле
    getIsOn() {
        return this.isOn;
    }

    // Очистка и освобождение ресурсов при завершении работы
    unexport() {
        try {
            this.digital.unexport();  // Освобождение пина
        } catch (e) {
            console.error(e)
        }
    }
}
