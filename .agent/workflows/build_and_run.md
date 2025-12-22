---
description: Guide to run and build the Auto Import Calculator on macOS
---

# Запуск и сборка на macOS

Этот гайд поможет вам запустить веб-версию и собрать iOS приложение.

## 1. Подготовка окружения
Вам понадобятся **Node.js** и (для iOS) **Xcode**.

1. **Установите Node.js** (если нет):
   ```bash
   # Рекомендуется использовать Homebrew
   brew install node
   ```
2. **Установите Xcode** (из Mac App Store) для сборки iOS версии.

## 2. Запуск веб-версии (Dev Mode)
Это режим для разработки с горячей перезагрузкой.

1. Откройте терминал в папке проекта.
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
4. Откройте ссылку (обычно `http://localhost:5173`) в браузере.

## 3. Сборка веб-версии (Production)
Создает оптимизированные файлы в папке `dist`.

```bash
npm run build
```

## 4. Сборка для iOS (Mobile App)
Мы используем Capacitor для превращения веб-сайта в нативное приложение.

1. **Инициализация** (один раз):
   ```bash
   # Если вы еще не делали этого
   npx cap init "Auto Import" com.example.autoimport --web-dir dist
   npm install @capacitor/ios
   npx cap add ios
   ```

2. **Синхронизация кода**:
   Каждый раз после изменения веб-кода (`npm run build`) нужно копировать его в iOS проект:
   ```bash
   npm run build
   npx cap sync
   ```

3. **Открытие в Xcode**:
   ```bash
   npx cap open ios
   ```
   В Xcode выберите свой Team (для подписи) и нажмите кнопку "Run" (Play icon) или `Cmd+R`.

## Что сейчас в проекте ("Чего не хватает")?
На данный момент реализован **MVP (v0.1)**.

1. **Данные**: Используются тестовые (mock) таблицы `util_fee.json` и `customs.json`. Для релиза нужно заполнить их реальными ставками из постановлений.
2. **Иконки**: Используются стандартные иконки React/Vite. Для App Store нужны AppIcon.
3. **Обмен валют**: Курс зашит (hardcoded) как константа. Нужно сделать использование `eur_rub.json`.
