# GPS-Testspaziergang – 6. November 2026

## Vereinbarter Umfang

Explizite Nutzerentscheidung: Testspaziergang von der aktuellen Position mit Bestätigung durch Erwachsene vor Ort. Kein fester Wohnort im Code. Kein regulär freigegebener Familien-Routingdienst. Vorschläge bleiben `unreviewed`; eine Erwachsenenbestätigung setzt sie nicht auf `eligible`. Main und Production werden nicht geändert.

## Aktiver Ablauf

`/` → `/character-select` → `/hub` → „GPS-Abenteuer in meiner Nähe“ → `/hub/walk` (`NearbyWalk`). `/hub/outdoor` bleibt eine separate Standortanzeige. Legacy-Berlin-Ziele werden nicht aktiviert.

1. Expliziter Browser-GPS-Abruf, maximal 15 Sekunden Wartezeit. Verweigerung, ungenaues Signal und ausbleibende Rückmeldung werden erklärt; erneuter Versuch bleibt möglich.
2. Ein begrenzter Overpass-POST für 1.100 m Umgebung eines auf drei Dezimalstellen gerundeten Startbereichs. Kein Adressfeld, keine gespeicherte GPS-Spur, kein automatisches Wiederholen. Eine Minute Abfrageabstand, fünf Minuten flüchtiger Cache, 30 Sekunden Ladegrenze, 4 MB Antwortgrenze. Kartenansicht lädt OSM-Tiles erst auf Wunsch.
3. Verbundener OSM-Weggraph mit Original-Knoten-IDs. Bekannter Belag, Fußwegtyp; Ausschluss kartierter Zugangsbeschränkungen, Treppen, Brücken, Tunnel, Furten, Querungen und erkannter Hindernisse. Keine Verbindung räumlich naher, aber topologisch getrennter Wege. Start höchstens 20 m vom vorhandenen Weg; maximal 500 m hinaus, derselbe Weg zurück. Drei Haltekandidaten auf vorhandenen Wegknoten.
4. Vorschau mit Linie, nummerierten Stopps, Quelle und Hin-/Rückweglänge. Start erst nach Kartenladung und Bestätigung von Verlauf, Tageslicht, erwachsener Begleitung und offenen geeigneten Wegen.
5. Echter `watchPosition`. Aufgaben benötigen plausible Folgepositionen auf dem Weg, Ankunft, kurzen Halt und ausdrückliche Bestätigung eines geeigneten Standplatzes. Kein Freischalten allein durch Laden eines gespeicherten Spielstands oder einen Sprung an ein Ziel. Ungültiger letzter Fix sperrt Interaktion sofort.
6. Drei virtuelle Zeichenrätsel ohne Kampf. Speichern nach jeder richtigen Antwort; 20 Gold einmalig im getrennten Spaziergang-Spielstand, nicht im Kampagneninventar. Persistiert werden nur Helden-bezogene Aufgaben-IDs und Belohnungsstatus. Zukünftige/defekte Spielstände werden nicht überschrieben; ältere Tabs können Fortschritt nicht zurücksetzen.
7. Pause, Verlassen und Hintergrundwechsel beenden GPS. Nach Signalverlust wird pausiert. Fortsetzung sucht nur verbleibende Aufgaben am aktuellen Ort. Keine Strafe und keine Zeitlimits für Aufgaben. Die Karte bleibt nach Abschluss bis zum Seitenwechsel sichtbar; die GPS-Verfolgung endet.

## Prüfnachweise

- Ergebnis: 325 Tests erfolgreich; der optionale OSM-Datensatztest separat erfolgreich. TypeScript/Produktionsbuild erfolgreich, Oxlint ohne Fehler (neun bestehende Warnungen), `git diff --check` sauber. Sass meldet bestehende Deprecations. Bestehende Tests unverändert erhalten. Neue Prüfungen: graphbasierte Wege, getrennte Topologie, Straßenquerung, Zugangsbeschränkungen, veraltete Daten, GPS-Sprünge/-Ungenauigkeit/-Ausfall, Kartenfehler, reale App-Routen mit simuliertem GPS, drei Aufgaben bis Belohnung, Reload und Fortsetzung, Berechtigungsverweigerung/Retry, verspätete Rückmeldungen, Provider-Fehler/Cache/gerundete Anfrage.
- Overpass lieferte am 5. November 2026 HTTP 200, JSON und `Access-Control-Allow-Origin: *`; Datenzeit 20:18:59 UTC. Separater Smoke-Test auf dieser öffentlichen Andernach-Stichprobe erfolgreich: 25 der 232 untersuchten Weganfänge ergaben drei Haltekandidaten, Hin-/Rückweg 340–988 m. Keine Ortsprüfung und keine Aussage, dass ein beliebiger Wohnort angeschlossen ist. Der erste Gesamtdurchlauf überschritt das 5-Sekunden-Testlimit; der vollständige optionale Datensatztest hat deshalb 30 Sekunden (232 getrennte Planungen, nicht eine einzelne Spieleranfrage).
- Wiederholbarer optionaler Datensatztest: `WALK_MAP_FILE=/absoluter/pfad/overpass.json npm test -- --run src/game/walk/live-smoke.test.ts`. Ohne Datei absichtlich ausgelassen; kein Netzabruf in regulären Tests. Keine privaten Startkoordinaten als Testfixture eingecheckt.
- Chrome-Browsercheck bei 390 × 844: Einstieg, kompakte Heldenwahl und Navigation zum GPS-Testbildschirm. Der echte Browser-Standortabruf meldete auf diesem Mac „Standort gerade nicht verfügbar“; der erneute Versuch blieb erreichbar, die Konsole meldete keine Fehler. Dies ist kein Safari/iPhone-Feldtest. GPS-Bewegung und Rätselablauf sind in den Integrationstests simuliert.

## Bekannte Grenzen

OSM ist unvollständig. Technische Filter bestätigen weder aktuelle Sperrungen noch Beleuchtung, Wetter, Verkehr, Baustellen, Uferabstände oder tatsächlich verfügbare Halteflächen. Wasserränder ohne kartierte Wasserlinie und unkartierte Hindernisse können fehlen. Nicht alle geometrischen Grenzfälle werden erkannt. Es gibt keine automatische Umleitung, keine garantierte Verfügbarkeit des öffentlichen Overpass-Dienstes, kein Offline-Routing und keinen Feldnachweis der GPS-Schwellen auf iPhones. Startsuche ist auf eine grobe Deutschland-Region begrenzt (keine amtliche Landesgrenzprüfung). Unzureichend dokumentierte oder nicht angeschlossene Wege werden abgelehnt.

Für ein öffentliches Produkt fehlen örtliche Routeneignungsprüfung, belastbarer eigener Routingbetrieb, Geräte-/Feldtests sowie Einbindung der Spaziergangsbelohnung in das Kampagneninventar. Die drei Rätsel bilden einen separaten Testlauf, keine neue Kampagnenepisode. Die iPhone-Adresse `adventure-game-mocha.vercel.app` lieferte zuvor den alten Production-Stand; ein Feature-Preview aktualisiert diese Adresse nicht automatisch.

Quellen für den Betrieb: [Overpass-Nutzung](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html), [OSM-Tile-Richtlinie](https://operations.osmfoundation.org/policies/tiles/). Sichtbare OSM-Attribution, HTTPS-Tiles, kein Prefetch/Offline-Download.
