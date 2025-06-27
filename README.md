# Руководство по работе с методичкой для старшего состава

## Оглавление
1. [Клонирование репозитория](#клонирование-репозитория)
2. [Установка зависимостей](#установка-зависимостей)
3. [Запуск проекта](#запуск-проекта)
4. [Добавление новых разделов](#добавление-новых-разделов)
5. [Добавление новых элементов](#добавление-новых-элементов)
6. [Работа с Git](#работа-с-git)
7. [Деплой на Vercel](#деплой-на-vercel)
8. [Стили CSS](#стили-css)
9. [Структура проекта](#структура-проекта)

## Клонирование репозитория
1. Установите [Git](https://git-scm.com/) и [Node.js](https://nodejs.org/) (версия 18+)
2. Выполните в терминале:
```bash
git clone https://github.com/Luckyillia/metodichka-mo.git
cd metodichka-mo
```

## Установка зависимостей
```bash
npm install
```

## Запуск проекта
Для локальной разработки:
```bash
npm run dev
```
Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

Для production-сборки:
```bash
npm run build
npm start
```

## Добавление новых разделов
1. Создайте файл компонента:
```bash
touch src/app/components/Manual/sections/NewSection.tsx
```

2. Заполните шаблон:
```tsx
import React from 'react';

const NewSection = () => {
  return (
    <div className="subsection">
      <h3>Заголовок подраздела</h3>
      <p>Содержание нового раздела</p>
    </div>
  );
};

export default NewSection;
```

3. Добавьте в навигацию (`src/data/manualData.ts`):
```typescript
export const navItems: NavItem[] = [
  // ... существующие разделы
  { id: 'new-section', title: 'Новый раздел', icon: '🆕' },
];
```

4. Импортируйте в `src/app/page.tsx`:
```typescript
const NewSection = lazy(() => import('@/app/components/Manual/sections/NewSection'));

const sectionComponents: Record<string, React.ComponentType> = {
  // ... существующие компоненты
  'new-section': NewSection,
};
```

## Добавление новых элементов

### Пример фразы
```tsx
import ExamplePhrase from '../ExamplePhrase';

<ExamplePhrase text="Текст фразы для копирования" />
```

### Элемент расписания
```tsx
import ScheduleGrid from '../ScheduleGrid';

<ScheduleGrid>
  <div className="schedule-item">Новый элемент расписания</div>
</ScheduleGrid>
```

### Специальные блоки
```tsx
<div className="note">
  <strong>📌 Примечание:</strong> Важная информация
</div>

<div className="warning">
  <strong>⚠️ Внимание:</strong> Критическое предупреждение
</div>
```

## Работа с Git
### Настройка
```bash
git config --global user.name "Ваше Имя"
git config --global user.email "ваш.email@example.com"
```

### Рабочий процесс
1. Создайте ветку (если не знаете что это такое и как им пользоватся то переходитек к пункту 2):
```bash
git checkout -b feature/new-feature
```

2. Добавьте изменения:
```bash
git add .
```

3. Создайте коммит:
```bash
git commit -m "Добавлен новый раздел методички"
```

4. Отправьте изменения:
```bash
git push origin master
```
Если пункт номер 1 не был пропущен то вот команда:
```bash
git push origin feature/new-feature
```
Если пункт номер 1 не был пропущен то вот:
5. Создайте Pull Request в GitHub/GitLab

## Деплой на Vercel
1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. Выполните деплой:
```bash
vercel
```

3. Для обновлений:
```bash
vercel --prod
```

## Стили CSS
### Основные стили
| Класс | Описание | Пример |
|-------|----------|--------|
| `.section-title` | Заголовок раздела | `<h1 class="section-title">Заголовок</h1>` |
| `.subsection h3` | Заголовок подраздела | `<h3>Подзаголовок</h3>` |
| `.subsection` | Контейнер подраздела | `<div class="subsection">...</div>` |
| `.example-phrase` | Блок с примером фразы | `<div class="example-phrase">Текст</div>` |
| `.copy-btn` | Кнопка копирования | `<button class="copy-btn">📋</button>` |
| `.schedule-grid` | Сетка расписания | `<div class="schedule-grid">...</div>` |
| `.schedule-item` | Элемент расписания | `<div class="schedule-item">Элемент</div>` |
| `.note` | Блок примечания | `<div class="note">Примечание</div>` |
| `.warning` | Блок предупреждения | `<div class="warning">Внимание!</div>` |
| `.highlight` | Подсветка текста | `<span class="highlight">Текст</span>` |
| `.document-link` | Ссылка на документ | `<a class="document-link">Ссылка</a>` |
| `.nav-link` | Элемент навигации | `<a class="nav-link">Раздел</a>` |

### Специальные классы
```css
/* Активный элемент навигации */
.nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Анимация появления секции */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Структура проекта
```
/src
  /app
    /components/Manual
      /sections          # Компоненты разделов
      Header.tsx         # Шапка приложения
      Sidebar.tsx        # Боковая панель
      ExamplePhrase.tsx  # Примеры фраз
      ScheduleGrid.tsx   # Сетка расписания
    /data
      manualData.ts      # Данные навигации
    /types
      manualTypes.ts     # Типы TypeScript
    layout.tsx           # Основной layout
    page.tsx             # Главная страница
  /styles
    globals.css          # Глобальные стили
```

## Полезные команды
```bash
# Проверка кода
npm run lint

# Проверка типов
npm run type-check

# Форматирование кода
npm run format
```

## Советы по разработке
1. Сохраняйте единый стиль оформления
2. Используйте существующие компоненты
3. Тестируйте изменения локально перед отправкой
4. Комментируйте сложные участки кода
5. Для вопросов обращайтесь к руководителю проекта