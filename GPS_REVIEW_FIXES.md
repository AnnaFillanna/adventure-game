# Korrekturen zum unabhängigen GPS-Review von e382ac9

Branch: `fix/gps-walk-review-e382ac9`. Keine Änderung an Main, Production oder Vercel-Zugriffsregeln.

Die unabhängigen Copilot-Regressionen wurden mit unveränderten Erwartungen ins Repository übernommen (nur Importpfade und eine TypeScript-Typanpassung). Vor der Korrektur: **8 fehlgeschlagen, 3 bestanden**. Nach der Korrektur: **alle 11 bestanden**.

| Befund | Korrektur |
|---|---|
| Straßen berühren/überlappen Fußwege bei getrennten Knoten-IDs | Segmentprüfung berücksichtigt Endpunkte, kollineare Überlappungen und 25 cm Kartentoleranz; bestehende Knotenprüfung bleibt erhalten. |
| Wasserpolygone fehlen | Overpass lädt Wasser-Ways und Multipolygon-Relations (`natural=water`, `waterway=riverbank`, `landuse=reservoir`) samt vollständiger Mitgliedsgeometrie; zusätzlich `is_in`/`pivot` für vom Dienst geführte umschließende Flächen. Zusammengesetzte, umgekehrt gerichtete Außenringe werden zusammengesetzt. Offene, mehrdeutige, selbstüberschneidende oder zu große Ringe sperren die Suche. Wegsegmente in/über Wasser und Haltepunkte innerhalb von 20 m zum erfassten Wasserrand werden ausgeschlossen. |
| Belohnung vom getrennten Parallelweg | Plan behält andere kartierte Wegkanten, auch private Wege/Straßen. Bei mehrdeutiger Zuordnung innerhalb von zweimal GPS-Genauigkeit plus 2 m wird kein Fix angenommen. Gemeinsame OSM-Knoten selbst gehören zu beiden Wegen; das erlaubt kein Weiterlaufen auf dem falschen Ast. Gleiche Geometrie ohne gemeinsamen Knoten bleibt mehrdeutig. |
| Unbekannte Zugangsregeln implizit erlaubt | Für vorhandene `access`/`foot`-Werte nur `yes`, `designated`, `permissive`; unbekannte, leere und genehmigungspflichtige Werte sowie `use_sidepath` ausgeschlossen. Fehlende Tags bleiben ausdrücklich eine Datenunsicherheit, keine Zutrittsbestätigung. |
| Unterschiedliche installierte Versionen | `package-lock.json` versioniert; Vercel nutzt `npm ci`. Keine pauschalen Bibliotheks-Upgrades. Saubere lokale Neuinstallation aus dem Lockfile geprüft. |
| Zusätzliche Speicherfelder | Lesen lehnt fremde Schlüssel ab und lässt vorhandene Rohdaten unverändert. Schreiben erstellt ein neues Objekt mit genau `version`, `completed`, `rewarded`, `gold`; auch die Aufgabenliste wird kopiert. |

Zusätzliche Tests prüfen Wasser-Multipolygone mit gedrehten Mitgliedern, defekte Geometrien, Querungen, Gewässerrandabstand, konservative Inselbehandlung, GPS-Mehrdeutigkeit auch auf der geplanten Linie, eindeutigere Positionsmessungen, gemeinsame Wegknoten, Zugangs-Whitelist und Provider-Relationen. Bestehende Tests wurden nicht entfernt oder abgeschwächt.

## Bewusste Grenzen

- Außenringe von Wasserflächen werden konservativ vollständig gesperrt, **auch Inseln/innere Löcher**. Das vermeidet Freigaben durch falsch zugeordnete Innenringe, kann aber tatsächlich begehbare Inselwege ablehnen.
- Kein allgemeiner Flächendaten-Vollständigkeitsnachweis: Overpass-Areale können fehlen oder verzögert sein; unkartierte Wasserflächen, Küsten, Hindernisse und aktuelle Sperrungen bleiben unbekannt. Unvollständige erhaltene Geometrie wird nicht stillschweigend ignoriert.
- Mehrdeutige GPS-Messungen können das Spielen auf dicht parallelen Wegen verhindern. Der Prüfstatus bleibt `unreviewed`. Diese Änderungen sind keine örtliche Sicherheitsfreigabe und ersetzen keinen begleiteten iPhone-Feldtest.
- Reguläre Tests verwenden simulierte GPS-Messungen. Der optionale Datensatztest testet Planung auf echten Kartendaten, nicht reale Bewegung.

Technische Quellen: [Overpass-Flächen und pivot](https://dev.overpass-api.de/overpass-doc/en/full_data/area.html), [Relationsgeometrie](https://dev.overpass-api.de/overpass-doc/en/full_data/osm_types.html), [OSM-Multipolygone](https://wiki.openstreetmap.org/wiki/Multipolygon).

## Prüfergebnisse

- `npm ci --offline` erfolgreich: vollständige Neuinstallation aus dem versionierten Lockfile.
- `npm test -- --run`: **349 bestanden**, ein optionaler Datensatztest ausgelassen; dieser anschließend separat erfolgreich auf echten Daten.
- `npm run build`: TypeScript und Vite erfolgreich. `npm run lint`: keine Fehler, neun bestehende Warnungen. Bestehende Sass-Deprecations bleiben. `git diff --check` sauber.
- Aktualisierter Overpass-Aufruf: HTTP 200 mit CORS, 910.022 Bytes, 1.348 Elemente, Datenstand `2026-11-06T10:09:51Z`; enthaltene Wasser-Multipolygon-Relation mit acht Mitgliedern und 961 Geometriepunkten. Optionaler Planungstest auf diesem Datensatz erfolgreich (viele Weganfänge werden einzeln geprüft; Laufzeit rund 27 Sekunden insgesamt).
- Kein neuer iPhone-Feldtest und keine Freigabe als geprüfte reale Route. Die normale App-Routenfolge, GPS-Fehler, Speichern und Wiederaufnahme sind durch die bestehenden Integrationstests abgedeckt.

## iPhone-Rückmeldung: erneute Suche verdeckt die erste Ursache

Die Fotos zeigen die Suchschaltfläche und anschließend die lokale 60-Sekunden-Sperre. Diese Sperre wird erst nach einem ausreichend genauen GPS-Fix und einer begonnenen Kartenanfrage erreicht. Ob die erste Anfrage am Netzwerk, an den Daten oder an der Wegplanung scheiterte, lässt sich aus diesen Bildern nicht nachweisen.

Korrektur: ursprünglichen Kartenfehler samt Freigabezeit erhalten; währenddessen Countdown und deaktivierte Wiederholung statt weiterer erfolgloser Anfragen. Der Bildschirm trennt GPS, Kartenabruf und Wegplanung und fokussiert die Ergebnisanzeige bei einem Fehler. Eine 30-Sekunden-Grenze beendet die Ladeanzeige auch dann, wenn ein Browser den Fetch-Abbruch nicht beantwortet; verspätete Ergebnisse bleiben wirkungslos. Kein automatischer Retry, keine Lockerung der Weg- oder GPS-Prüfungen.

Nachweis: 353 Tests erfolgreich, TypeScript/Build erfolgreich, Lint ohne Fehler mit neun bestehenden Warnungen. Vier neue Regressionen prüfen Fehlererhalt, Countdown/Retry, hängende Netzantwort einschließlich später Rückmeldung und getrennte Anzeige einer abgelehnten Route. Der konkrete ursprüngliche iPhone-Kartenfehler ist weiterhin unbekannt; die neue Ergebnisanzeige soll ihn sichtbar machen.

## Direkter Story-Einstieg auf ausdrücklichen Nutzerwunsch

„Fortsetzen“ im Hub startet beziehungsweise setzt den aktuellen Story-Abschnitt vor der Navigation fort; bei Speicherfehlern bleibt der Nutzer mit Fehlermeldung im Hub. Im aktiven Story-Header entfallen Standortprüfung und wiederholter GPS-Hinweis. Die dritte Szene des ersten Abenteuers zeigt eine kurze friedliche Passage und „Weiter“ statt Lernkampf-Steuerung, Lebensbalken und Wiederholungsaufforderung. Alte Kampf-Speicherstände werden weiter gelesen und können diese Szene auch nach einer Niederlage verlassen. Ereignisbindung und einmalige Belohnungen bleiben abgesichert. Die bisherigen Engine-Kampftests bleiben erhalten; UI-Tests wurden für den ausdrücklich geänderten Ablauf angepasst, neue Tests decken direkten Einstieg ohne GPS, Speicherfehler und alte Niederlagen ab.
