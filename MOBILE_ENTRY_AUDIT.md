# Mobiler Einstieg: Befunde vor der Änderung

Geprüfte Basis: `3a6a4e609d1a85bbe959b1f83489e07b29f8a783`, Branch `feature/phase-6-desert-adventure`.
`GAME_DESIGN.md` und `IMPLEMENTATION_ROADMAP.md` vollständig gelesen.

- Aktiver Erststart: App → StartScreen → CharacterSelectionPage → CharacterSelection → GameHub. `/game` nutzt GameWorld → SimplifiedCampaignScreen. CampaignScreen ist nur über DebugCampaignPage erreichbar; LegacyGameWorld über `/free-world`.
- Das aktive CharacterSelection enthält bereits ein kompaktes Raster. Die Aussage, die veröffentlichte Version zeige alte große Karten, lässt sich ohne die konkret verwendete URL und deren Build nicht bestätigen. Ein alter Deploymentstand ist eine Hypothese, kein Befund.
- Die Auswahl enthält englische Hilfetexte und technische Klassenkennungen. Bestätigung ruft selectHero zweimal auf; der Button heißt irreführend „Kampagne öffnen“. Verschachtelte Scrollbereiche erschweren mobiles Lesen.
- GameHub bietet vier gleichwertige Menüpunkte statt eines erklärten ersten Ziels. SimplifiedCampaignScreen verlinkt `/outdoor`, App registriert ausschließlich `/hub/outdoor`. CampaignScreen verlinkt das ebenfalls fehlende `/game/outdoor`.
- StartScreen lädt den Legacy-Speicher; die Kampagne speichert getrennt und die gewählte Figur liegt in preferences. Pause führt zur Heldenauswahl. Der vereinfachte Bildschirm verschweigt den Simulationsstatus späterer Episoden und zeigt einen Debug-Link.
- OutdoorAdventure liest echte Browserpositionen, benutzt jedoch drei feste Berliner Koordinaten aus questEngine. Nähe allein schließt Ziele ab. Keine Fußwegprüfung, keine Startortplanung, keine belastbare Genauigkeits-/Sprungprüfung. Outdoor-Belohnungen sind getrennt von der Kampagne. Fehlermeldungen des GPS-Diensts sind englisch. Tracking wurde beim normalen Zurückgehen/Unmount nicht zuverlässig beendet.

## GPS-Grenzen
Eine deutschlandweite Route im Umfeld von ungefähr 1 km ist nicht implementiert. Dafür fehlen Fußwegdaten, Routing, Eignungsprüfung, geprüfte Haltepunkte, Wiederplanung und Geräteabnahme. Keine zusätzlichen Episoden oder Routingarchitektur im Rahmen dieser Korrektur. Bestehende Simulationslogik und gespeicherte Daten bleiben erhalten; ungeprüfte Ziele dürfen nicht als echte Route angeboten werden.

## Nachweis des veröffentlichten Altstands

Am 05.11.2026 abgerufen: https://adventure-game-mocha.vercel.app/.
Ausgelieferte Dateien: `/assets/index-RDjFPDM6.js` (291860 Bytes) und `/assets/index-B4Yc15-i.css` (25572 Bytes).
Der Router am Ende dieses JS-Bundles enthält ausschließlich `/` und `/game`. `saira`, `/character-select`, `/hub/outdoor`, `compactCardsGrid` fehlen. Die Heldenbeschreibungen und Questoberfläche sind englisch; die alte Spielwelt enthält Elder Elara, Münzen und einen Goblin. Der Router entspricht in seiner Struktur der ursprünglichen App in Commit `d8693fe` (kein Nachweis eines exakten Deployment-Commits).

Damit ist belegt, dass diese URL nicht den geprüften Feature-Branch ausliefert. Warum Vercel diesen Stand verwendet (Projektzuordnung, Produktionsbranch oder fehlendes Deployment), ist ohne Vercel-Projektmetadaten nicht belegt. Ein iPhone-Cache ist nicht als Ursache nachgewiesen. Die genaue auf dem iPhone beobachtete Heldenansicht wurde nicht direkt geprüft.

## Umgesetzte Korrekturen

- Vorhandenes Heldenraster beibehalten und auf drei Spalten vereinheitlicht; datengetriebene Liste unterstützt weitere Figuren. Deutsche Hilfen und Klassenanzeige, genau ein Auswahlvorgang, Beschriftung „Held auswählen“. Vorhandene Daten und Fähigkeiten unverändert, keine neuen Bilder.
- Detailtexte sind größer und ohne verschachtelte Scrollbox lesbar; Safe-Area-Abstände und dynamische Bildschirmhöhe berücksichtigt.
- Übersicht zeigt ausgewählten Helden, erstes Ziel, nächste Aktion und Anzahl erledigter Aufgaben. Standortprüfung erklärt den aktuellen Funktionsumfang. Sekundäre Navigation ist nachgeordnet.
- Start erkennt die persistierte Heldenwahl. Pause führt zur Übersicht; bestätigte Kampagnenaktionen und deren Speicherlogik bleiben erhalten. Alte GPS-Links werden weitergeleitet; Rückweg funktioniert auch nach direktem Seitenaufruf.
- GPS wird ausdrücklich angefragt, nur einmal gelesen und nicht für feste Berliner Ziele oder Belohnungen verwendet. Keine Koordinatenanzeige, kein kontinuierliches Tracking im regulären Einstieg. Deutsche Behandlung von Ablehnung, Zeitüberschreitung, fehlender Unterstützung und ungenauem Standort. Keine Änderung vorhandener Outdoor-Spielstände. Die bisherige Outdoor-Komponente bleibt im Quellcode als `OutdoorAdventureDemo` erhalten, wird aber nicht vom regulären Router angeboten.
- Technischer Debug-Link aus dem Spieleinstieg entfernt; bestehende Debug- und Legacy-Routen bleiben erreichbar. Spätere simulierte Episoden ausdrücklich als Vorschau bezeichnet, keine zusätzlichen Episoden entwickelt.

## Grenzen und weitere Lücken

- GPS-Standortprüfung ist kein GPS-RPG. Geprüfte Fußwege, Ereignisse nahe dem Startort, sichere Navigation, geeignete Haltepunkte und Fortsetzen einer Route an anderem Standort fehlen weiterhin. Kein realer Spaziergang als bestanden ausgegeben.
- Bestehende Kampagnenereignisse laufen ohne GPS; der erste Lernkampf bleibt Teil der vorhandenen Geschichte. Eine kampffreie GPS-Erkundung wurde nicht implementiert.
- GDD-Intro sowie sichere Haltbestätigung/Bewegungspause der Kampagnenkämpfe fehlen im vereinfachten Einstieg; nicht Gegenstand eines zusätzlichen Kampfsystemumbaus.
- Bestehende Inventarseite enthält Beispieldaten; Kampagnen- und Legacy-Inventar sind noch nicht vereinheitlicht. Heldenwechsel erhält getrennte bestehende Kampagnenstände, überträgt sie aber nicht zwischen Helden.
- Browserprüfung versucht: Work meldet „Local browser use is disabled in Work settings“. Daher keine behauptete visuelle Abnahme bei 320/390 px, kein Safari-Gerätetest. Mobile CSS und DOM-Interaktionen geprüft, Layout-Abnahme offen.
- Keine Vercel-Verwaltungsverbindung verfügbar. Der Produktionsalias wurde nicht umgestellt. `main` wird nicht verändert; kein Force-Push.

## Prüfungen

- `npm test -- --run`: 18 Dateien, 296 Tests erfolgreich. Alle 289 bestehenden Tests unverändert erhalten, sieben neue Integrationstests ergänzt.
- Neue Tests verwenden den tatsächlichen App-Router: Erststart → fünf auswählbare Helden → Bestätigung → Übersicht → explizite GPS-Anfrage → ehrlicher Hinweis auf fehlende Route → erste Aufgabe → Pause → neuer App-Mount → Fortsetzen. GPS wird simuliert, kein echter Gerätestandort abgefragt.
- Weitere Fälle: Berechtigung abgelehnt, Position nicht verfügbar, Timeout, alte GPS-Routen, ungenaue Position, gespeicherte Demo-Präferenz ohne Aktivierung echter Ziele.
- `npm run build`: TypeScript (`tsc -b`) und Vite erfolgreich. Bestehende Sass-Abkündigungswarnungen.
- `npm run lint`: erfolgreich mit Warnungen; keine Fehler. Bestehende Warnungen u. a. in gameWorldIntegration, GameMap und NPCDialogue.
- `git diff --check`: ohne Befund.
