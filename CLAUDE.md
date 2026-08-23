# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt-Kontext

Statische Website für den Homa-Hof Heiligenberg e.V.
- GitHub: `Lakeshore-Media/client-homahof-website` (main branch)
- Netlify: Auto-Deploy aus `main` — kein Build-Schritt, `publish = "."`
- Decap CMS: `/admin/` (Netlify Identity muss im Dashboard aktiviert sein)

## Stack — STRIKT einhalten

- **Kein React, kein Tailwind, kein Framework-Overhead**
- Vanilla HTML5 + CSS Custom Properties + Vanilla JS
- GSAP + ScrollTrigger für Scroll-Animationen
- CSS-Transitions für Hover/einfache Interaktionen

## Design-System

```css
--cream:      #FFFCF5
--cream2:     #FFF8EC
--gold:       #C07818
--gold-light: #F5D88A
--copper:     #B84010
--brown:      #2A1505
--brown2:     #5A3A18
--border:     #EDD9A8
--serif:      'Playfair Display', Georgia, serif
--sans:       'Raleway', system-ui, sans-serif
```

## Architektur

### Seiten
Jede Seite ist eine eigenständige HTML-Datei. Alle teilen:
- Denselben Inline-CSS-Block im `<head>` (kein globales Stylesheet)
- Denselben Footer-Markup
- `js/site-config.js` und `js/cookie-banner.js` am Ende des `<body>`

### Content-Schicht (JSON → JS fetch → DOM)
Dynamische Inhalte werden per `fetch()` aus `content/` geladen und ins DOM gerendert — kein serverseitiges Rendering:

| Datei | Genutzt von | Zweck |
|---|---|---|
| `content/veranstaltungen.json` | `veranstaltungen.html`, `am-hof.html`, `index.html` | Termine, gefiltert nach `category` und `date >= today` |
| `content/downloads.json` | `medien.html` | Downloadliste, gefiltert nach `category` |
| `content/hofladen.json` | `am-hof.html` | Kategorienlisten im Hofladen (`stand` + `categories[].{name, items}`) |
| `content/aktuelles.json` | `aktuelles-beitrag.html`, `medien.html`, `index.html` | Blog/Neuigkeiten |

Event-Kategorien: `seminar`, `hof`, `online`
Download-Kategorien: `aktuell`, `anleitung`, `flyer`, `presse`, `wissenschaft`

### Netlify Functions

**`netlify/functions/brevo-subscribe.js`** — Newsletter DOI
- Empfängt POST `{email, firstName, lastName, source, interests[]}`
- Endpoint: `POST /v3/contacts/doubleOptinConfirmation` (nicht `/v3/contacts`)
- Pflichtfeld im Body: `includeListIds` (nicht `listIds`)
- Env vars: `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID` (=1), `BREVO_DOI_REDIRECT_URL`
- `BREVO_DOI_REDIRECT_URL` muss auf eine **erreichbare** Domain zeigen — sonst schlägt der DOI-Link fehl. Fallback: `homahof-design-2026-website.netlify.app/newsletter-bestaetigt`
- Erfolg: HTTP 204. Kontakt ist erst nach Klick auf den DOI-Link in der Liste.
- Aufgerufen aus `js/site-config.js` → `subscribeToBrevo()` — muss Promise zurückgeben damit Navigation wartet
- Interessen-Attribute in Brevo (boolean): `INT_SEMINARE`, `INT_HOF`, `INT_AGNIHOTRA`

**`netlify/functions/event-confirm.js`** — Veranstaltungs-Bestätigungsmail (transaktional, kein DOI)
- Empfängt POST `{email, vorname, eventTitle, eventDate, eventTime, eventLocation, confirmKey, newsletter}`
- Führt drei Brevo-Calls aus:
  1. `POST /v3/smtp/email` — transaktionale Bestätigungsmail (Template-ID aus `BREVO_EVENT_TEMPLATE_ID`, aktuell 6). Params: `EVENT_TITLE`, `EVENT_DATE`, `EVENT_TIME`, `EVENT_LOCATION`, `VORNAME`. Antwort 201 = Erfolg.
  2. `POST /v3/contacts` mit `updateEnabled: true` — setzt Kontaktattribut `LETZTE_VERANSTALTUNG` auf `confirmKey` (oder Fallback auf `eventTitle`). Funktioniert auch wenn Kontakt schon existiert (überschreibt nur das Attribut, lässt Newsletter-Abo unberührt).
  3. Nur wenn `newsletter === 'ja'`: `POST /v3/contacts/doubleOptinConfirmation` — DOI-Flow wie oben
- `confirmKey` im CMS-Feld pro Event — beim Duplizieren mitgenommen. Leer = Titel als Segmentierungsschlüssel.
- Env vars: `BREVO_API_KEY`, `BREVO_EVENT_TEMPLATE_ID`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL`
- Fire-and-forget aus `submitAnmeldung()` — Fehler blockieren die Navigation nicht
- Danke-Seite: `/danke-anmeldung`

### Newsletter-Flow
1. Formular-Submit → Netlify Forms (Backup) + `return subscribeToBrevo()` → `.then(() => window.location.href = '/danke-newsletter')`
2. Brevo sendet DOI-Mail (Template-ID 1) mit `{{ doubleoptin }}`-Link
3. Klick → Brevo bestätigt → redirect auf `/newsletter-bestaetigt`
- DOI-Template muss in Brevo aktiviert (nicht im Draft-Status) sein
- `subscribeToBrevo()` MUSS `return fetch(...)` haben — fehlendes `return` bricht die Promise-Chain

### Event-Anmeldungs-Flow (`veranstaltungen.html`)
1. Formular-Submit → Netlify Forms (Backup) → `event-confirm` Function (fire-and-forget) → redirect `/danke-anmeldung`
2. Pflichtfelder: Name + E-Mail (mit visueller Fehleranzeige), Bestätigungs-Checkbox
3. Formular hat `data-*`-Attribute: `data-title`, `data-date`, `data-time`, `data-location`, `data-confirm-key`
4. Brevo-Segmentierung: `LETZTE_VERANSTALTUNG` wird bei **jeder** Anmeldung gesetzt — unabhängig vom Newsletter-Opt-in

### Gemeinsame JS-Hilfsmittel (`js/site-config.js`)
- `HOMAHOF.paypalUrl` — PayPal-Spendenlink (HIER und nur hier pflegen): `https://www.paypal.com/donate/?hosted_button_id=KXFDM88VBHQKC`
- `HOMAHOF.iban`, `HOMAHOF.bic`, `HOMAHOF.bank` — Bankdaten (HIER pflegen)
- `HOMAHOF.spendenInner()` — rendert den kompletten Spenden-HTML-Block; `<section id="spenden">` auf jeder Seite wird beim DOMContentLoaded damit befüllt
- `HOMAHOF.newsletterInner()` — rendert den Newsletter-Formular-Block; `<section id="newsletter">` wird damit befüllt
- `HOMAHOF.scrollToBank()`, `HOMAHOF.copyIBAN()`, `HOMAHOF.submitNewsletter()` — zentrale Handlers, nicht mehr inline pro Seite
- `window._fadeObserver` — jede Seite setzt `window._fadeObserver = observer` nach dem IntersectionObserver-Setup; site-config.js observiert damit dynamisch injizierte `.fade-in`-Elemente
- `subscribeToBrevo(email, firstName, lastName, source, interests[])` — löst Brevo DOI aus; `interests` = Array mit Werten `'seminare'`, `'hof'`, `'agnihotra'`

**Sync-Regel**: Spenden- und Newsletter-Abschnitt existieren als leere `<section id="spenden">` und `<section id="newsletter">` Tags in `index.html`, `mitmachen.html` und `am-hof.html`. Inhalt kommt ausschließlich aus `js/site-config.js`. Änderungen am Inhalt nur dort vornehmen.

### Formulare
Netlify Forms (AJAX). Jede Seite mit Formular hat ein verstecktes `<form name="..." netlify hidden>` für die Registrierung. Submissions landen im Netlify Dashboard.

### Decap CMS (`admin/config.yml`)
Verwaltet: Veranstaltungen, Hofladen, Aktuelles, Downloads — alles über `content/*.json`.
Aktivierung: Netlify Dashboard → Identity → Enable, dann Git Gateway aktivieren.

**Select-Felder brauchen `{label, value}`-Paare** — sonst schreibt das CMS den Anzeigetext (`Seminar`) statt des Frontend-Werts (`seminar`) und die Filter greifen nicht mehr.

Der Verein pflegt Termine selbst übers CMS. Diese Commits landen direkt auf `main` → **vor jedem Push `git pull --rebase`**, sonst wird der Push abgelehnt.

## Mobile-Robustheit

Am Ende jedes `<style>`-Blocks steht ein Block `/* mobile overflow guard */`. **Nicht entfernen** — ohne ihn zoomt Android-Chrome bei horizontalem Überlauf die gesamte Seite heraus (shrink-to-fit); die Sektionen decken dann nur einen Teil der Bildschirmbreite ab und der Rest zeigt den Body-Hintergrund. iOS macht das nicht, deshalb fällt es beim Testen am iPhone nicht auf.

Aufbau in drei Stufen:
- **Immer:** `html { overflow-x: hidden }` (nur `html`, **nicht** `body` — sonst stirbt `position: sticky`, z. B. die Filterleiste auf `veranstaltungen.html`), `img/video/iframe { max-width: 100% }`, `min-width: 0` auf Grid-Kindern
- **≤ 700px:** `hyphens: auto` + `overflow-wrap: break-word`, Flex-Zeilen dürfen umbrechen. Bewusst nicht global: am Desktop trennte `break-word` sonst „2000er" in der Jahresspalte der Timeline
- **≤ 340px:** alles einspaltig, `* { min-width: 0 }`, Innenabstände auf 14px. Greift praktisch nur bei stark gezoomten Browsern (ein Kunde surft mit ~200 % Zoom → effektiver Viewport ~200px)

**Testen:** Viewport auf 210px stellen — das reproduziert die Zoom-Situation. Elemente mit `scrollWidth > clientWidth` finden bzw. `width: min-content` messen, um Container zu finden, die nicht schrumpfen können.

Bekannte Fallstricke:
- Inline-`<a>` in einem `display: flex`-Label wird zu einem eigenen Flex-Item → der Text steht nebeneinander statt umzubrechen. **Fließtext in Flex-Containern immer in ein `<span>` wickeln.**
- Karten-Innenabstände (36px) fressen bei schmalem Viewport die halbe Textbreite
- `overflow-x: hidden` auf Leaflet-Bildern bricht die Karte → `.leaflet-container img { max-width: none }`

### Bilder in Karten
Aktuelles-/Blog-Karten schneiden Bilder **nicht** an: `object-fit: contain`, die freie Fläche füllt ein `::before` mit demselben Bild als unscharfer Hintergrund (`--card-bg` wird beim Rendern inline gesetzt). Unter 768px bekommt die Box `height: auto`, wächst also mit dem Bild mit — das Agnihotra-Aktuell-Cover (Hochformat) ist dadurch vollständig lesbar.

## Agnihotra-Zeiten: PDF-Druck

`printPDF(event, pages)` in `agnihotra-zeiten.html` erzeugt zwei Varianten:
- **2 Seiten** — 6 Monate/Seite, Auf- und Untergangszeit zweizeilig übereinander, 9,2pt
- **4 Seiten** — 3 Monate/Seite, Zeiten als zwei Spalten *nebeneinander* (`buildPrintTableWide`), dadurch nur eine Zeile pro Tag und 12,5pt Schrift

Höhenbudget A4 hoch bei 0,9cm Rand: **1054px @96dpi**. 31 Zeilen sind das Limit — jede Änderung an `font-size`, `line-height` oder `padding` der `.print-table` muss dagegen geprüft werden (Höhe von `.print-page` messen), sonst rutscht der Druck auf eine Zusatzseite. Der alte 8,8pt-Stand lag mit 1071px bereits knapp darüber.

Der Cookie-Banner heißt `#priv-notice` (nicht `.cookie-banner`) — muss in `@media print` mit ausgeblendet werden.

## NAS-Pfade (Medien)

- Videos: `/Volumes/RKB films/01_Projects/Homa Hof/99_Master_video/`
- Fotos: `/Volumes/RKB films/01_Projects/Homa Hof/97_Foto_export/`

Bilder im Repo: `images/stills/` (WebP), Archivbilder: `Archivbilder/`
Videos: `videos/` (WebM + MP4), in Git LFS (`.gitattributes` beachten)

Die Hero-Loops lassen sich direkt aus den fertigen Mastern in `99_Master_video/` mit ffmpeg schneiden — kein DaVinci nötig. Zielgrößen: MP4 ~12 MB, WebM ~2,5 MB bei 1920×1080/25fps.

**Hero-Videos werden am Desktop auf ca. 2,75:1 beschnitten** — Einstellungen mit Personen-Nahaufnahmen verlieren dabei die Köpfe. Für den Hero nur weite Einstellungen oder Drohnenflüge verwenden.

## Screenshots / visuelle Prüfung

- Headless Chrome mit `--virtual-time-budget` unterdrückt den IntersectionObserver → alle `.fade-in`-Elemente bleiben unsichtbar. **Ohne** Virtual-Time screenshotten, vorher einmal durch die Seite scrollen.
- Puppeteer liegt in `~/Documents/GitHub/tool-showcase-remotion/node_modules/` (Import über `lib/puppeteer/puppeteer.js`)
- Die Claude-in-Chrome-Extension kann `localhost` nicht laden — für lokale Vorschauen Headless Chrome oder Puppeteer nutzen

## Skills

- ✅ `gsap-scrolltrigger`, `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-performance`
- ✅ `full-output-enforcement` — bei langen Code-Outputs
- ❌ `design-taste-frontend`, `gpt-taste`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui` — falsche Design-Sprache oder setzt React/Tailwind voraus
- ❌ `gsap-react`, `gsap-frameworks` — nicht relevant

## Arbeitsweise

- Antworten auf Deutsch, Code auf Englisch
- Permissions sind bereits freigegeben — kein Warten auf Bestätigung
