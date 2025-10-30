#!/bin/bash

# Активация RTC модуля DS3231
echo ds3231 0x68 > /sys/class/i2c-adapter/i2c-0/new_device

# Ожидание появления /dev/rtc1
for i in {1..10}; do
    if [ -e /dev/rtc1 ]; then
        echo "RTC1 device found successfully"
        break
    fi
    sleep 0.5
done

# Проверка существования RTC1
if [ ! -e /dev/rtc1 ]; then
    echo "ERROR: /dev/rtc1 not found after 5 seconds"
    exit 1
fi

# Синхронизация системного времени с RTC1
echo "Syncing system time from RTC1..."
if /sbin/hwclock -f /dev/rtc1 -s; then
    echo "System time synced from RTC1: $(date)"
else
    echo "ERROR: Failed to sync from RTC1"
    exit 1
fi

# Сохранение системного времени в RTC0 (опционально)
echo "Saving system time to RTC0..."
if /sbin/hwclock -w -f /dev/rtc0; then
    echo "Time saved to RTC0 successfully"
else
    echo "WARNING: Failed to save time to RTC0"
fi