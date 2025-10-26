#!/bin/bash
# ===============================
# Orange Pi Node.js Service Setup
# ===============================

APP_NAME="hpjs"                      # имя твоего приложения в PM2
APP_PATH="/home/mycodouser/hpjs"     # путь к папке проекта
ENTRY_FILE="server/src/index.js"      # точка входа в Node
USER_NAME="mycodouser"                  # пользователь системы (или root)

echo "🚀 Настройка Node.js-сервиса ($APP_NAME)..."

# 1. Проверка Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js не найден. Установи Node.js перед запуском этого скрипта."
    exit 1
fi

# 2. Установка PM2 (если не установлен)
if ! command -v pm2 &> /dev/null
then
    echo "📦 Устанавливаю PM2..."
    sudo npm install -g pm2
fi

# 3. Переход в директорию проекта
cd "$APP_PATH" || { echo "❌ Ошибка: нет директории $APP_PATH"; exit 1; }

# 4. Установка зависимостей (если нужно)
if [ -f "package.json" ]; then
  echo "📦 Проверка зависимостей..."
  npm run install:all
fi

# 5. Запуск приложения через PM2
echo "▶️ Запуск приложения $APP_NAME..."
pm2 start "$ENTRY_FILE" --name "$APP_NAME"

# 6. Настройка автозапуска
#echo "🔧 Настраиваю автозапуск..."
#sudo pm2 startup systemd -u "$USER_NAME" --hp "/home/$USER_NAME"

# 7. Сохранение текущего списка процессов PM2
#pm2 save

# 8. Проверка статуса
#pm2 list

echo "✅ Готово! Приложение $APP_NAME теперь:"
echo "   • Запускается при старте системы"
echo "   • Перезапускается при сбое"
echo "   • Управляется командами PM2:"
echo "     - pm2 status"
echo "     - pm2 logs $APP_NAME"
echo "     - pm2 restart $APP_NAME"
echo "     - pm2 stop $APP_NAME"
