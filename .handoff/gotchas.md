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

## Brevo-API-Schlüssel läuft nach 90 Tagen Inaktivität ab (geprüft 02.10.2026)

Beim Erstellen lässt sich „keine Ablaufdauer" wählen, der Schlüssel hat dann kein
Ablaufdatum. Das heißt aber nicht, dass er dauerhaft gilt. Brevo schreibt:

> „Um die Sicherheit zu erhöhen und das Risiko durch ungenutzte Zugangsdaten zu
> reduzieren, laufen inaktive API-Schlüssel nach 90 Tagen ab. Sie erhalten
> E-Mail-Benachrichtigungen 7 Tage vor dem Ablauf und am Ablaufdatum."

(help.brevo.com/hc/de/articles/209467485, Abschnitt „Best Practices für API-Schlüssel")

**Warum das hier gefährlich ist:** In einer ruhigen Phase ohne Newsletter- und
Veranstaltungsanmeldungen wird `BREVO_API_KEY` drei Monate lang nicht benutzt und
verfällt. Danach schlagen beide Functions fehl — und `event-confirm` ist
fire-and-forget: Der Fehler blockiert die Navigation nicht, die Besucherin sieht
weiter die Danke-Seite, und die Bestätigungsmail kommt einfach nicht an. Das fällt
niemandem auf.

**Die Warnmails gehen an den Kontoinhaber, also an `info@homa-hof-heiligenberg.de`
und damit an Birgitt — nicht an Raeto.** Birgitt muss wissen, dass eine Brevo-Mail mit
„API-Schlüssel läuft ab" keine Werbung ist und sofort weitergeleitet gehört.

**Gegenmittel, nach Aufwand:**
1. Birgitt Bescheid geben (kostet nichts, hängt aber daran, dass sie die Mail erkennt)
2. Einen Monatsping einrichten, der den Schlüssel wachhält — eine Netlify Scheduled
   Function, die z. B. `GET /v3/account` aufruft. Setzt die 90 Tage zuverlässig zurück
3. In beiden Functions einen fehlgeschlagenen Brevo-Call wenigstens protokollieren,
   damit ein stiller Ausfall im Netlify-Log sichtbar wird

Für die SMTP-Schlüssel gilt dasselbe in strenger: Dort meldet Brevo schon nach
3 Monaten ohne Nutzung die Deaktivierung an. Der Homa-Hof nutzt SMTP nicht,
sondern die API — relevant wird das nur, falls jemand auf SMTP-Versand umstellt.

## Benjamins Bildmaterial ist hochgerechnet, nicht nativ 4K (gemessen 02.10.2026)

Die Dateien aus `~/Downloads/Homa-Hof Bildauswahl 22. September/` sind alle
3840×2160 — aber die Auflösung ist nicht echt. Messung: Bild auf 50 % verkleinern,
wieder auf 200 % vergrößern, Abweichung (RMSE) zum Original messen. Je weniger
Abweichung, desto weniger echtes Detail war vorhanden.

| Datei | echtes Detail |
|---|---|
| Echtes Foto (`Archivbilder/Mitmachen/imgi_3_a-mitmachen.jpg`) | 0,069 |
| `43_Gruppe_im_Obstgarten` | 0,030 |
| `46_Luftbild_Apfelernte` | 0,037 |
| `48_Zu_zweit_im_Beet` | 0,011 |
| `52_Haende_bei_der_Ernte` | 0,005 |

Alle 18 Motive sind Video-Standbilder, kein einziges ist ein Foto. Das deckt sich
mit der Commit-Notiz von `145da32`: „4K-Video-Stills, KI-hochskaliert — bei
Nahaufnahmen sind die Upscale-Artefakte sichtbar."

**Konsequenz: Nachträgliches Upscaling bringt nichts.** Getestet mit Higgsfield
(bytedance, 2 Credits) — das Ergebnis ist kaum vom Original zu unterscheiden, weil
ein bereits hochgerechnetes Bild erneut hochgerechnet wird. Magnific wäre stärker,
kostet aber mindestens 90 Credits pro Bild; das Konto stand am 02.10. bei 7.

Ein *kreativer* Upscaler würde Details erfinden. Für einen Verein, der echte
Menschen und echte Beete zeigt, ist das keine Option.

**Der einzige echte Weg:** Originaldateien bei Benjamin (benjamin@indiegene.studio)
anfragen — entweder Fotos vom Drehtag oder die Original-Videoclips (C4873–C4928 vom
22.09. plus Drohne). Vom April-Dreh liegen die Originale noch in
`~/Downloads/swisstransfer_487d8dac-.../` mit rund 140 Mbit/s bei 4K — daraus lassen
sich native Standbilder ziehen. Die September-Clips sind auf keinem Laufwerk
auffindbar (geprüft 02.10., inkl. RKB films und Extreme SSD).

**Was bei den vorhandenen Bildern hilft:** nur Helligkeit. Sie liegen im Mittel bei
0,55–0,69 statt 0,50 und wirken deshalb ausgebrannt. `-modulate 85,100,100` plus
`-sigmoidal-contrast 2,48%` reicht. Finger weg von Sättigung und Weißabgleich: Ein
Grey-World-Abgleich kippt die Bäume ins Magenta und legt die Upscale-Artefakte frei,
weil eine Wiese im Durchschnitt eben nicht neutralgrau ist.
