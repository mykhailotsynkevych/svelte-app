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

1. `Message` и `Chat` — обычные TypeScript-типы, теперь в [src/lib/types.ts](src/lib/types.ts).
2. `chats`, `activeChatId`, `draft` — независимые реактивные значения `$state`.
3. `activeChat`, `messageCount`, `canSend` — `$derived`, а не дублирующее состояние.
   После урока 4 `canSend` находится в `MessageComposer`.
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

## Урок 2. Компоненты и `$props()`

Список чатов вынесен в [ChatList.svelte](src/lib/components/ChatList.svelte).
Состояние `chats`, `activeChatId` и функция `selectChat` остались на странице:
это тот же lifting state up / controlled component, что и в React.

Родитель передаёт данные вниз и обработчик наверх:

```svelte
<ChatList {chats} {activeChatId} onSelect={selectChat} />
```

`{chats}` — сокращение `chats={chats}`, не spread.
В дочернем компоненте props типизированы и прочитаны через rune:

```ts
type Props = {
	chats: Chat[];
	activeChatId: string;
	onSelect: (id: string) => void;
};

let { chats, activeChatId, onSelect }: Props = $props();
```

В React аналогичная сигнатура: `function ChatList({ chats, activeChatId, onSelect }: Props)`.
В Svelte компонент описывается файлом, а props получаем внутри `<script>`.
Деструктуризация **непосредственно `$props()`** реактивна: новые значения родителя
доступны в шаблоне ребёнка. Это отличается от обычной деструктуризации `$state`-объекта.
Не копируй prop в `$state`, если нужен актуальный prop, а не независимый начальный снимок.

Поток выбора чата:

1. DOM-кнопка вызывает `onclick={() => onSelect(chat.id)}`.
2. `onSelect` — обычная переданная функция, а не специальное событие Svelte.
3. На странице выполняется `selectChat`: меняет `activeChatId`, очищает `draft`.
4. Дочерний компонент получает обновлённый `activeChatId` и меняет подсветку.

Ребёнок не меняет переданные объекты и не хранит свою копию выбранного чата.
`$bindable`, context и stores для этого не нужны.
Также здесь не нужны legacy `createEventDispatcher` и `on:select`.
Стили списка перенесены вместе с разметкой: scoped CSS родителя не стилизует
внутреннюю разметку ребёнка. Общие `:global`-правила пока остаются на странице.

### Твоё упражнение

Добавь в `ChatList` необязательный строковый prop `title`:

- Значение по умолчанию — `Чаты`; задай его при деструктуризации `$props()`.
- Выведи его в `<h2>` над списком.
- Со страницы передай `title="Мои чаты"`.
- Проверь оба варианта: с prop виден текст «Мои чаты», без него — «Чаты».
- Переключение чатов, очистка draft и счётчики должны работать как раньше.

## Урок 3. Snippets и композиция

Сообщения вынесены в [MessageList.svelte](src/lib/components/MessageList.svelte).
Данные по-прежнему принадлежат странице. Компонент получает `messages` и обязательный
`children: Snippet` (тип импортирован из `svelte`).

```svelte
<MessageList messages={activeChat?.messages ?? []}>
	<div class="empty-state">
		<h2>A fresh conversation</h2>
		<p>Send your first message and watch the counters update.</p>
	</div>
</MessageList>
```

Обычная вложенная разметка становится prop `children` автоматически.
Внутри `MessageList` ветка `{:else}` списка выводит её через `{@render children()}`.
Это выбранный нами контракт: children служит пустым состоянием.
Сам Svelte не ограничивает children этим назначением.

В React похожий API:

```tsx
function MessageList({ messages, children }: Props) {
	return (
		<section>
			{messages.length
				? messages.map((message) => <article key={message.id}>{message.text}</article>)
				: children}
		</section>
	);
}
```

В React children обычно имеет тип `ReactNode` и выводится через `{children}`.
В Svelte `Snippet` — фрагмент шаблона, который выводится директивой `{@render ...}`.
Не вызывай его как обычную функцию в script.
Snippets также могут быть именованными и принимать параметры (похоже на render props);
сейчас используем только неявный children без параметров.
Legacy `<slot>` для этого урока не нужен.

Разметка пустого состояния объявлена на странице, поэтому видит переменные страницы,
а не локальные переменные `MessageList`. Её scoped CSS тоже остаётся на странице.
Стили списка и сообщений перенесены в дочерний компонент.

### Твоё упражнение

Внутри пустого состояния на странице выведи название активного чата:

- Используй `activeChat?.title` внутри разметки, вложенной в `MessageList`.
- Не добавляй prop `title` в `MessageList`: это упражнение на область видимости snippet.
- Переключись на пустой чат: его название должно появиться в пустом состоянии.
- Отправь сообщение: пустое состояние с названием должно исчезнуть.
- Убедись, что название непустого чата по-прежнему есть в основном заголовке,
  но дополнительное пустое состояние не показывается.

## Урок 4. `$bindable()` и форма

Форма и её CSS перенесены в [MessageComposer.svelte](src/lib/components/MessageComposer.svelte).
`draft` остаётся `$state` на странице, чтобы `selectChat` мог его очищать.
В дочернем компоненте:

```ts
type Props = {
	draft: string;
	disabled?: boolean;
	onSend: () => void;
};

let { draft = $bindable(), disabled = false, onSend }: Props = $props();
```

`$bindable()` разрешает binding этого prop; это не второй `$state`.
На странице `<MessageComposer bind:draft disabled={!activeChat} onSend={sendMessage} />`.
`bind:draft` — сокращение `bind:draft={draft}`.
Без `bind:` обычное `draft={draft}` передавало бы обновления только от родителя.
Binding нужен с обеих сторон: разрешение в ребёнке и `bind:` в родителе.

Цепочка ввода: input `bind:value` → prop `draft` в форме → `$state draft` на странице.
Обратная цепочка: страница присваивает `draft = ''` → обновляется prop → очищается input.
В React привычнее `value={draft}` + `onChange={setDraft}` (для кастомного компонента).
В Svelte callbacks тоже остаются валидным подходом; `$bindable` не нужен для всех props.
Используем его здесь для значения поля, а callback `onSend` — для действия.

`handleSubmit` в форме вызывает `preventDefault`, проверяет `canSend` и вызывает `onSend()`.
Страница не получает DOM event: её `sendMessage` проверяет данные, добавляет сообщение
и очищает draft. Enter и кнопка используют один обработчик формы.
Проверка пустого текста на странице сохранена, даже при отключённой кнопке:
доступность UI и проверка данных — разные уровни.
Серверных actions и сетевого запроса здесь пока нет.

### Твоё упражнение

Добавь кнопку «Очистить» в `MessageComposer`:

- `type="button"`: она не должна отправлять форму.
- По клику присваивай `draft = ''`, без дополнительного callback или `$effect`.
- При `draft.length === 0` кнопка должна быть disabled.
- Пробелы тоже считаются содержимым для очистки, хотя отправлять их нельзя.
- После очистки история и счётчики не меняются, кнопка Send недоступна.
- Проверь, что переключение чата по-прежнему очищает поле.

## Урок 5. Именованные snippets с параметрами

Теперь [MessageList.svelte](src/lib/components/MessageList.svelte) отвечает за перебор,
стабильные ключи и контейнеры сообщений, а страница определяет их содержимое.

```svelte
<MessageList messages={activeChat?.messages ?? []}>
	{#snippet item(message)}
		<p class="author">You</p>
		<p class="message-text">{message.text}</p>
	{/snippet}

	<div class="empty-state">...</div>
</MessageList>
```

Snippet, объявленный непосредственно внутри тега компонента, автоматически передаётся
как prop с соответствующим именем: здесь `item`. Остальная разметка становится `children`.
В `MessageList` оба props обязательны:

```ts
type Props = {
	messages: Message[];
	item: Snippet<[Message]>;
	children: Snippet;
};
```

`Snippet<[Message]>` описывает один параметр типа `Message`.
Это кортеж типов аргументов, а не тип массива сообщений.
Внутри `{#each}` компонент выводит `{@render item(message)}`.
Так данные из дочернего компонента доступны шаблону родителя через параметр snippet.
Сам шаблон также сохраняет доступ к переменным страницы.

Аналог render prop в React:

```tsx
<MessageList
	messages={messages}
	renderItem={(message) => <p>{message.text}</p>}
>
	<p>Пока нет сообщений</p>
</MessageList>
```

Внутри React-списка это был бы вызов `renderItem(message)`.
В Svelte используй `{@render item(message)}`, не обычный вызов в script.
Snippet — шаблон, не обработчик события: для действий остаются callback props.
Стили `.author` и `.message-text` теперь на странице, где объявлена разметка item.
Стили контейнеров `.conversation` и `.message` остались в `MessageList`.

### Твоё упражнение

Добавь нумерацию сообщений через второй параметр snippet:

- В типе `item` добавь второй аргумент `number` в кортеж.
- Получи индекс в `{#each}` внутри `MessageList`, сохрани ключ `message.id`.
- Передай индекс вторым аргументом в `{@render item(...)}`.
- На странице прими `index` в `{#snippet item(...)}`.
- Выведи автора как `You · #1`, `You · #2` и т. д. (индексы начинаются с 0).
- Нумерация относится к текущему списку чата, не к глобальному `message.id`.
- Пустое состояние, Clear, отправка и счётчики должны работать как раньше.

## Следующие шаги (ещё не реализованы)

1. Routing и загрузка: `[chatId]/+page.svelte`, `+page.ts`, `+page.server.ts`;
   сравнение с dynamic segments и data fetching в Next.
2. Формы и сервер: form actions, `use:enhance`, валидация и явные ошибки.
   Сначала mock API, настоящий AI не нужен.
3. Общий state: context, `.svelte.ts`, границы запросов SSR; никакого общего mutable
   server-state между пользователями.
4. Side effects: `$effect`, cleanup и `onMount`; SSR и browser-only API.
5. Тесты: unit-тесты логики, component-тест формы, integration/e2e сценарий чата.
6. Подготовка к собеседованию: accessibility, loading/error states, CI/CD,
   adapter-node и контейнеризация; чтение legacy `$:` / `export let` / `on:click`.

## Официальные материалы

- [Интерактивный tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte)
- [$state](https://svelte.dev/docs/svelte/$state)
- [$derived](https://svelte.dev/docs/svelte/$derived)
- [Snippets](https://svelte.dev/docs/svelte/snippet)
- [$bindable](https://svelte.dev/docs/svelte/$bindable)
- [Svelte 5 migration guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [SvelteKit routing](https://svelte.dev/docs/kit/routing)
