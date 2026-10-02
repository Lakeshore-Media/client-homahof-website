# Entscheidungen

## Newsletter: Brevo statt AcyMailing (2026-09-14)
AcyMailing hängt an Joomla und stirbt mit der alten Website. Lizenz abgelaufen,
Account-Zugang über Ex-Mitarbeiter Jürgen verloren.

## Repermission-Mailing statt Weiternutzung (2026-09-24, einstimmig)
2.303 Adressen stammen aus einem Import am 08.11.2021 und haben keinen
Einwilligungsnachweis. Susanne: „klar Schiff statt 10 Jahre Altlasten",
Peter und Birgitt stimmen zu.

**Verworfen:** Meine Empfehlung war, sie zu übernehmen und in Brevo zu markieren
(Risiko bleibt wie es ist, Verteiler bleibt groß). Der Verein wollte den sauberen
Weg, auch um den Preis, dass sich der Verteiler etwa halbiert.

## Brevo-Tarif: Free + Prepaid-Guthaben statt Monatspaket (2026-09-30)
Preise direkt bei Brevo abgelesen:
- Prepaid: 5.000 = 30 € · 20.000 = 90 € · 50.000 = 150 €, kein Ablaufdatum
- Pakete sind **kontaktlimitiert**: 5.000 Mails/Mon = nur 500 Kontakte,
  10.000 = 1.500, erst 20.000 Mails geben 500.000 Kontakte (25,25 €/Mon)

Bei ~2.600 Empfängern nach der Repermission wären das 303 €/Jahr im Paket
gegen rund 100 €/Jahr über Guthaben. Empfehlung: 50.000 Credits für 150 €.

**Geklärt am 2026-10-02 (kein Supportticket nötig):** Das Logo verschwindet mit
gekauftem Guthaben. Die Brevo-Hilfe sagt wörtlich: „Mit Prepaid-E-Mail-Guthaben hast
du Zugriff auf alle Funktionen des Starter-Pakets sowie auf das Add-on Remove Brevo
logo (Brevo-Logo entfernen)."
(help.brevo.com/hc/de/articles/208589409 → Abschnitt „Prepaid-E-Mail-Guthaben")

Der scheinbare Widerspruch war keiner: Die Free-FAQ („E-Mails aus dem Free-Paket haben
**immer** das Sent-with-Brevo-Logo") beschreibt den Free-Plan **ohne** Guthaben. Mit
Guthaben ist es kein Free-Versand mehr.

**Mitgekauft wird damit auch das Wegfallen des 300-Mails-pro-Tag-Limits** — das ist der
wichtigere Punkt. Ohne Guthaben erreicht eine Kampagne an 2.136 Kontakte nur 300 Leute
pro Tag und muss sieben Mal von Hand per „Requeue" nachgeschoben werden.

**Bleibt trotz Guthaben:** die Grenze von 2.000 eindeutigen Kontakten in Automatisierungen.
Für die Anmeldebestätigungen unkritisch — die laufen über die Transactional-API, nicht
über eine Automatisierung.

## Absenderadresse: news@, nicht info@ (2026-09-30, Susanne)
`news@homa-hof-heiligenberg.de` ist seit Jahren die gewohnte Absenderadresse und
bleibt. `info@` nur in der Signatur. Der Konto-Login ist `info@` — das ist eine
getrennte Einstellung und kein Widerspruch.

## Kein Umzug von Netlify zu Strato (geprüft 2026-09-30)
Machbar, aber 3–4 Tage. Statik wäre trivial, der Rest nicht:
zwei Netlify Functions (175 Zeilen Node) müssten nach PHP, vier Formulare
bräuchten PHP+MySQL, und **Decap ist der Blocker** — `git-gateway` und Netlify
Identity sind Netlify-Dienste. Ohne sie bräuchte Sonja einen GitHub-Account.

**Mittelweg, falls das Thema wiederkommt:** Nur die Formulardaten nach Strato
(ca. 1 Tag). Dann liegen die personenbezogenen Daten in Deutschland, CMS und
Website bleiben wo sie sind.

## Teilnehmerübersicht: nicht über Brevo (Empfehlung 2026-09-30, Entscheidung offen)
Brevo bekommt bei einer Anmeldung nur E-Mail und Veranstaltungsschlüssel —
**kein Name, keine Teilnehmerzahl**. Genau die Daten, die Susanne sehen will,
liegen ausschließlich in den Netlify-Formulardaten.

Dazu: Listen je Veranstaltung hieße Handarbeit vor jedem Termin, und
Automationen sind im Free-Tarif auf 2.000 eindeutige Kontakte begrenzt.

Vorschlag: geschützte Seite, die die Netlify-Submissions per API ausliest.

## Individuelle Bestätigungsmails über das CMS (2026-10-01, umgesetzt)
Statt pro Veranstaltung ein eigenes Brevo-Template: ein optionales CMS-Feld
„Zusatztext für die Anmeldebestätigung", das als `EVENT_HINWEIS` durchgereicht
wird. Susanne schreibt den Hinweis dort, wo sie die Veranstaltung ohnehin anlegt.
