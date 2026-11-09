# Log

## 2026-11-08
Stand aufgenommen und Handoff neu geschrieben. **Die Website ist live** —
www.homa-hof-heiligenberg.de antwortet über Netlify Edge. Brevo-Listen abgelesen:
Liste 3 steht bei 2.647 (+16 seit dem 30.10., Nachläufer von Etappe 3).

## 2026-10-28 bis 10-30
Repermission-Etappe 3 (372 Altadressen) versandt, Kampagne 15. Ergebnis ist der
Warnschuss des Projekts: 168 Softbounces (45 %), 5 Hardbounces (1,34 %),
Öffnungsrate 17,6 % — gegen 2 % / 0,31 % / 60,5 % bei Etappe 2. Netto ~21
Bestätigungen. Daraus die Entscheidung: **Etappe 4 (410 nie-Öffner) nicht ohne
vorgeschaltete Adressvalidierung und nicht ohne Reputationspause.**

Die Bounce-Gründe sind über den Brevo-MCP nicht zu holen —
`campaign_analytics_get_email_event_report` deckt nur transaktionale Mails ab und
gibt für Kampagnen `{}` zurück. Nur im Panel einsehbar.

Nebenbei gelernt: `sender` nimmt entweder ID oder E-Mail, nie beides (HTTP 400);
bei ID-only steht `[DEFAULT_FROM_NAME]` als Absendername in der Mail.

## 2026-10-15 bis 10-16
Etappen 1 (250) und 2 (1.278) versandt, Kampagne 14. Etappe 2 lief sauber:
97,7 % zugestellt, 479 Klicks auf „Ja, ich bleibe dabei".

## 2026-10-02
Brevo-Import begonnen. Fünf Import-Dateien aus dem AcyMailing-Rohexport gebaut
und geprüft (`~/Downloads/brevo-import/`). Beim Mapping-Screenshot einen Fehler
im Namens-Split entdeckt („Frau Gabriele Plate" → VORNAME „Frau") und behoben,
dazu kleingeschriebene Vornamen kapitalisiert. Template-Links auf die kanonische
www-Domain korrigiert. Handoff angelegt.

**Dabei aufgefallen:** Der Go-Live vom 01.10. hat nicht stattgefunden,
www.homa-hof-heiligenberg.de liefert weiter die alte Joomla-Seite.

## 2026-10-01
CMS-Feld „Zusatztext für die Anmeldebestätigung" eingebaut (`a45e5a0`), reicht
als `EVENT_HINWEIS` ans Brevo-Template durch. Beide Brevo-Templates als
Quellstand ins Repo geholt (`fd3603d`) — sie existierten vorher nur in Brevo.

## 2026-09-30
Birgitts Rückmeldung umgesetzt (`097ff25`): Gemeinschaft statt Einzelperson auf
„Leben und Arbeiten", mehr Stimmung in der Galerie, Mitmachen-Bild in höherer
Auflösung neu entwickelt. Brevo-Preise direkt abgelesen und Gegenüberstellung
für Susanne gebaut. Strato-Umzug geprüft (3–4 Tage, Decap ist der Blocker).

## 2026-09-28
Benjamins September-Material eingebaut (`5e42a39`): Ernte-Motive an fünf Stellen,
FAQ-Hero-Zuschnitt gefixt. Call-Transkript vom 24.09. ausgewertet, To-Do-Liste
bis zum Go-Live angelegt.

## 2026-09-24
Call mit Susanne, Birgitt und Peter Maier. Go-Live auf 01.10. gelegt,
Repermission-Mailing beschlossen, Brevo-Konto auf `info@` umgestellt.
Drei Bildstellen aus Birgitts Liste eingebaut (`145da32`) — im Call teilweise
wieder verworfen.
