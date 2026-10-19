# Svelte Lab

Учебный мини-workspace для перехода с React/Next.js на Svelte 5 + SvelteKit + TypeScript.
Используем Node 24 LTS и SvelteKit 3: версия SvelteKit не равна версии Svelte.
Первый урок намеренно находится в одном компоненте: сначала реактивность, затем декомпозиция.
Вакансия указывает Svelte, но не подтверждает его версию или использование SvelteKit.

## Запуск

```sh
nvm use
npm install
npm run dev -- --open
```

После появления lock-файла для повторной установки используй `npm ci`.

```sh
npm run check
npm run build
```

`check` проверяет TypeScript, Svelte и статические accessibility-диагностики; это не unit-тесты.
`build` проверяет production-сборку. Для деплоя нужно выбрать adapter под целевую среду.

## Карта проекта через React/Next

| Здесь | Знакомая концепция | Важное отличие |
| --- | --- | --- |
| [src/routes/+page.svelte](src/routes/+page.svelte) | `app/page.tsx` | Svelte-компонент: script + шаблон + scoped CSS |
| [src/routes/+layout.svelte](src/routes/+layout.svelte) | `app/layout.tsx` | `$props()` получает children-snippet, `{@render children()}` выводит его |
| `src/lib` / `#lib` | Общие компоненты и модули / alias | Alias настроен шаблоном проекта |
| `$state(initial)` | `useState(initial)` | Нет setter; простые объекты/массивы глубоко реактивны |
| `$derived(expression)` | Вычисление при render, иногда `useMemo` | Зависимости отслеживаются автоматически; это не эффект |
| `bind:value={draft}` | `value={draft}` + `onChange` | Двусторонняя привязка значения input |
| `onclick`, `onsubmit` | `onClick`, `onSubmit` | Имена в нижнем регистре, нативные DOM-события |
| `{#each list as item (item.id)}` | `list.map` + `key` | Блок шаблона со стабильным ключом |
| `<style>` | CSS Modules | Стили компонента scoped по умолчанию |

Svelte — компилятор UI, SvelteKit — framework для routing, SSR и серверной части.
Страницы по умолчанию рендерятся на сервере и гидратируются в браузере.
Это **не** модель React Server Components; `'use client'` здесь не нужен.
Runes — синтаксис компилятора, а не импортируемые React hooks.

## Урок 1. Реактивность

Открой [src/routes/+page.svelte](src/routes/+page.svelte) и читай сверху вниз:

1. `Message` и `Chat` — обычные TypeScript-типы.
2. `chats`, `activeChatId`, `draft` — независимые реактивные значения `$state`.
3. `activeChat`, `messageCount`, `canSend` — `$derived`, а не дублирующее состояние.
4. `bind:value` обновляет `draft`; `canSend` управляет доступностью кнопки.
5. `onsubmit` вызывает `preventDefault()` явно. Enter и кнопка используют одну форму.
6. `activeChat.messages.push(...)` обновляет UI и оба счётчика через deep proxy.
   В React для state-массива обычно нужен новый массив через setter.
7. `{#each ... (message.id)}` выводит сообщения; `{:else}` — пустое состояние.

В Svelte компонент не выполняется заново целиком на каждое изменение состояния,
как React function component. Компилятор связывает реактивные зависимости с обновлением UI.
Не деструктурируй `$state`-объект в обычные переменные, ожидая сохранить реактивность.
Не добавляй `$effect`, чтобы вычислять значения, для которых достаточно `$derived`.

### Проверь руками

- Отправь сообщение: текст появляется, input очищается, счётчик растёт.
- Отправь только пробелы: кнопка недоступна.
- Переключись на пустой чат: появится empty state.
- Отправь туда сообщение и вернись: истории чатов независимы.
- Набери черновик и переключись: черновик сбрасывается (осознанное упрощение урока).
- Обнови страницу: данные сбросятся. Нет API, AI, localStorage или базы данных.
- Пройди интерфейс клавишей Tab и отправь сообщение через Enter.

### Твоё первое упражнение

Добавь `$derived` со **суммарным количеством сообщений во всех чатах**
через `chats.reduce(...)` и выведи его в sidebar.
Не создавай отдельный `$state` и не используй `$effect`.
Проверка: сначала всего 1 сообщение; после отправки в любой чат число растёт на 1;
переключение чата его не меняет.

## Следующие шаги (ещё не реализованы)

1. Компоненты `ChatList`, `MessageList`, `MessageComposer`: `$props`, callback props,
   snippets; сравнение с props, lifting state up и children в React.
2. Routing и загрузка: `[chatId]/+page.svelte`, `+page.ts`, `+page.server.ts`;
   сравнение с dynamic segments и data fetching в Next.
3. Формы и сервер: form actions, `use:enhance`, валидация и явные ошибки.
   Сначала mock API, настоящий AI не нужен.
4. Общий state: context, `.svelte.ts`, границы запросов SSR; никакого общего mutable
   server-state между пользователями.
5. Side effects: `$effect`, cleanup и `onMount`; SSR и browser-only API.
6. Тесты: unit-тесты логики, component-тест формы, integration/e2e сценарий чата.
7. Подготовка к собеседованию: accessibility, loading/error states, CI/CD,
   adapter-node и контейнеризация; чтение legacy `$:` / `export let` / `on:click`.

## Официальные материалы

- [Интерактивный tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte)
- [$state](https://svelte.dev/docs/svelte/$state)
- [$derived](https://svelte.dev/docs/svelte/$derived)
- [Svelte 5 migration guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [SvelteKit routing](https://svelte.dev/docs/kit/routing)
