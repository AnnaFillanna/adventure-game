> Ergänzung vom 6. November 2026: Die Standortanzeige bleibt unter `/hub/outdoor`. Der neue, ausdrücklich freigegebene Testspaziergang unter `/hub/walk` ist in [GPS_TEST_WALK.md](GPS_TEST_WALK.md) beschrieben. Die nachfolgende Bestandsbeschreibung bezieht sich auf Commit `80b574e`.

# GPS-Anzeige und Live-Standort

Ergänzung zum mobilen Audit vom 05.11.2026. Der frühere reine Standorttest wurde um eine Standortanzeige und explizit startbare Live-Aktualisierung erweitert.

## Nutzbarer Ablauf

Übersicht → Standort prüfen → Standort freigeben → Browserberechtigung → Koordinaten, Genauigkeit und Empfangszeit. Danach kann die Karte ausdrücklich geladen und „GPS live starten“ betätigt werden. „GPS pausieren“, Navigation und ausgeblendete Seite stoppen die Browserüberwachung. Es gibt keinen automatischen Neustart im Hintergrund und keine gespeicherte GPS-Spur.

Die Anzeige unterscheidet empfangene Position, ungenauen Standort, aktive Aktualisierung, Pause und Fehler. Ein initialer Abruf ohne Browserantwort endet nach 15 Sekunden. Bleiben Live-Messungen aus, pausiert die Überwachung nach 20 Sekunden. Ungültige Koordinaten und mehr als 30 Sekunden alte Live-Messungen werden nicht übernommen. Das sind Betriebsgrenzen für die Anzeige, keine geprüften Freischaltregeln für Spielziele.

OpenStreetMap wird erst nach „Karte anzeigen“ geladen; vorher erklärt die Oberfläche die Übermittlung von IP-Adresse und Kartenausschnitt. Leaflet zeigt Position und Genauigkeitskreis, keine erfundenen Questziele. Sichtbare Attribution, HTTPS-Standardtiles, Browsercache und keine Offline-Vorabdownloads entsprechend https://operations.osmfoundation.org/policies/tiles/. Kartendaten werden erst beim Öffnen der Karte geladen; Ladefehler lassen die Koordinatenanzeige nutzbar.

## Grenzen

Dies ist eine echte Browser-GPS-Anbindung mit Karte, aber noch kein vollständiges GPS-Abenteuer. Öffentlich zugängliche, zusammenhängende Fußwege, Eignungsprüfung, erreichbare Questziele und sichere Routenplanung sind nicht implementiert. Die bestehenden festen Berliner Testziele bleiben vom regulären Einstieg getrennt. Kampagnenfortschritt wird durch Koordinaten nicht verändert. Die Geschichte ist weiterhin unabhängig von GPS spielbar.

## Prüfung

301 Tests erfolgreich, einschließlich initialem Abruf, ausbleibender Antwort, erneuter Anfrage, veralteter Rückmeldung, Anzeige von Koordinaten/Genauigkeit, explizitem Live-Start, Updates, Pause, Navigation, Hintergrundwechsel, entzogener Berechtigung, ungültigen Messungen und ausbleibenden Live-Updates. Bestehende Speicher- und Kampagnentests bleiben erhalten. Die alte Beschriftung „Weiter zur Geschichte ohne GPS“ wurde durch „Geschichte öffnen“ ersetzt; der zugehörige Navigationstest prüft weiterhin denselben vollständigen Rückweg.

TypeScript/Build und Lint werden vor Veröffentlichung ausgeführt. GPS-Antworten sind in Tests simuliert. Keine Aussage über einen tatsächlichen iPhone-Gerätetest oder eine visuelle Kartenabnahme; der zuvor deaktivierte lokale Browserzugriff wurde nicht umgangen.
