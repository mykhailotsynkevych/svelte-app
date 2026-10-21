<svelte:head>
  <title>Über das Projekt | Svelte Lab</title>
  <meta
    name="description"
    content="Ein Lernprojekt, um Svelte 5 ausgehend von React kennenzulernen."
  />
</svelte:head>

<div class="about">
  <header>
    <a href="/" class="back-link">← Zurück zum Workspace</a>
    <h1>Über Svelte <span>Lab</span></h1>
  </header>
  <main>
    <p lang="de">
      Dieses lokale Lernprojekt hilft dabei, Svelte 5 ausgehend von React zu erkunden.
      Es verbindet einen kleinen Chat-Workspace mit Beispielen für SvelteKit-Routing
      und serverseitige Formularvalidierung.
    </p>
    <section lang="de" aria-labelledby="concepts-title">
      <h2 id="concepts-title">Bisher behandelte Themen</h2>
      <ul>
        <li><code>$state</code> — reaktiver Zustand ohne Setter, einschließlich tiefer Reaktivität einfacher Objekte und Arrays.</li>
        <li><code>$derived</code> — berechnete Werte mit automatisch erkannten Abhängigkeiten, ohne zusätzlichen State oder Effect.</li>
        <li><code>onclick</code> und <code>onsubmit</code> — Event-Handler; <code>preventDefault()</code> verhindert das Standardverhalten eines Formulars.</li>
        <li><code>bind:value</code> — Zwei-Wege-Bindung eines Eingabefelds.</li>
        <li><code>$props()</code> — typisierte Props mit optionalen Eigenschaften und Standardwerten.</li>
        <li>Callback-Props — die Kindkomponente meldet eine Aktion, die Elternkomponente aktualisiert den State; ähnlich wie „Lifting State Up“ in React.</li>
        <li><code>$bindable()</code> und <code>bind:draft</code> — ausdrücklich erlaubte Zwei-Wege-Bindung eines Props zwischen Komponenten.</li>
        <li><code>{'{#each messages as message, index (message.id)}'}</code> — keyed list mit stabilem Schlüssel; der Index dient der Nummerierung, nicht der Identifikation.</li>
        <li><code>children</code>, <code>Snippet</code> und <code>{'{@render children()}'}</code> — Komposition mit Template-Fragmenten.</li>
        <li>Benannte Snippets mit Parametern — ähnlich Render-Props in React; <code>Snippet&lt;[Message, number]&gt;</code> typisiert die Argumente.</li>
        <li>Scoped CSS — Styles gehören zur Komponente, in der das Markup definiert ist; globale Regeln werden ausdrücklich festgelegt.</li>
        <li>File-based Routing — <code>src/routes/about/+page.svelte</code> erstellt die Seite <code>/about</code>; navigiert wird mit normalen Links.</li>
        <li><code>&lt;svelte:head&gt;</code> — Seitentitel und Metadaten.</li>
        <li><code>+layout.svelte</code> — gemeinsamer Seitenrahmen, der bei clientseitigen Übergängen erhalten bleibt und beim Neuladen neu erstellt wird.</li>
        <li><code>/chats/[chatId]</code> — dynamische Route: Die Chat-Auswahl steckt in der URL; Links ermöglichen Direktaufruf und Browser-Verlauf.</li>
        <li><code>load</code> in <code>+page.server.ts</code> — läuft nur auf dem Server, liest <code>params.chatId</code>, findet den Chat und gibt ID sowie Titel über <code>data</code> zurück. Unbekannte IDs führen zu HTTP 404.</li>
        <li>Universal-<code>+page.ts</code> — kann auf dem Server und im Browser laufen; geeignet für Datenladen ohne serverseitige Geheimnisse.</li>
        <li><code>+error.svelte</code> und <code>$app/state</code> — stellen Fehlerstatus und Meldung dar, zum Beispiel 404 bei einer unbekannten Chat-ID.</li>
        <li><code>navigating</code> aus <code>$app/state</code> — zeigt einen laufenden clientseitigen Navigationsvorgang an.</li>
        <li>Form Actions, <code>request.formData()</code>, <code>fail(400, ...)</code> und <code>use:enhance</code> — serverseitige Validierung mit Erhalt der Eingaben und optionalem Absenden ohne Neuladen.</li>
        <li><code>$derived(data.chatId)</code> — reagiert auf einen neuen Routenparameter; <code>afterNavigate</code> leert den Entwurf nach der Navigation.</li>
        <li>Serverseitige Formularvalidierung — prüft Eingaben, gibt feldbezogene Fehler zurück und speichert oder versendet keine Daten.</li>
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
