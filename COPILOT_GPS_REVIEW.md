# Auftrag an Copilot: GPS-Testspaziergang unabhängig prüfen

Repository AnnaFillanna/adventure-game, Branch feature/phase-6-desert-adventure. Erst GAME_DESIGN.md, IMPLEMENTATION_ROADMAP.md und GPS_TEST_WALK.md lesen. Die Nutzerin erlaubt ausdrücklich einen als ungeprüft markierten Testspaziergang mit Erwachsenenbestätigung vor Ort. Keine Production-Freigabe daraus ableiten.

Bitte den aktuellen Commit unabhängig prüfen, konkrete Fehler mit Datei/Zeile melden und nötige Korrekturen auf einem separaten Branch vorschlagen:

- `/hub/walk`: iPhone Safari, Standort erlauben/ablehnen/erneut versuchen, ungenaues GPS, App im Hintergrund, Wiederaufnahme.
- OSM-Graph: keine erfundenen Verbindungen, unerlaubten Wege, bekannten Querungen oder Belohnungen durch GPS-Sprünge. Besondere Grenzfälle: parallele Wege, sich berührende Segmente, Wasserflächen ohne Wasserlinie, lückenhafte Zugangstags.
- Preview-Karte und drei Aufgaben mit echter Bewegung auf einem vor Ort bestätigten Weg. Testbeobachtungen von Simulationen trennen. Keine Behauptung „sicher“, wenn nur Kartendaten geprüft wurden.
- Speicherung nach Aufgabe 1, Neustart an anderer Stelle, nur Aufgaben 2/3 übrig, Belohnung einmalig, keine Koordinaten in localStorage, beschädigte/future-Spielstände unverändert.
- `npm test -- --run`, `npm run build`, `npm run lint`; bestehende Tests nicht abschwächen. Vercel-Preview muss wirklich diesen Branch/Commit ausliefern.

Main nicht verändern, kein Force-Push, keine Änderung der Vercel-Zugriffseinstellungen und kein Production-Deployment. Kein paralleles Überschreiben dieses Arbeitsverzeichnisses. Der Auftrag ist vorbereitet, nicht automatisch an Copilot übermittelt.


## Zweite Prüfrunde

Die Fehler aus dem Review von `e382ac9` wurden in `fix/gps-walk-review-e382ac9` bearbeitet. Bitte zuerst [GPS_REVIEW_FIXES.md](GPS_REVIEW_FIXES.md) und die übernommenen unveränderten Regressionsfälle in `src/game/walk/reviewRegression.test.ts` prüfen. Besonders die gemeinsame-Knoten-Ausnahme bei der GPS-Zuordnung und die konservative Wasser-Inselbehandlung unabhängig überprüfen. Danach Feldtest separat dokumentieren.
