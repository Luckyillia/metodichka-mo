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
10. [Dropdown Menu (Выпадающее меню)](#dropdown-menu-выпадающее-меню)
11. [Защищенные разделы (Protected Sections)](#защищенные-разделы-protected-sections)

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

## Dropdown Menu (Выпадающее меню)

### Как использовать DropdownMenu

1. **Импорт компонента**:
```tsx
import DropdownMenu from '../DropdownMenu';
```

2. **Пример использования**:
```tsx
<DropdownMenu
  title="Название меню"
  items={[
    "Пункт 1",
    "Пункт 2",
    "Пункт 3"
  ]}
  icon="📚" // Опционально
  searchable={true} // Опционально
/>
```

3. **Параметры**:
- `title`: Заголовок меню
- `items`: Массив строк для отображения
- `icon`: Иконка перед заголовком (по умолчанию 📚)
- `searchable`: Включить поиск по пунктам (по умолчанию false)

4. **Пример с поиском**:
```tsx
<DropdownMenu
  title="Список лекций"
  items={lectureTitles}
  icon="📖"
  searchable={true}
/>
```

## Защищенные разделы (Protected Sections)

### Как создать защищенный раздел

1. **Импорт компонента**:
```tsx
import ProtectedSection from '../ProtectedSection';
```

2. **Базовое использование**:
```tsx
<ProtectedSection 
  password="secret123" 
  hint="Подсказка для пароля"
>
  {/* Контент раздела */}
  <div className="subsection">
    <h3>Секретный контент</h3>
    <p>Этот контент виден только после ввода пароля</p>
  </div>
</ProtectedSection>
```

3. **Параметры**:
- `password`: Пароль для доступа
- `hint`: Подсказка для пароля (опционально)
- `icon`: Кастомная иконка (опционально)

4. **Пример с кастомной иконкой**:
```tsx
<ProtectedSection 
  password="topsecret" 
  hint="Пароль: название организации + год"
  icon={<ShieldLockIcon />} // Ваш кастомный компонент иконки
>
  {/* Контент раздела */}
</ProtectedSection>
```

### Особенности работы защищенных разделов

1. После успешного ввода пароля доступ сохраняется в localStorage
2. По умолчанию дается 3 попытки для ввода пароля
3. После 3 неверных попыток доступ блокируется на 30 секунд
4. Можно добавить подсказку для помощи пользователям

### Пример полного защищенного раздела

1. Создайте файл раздела:
```bash
touch src/app/components/Manual/sections/SecretDocuments.tsx
```

2. Заполните содержимое:
```tsx
import React from 'react';
import ProtectedSection from '../ProtectedSection';

const SecretDocuments = () => {
  return (
    <ProtectedSection 
      password="mo2023" 
      hint="Пароль: аббревиатура + текущий год"
      icon="🛡️"
    >
      <div className="subsection">
        <h3>Секретные документы</h3>
        
        <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg">
          <h4 className="font-bold mb-2">Конфиденциальная информация:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Документ 1: Стратегические планы</li>
            <li>Документ 2: Список ответственных</li>
            <li>Документ 3: Коды доступа</li>
          </ul>
        </div>
      </div>
    </ProtectedSection>
  );
};

export default SecretDocuments;
```

3. Добавьте в навигацию (`src/data/manualData.ts`):
```typescript
export const navItems: NavItem[] = [
  // ... другие разделы
  { id: 'secret-docs', title: 'Секретные документы', icon: '🛡️' },
];
```

4. Добавьте в список компонентов (`src/app/page.tsx`):
```typescript
const SecretDocuments = lazy(() => import('@/app/components/Manual/sections/SecretDocuments'));

const sectionComponents: Record<string, React.ComponentType> = {
  // ... другие компоненты
  'secret-docs': SecretDocuments,
};
```

### Советы по защищенным разделам

1. Используйте разные пароли для разных разделов
2. Для важных разделов делайте сложные пароли
3. Добавляйте содержательные подсказки для авторизованных пользователей
4. Регулярно обновляйте пароли
5. Для особо важных данных рассмотрите серверную проверку паролей

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
### !!Выжное перед изменением фалов выполнить команду в папке проекта!!
```bash
git branch --set-upstream-to=origin/master
```
### После чего выполнить данную команду
```bash
git pull
```
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

## Как использовать стили

### 1. Для текстовых элементов
```tsx
<h1 className="section-title">Заголовок раздела</h1>
<h3 className="subsection">Заголовок подраздела</h3>
<p>Обычный текст</p>
```

### 2. Для специальных блоков
```tsx
<div className="note">
  <strong>Примечание:</strong> Важная информация
</div>

<div className="warning">
  <strong>Внимание!</strong> Критическое предупреждение
</div>

<span className="highlight">Подсвеченный текст</span>
```

### 3. Для интерактивных элементов
```tsx
<div className="example-phrase" onClick={copyToClipboard}>
  Текст для копирования
  <button className="copy-btn">📋 Копировать</button>
</div>

<div className="schedule-grid">
  <div className="schedule-item">Элемент 1</div>
  <div className="schedule-item">Элемент 2</div>
</div>
```

### 4. Для ссылок
```tsx
<a href="#" className="document-link" target="_blank">Ссылка на документ</a>
```

### 5. Для навигации
```tsx
<a href="#" className="nav-link active">Активный раздел</a>
<a href="#" className="nav-link">Обычный раздел</a>
```

## Добавление новых стилей

1. Для добавления нового стиля:
    - Откройте файл `src/app/styles/globals.css`
    - Добавьте новые стили в конец файла
    - Используйте префикс `mo-` для кастомных классов (например, `mo-new-style`)

2. Пример добавления нового стиля:
```css
.mo-new-style {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

3. Использование нового стиля в компоненте:
```tsx
<div className="mo-new-style">
  Новый стилизованный блок
</div>
```

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
src
├───app
│   │   favicon.ico       # Иконка которая возле карточки старая
│   │   favicon_old.ico   # Иконка которая возле карточки старая
│   │   layout.tsx        # Основной layout
│   │   page.tsx          # Главная страница
│   │   
│   ├───components
│   │   └───Manual
│   │       │   DropdownMenu.tsx       # Элемент который позволяет делать выпадное меню
│   │       │   ExamplePhrase.tsx      # Элемент который позвволяет копировать текст
│   │       │   Header.tsx             # Шапка приложения
│   │       │   ProtectedSection.tsx   # Элемент который позволяет создавать скрытые разделы для СС
│   │       │   ScheduleGrid.tsx       # Сетка расписания
│   │       │   SectionContent.tsx     # ХЗ
│   │       │   Sidebar.tsx            # Боковая панель
│   │       │
│   │       └───sections                              # Компоненты разделов
│   │               AmmunitionSupplies.tsx            # Поставка боеприпасов
│   │               AnnouncementsSection.tsx          # Примеры в ДО
│   │               EventsSection.tsx                 # Мероприятия
│   │               ExamSection.tsx                   # Экзамены
│   │               ForumResponsesSection.tsx         # Работа по форуму
│   │               InterviewConscriptSection.tsx     # Собес Срочная
│   │               InterviewContractSection.tsx      # Собес Контрактная
│   │               LecturesSection.tsx               # Лекции
│   │               OverviewSection.tsx               # Содержание
│   │               ParkingSpaces.tsx                 # Парковочные места ВЧ
│   │               RPTaskSection.tsx                 # РП задания
│   │               TrainingSection.tsx               # Тренировки
│   │               WorkProceduresSection.tsx         # Действия СС в разных случаях
│   │
│   └───styles
│           globals.css    # Глобальные стили
│
├───data
│       manualData.ts      # Данные навигации(Так же последовательность кнопок раздела)
│
└───types
        manualTypes.ts     # Типы TypeScript
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