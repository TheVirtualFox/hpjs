#!/bin/bash
# rtc-sync-i2c.sh
# Синхронизация системного времени с DS3231 через I2C

I2C_BUS=0        # Шина, на которой подключен DS3231
DS3231_ADDR=0x68

# Функция для преобразования BCD в десятичное
bcd2dec() {
    echo $(( ($1 >> 4) * 10 + ($1 & 0x0F) ))
}

# Чтение регистров DS3231
read_regs() {
    # секунды, минуты, часы, день недели, день месяца, месяц, год
    for reg in {0..6}; do
        val=$(i2cget -y $I2C_BUS $DS3231_ADDR $reg)
        regs[$reg]=$((0x${val:2}))  # конвертируем hex в число
    done
}

# Преобразование регистров в обычное время
regs_to_time() {
    SEC=$(bcd2dec ${regs[0]})
    MIN=$(bcd2dec ${regs[1]})
    HOUR=$(bcd2dec ${regs[2]} & 0x3F)  # 24-часовой формат
    DAY=$(bcd2dec ${regs[4]})
    MONTH=$(bcd2dec ${regs[5]} & 0x1F)
    YEAR=$((2000 + $(bcd2dec ${regs[6]})))
}

# Чтение и преобразование времени
read_regs
regs_to_time

# Форматируем для команды date
DATE_STR=$(printf "%04d-%02d-%02d %02d:%02d:%02d" $YEAR $MONTH $DAY $HOUR $MIN $SEC)

echo "Системное время будет синхронизировано с DS3231: $DATE_STR"

# Устанавливаем системное время
sudo date -s "$DATE_STR"

echo "Системное время установлено: $(date)"
