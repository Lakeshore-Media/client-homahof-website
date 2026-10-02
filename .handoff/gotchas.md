# Fallen

## Brevo

**Kontolimits im Free-Tarif** (aus Brevos eigener FAQ, 2026-09-30):
100.000 gespeicherte Kontakte, 300 Mails/Tag, **nur 1 Benutzer**,
Automationen max. 2.000 eindeutige Kontakte, immer „Sent with Brevo"-Logo.
Das 300er-Tageslimit greift auch bei Kampagnen — 2.600 Empfänger wären ohne
Guthaben neun Tage manuelles Nachschieben über „Requeue".

**Sperrgefahr:** Brevo pausiert bei Hard Bounces > 2 %, Abmeldungen > 1 % oder
Beschwerden > 0,2 %. Die zweite Sperrung kann das Konto dauerhaft deaktivieren.
Das Konto ist neu und ohne Versandhistorie — genau die Konstellation, bei der
Brevo besonders genau hinschaut. Repermission deshalb in Etappen.

**Import-Schalter:** „Nicht ausgefüllte Attribute in deinem Import löschen"
muss **aus** bleiben. Bei 810 der 2.132 Kontakte ist die Opt-in-IP leer —
mit dem Schalter würden vorhandene Werte überschrieben.

**Attributtypen:** Brevo schlägt für `OPTIN_DATUM` ein Datumsfeld und für
`OPTIN_IP` ein Zahlenfeld vor. Beides ist falsch — Text nehmen. Bei Datum muss
das Format exakt passen, sonst kippt die Zeile; `87.145.81.138` ist keine Zahl.

**Authorised IPs** im Brevo-Konto blockieren Netlify-Functions komplett (401,
wechselnde IPs). War die Ursache für „Brevo funktioniert nicht". Muss aus bleiben.

**Antwortcodes:** Brevo liefert bei neuen Kontakten 201, nicht 204.
`res.ok` prüfen, nicht auf einen bestimmten Code testen.

**Templates:** Die API kann Templates nur lesen, nicht aktualisieren. Änderungen
müssen im Brevo-Editor rein. Quellstand liegt in `brevo-templates/` im Repo.
Der **Absender ist pro Template separat** eingestellt, zusätzlich zum Konto-Sender.

## Daten aus AcyMailing

**Export-Falle:** Filter in der Abonnentenliste werden auf den Export angewendet.
Vor dem Export alle Filter zurücksetzen, sonst fehlen Datensätze unbemerkt.

**Kodierung:** UTF-8 wählen, nicht ISO-8859-16 (Voreinstellung). Trennzeichen
Semikolon, weil Namen Kommas enthalten können.

**Namen stehen in einem Feld** und enthalten teils Anreden („Frau Gabriele Plate",
„Dr. Gisela Hoppe" — 10 Fälle). Beim Splitten erst Anrede/Titel abtrennen, sonst
steht „Hallo Frau" in der Mail. Manche Einträge sind gar keine Namen
(`isabelladuffrin`, `hr`) — in der Vorlage einen Fallback für leere Vornamen bauen.

**Die Dashboard-Zahlen sind nicht additiv** (Kategorien überlappen). Disjunkt
aufgeteilt ergeben sich exakt 6.278: 2.132 mit Nachweis, 2.310 ohne,
521 inaktiv, 641 abgemeldet, 674 nie bestätigt.

## Website

**Vor jedem Push `git pull --rebase`** — Sonja committet übers CMS auf `main`.

**Mobile-Overflow-Guard** am Ende jedes `<style>`-Blocks nicht entfernen, sonst
zoomt Android-Chrome die ganze Seite heraus. Details in der Repo-CLAUDE.md.

**Hero- und Karten-Zuschnitte schneiden Köpfe ab.** Der FAQ-Hero ist flach und
kappte die Oberkante — gelöst mit `background-position: center 30%`.
Für Heroes nur weite Einstellungen oder Drohnenflüge verwenden.

**Benjamins Material sind 4K-Video-Stills, keine Fotos** (alle 3840×2160,
KI-hochskaliert). Nahaufnahmen zeigen Artefakte — Peter hat sie selbst bemerkt.
Totalen und Luftbilder bevorzugen, Kontrast an den Bestand angleichen
(mean 48–54, Kontrast 21–26) und nur minimal nachschärfen.

**Claude-in-Chrome kann localhost und `file://` nicht laden.** Für lokale
Vorschauen Headless Chrome oder Puppeteer nutzen, oder Zuschnitte mit
ImageMagick simulieren.
