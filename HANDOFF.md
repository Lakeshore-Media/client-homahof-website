---
projekt: Homa-Hof Heiligenberg — Website, Shop, Newsletter
stand: 2026-10-02
status: Go-Live steht aus, Brevo-Migration läuft, Konto noch im Free-Tarif
naechster_schritt: Guthaben kaufen (sonst nur 300 Mails/Tag), Dateien 04/05/02 importieren, dann Domains auf Netlify umstellen
---

## Ziel

Neue Website (Netlify) und redesignter Shopware-Shop lösen die alte Joomla-Seite ab.
Gleichzeitig zieht der Newsletter von AcyMailing (stirbt mit Joomla) nach Brevo.

## Stand

- ✅ Website inhaltlich fertig, alle Bildwünsche von Birgitt und Peter Maier umgesetzt (2026-10-02, Commit `fd3603d`)
- ✅ Vorschau läuft: homahof-design-2026-website.netlify.app liefert 200, neue Bilder sind live (geprüft 2026-10-02)
- ⚠️ **Go-Live war für 2026-10-01 verabredet und ist nicht passiert.** www.homa-hof-heiligenberg.de zeigt weiter die alte Joomla-Seite (Apache, geprüft 2026-10-02)
- ✅ Brevo-Absender `news@homa-hof-heiligenberg.de` aktiv, Domain verifiziert (laut Raeto 2026-10-02)
- ✅ Shop: Gewährleistungshinweis live (laut Raeto 2026-09-28)
- ✅ Brevo-Import Datei `01_newsletter_aktiv.csv` **durch** — Liste „Homa Hof Newsletter" (ID 3) hat 2.136 Kontakte = 2.132 + 4 Tests (per MCP geprüft 2026-10-02)
- ✅ Attribute `OPTIN_DATUM`, `OPTIN_IP`, `OPTIN_QUELLE` als Typ **Text** angelegt (geprüft 2026-10-02). Bei den Dateien 04/05/02 genauso halten
- ⚠️ **Konto steht noch im Free-Tarif** (`plan: free`, 300 Mails/Tag, geprüft 2026-10-02). Das Prepaid-Guthaben ist nicht gekauft. Solange das so ist, erreicht ein Newsletter an die 2.136 Kontakte nur 300 Leute am Tag und muss sieben Mal von Hand per „Requeue" nachgeschoben werden
- ❌ Shop-Redesign (Kassenbereich, weißer Hintergrund), Erklärvideo, Teilnehmerübersicht: offen

## Nächster Schritt

1. **Guthaben kaufen** (Empfehlung 50.000 Credits / 150 €). Hebt das 300-pro-Tag-Limit auf und entfernt das „Sent with Brevo"-Logo — beides Voraussetzung für den ersten echten Newsletter. Birgitt ist Kontoinhaberin, Zahlung per Lastschrift oder PayPal
2. `04_foerdermitglieder.csv` (38) in eigene Liste
3. `05_blocklist.csv` (641) — **mit Schalter „E-Mail-Kontakte auf die Blocklist setzen"**
4. `02_repermission.csv` (2.310) in eine eigene Liste „Repermission 2026", **nicht am selben Tag** wie Datei 01 (die lief am 02.10.)
5. Danach Go-Live: Domains auf Netlify, Shop-Theme kompilieren

Dateien liegen in `~/Downloads/brevo-import/`.

## Blocker / wer wartet auf wen

| seit | was | bei wem |
|---|---|---|
| 2026-10-01 | Go-Live-Termin verstrichen, kein neuer vereinbart | Raeto |
| 2026-09-30 | **Guthaben noch nicht gekauft** — Konto im Free-Tarif, 300 Mails/Tag. Kostenmail vom 30.09. unbeantwortet | Susanne/Birgitt |
| 2026-09-30 | Entscheidung Teilnehmerübersicht (geschützte Seite vs. Brevo) | Susanne/Peter |
| 2026-09-30 | Birgitts Daumen zur Absenderadresse `news@` | Birgitt |
| 2026-09-25 | Shop-Lieferländer: Versandseite passt nicht zur Einstellung — Mail unbeantwortet | Susanne |

**Erledigt 2026-10-02:** Brevo-Logo-Frage — Guthaben schaltet Starter-Funktionen plus
„Remove Brevo logo" frei, kein Supportticket nötig. Belege in `.handoff/decisions.md`.

## Nicht verhandelbar

1. **Vor jedem Push `git pull --rebase`** — Sonja committet übers CMS direkt auf `main`
2. **Repermission-Mailing in Etappen** (erst ~300, dann Bounce-Quote prüfen). Brevo pausiert ab 2 % Hard Bounces, die zweite Sperrung kann das Konto dauerhaft deaktivieren
3. **Beim Import „Nicht ausgefüllte Attribute löschen" aus lassen** — sonst überschreiben leere IP-Felder vorhandene Nachweise
4. **Die 521 aus `03_inaktiv_pruefen.csv` nicht anschreiben**, solange unklar ist, ob es Bounces waren
5. **Rohdatei der Newsletter-Liste nie verändern** — einziger Nachweis der Einwilligungen, Joomla erst danach abschalten

## Wo liegt was

| Was | Wo |
|---|---|
| Arbeitsordner | `~/Documents/GitHub/Homahof Design 2026 – v3/` |
| Repo | `Lakeshore-Media/client-homahof-website`, Branch `main` |
| Vorschau | homahof-design-2026-website.netlify.app |
| Import-Dateien | `~/Downloads/brevo-import/` (5 CSVs) |
| Rohexport AcyMailing | `~/Downloads/Homahof_Newsletter_Liste_an_und_Abmeldungen_2026-09-24.csv` |
| Brevo-Templates (Quellstand) | `brevo-templates/` im Repo |
| Alter Handoff, AVV, Projektstand | `~/Documents/Homahof_Uebergabe/` |
| Call-Transkript 24.09. | Sally, Recording `7c30ae8b-82bb-4703-a4bd-82a8592b2ab8` |

Technische Details zum Code: `CLAUDE.md` im Repo. Projekt-Eckdaten: Memory `project_homahof`.

## Prüfen, ob es noch stimmt

```bash
cd ~/Documents/GitHub/"Homahof Design 2026 – v3" && git pull --rebase && git log --oneline -5
curl -sI https://www.homa-hof-heiligenberg.de/ | head -3          # noch Apache = alte Seite
curl -s -o /dev/null -w "%{http_code}\n" https://homahof-design-2026-website.netlify.app/
wc -l ~/Downloads/brevo-import/*.csv                               # 2133/2311/522/39/642 inkl. Kopfzeile
```

Brevo-Stand über den MCP: `accounts_get_account`, `lists_get_lists`, `senders_get_senders`.

## Nur bei Bedarf lesen

| Datei | Wann |
|---|---|
| `.handoff/decisions.md` | Wenn jemand fragt, warum Prepaid statt Paket, warum Repermission, warum kein Strato-Umzug |
| `.handoff/gotchas.md` | Vor jedem Brevo-Import, vor Arbeit an den Netlify Functions, bei Bildauswahl |
| `.handoff/context.md` | Wer ist Peter Maier, wer entscheidet was, welche Adresse wofür |
| `.handoff/log.md` | Was in welcher Sitzung passiert ist |
