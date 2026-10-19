# Svelte Lab

Учебный мини-workspace для перехода с React/Next.js на Svelte 5 + SvelteKit 3 + TypeScript.
Используем Node 24 LTS. Версии Svelte и SvelteKit независимы.
Данные чатов находятся в памяти: пока без API, AI и постоянного хранения.

## Запуск

```sh
nvm use
npm ci
npm run dev -- --open
```

Проверка типов и Svelte-диагностики: `npm run check`.
Production-сборка: `npm run build`. Для деплоя нужен adapter под целевую среду.

## Что рассмотрели

| Svelte / SvelteKit | Суть и сравнение с React / Next.js |
| --- | --- |
| `$state` | Реактивное состояние без setter. Обычные объекты и массивы глубоко реактивны, поэтому `messages.push(...)` обновляет UI. |
| `$derived` | Вычисляемое значение с автоматическими зависимостями. Аналог вычисления при render; не требует отдельного state или эффекта. |
| `$props()` | Типизированные props, значения по умолчанию и callbacks. Деструктуризация непосредственно `$props()` сохраняет реактивность. |
| Callback props | Данные идут вниз, действия сообщаются родителю через функции — как lifting state up в React. |
| `bind:value` | Двусторонняя привязка input вместо ручной связки `value` и `onChange`. |
| `$bindable()` | Явно разрешает binding prop. `bind:draft` связывает черновик формы со state страницы без второй копии. |
| `onclick`, `onsubmit` | Обработчики нативных событий. Для отмены стандартной отправки формы вызываем `preventDefault()`. |
| `{#each ... (message.id)}` | Список со стабильным ключом, аналог `map` + `key`. Индекс используем для нумерации, а не идентификации. |
| `children: Snippet` | Вложенная разметка как prop; вывод через `{@render children()}`. Похоже на React children, но это фрагмент шаблона, не `ReactNode`. |
| Именованные snippets | `item(message, index)` задаёт шаблон сообщения, как render prop. `Snippet<[Message, number]>` описывает типы его аргументов. |
| Scoped CSS | Стили относятся к разметке, объявленной в компоненте. Общие правила задаём через `:global`. |
| Файловый routing | Папка задаёт сегмент URL, `+page.svelte` — страницу. Аналог `app/.../page.tsx` в Next.js. |
| `<a href="/about">` | Внутренняя навигация без отдельного Link-компонента; после гидратации SvelteKit перехватывает подходящие ссылки. |
| `<svelte:head>` | Заголовок вкладки и метаданные страницы. |
| `+layout.svelte` | Общий каркас с текущей страницей в `children`. Общий layout сохраняется при клиентских переходах, но не при перезагрузке. |

Svelte — компилятор UI, SvelteKit добавляет routing, SSR и серверную часть.
По умолчанию страницы рендерятся на сервере и гидратируются в браузере.
Это не React Server Components: `'use client'` здесь не нужен.
Runes — синтаксис компилятора, а не импортируемые hooks.
Локальный `$state` не заменяет постоянное хранилище; mutable state в module scope
на сервере может случайно стать общим для разных пользователей.


## Официальные материалы

- [Интерактивный tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte)
- [$state](https://svelte.dev/docs/svelte/$state)
- [$derived](https://svelte.dev/docs/svelte/$derived)
- [$props](https://svelte.dev/docs/svelte/$props)
- [$bindable](https://svelte.dev/docs/svelte/$bindable)
- [Snippets](https://svelte.dev/docs/svelte/snippet)
- [SvelteKit routing](https://svelte.dev/docs/kit/routing)
