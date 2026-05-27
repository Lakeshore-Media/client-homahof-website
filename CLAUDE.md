# Homahof Design 2026 – v3

## Projekt-Kontext
Statische Webseite für den Homa-Hof Heiligenberg e.V. — Vanilla HTML/CSS/JS, kein Framework.
GitHub: `Lakeshore-Media/client-homahof-website` (main branch)
Netlify: Deployment aus main branch.

## Stack — STRIKT einhalten
- **Kein React, kein Tailwind, kein Framework-Overhead**
- Vanilla HTML5 + CSS Custom Properties + Vanilla JS
- GSAP + ScrollTrigger für Scroll-Animationen
- CSS-Transitions für Hover/einfache Interaktionen

## Design-System (bestehend, nicht überschreiben)
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

## Skills — was verwenden / was ignorieren
- ✅ `gsap-scrolltrigger`, `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-performance` — aktiv nutzen
- ✅ `full-output-enforcement` — bei langen Code-Outputs einsetzen
- ❌ `design-taste-frontend` — ignorieren (setzt React/Tailwind voraus)
- ❌ `gpt-taste`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui` — ignorieren (falsche Design-Sprache)
- ❌ `gsap-react`, `gsap-frameworks` — nicht relevant

## Aktueller Plan
Plan-Datei: `~/.claude/plans/proud-foraging-cupcake.md`

Offene Tasks (Runde 2):
1. **A** – Footer-Kontrast: `rgba(255,255,255,0.3)` → `0.65`, `13.5px` → `14.5px` (alle 8 Seiten)
2. **C** – am-hof.html Events: Click-to-Expand + Layout-Fix + Link zu veranstaltungen.html
3. **D** – NAS-Bilder: Sichten, umbenennen, kopieren, einbinden (`/Volumes/RKB films/01_Projects/Homa Hof/97_Foto_export/`)
4. **F** – Video-Hintergründe: 4 WebM-Loops vom NAS als Hero-Hintergrund einbinden
5. **G** – Netlify + GitHub + Decap CMS: admin/ + content/ anlegen, veranstaltungen.html datenbankgetrieben

## NAS-Pfade
- Videos: `/Volumes/RKB films/01_Projects/Homa Hof/99_Master_video/`
- Fotos: `/Volumes/RKB films/01_Projects/Homa Hof/97_Foto_export/`

## Arbeitsweise
- Antworten auf Deutsch, Code auf Englisch
- Kein unnötiger Kommentar im Code
- Permissions sind bereits freigegeben — kein Warten auf Bestätigung
