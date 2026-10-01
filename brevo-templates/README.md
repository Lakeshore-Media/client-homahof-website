# Brevo-Templates

Die beiden transaktionalen Templates liegen produktiv in Brevo, nicht hier.
Diese Dateien sind der Quellstand zum Nachschlagen und Wiederherstellen —
Brevo bietet über die API **kein Update** bestehender Templates, Änderungen
müssen im Brevo-Editor eingefügt werden (Kampagnen → Vorlagen → Code).

| Datei | Brevo-ID | Env var | Zweck |
|---|---|---|---|
| `template-1-newsletter-doi.html` | 1 | `BREVO_DOI_TEMPLATE_ID` | Double-Opt-in für den Newsletter |
| `template-6-anmeldebestaetigung.html` | 6 | `BREVO_EVENT_TEMPLATE_ID` | Bestätigung einer Veranstaltungsanmeldung |

## Parameter in Template 6

| Parameter | Quelle |
|---|---|
| `EVENT_TITLE`, `EVENT_DATE`, `EVENT_TIME`, `EVENT_LOCATION` | CMS-Felder der Veranstaltung |
| `EVENT_HINWEIS` | CMS-Feld „Zusatztext für die Anmeldebestätigung", optional |
| `VORNAME` | Anmeldeformular |

Alle sind in Liquid-Bedingungen gekapselt (`{% if params.X %}`) — leere Felder
erzeugen keine leeren Kästen.

## Nach dem Go-Live zu prüfen

Beide Templates verlinken auf `https://homa-hof-heiligenberg.de` (Logo,
Datenschutz, Impressum, Veranstaltungs-Button). Vor dem Livegang stand dort
die Netlify-Vorschaudomain. Falls die kanonische Domain `www.` trägt, hier
und in Brevo nachziehen.

**Der Absender beider Templates steht in Brevo separat** und zeigte am
30.09. noch auf `Info@rkbfilms.de` — gehört auf `news@homa-hof-heiligenberg.de`
(Susanne, 30.09.: news@ bleibt die gewohnte Absenderadresse, info@ nur in
die Signatur).
