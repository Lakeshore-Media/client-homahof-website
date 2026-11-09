---
projekt: Homa-Hof Heiligenberg — Website, Shop, Newsletter
stand: 2026-11-08
status: Website live · Repermission-Mailing bei 3 von 4 Etappen
naechster_schritt: Etappe 4 (410 nie-Öffner) erst nach Adressvalidierung und Reputationspause senden
---

## Ziel

Neue Website (Netlify) und redesignter Shopware-Shop lösen die alte Joomla-Seite ab.
Der Newsletter ist von AcyMailing (stirbt mit Joomla) nach Brevo gezogen; die Altadressen
werden über ein Repermission-Mailing in Etappen neu eingeholt.

## Stand

- ✅ **Website ist live.** `www.homa-hof-heiligenberg.de` antwortet über Netlify Edge
  (geprüft 2026-11-08). Der Go-Live-Blocker „Brevo stellt keine Mails zu" ist weg
- ✅ Letzter Commit `1f30b56` — Impressum mit dem neuen Vorstand nach der JHV vom 10.10.2026
- ✅ Brevo-Absender: **ein** Sender, ID 1, `news@homa-hof-heiligenberg.de`,
  Name „Homa Hof Heiligenberg e.V.", aktiv
- ⚠️ Im Arbeitsordner liegen **ungetrackte Dateien**: `images/favicon-source.png`,
  drei Feuer-Transition-Videos, `shop-preview/HomaHofTheme.zip`. Entweder committen
  oder in `.gitignore` — die .mov-Dateien gehören nicht ins Repo
- ❌ Shop-Redesign (Kassenbereich, weißer Hintergrund), Erklärvideo,
  Teilnehmerübersicht: weiter offen

## Repermission-Mailing — der aktuelle Kern

**Die Regel bleibt: in Etappen, nie alles auf einmal.** Brevo pausiert ab 2 % Hard
Bounces; die zweite Sperrung kann das Konto dauerhaft deaktivieren.

| Etappe | Datei | Adressen | versandt | Kampagne |
|---|---|---|---|---|
| 1 | `rp_etappe1_test.csv` | 250 | 15.10. | — |
| 2 | `rp_etappe2_aktiv.csv` | 1.278 | 16.10. | 14 |
| 3 | `rp_etappe3_alt.csv` | 372 | 28.10. | 15 |
| 4a | `rp_etappe4a_stumm.csv` | 205 | **offen** | — |
| 4b | `rp_etappe4b_stumm.csv` | 205 | **offen** | — |

Dateien in `~/Downloads/brevo-import/repermission-etappen/`, Kopf
`EMAIL;VORNAME;NACHNAME;OPTIN_DATUM;OPTIN_IP;OPTIN_QUELLE`, semikolongetrennt.
Geprüft: E3 und E4 je vollständig unique, keine Überschneidung untereinander oder mit
E1/E2, keine Syntaxfehler.

### Etappe 3 war der Warnschuss

| | Etappe 2 (1.278) | Etappe 3 (372) |
|---|---|---|
| zugestellt | 1.249 (97,7 %) | **199 (53,5 %)** |
| Softbounces | 25 (2,0 %) | **168 (45,2 %)** |
| Hardbounces | 4 (0,31 %) | 5 (1,34 %) |
| Öffnungsrate | 60,5 % | 17,6 % |
| Klicks auf „Ja, ich bleibe dabei" | 479 | 23 |
| Abmeldungen | 17 | 4 |

45 % Softbounces bei gleichzeitig eingebrochener Öffnungsrate heißt nicht „Postfächer
voll", sondern: die Provider (gmx, web.de, t-online) drosseln die Zustellung an lange
tote Adressen. Die Hardbounce-Schwelle von 2 % ist gehalten, aber die Reputation der
jungen Absenderdomain `news@` leidet.

**Die Bounce-Gründe sind über den MCP nicht auslesbar.**
`campaign_analytics_get_email_event_report` deckt nur transaktionale Mails ab und
liefert für Kampagnen `{}`. Die Gründe stehen nur im Panel unter
Statistiken → Kampagne 15 → Softbounces.

### Vorgehen für Etappe 4 (410 nie-Öffner) — Empfehlung

Die nie-Öffner sind per Definition noch inaktiver als Etappe 3. Ohne Vorsortierung wird
das schlechter, nicht besser.

1. **Reputationspause.** Ein bis zwei Wochen keine Aussendung an Altadressen.
   Dazwischen ein normaler Newsletter an die bestätigte Liste 3 — die öffnet und klickt
2. **Adressvalidierung ist Pflicht, nicht optional.** Rund 4 € für die 410
3. **In zwei Hälften** zu je ~200 senden, mit einigen Tagen Abstand
4. Die **168 nicht zugestellten aus Etappe 3** in denselben Topf: validieren und einmal
   erneut versuchen — sie haben die Frage nie zu sehen bekommen

Nettoergebnis Etappe 3: ~21 Bestätigungen aus 372 Angeschriebenen (5,6 %),
4 Abmeldungen, 0 Beschwerden.

## Brevo-Listen (abgelesen 2026-11-08)

```
 3  Homa Hof Newsletter      2647   ← Zielliste, wächst weiter (30.10.: 2631)
 6  Repermission 2026        1826   ← schrumpft entsprechend (30.10.: 1839)
 7  Fördermitglieder           38
 8  blocklist - abgemeldete   642
 9  RP Etappe 1               250
10  RP Etappe 0                 2
11  RP Etappe 2              1278
12  Namenskorrektur            58
13  RP Etappe 3               372
```

Zwischen 30.10. und 08.11. sind ohne weiteres Mailing 16 Bestätigungen dazugekommen —
die Nachläufer von Etappe 3 tröpfeln noch herein.

## Brevo-Eigenheiten (teuer gelernt)

- **`sender` akzeptiert entweder ID oder E-Mail, nie beides.** Sonst HTTP 400:
  „Only one of Sender ID or Sender Email can be passed for the same request."
- Bei ID-only erscheint als Absendername **`[DEFAULT_FROM_NAME]`** — in der Kampagne
  überschreiben oder dauerhaft unter Einstellungen → Absender setzen
- **`{{ unsubscribe }}` entsteht nur beim Kampagnenversand**, nicht in SMTP-Templates.
  Für eine Testmail den Platzhalter durch Text ersetzen, sonst bricht das Template
- Testmail geht über `email_campaign_management_send_test_email` — das ist der richtige
  Weg, nicht der Umweg über ein SMTP-Template
- „Authorised IPs" im Brevo-Konto blockiert Netlify Functions komplett (401, wechselnde
  IPs). War die Ursache für „Brevo funktioniert nicht"
- Beim Import **„Nicht ausgefüllte Attribute löschen" aus lassen** — sonst überschreiben
  leere IP-Felder vorhandene Einwilligungsnachweise

## Bestätigungsweg

Button in der Mail →
`https://www.homa-hof-heiligenberg.de/newsletter-bestaetigen#e={{ contact.EMAIL }}&v={{ contact.VORNAME }}&n={{ contact.NACHNAME }}`
→ Netlify Function `repermission-confirm.js` → Eintrag in Liste 3.
Kein zweites Double-Opt-In (Commit `aa63602`) — die Einwilligung von damals wird
bestätigt, nicht neu eingeholt.

Quellstand der Mail: `brevo-templates/repermission-2026.html` (10.003 Bytes), identisch
mit dem Versandstand bis auf `&amp;` vs. `&` im Button-Link.

## Aufräumen in Brevo (offen)

- **Template 16** „ZZ TEST – Repermission Etappe 3 (nach dem Test löschen)" — nur für
  eine Testmail angelegt, **kein Delete-Tool im MCP**, muss von Hand weg
- **Template 10** „TEST Repermission 2026 (loeschbar)" — dito
- Alter Draft Kampagne 11
- Liste 12 „Namenskorrektur" (58) — Zweck klären oder löschen
- Testkontakte `raeto@lakeshoremedia.de` (ID 10) und `raeto+rp@lakeshoremedia.de`
  (ID 5154)
- Acht Handarbeitsfälle aus dem Import

## Nicht verhandelbar

1. **Vor jedem Push `git pull --rebase`** — Sonja committet übers CMS direkt auf `main`
2. **Repermission-Mailing in Etappen.** Siehe oben, das ist keine Vorsichtsmaßnahme
   mehr, sondern durch Etappe 3 belegt
3. **Beim Import „Nicht ausgefüllte Attribute löschen" aus lassen**
4. **Die 521 aus `03_inaktiv_pruefen.csv` nicht anschreiben**, solange unklar ist, ob es
   Bounces waren
5. **Rohdatei der Newsletter-Liste nie verändern** — einziger Nachweis der
   Einwilligungen, Joomla erst danach abschalten
6. **Das Absenden von Kampagnen bleibt beim Nutzer.** Claude baut die Kampagne als
   Draft, Raeto drückt ab
7. **Umlaute immer echt schreiben**, nie `ae/oe/ue`

## Wo liegt was

| Was | Wo |
|---|---|
| Arbeitsordner | `~/Documents/GitHub/Homahof Design 2026 – v3/` |
| Repo | `Lakeshore-Media/client-homahof-website`, Branch `main` |
| Live | www.homa-hof-heiligenberg.de (Netlify) |
| Vorschau | homahof-design-2026-website.netlify.app |
| Etappen-CSVs | `~/Downloads/brevo-import/repermission-etappen/` |
| Import-Dateien (Erstimport) | `~/Downloads/brevo-import/` |
| Rohexport AcyMailing | `~/Downloads/Homahof_Newsletter_Liste_an_und_Abmeldungen_2026-09-24.csv` |
| Brevo-Templates (Quellstand) | `brevo-templates/` im Repo |
| Alter Handoff, AVV, Projektstand | `~/Documents/Homahof_Uebergabe/` |
| Call-Transkript 24.09. | Sally, Recording `7c30ae8b-82bb-4703-a4bd-82a8592b2ab8` |

Technische Details zum Code: `CLAUDE.md` im Repo. Projekt-Eckdaten: Memory
`project_homahof`. Shop: Memory `project_homahof_shop`.

## Prüfen, ob es noch stimmt

```bash
cd ~/Documents/GitHub/"Homahof Design 2026 – v3" && git pull --rebase && git log --oneline -5
curl -sI https://www.homa-hof-heiligenberg.de/ | head -3    # Netlify Edge = live
wc -l ~/Downloads/brevo-import/repermission-etappen/*.csv
```

Brevo-Stand über den MCP: `accounts_get_account`, `lists_get_lists`,
`senders_get_senders`, `email_campaign_management_get_email_campaign`.

## Nur bei Bedarf lesen

| Datei | Wann |
|---|---|
| `.handoff/decisions.md` | Warum Prepaid statt Paket, warum Repermission, warum kein Strato-Umzug |
| `.handoff/gotchas.md` | Vor jedem Brevo-Import, vor Arbeit an den Netlify Functions, bei Bildauswahl |
| `.handoff/context.md` | Wer ist Peter Maier, wer entscheidet was, welche Adresse wofür |
| `.handoff/log.md` | Was in welcher Sitzung passiert ist |
