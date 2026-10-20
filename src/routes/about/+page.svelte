<svelte:head>
  <title>About Project | Svelte Lab</title>
  <meta
    name="description"
    content="A local learning workspace for exploring Svelte 5 from a React background."
  />
</svelte:head>

<div class="about">
  <header>
    <a href="/" class="back-link">← Back to Workspace</a>
    <h1>About Svelte <span>Lab</span></h1>
  </header>
  <main>
    <p>
      This is a local learning workspace for exploring Svelte 5 from a React
      background.
    </p>
    <section lang="ru" aria-labelledby="concepts-title">
      <h2 id="concepts-title">Что уже изучили</h2>
      <ul>
        <li><code>$state</code> — реактивное состояние без setter, включая глубокую реактивность обычных объектов и массивов.</li>
        <li><code>$derived</code> — вычисляемые значения с автоматическим отслеживанием зависимостей, без лишнего state и эффектов.</li>
        <li><code>onclick</code> и <code>onsubmit</code> — обработчики событий; <code>preventDefault()</code> предотвращает стандартную отправку формы.</li>
        <li><code>bind:value</code> — двусторонняя привязка значения поля ввода.</li>
        <li><code>$props()</code> — типизированные входные свойства, необязательные props и значения по умолчанию.</li>
        <li>Callback props — ребёнок сообщает о действии, родитель изменяет состояние, как при lifting state up в React.</li>
        <li><code>$bindable()</code> и <code>bind:draft</code> — явно разрешённая двусторонняя привязка prop между компонентами.</li>
        <li><code>{'{#each messages as message, index (message.id)}'}</code> — перебор со стабильным ключом; индекс используем для нумерации, а не идентификации.</li>
        <li><code>children</code>, <code>Snippet</code> и <code>{'{@render children()}'}</code> — композиция через фрагменты шаблона.</li>
        <li>Именованные snippets с параметрами — аналог render props в React; <code>Snippet&lt;[Message, number]&gt;</code> задаёт типы аргументов.</li>
        <li>Scoped CSS — стили принадлежат компоненту, в котором объявлена разметка; глобальные правила задаются явно.</li>
        <li>Файловый routing — <code>src/routes/about/+page.svelte</code> создаёт страницу <code>/about</code>; для навигации используются обычные ссылки.</li>
        <li><code>&lt;svelte:head&gt;</code> — заголовок вкладки и метаданные страницы.</li>
        <li><code>+layout.svelte</code> — общий каркас страниц; при клиентских переходах общий layout сохраняется, при перезагрузке создаётся заново.</li>
        <li><code>/chats/[chatId]</code> — динамический маршрут: выбор чата находится в URL, а ссылки поддерживают прямое открытие и историю браузера.</li>
        <li><code>load</code> в <code>+page.server.ts</code> — выполняется только на сервере, читает <code>params.chatId</code>, находит чат и возвращает <code>chatId</code> с заголовком в prop <code>data</code>; неизвестный ID вызывает HTTP 404. Возвращённые данные доступны браузеру — секреты туда не включаем.</li>
        <li>Universal <code>+page.ts</code> — может выполняться и на сервере, и в браузере; подходит для загрузки без серверных секретов.</li>
        <li><code>+error.svelte</code> и <code>$app/state</code> — показывают статус и сообщение ошибки, например 404 для неизвестного chatId.</li>
        <li><code>navigating</code> из <code>$app/state</code> — состояние незавершённого клиентского перехода; используется для общего индикатора навигации.</li>
        <li><code>$derived(data.chatId)</code> — отслеживает новый параметр при переиспользовании страницы; <code>afterNavigate</code> очищает черновик после перехода.</li>
      </ul>
    </section>
  </main>
</div>

<style>
  .about {
    padding: 36px 24px;
  }
  .about header {
    margin-bottom: 24px;
  }
  .about h1 {
    margin: 0;
    font-size: clamp(24px, 3vw, 34px);
    line-height: 1.2;
  }
  .about main {
    font-size: 16px;
    line-height: 1.5;
  }
  .back-link {
    display: inline-block;
    margin-top: 8px;
    font-size: 14px;
    color: #0070f3;
    text-decoration: none;
  }
  .back-link:hover {
    text-decoration: underline;
  }
</style>
