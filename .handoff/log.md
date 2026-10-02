# Log

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
