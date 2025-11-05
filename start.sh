#!/bin/bash
APP_NAME="hpjs"
APP_PATH="/root/hpjs"
ENTRY_FILE="server/src/index.js"

echo "🚀 Настройка Node.js-сервиса ($APP_NAME) под root..."

# Проверка Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js не найден."
  exit 1
fi

# Установка PM2 (если нужно)
if ! command -v pm2 &> /dev/null; then
  echo "📦 Устанавливаю PM2..."
  npm install -g pm2
fi

cd "$APP_PATH" || exit 1

npm run install:all
npm run start:client

echo "▶️ Запуск $APP_NAME..."
pm2 start "$ENTRY_FILE" --name "$APP_NAME"

echo "🔧 Настраиваю автозапуск PM2..."
pm2 startup systemd -u root --hp /root
pm2 save

echo "✅ Готово!"
pm2 list
