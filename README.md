# Svelte Lab

Ein kleines Lernprojekt für den Umstieg von React/Next.js auf Svelte 5, SvelteKit 3 und TypeScript.
Verwendet wird Node 24 LTS. Svelte und SvelteKit haben unabhängige Versionsnummern.
Die Chatdaten liegen nur im Arbeitsspeicher. Es gibt noch keine API, KI oder dauerhafte Speicherung.

## Starten

```sh
nvm use
npm ci
npm run dev -- --open
```

Typprüfung und Svelte-Diagnosen: `npm run check`.
Produktionsbuild: `npm run build`. Für ein Deployment muss ein passender Adapter gewählt werden.

## Bisher behandelte Themen

| Svelte / SvelteKit | Bedeutung und Vergleich mit React / Next.js |
| --- | --- |
| `$state` | Reaktiver Zustand ohne Setter. Einfache Objekte und Arrays sind tief reaktiv; `messages.push(...)` aktualisiert daher die UI. |
| `$derived` | Berechneter Wert mit automatisch erkannten Abhängigkeiten. Ähnlich einer Berechnung während des Renderns; kein zusätzlicher State oder Effect nötig. |
| `$props()` | Typisierte Props, Standardwerte und Callbacks. Eine direkte Destrukturierung von `$props()` bleibt reaktiv. |
| Callback-Props | Daten fließen nach unten, Aktionen über Funktionen zum Elternteil – ähnlich wie „Lifting State Up“ in React. |
| `bind:value` | Zwei-Wege-Bindung eines Eingabefelds statt einer manuellen Kombination aus `value` und `onChange`. |
| `$bindable()` | Erlaubt eine Bindung eines Props ausdrücklich. `bind:draft` verbindet den Formularentwurf mit dem State der Seite, ohne eine zweite Kopie anzulegen. |
| `onclick`, `onsubmit` | Handler für native Events. `preventDefault()` verhindert das Standardverhalten beim Absenden eines Formulars. |
| `{#each ... (message.id)}` | Liste mit stabilem Schlüssel, vergleichbar mit `map` und `key` in React. Der Index dient der Nummerierung, nicht als Identität. |
| `children: Snippet` | Verschachteltes Markup als Prop, Ausgabe mit `{@render children()}`. Ähnelt React-Children, ist aber ein Template-Fragment und kein `ReactNode`. |
| Benannte Snippets | `item(message, index)` definiert das Nachrichten-Template, ähnlich einem Render-Prop. `Snippet<[Message, number]>` typisiert seine Argumente. |
| Scoped CSS | Styles gelten für das Markup der jeweiligen Komponente. Gemeinsame Regeln werden ausdrücklich mit `:global` definiert. |
| File-based Routing | Der Ordner definiert den URL-Abschnitt, `+page.svelte` die Seite. Vergleichbar mit `app/.../page.tsx` im Next.js App Router. |
| `<a href="/about">` | Interne Navigation ohne separate Link-Komponente. Nach der Hydrierung verarbeitet SvelteKit passende Links clientseitig. |
| `<svelte:head>` | Seitentitel und Metadaten im Dokumentkopf. |
| `+layout.svelte` | Gemeinsamer Seitenrahmen mit der aktuellen Seite in `children`. Das Layout bleibt bei clientseitiger Navigation erhalten, nicht aber nach einem Neuladen. |
| `/chats/[chatId]` | Dynamische Route: `params.chatId` stammt aus der URL. `/` leitet zu `/chats/svelte` weiter. |
| `+page.server.ts` / `load` | Serverfunktion sucht einen Chat und gibt `{ chatId, title }` als `data` zurück. Unbekannte IDs führen mit `error()` zu HTTP 404. Die Funktion läuft nur auf dem Server; zurückgegebene Daten sind trotzdem im Browser sichtbar. |
| `+page.ts` / Universal-`load` | Kann auf dem Server oder im Browser laufen. Hier leitet die Startseite `/` zu `/chats/svelte` weiter; serverseitige Geheimnisse gehören nicht hierher. |
| Form Actions in `+page.server.ts` | Verarbeiten Formular-POSTs auf dem Server. `request.formData()` liest die Eingaben; `fail(400, ...)` gibt Fehler und Eingabewerte an die Seite zurück. |
| `use:enhance` | Verbessert ein normales HTML-Formular von SvelteKit: Mit JavaScript wird es ohne Neuladen abgesendet. Ohne JavaScript funktioniert es weiterhin. |
| `+error.svelte` | Fehlerseite mit reaktivem `page.status` und `page.error` aus `$app/state`. Ein HTTP-404-Fehler wird nicht als leerer Chat dargestellt. |
| `navigating` aus `$app/state` | Zeigt eine laufende clientseitige Navigation an. Geeignet für einen allgemeinen Fortschrittsindikator, nicht für das initiale SSR. |
| `$derived(data.chatId)` | Der aktive Chat wird aus der URL abgeleitet. SvelteKit kann die Seite beim Wechsel des Parameters wiederverwenden und `data` aktualisieren. |
| `afterNavigate` | Löscht den Entwurf nach einer Navigation. Nachrichten bleiben im lokalen Seiten-State beim Chatwechsel erhalten, gehen beim Neuladen oder beim Wechsel zu `/about` verloren. |

Svelte ist ein UI-Compiler; SvelteKit ergänzt Routing, SSR und Serverfunktionen.
Seiten werden standardmäßig serverseitig gerendert und im Browser hydriert.
Das ist nicht das React-Server-Components-Modell; ein `'use client'` ist hier nicht nötig.
Runes sind Compiler-Syntax und keine importierten Hooks.
Lokaler `$state` ist kein dauerhafter Speicher. Veränderbarer Modul-State auf dem Server
könnte versehentlich zwischen verschiedenen Nutzern geteilt werden.

Der serverseitige `load` sucht den Chat anhand von `chatId` in [createChats](src/lib/chats.ts)
und übergibt ID und Titel an die Seite. Die Nachrichten liegen separat in einem veränderbaren
clientseitigen `$state`, der aus denselben Beispieldaten erstellt wird. Beim Wechsel zwischen
Chats bleibt er erhalten, solange die Seite gemountet ist. Es handelt sich um Beispieldaten,
nicht um eine Datenbank oder API. Die Chatroute liegt in [chats/[chatId]/+page.svelte](src/routes/chats/[chatId]/+page.svelte),
die Prüfung und Datenladung in [+page.server.ts](src/routes/chats/[chatId]/+page.server.ts).

Die Fehlerseite befindet sich in [+error.svelte](src/routes/+error.svelte). Das Layout verwendet
`navigating` aus `$app/state` für einen schmalen Navigationsindikator. Der lokale `load` ist
synchron, daher kann der Indikator nur kurz aufblinken. Es wird keine künstliche Verzögerung
hinzugefügt. Bei echten langsamen Anfragen ist er hilfreicher; für das initiale SSR ist er kein
Fallback.

Das Formular unter `/forms` demonstriert die benannte Action `?/validate`, serverseitige
Validierung und `use:enhance`. Geprüft werden ein Name mit 2–40 Zeichen und eine nicht leere
Nachricht mit höchstens 280 Zeichen. Fehler werden mit Status 400 zurückgegeben; die Eingaben
bleiben im Formular erhalten. Bei Erfolg ist nur die Validierung erfolgreich: Die Daten werden
weder gespeichert noch versendet.

## Offizielle Dokumentation

- [Interaktives Tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte)
- [$state](https://svelte.dev/docs/svelte/$state)
- [$derived](https://svelte.dev/docs/svelte/$derived)
- [$props](https://svelte.dev/docs/svelte/$props)
- [$bindable](https://svelte.dev/docs/svelte/$bindable)
- [Snippets](https://svelte.dev/docs/svelte/snippet)
- [SvelteKit Routing](https://svelte.dev/docs/kit/routing)
