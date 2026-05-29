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

### Netlify Function
`netlify/functions/brevo-subscribe.js` — empfängt POST mit `{email, firstName, lastName}`, fügt Kontakt zur Brevo-Liste hinzu.
- Env vars: `BREVO_API_KEY`, `BREVO_LIST_ID`
- Aufgerufen aus `js/site-config.js` → `subscribeToBrevo()` — feuert still, blockiert nie den Formular-Submit

### Gemeinsame JS-Hilfsmittel (`js/site-config.js`)
- `HOMAHOF.paypalUrl` — PayPal-Spendenlink (HIER und nur hier pflegen): `https://www.paypal.com/donate?token=gz4U8careXbDl8W_N6fNKGuRi90bScKiMu5bZ9o7qAGFw0WwVKfDtkw0pfWKgF_OmPYle51z0ajAOr0b&locale.x=DE`
- `HOMAHOF.iban`, `HOMAHOF.bic`, `HOMAHOF.bank` — Bankdaten (HIER pflegen)
- `HOMAHOF.spendenInner()` — rendert den kompletten Spenden-HTML-Block; `<section id="spenden">` auf jeder Seite wird beim DOMContentLoaded damit befüllt
- `HOMAHOF.newsletterInner()` — rendert den Newsletter-Formular-Block; `<section id="newsletter">` wird damit befüllt
- `HOMAHOF.scrollToBank()`, `HOMAHOF.copyIBAN()`, `HOMAHOF.submitNewsletter()` — zentrale Handlers, nicht mehr inline pro Seite
- `window._fadeObserver` — jede Seite setzt `window._fadeObserver = observer` nach dem IntersectionObserver-Setup; site-config.js observiert damit dynamisch injizierte `.fade-in`-Elemente
- `subscribeToBrevo(email, firstName, lastName, source)` — Newsletter-Opt-in aus Anmeldeformularen

**Sync-Regel**: Spenden- und Newsletter-Abschnitt existieren als leere `<section id="spenden">` und `<section id="newsletter">` Tags in `index.html`, `mitmachen.html` und `am-hof.html`. Inhalt kommt ausschließlich aus `js/site-config.js`. Änderungen am Inhalt nur dort vornehmen.

### Formulare
Netlify Forms (AJAX). Jede Seite mit Formular hat ein verstecktes `<form name="..." netlify hidden>` für die Registrierung. Submissions landen im Netlify Dashboard.

### Decap CMS (`admin/config.yml`)
Verwaltet: Veranstaltungen, Hofladen, Aktuelles, Downloads — alles über `content/*.json`.
Aktivierung: Netlify Dashboard → Identity → Enable, dann Git Gateway aktivieren.

## NAS-Pfade (Medien)

- Videos: `/Volumes/RKB films/01_Projects/Homa Hof/99_Master_video/`
- Fotos: `/Volumes/RKB films/01_Projects/Homa Hof/97_Foto_export/`

Bilder im Repo: `images/stills/` (WebP), Archivbilder: `Archivbilder/`
Videos: `videos/` (WebM + MP4), in Git LFS (`.gitattributes` beachten)

## Skills

- ✅ `gsap-scrolltrigger`, `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-performance`
- ✅ `full-output-enforcement` — bei langen Code-Outputs
- ❌ `design-taste-frontend`, `gpt-taste`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui` — falsche Design-Sprache oder setzt React/Tailwind voraus
- ❌ `gsap-react`, `gsap-frameworks` — nicht relevant

## Arbeitsweise

- Antworten auf Deutsch, Code auf Englisch
- Permissions sind bereits freigegeben — kein Warten auf Bestätigung
