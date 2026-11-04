# 🎬 ShakePack (Alpha Version)

**ShakePack** is a free panel for After Effects that allows you to quickly add stylish shakes to your layers using Sapphire effects.

> ⚠️ **IMPORTANT: THIS IS AN ALPHA VERSION**
>
> **The plugin may contain bugs, crashes, or unexpected behavior.** Please bear with me. I am actively working on improvements and bug fixes.
>
> **If you found a bug or have a suggestion — please contact me on Discord: `xote._.`**. I will try to fix everything as soon as possible! *(If I don't reply, I'm sleeping 😴)*

## 🎨 UI Themes

ShakePack comes with **6 built-in color themes** to match your workflow. You can easily switch between them in the settings menu.

<div align="center">
  <img src="screenshots/mainblue-screenshot.png" width="100%" /><br>
  🔵 <b>Blue (Default)</b><br><br>
  
  <img src="screenshots/maingold-screenshot.png" width="100%" /><br>
  🟡 <b>Gold</b><br><br>
  
  <img src="screenshots/maingreen-screenshot.png" width="100%" /><br>
  🟢 <b>Green</b><br><br>
  
  <img src="screenshots/mainpurple-screenshot.png" width="100%" /><br>
  🟣 <b>Purple</b><br><br>
  
  <img src="screenshots/mainred-screenshot.png" width="100%" /><br>
  🔴 <b>Red</b><br><br>
  
  <img src="screenshots/main-screenshot.png" width="100%" /><br>
  🌸 <b>Original / Default UI</b>
</div>

## ✨ Features

- **40+ ready-to-use** shake presets (Soft, Hard, Dirty, Fast).
- **Random Shake** (Picks a random shake from the folders for the selected layer).
- **Apply to All** (Select multiple layers, e.g., 4, and a random shake will be applied to each of them).
- **Favorites** with Drag & Drop support.
- **Visual preview** of the shake right inside the panel.
- **Smart Positioning**: Shakes (Adjustment Layers) appear exactly above the selected clip in the timeline.
- **UI Customization**: 6 color themes, interface scale adjustment, custom cursor styles (Circle, Diamond, Square) and size.
- **Stylish Footer**: Quick access to the GitHub repository and current version.

## 📦 Installation

1. Download the latest release (or clone the repository).
2. Unzip and place the `ShakePack` folder into your CEP extensions directory:
   - **Windows:** `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
   - **macOS:** `/Library/Application Support/Adobe/CEP/extensions/`
3. Restart After Effects.
4. Open the panel: `Window -> Extensions -> ShakePack`.

Done! In most cases that's all you need — the panel appears in the Extensions menu right away.

> 💡 **If the panel is not in the `Window -> Extensions` menu** — debug mode for unsigned extensions is not enabled. Enable it once:
>
> **Windows:**
> 1. Open `regedit` (Win + R → `regedit`).
> 2. Go to `HKEY_CURRENT_USER\Software\Adobe\CSXS.11` (create the `CSXS.11` key if it doesn't exist; the number must match your AE version, e.g. `CSXS.12` for AE 2021).
> 3. Create a string value `PlayerDebugMode` and set it to `1`.
>
> **macOS:**
> Run in Terminal (use the CSXS version matching your AE):
> ```bash
> defaults write com.adobe.CSXS.11 PlayerDebugMode 1
> ```
>
> Restart After Effects — the panel will appear in the menu.

## ⚙️ Requirements

- **After Effects** (2020 or newer recommended).
- **Sapphire Plugin** (`S_Shake` and `S_DissolveShake` effects). The plugin cannot create shakes without it.

## 🛠 Tech Stack

- **HTML, CSS, JavaScript** (CEP Panel)
- **ExtendScript (JSX)** for interacting with After Effects.
- **Sapphire Effects**.

---

# 🇷🇺

**ShakePack** — это бесплатная панель для After Effects, которая позволяет быстро добавлять стильные шейки (тряску) на ваши слои с помощью эффектов Sapphire.

> ⚠️ **ВАЖНО: ЭТО АЛЬФА-ВЕРСИЯ**
>
> **В плагине могут быть баги, вылеты и странное поведение.** Пожалуйста, отнеситесь с пониманием. Я активно работаю над улучшением и исправлением ошибок.
>
> **Если вы нашли баг, или у вас есть предложение — пишите мне в Discord: `xote._.`**. Я постараюсь всё исправить как можно быстрее! *(если не отвечаю, сплю 😴)*

## ✨ Что умеет плагин (на данный момент)

- **40+ готовых пресетов** шейков (Soft, Hard, Dirty, Fast).
- **Случайный шейк** (Выбирается из папок шейков один рандомный шейк на слой).
- **Apply to All** (Выделил 4 слоя например и на эти 4 слоя накидывается рандомный шейк из папок).
- **Избранное** с возможностью перетаскивания (Drag & Drop).
- **Визуальное превью** шейка прямо в панели.
- **Умное позиционирование**: Шейки (Adjustment Layers) появляются ровно над выделенным клипом в таймлайне.
- **Кастомизация интерфейса**: 6 цветовых тем, настройка масштаба, выбор стиля курсора (Круг, Алмаз, Квадрат) и его размера.
- **Стильный футер**: Быстрый доступ к репозиторию GitHub и текущей версии плагина.

## 📦 Установка

1. Скачайте последний релиз (или клонируйте репозиторий).
2. Распакуйте и поместите папку `ShakePack` в директорию расширений CEP:
   - **Windows:** `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
   - **macOS:** `/Library/Application Support/Adobe/CEP/extensions/`
3. Перезапустите After Effects.
4. Откройте панель: `Window -> Extensions -> ShakePack`.

Готово! В большинстве случаев этого достаточно — панель появится в меню расширений сразу.

> 💡 **Если панели нет в меню `Window -> Extensions`** — не включён режим отладки для неподписанных расширений. Включите его один раз:
>
> **Windows:**
> 1. Откройте `regedit` (Win + R → `regedit`).
> 2. Перейдите в `HKEY_CURRENT_USER\Software\Adobe\CSXS.11` (если папки `CSXS.11` нет — создайте; номер версии должен соответствовать вашему AE, например `CSXS.12` для AE 2021).
> 3. Создайте строковый параметр `PlayerDebugMode` и установите значение `1`.
>
> **macOS:**
> Выполните в терминале (номер CSXS — под вашу версию AE):
> ```bash
> defaults write com.adobe.CSXS.11 PlayerDebugMode 1
> ```
>
> Перезапустите After Effects — панель появится в меню.

## ⚙️ Требования

- **After Effects** (рекомендуется 2020 и выше).
- **Sapphire Plugin** (эффекты `S_Shake` и `S_DissolveShake`). Без него плагин не сможет создавать шейки.

## 🛠 Технологии

- HTML, CSS, JavaScript (CEP Panel)
- ExtendScript (JSX) для взаимодействия с After Effects.
- Sapphire Effects.

## 📄 Лицензия / License

Этот проект распространяется под лицензией **PolyForm Noncommercial License 1.0.0**. Плагин бесплатный: продавать его, использовать в коммерческих целях или присваивать авторство строго запрещено. Подробности в файле LICENSE. 

This project is licensed under the **PolyForm Noncommercial License 1.0.0**. The plugin is free: selling it, using it for commercial purposes, or claiming authorship is strictly prohibited. See the LICENSE file for details.
