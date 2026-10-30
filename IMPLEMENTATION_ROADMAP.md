# Adventure Game – Implementierungsfahrplan

Stand: 30.10.2026. Grundlage: `GAME_DESIGN.md`. Diese Phase plant Architektur und Umsetzung; sie ändert keine Spiellogik und keine gespeicherten Daten.

## 1. Prüfstand und belastbare Grenzen

Zielrepository: `AnnaFillanna/adventure-game`.

Der Arbeitsbereich enthielt bei Beginn keine Projektkopie. Der Versuch, das Repository per HTTPS lokal zu klonen, scheiterte an der Verbindung zum konfigurierten Proxy auf Port 8080. Die verbundene GitHub-App antwortete sowohl auf die Repository-Metadatenabfrage als auch auf eine erste Baumabfrage mit HTTP 404. Die erste Baumabfrage verwendete `main`; dieser Branch ist nicht bestätigt. Da auch die branchunabhängige Metadatenabfrage fehlschlug, sind weder Standardbranch noch Commit noch Zugriffsrechte geklärt. Eine 404-Antwort beweist nicht, dass das Repository nicht existiert; fehlende Berechtigungen können dieselbe Antwort verursachen.

**Folge:** Eine Codeanalyse und ein belastbarer Vergleich mit der Implementierung waren nicht möglich. Es wurden keine Quelldateien, Abhängigkeiten, Speicherformate, Tests oder tatsächlichen Spielfunktionen eingesehen. React und TypeScript sind die gewünschte technische Richtung laut Auftrag, kein verifizierter Befund. Die folgenden Pfade und Typen sind Architekturvorschläge, keine Aussagen über vorhandene Dateien.

Die beiden Dokumente liegen als lokale Entwürfe unter `/workspace/adventure-game/`. Dieses Verzeichnis ist aktuell keine geklonte Git-Arbeitskopie. Es gab keinen Commit, Git Push, entfernten Schreibzugriff oder Veröffentlichung. Die Entwürfe müssen nach erfolgreichem Zugriff mit eventuell vorhandenen gleichnamigen Dokumenten zusammengeführt werden; nicht blind überschreiben.

### 1.1 Bereits vorhandene Funktionen

Aktuell kann keine Spielfunktion als vorhanden bestätigt werden. Das bedeutet ausdrücklich nicht, dass keine implementiert ist.

| Prüfbereich | Belegter Ist-Zustand | Nachzuliefernder Nachweis |
| --- | --- | --- |
| Framework, Einstieg und Build | Nicht prüfbar | Paketmanifest, Sperrdatei, Einstiegspunkte, Build-Konfiguration |
| Charakterauswahl und Helden | Nicht prüfbar; Anzahl unbekannt | Charakterdefinitionen, Auswahloberfläche, Fähigkeitslogik |
| Intro, Dialoge und Geschichte | Nicht prüfbar | Szenendaten, Dialogdarstellung, Einstieg und Wiederholung |
| Kapitel, Quests und Episoden | Nicht prüfbar | Inhaltsdaten, Freischaltbedingungen, Abschlusslogik |
| GPS, Karte und Routing | Nicht prüfbar | Geolocation-Zugriffe, Kartenanbieter, Koordinatenerzeugung, Routenlogik |
| Kampf und Verwandlungen | Nicht prüfbar | Zustandsmodell, Gegnerdaten, Runden- und Pausenlogik |
| Gold, Gegenstände und Ausrüstung | Nicht prüfbar | Inventar, Preise, Vergabe und Verbrauch |
| Spielstände und Fortsetzen | Nicht prüfbar | Speicheradapter, Schema, Migrationen, gegebenenfalls Servermodell |
| Lokalisierung und Barrierefreiheit | Nicht prüfbar | Textquellen, Sprachkonfiguration, zugängliche Namen und Datumsformate |
| Tests und automatisierte Prüfungen | Nicht prüfbar | Testkonfiguration, vorhandene Tests und Arbeitsabläufe |

### 1.2 Vorgehen beim späteren Codeaudit

1. Repository mit berechtigtem Zugriff in ein separates Verzeichnis laden, Standardbranch und Commit dokumentieren; bestehende lokale Entwürfe erhalten.
2. Anwendbare `AGENTS.md` und Projektanweisungen lesen, Arbeitsbaumstatus erfassen und vorhandene Änderungen respektieren.
3. Mit `rg --files` zunächst Struktur, Paketmanifest, Sperrdatei, bestehende Dokumentation und Tests erfassen. Keine Installation oder Migration auf Verdacht.
4. Einstieg, Navigationsfluss, Datenmodelle, Persistenz, GPS-Zugriffe und Netzwerkanbieter nachvollziehen. Bei jedem Befund konkrete Datei und Zeile sowie den geprüften Commit angeben.
5. Bestehenden Textumfang prüfen: sichtbare Zeichenketten, Platzhalter, Dialoge, Questdaten, Benachrichtigungen, Fehler, Bilder mit Text und gegebenenfalls Serverantworten.
6. Bestehende Prüfskripte entsprechend den Projektanweisungen ausführen und Ergebnis samt Einschränkungen dokumentieren. Keine Produktionsdaten verändern.
7. Die folgenden Tabellen mit „vorhanden“, „teilweise vorhanden“ oder „fehlt“ und Belegen vervollständigen. Erst danach Aufwand und konkrete Änderungsdateien festlegen.

## 2. Fehlende Funktionen beziehungsweise zu prüfende Lücken

**„Zu prüfen“ ist kein bestätigtes „fehlt“.** Folgende Funktionen sind für das neue Design erforderlich und bisher unbelegt:

| Designanforderung | Sollverhalten | Status und Abnahmekriterium |
| --- | --- | --- |
| Deutsche Anwendung | Vollständige deutsche Inhalte einschließlich Fehlern und Sicherheit | Zu prüfen; keine englischen sichtbaren Standardtexte |
| Intro | Deutsche Turmszene mit allen fünf Helden vor der Auswahl | Zu prüfen; überspringbar, nachlesbar, ohne GPS spielbar |
| Fünf Helden | Aeran, Velar, Varg, Ravena und Saira auswählbar | Zu prüfen; alle besitzen vollständige Daten und zugängliche Fähigkeiten |
| 30 Episoden | Fünf Kapitel mit je sechs zusammenhängenden Episoden | Zu prüfen; Datenvalidator und Durchläufe bestätigen die Struktur |
| Distanzmodi | Etwa 1 km, 2–3 km und 4–5 km | Zu prüfen; identische Pflichtgeschichte, keine Modussperre |
| Persistente Pause | Fortsetzung auch nach App-Ende und Ortswechsel | Zu prüfen; keine Verluste und keine doppelte Belohnung |
| Story-Fortschritt | Karten, Runen, Schlüssel und Artefakte | Zu prüfen; keine Gold- oder Kalendertagschranke |
| Sicheres Fußwegrouting | OSM-basierte, gesondert geprüfte Wege | Zu prüfen; keine zufälligen echten GPS-Ziele |
| Kampf im Stillstand | Rundenbasierter Kampf nur am bestätigten sicheren Halt | Zu prüfen; Bewegung pausiert statt zu bestrafen |
| Erweiterbare Welten | Neue Kampagnen ohne Umbau des Bewegungskerns | Zu prüfen; stabile Inhaltskennungen und getrennte Systeme |

## 3. Architektur der deutschen Lokalisierung

### 3.1 Grundentscheidung

Zunächst zentrale deutsche Ressourcen und eine schmale typisierte Zugriffsschicht planen. Keine neue Bibliothek festlegen, bevor vorhandene Abhängigkeiten und Textinfrastruktur geprüft sind. Ein bereits geeignetes Lokalisierungssystem soll erweitert werden. Die Architektur muss kleine, überprüfbare Umstellungen pro Oberfläche zulassen; keine vollständige Neustrukturierung und kein Austausch funktionierender Spielmechanik.

Vorgeschlagene Struktur, an tatsächliche Projektkonventionen anzupassen:

```text
src/
  locales/
    de.ts                 # Vollständige deutsche Standardressource
    index.ts              # Sprachregister, Textzugriff und Formatierung
    types.ts              # Textschlüssel und Parameterverträge
  content/
    campaigns/
      first-light.ts      # Technische IDs, Ereignisse, Bedingungen, Textschlüssel
    heroes.ts             # Werte, Fähigkeits-IDs, Textschlüssel
    items.ts              # Item-IDs, Werte und Textschlüssel
```

Eine einzelne `de.ts` reicht zum Einstieg. Bei wachsendem Umfang kann sie deutsche Teilressourcen aus `de/common.ts`, `de/safety.ts` oder `de/campaigns/first-light.ts` zusammenführen, ohne die Aufrufstellen zu ändern. Solche Dateien werden in dieser Phase ausdrücklich noch nicht angelegt.

### 3.2 Textbereiche und Beispiel

Bereiche: `common`, `navigation`, `characterSelection`, `heroes`, `intro`, `campaigns`, `quests`, `combat`, `inventory`, `items`, `abilities`, `transformations`, `rewards`, `notifications`, `errors`, `settings`, `safety` und `accessibility`. Technische Schlüssel dürfen englisch sein; alle angezeigten Werte sind deutsch.

Nur konzeptionelles TypeScript-Beispiel:

```ts
export const de = {
  common: {
    continue: "Weiter",
    pause: "Pausieren",
    resume: "Fortsetzen",
  },
  characterSelection: {
    title: "Wähle deinen Helden",
    confirm: "Mit diesem Helden spielen",
  },
  heroes: {
    saira: {
      name: "Saira",
      title: "Die Schattenkriegerin",
      description: "Mit zwei kurzen Klingen und klugen Täuschungen schützt Saira ihre Freunde.",
    },
  },
  intro: {
    tower: {
      title: "Der Turm des letzten Magiers",
      lines: {
        wizardQuest: "Sucht das Schwert des Ersten Lichts. Findet es und bringt es zu mir zurück.",
      },
    },
  },
  campaigns: {
    firstLight: {
      episodes: {
        day01: {
          title: "Das Flüstern im Sand",
          objective: "Sichere die erste Spur zum Schwert.",
        },
      },
    },
  },
  rewards: {
    goldReceived: "Du erhältst {amount} Goldmünzen.",
  },
  errors: {
    locationUnavailable: "Dein Standort ist gerade nicht verfügbar. Pausiere und versuche es später erneut.",
    saveFailed: "Dein Fortschritt konnte noch nicht gespeichert werden. Bitte versuche es erneut.",
  },
  safety: {
    confirmStop: "Ich stehe mit meiner Begleitperson an einem sicheren Ort.",
    movementPause: "Die Begegnung pausiert. Spiele weiter, wenn du wieder sicher stehst.",
  },
} as const;
```

Das Beispiel zeigt nur die Form; es ist kein vollständiger Textkatalog. Die tatsächliche Intro-Ressource muss den freigegebenen Dialog aus `GAME_DESIGN.md` enthalten. Sprechernamen werden über Helden- oder NPC-IDs aufgelöst; Reihenfolge und Verzweigungen gehören zu Szenendaten.

### 3.3 Zugriff, Parameter und weitere Sprachen

- Eine Funktion wie `t(key, params)` oder ein bestehender gleichwertiger Adapter liefert Texte. `TranslationKey` soll aus den verschachtelten Ressourcen abgeleitet werden; fehlende Schlüssel werden bereits beim Typprüfen sichtbar.
- Parameter erhalten je Schlüssel einen Vertrag, beispielsweise `{ amount: number }` für `rewards.goldReceived`. Platzhaltergleichheit wird geprüft. Keine untypisierte globale Zeichenersetzung und keine zur Laufzeit zusammengebauten Schlüssel ohne Validierung.
- Zahlen, Datum, Uhrzeit und Entfernungen werden mit `Intl` und `de-DE` formatiert: `1,5 km` statt `1.5 km`. Pluralformen werden über `Intl.PluralRules` beziehungsweise eine vorhandene ICU-Lösung formuliert, beispielsweise „1 Gegenstand“ und „2 Gegenstände“.
- Keine Satzfragmente zusammensetzen: vollständige Sätze mit benannten Parametern ermöglichen andere Wortstellungen in späteren Sprachen. Keine HTML-Zeichenketten aus Übersetzungsdateien ungeprüft rendern.
- Die Sprachkennung ist `de-DE`; die Ressourcendatei darf `de.ts` heißen. Eine spätere Sprache erfüllt dieselbe strukturelle Schlüsselform mit allgemeinen Zeichenkettenwerten. Nicht `typeof de` unmittelbar als Vertrag für identische deutsche Literalwerte erzwingen.
- Deutsch bleibt Standard und Rückfallsprache. In Entwicklung und Tests schlagen fehlende deutsche Schlüssel fehl; in Produktion erscheint ein verständlicher deutscher Ersatztext statt technischem Schlüssel oder englischer Fehlermeldung. Fehler zur Diagnose intern getrennt erfassen, ohne sensible Daten auszugeben.
- Nur vollständig geprüfte Sprachen erscheinen später in der Sprachwahl. Fehlende Sprachen fallen auf Deutsch zurück. Noch keine funktionslose Sprachwahl anzeigen.
- Dokumentensprache beziehungsweise Plattformmetadaten auf `de-DE` setzen; Browser-/Betriebssystemdialoge unterliegen teilweise der Systemsprache und lassen sich nicht vollständig durch App-Texte steuern. Eigene Erklärungen und Fehlermeldungen bleiben deutsch.

### 3.4 Inhalte, Speicherstände und Migration

Spielstände speichern stabile IDs wie `saira`, `first-light`, `day-01`, `sun-key` und Textparameter, keine übersetzten Anzeigenamen. Das Umbenennen einer deutschen Quest darf deren Fortschritt nicht verändern. Bereits gespeicherte Anzeigenamen werden nicht ohne geprüfte Migration ersetzt.

Vorgehen: tatsächliches Speicherschema erfassen → anonymisierte Testfixtures anlegen → additive versionierte Migration entwerfen → alte und neue Spielstände testen → erst dann schrittweise produktiv einsetzen. Neue optionale Felder bekommen kompatible Vorgaben, nicht ein pauschales Zurücksetzen. Bekannte alte Inhalte bleiben auflösbar. Unbekannte oder neuere Versionen werden verständlich behandelt und nicht überschrieben. Kein `localStorage.clear()`, Löschen einer Datenbank oder „Reset bei Schemafehler“ als Migrationsstrategie.

Nicht nur React-Komponenten prüfen: auch Inhaltsdateien, Validierungsfehler, Netzwerkfehler, Benachrichtigungen, Bildbeschriftungen, Alternativtexte, zugängliche Namen, Platzhalter und gegebenenfalls serverseitige Meldungen. Rohe API- oder Browserfehler werden auf deutsche Fehlercodes abgebildet. Gespeicherte Daten ändern sich erst in einer separat getesteten Implementierungsphase.

## 4. Anforderungen an die 30-Episoden-Kampagne

Ein datengetriebenes Inhaltsmodell ergänzen, sofern nicht bereits geeignet vorhanden. Nicht jede Episode als eigene React-Seite oder eigenständigen Logikzweig bauen. Bestehende Systeme zuerst wiederverwenden.

Vorgeschlagene Verträge:

| Modell | Benötigte Informationen |
| --- | --- |
| `CampaignDefinition` | Stabile ID, Inhaltsversion, Titeltextschlüssel, Kapitel, Einstieg, Abschluss |
| `ChapterDefinition` | ID, Reihenfolge, genau sechs Episoden, Bosse und Kapitelbelohnung |
| `EpisodeDefinition` | ID, Reihenfolge, Story- und Zielschlüssel, 3–5 Ereignisse, Voraussetzungen, Story-Fund, Belohnungen, Übergang |
| `EventDefinition` | ID, Typ wie Dialog/Rätsel/Kampf/Fund, Textreferenzen, benötigter Halt, Voraussetzungen und Ergebnis |
| `EpisodeProgress` | Zustandsversion, aktive und erledigte Ereignisse, pausierter Kampf, bestätigte Story-Flags, Vergabebelege |
| `WalkSession` | Distanzmodus, gültiger Bewegungsfortschritt, aktuelle Routenreferenz mit Prüfversion, Pause; getrennt von Storydaten |

Anforderungen:

- GDD-Inhalte für 30 Episoden vollständig übertragen; fünf Kapitel mit je sechs Episoden, vier geplante Pflicht-Ereignisse pro Episode.
- Freischaltung anhand erledigter Vorgängerepisoden und Story-Flags, niemals anhand des Datums oder eines Goldpreises. Eine Pause über Wochen verändert keine Bedingungen.
- Konsistente Kette der Artefakte: Kartenfragmente → Runen → Sonnenschlüssel → Festungssiegel → Sternenkompass → Lichtkarte → Schwert → Nachtsiegel → Rückgabe. Verbrauch oder Umwandlung etwa des Sonnenschlüssels wird explizit modelliert.
- Jede Episode liefert einen Pflichtfund oder dauerhaft gespeicherten Hinweis; notwendige Gegenstände sind nicht verkäuflich und nicht durch Inventarlimits blockiert.
- Belohnungen und Ereignisabschluss gemeinsam konsistent sichern. Stabile Vergabe-ID pro Kampagne/Episode/Belohnung verhindert doppelte Auszahlung nach Absturz. Vorhandene Transaktionsmöglichkeiten nutzen; andernfalls idempotenten Vergabebeleg vorsehen.
- Alle Distanzmodi teilen dieselbe Pflicht-Ereignisfolge; nur Verteilung und optionale Begegnungen ändern sich. Kurze Routen dürfen mehrere Ereignisse am selben geeigneten Halt erlauben.
- Ereignisse sind nicht an reale Fantasieorte gebunden. Beim Ortswechsel bleiben Ereignis-IDs gleich, während Routenwegpunkte neu zugeordnet werden.
- Wiederaufnahme lädt den letzten bestätigten Zustand und überspringt keine Story-Funde. Wiederholungen ändern den Erstabschluss nicht.
- Alle fünf Helden bekommen allgemeine Rätsellösungen plus optionale heldenspezifische Darstellung. Finale Questfähigkeit für jeden Helden verfügbar.
- Der mögliche Magier-Twist wird als offene redaktionelle Entscheidung geführt. Er darf nicht stillschweigend Teil einer implementierten Pflichtbedingung werden.
- Neue Kampagnen wie Piraten oder Detektivgeschichten besitzen eigene IDs und Inhaltsversionen. Ihr Start überschreibt keine andere Kampagne.

## 5. Anforderungen an GPS und Routing

### 5.1 Verantwortlichkeiten

Ein Standortadapter kapselt Berechtigung, Messgenauigkeit, Aussetzer und Plattformunterschiede. Ein Routingadapter berechnet Fußwege aus OSM-basierten Daten. Eine getrennte Eignungsprüfung bewertet Routensegmente und Wegpunktkandidaten. Ein Ereignisplaner verteilt die Story auf freigegebene Haltemöglichkeiten. Eine Kampagne darf selbst keine echten Koordinaten würfeln oder die Routenprüfung umgehen.

### 5.2 Planung und Freigabe

1. Startbereich mit vertretbarer GPS-Genauigkeit bestimmen und Modus erfassen.
2. Öffentlich zugängliche zusammenhängende Fußwege ermitteln; Zugang, Oberflächen, Querungen und weitere verfügbare OSM-Merkmale berücksichtigen.
3. Geeignete Haltekandidaten entlang dieser Wege bestimmen. Nicht auf Privatgrund, Fahrbahnen oder getrennte Flussufer springen.
4. Eine möglichst zum Ausgangspunkt zurückführende Fußroute im Distanzbereich berechnen. Keine reine Luftlinienpolygonroute.
5. Unbekannte Eigenschaften, aktuelle Sperrungen, Tageszeit, Wetter und örtliche Eignung gesondert prüfen. Datenherkunft und Prüfzeit dokumentieren; keine automatische Gleichsetzung „OSM vorhanden = sicher“.
6. Erst geeignete und geprüfte Vorschläge mit klaren Einschränkungen in der Vorschau zeigen und die Auswahl durch Erwachsene bestätigen lassen. Routenerzeugung allein erteilt keine Betriebsfreigabe.
7. Kann die Eignung nicht festgestellt werden, GPS-Start sperren und eine deutsche Erklärung anbieten; die Episode bleibt gespeichert. Keine zufällige Ersatzroute aktivieren.

Ein möglicher Prüfvertrag enthält `status` (`unreviewed`, `eligible`, `rejected`, `expired`), `reviewedAt`, Datensatzversion, Prüfmethode, offene Risiken und Verfallsbedingungen. Wie eine örtliche Prüfung konkret organisiert wird, ist vor echtem Betrieb zu entscheiden. Bis dahin bleiben neue Routenvorschläge deaktiviert. Eine Erwachsenenbestätigung ist ergänzend, kein Ersatz für diesen Prozess.

### 5.3 Betrieb und Ausfälle

- GPS-Sprünge und geringe Genauigkeit dürfen weder Distanzbonus noch automatischen Zielabschluss erzeugen. Schwellwerte aus Geräteversuchen ableiten und dokumentieren.
- Fortschritt an erreichbare, geprüfte Wegabschnitte koppeln; bloße Nähe durch Wände, Gewässer oder Straßen genügt nicht.
- Wegpunkt ersetzen oder zurückstellen, wenn er unzugänglich wird; keine zeitkritische Umleitung. Sicher anhalten, danach Route erneut prüfen.
- Beim Wiederaufnehmen vom neuen Standort nur verbleibende Route neu planen, bestehende Episoden- und Belohnungszustände erhalten.
- Keine Bewegungsbefehle wie „Lauf weg!“; Gegner existieren nur in virtuellen Begegnungen.
- Kampfstart verlangt sicheren Halt; plausible Bewegung pausiert den Kampf. Stationäre GPS-Daten sind kein Nachweis eines sicheren Ortes.
- Offlinekarten oder gespeicherte Routen nur entsprechend Lizenz, Aktualität und Eignungsstatus nutzen. Fehlende Verbindung darf keine ungeprüfte Ersatznavigation auslösen.
- Standortdatensparsamkeit und nachvollziehbare Berechtigungsdialoge vorsehen; Veröffentlichung von Positionen Minderjähriger vermeiden.
- OSM-Lizenz und Attribution, Kachel- und Routing-Nutzungsbedingungen sowie Betriebsgrenzen vor Integration prüfen. Keine kostenpflichtige API oder unkontrollierte Nutzung öffentlicher Server einführen.

## 6. Anforderungen an die Intro-Szene

- Turm, Wüste, bärtiger Magier mit Stab und alle fünf Helden darstellen; Text aus dem GDD redaktionell verbindlich zentralisieren.
- Ablauf: Intro → Charakterauswahl → Bestätigung → Abenteuerübersicht beziehungsweise erster Spaziergang. Tatsächliche Navigation nach dem Audit integrieren.
- Ohne Standortberechtigung und ohne reale Bewegung abspielbar. Bestehende Spielstände sollen direkt fortgesetzt werden können, ohne erzwungenes erneutes Intro.
- „Überspringen“, „Weiter“ und „Erneut ansehen“ auf Deutsch anbieten; Szene im Tagebuch erhalten. Kein Text nur für kurze Animationsdauer sichtbar.
- Text und Darstellung trennen: Szenendaten referenzieren Sprecher-IDs, Dialogschlüssel und Bildzustände. Bewegungsreduktion und Textalternative vorsehen; Vertonung ist optional und kein Verständniszwang.
- Falls ein neues Merkmal wie `introSeenVersion` nötig ist, kompatibel ergänzen. Eine fehlende Markierung darf keinen alten Fortschritt verwerfen oder die Figur neu anlegen.

## 7. Integration von Saira und Abgleich aller Helden

Die vorhandene Heldenanzahl ist unbekannt. Zuerst feststellen, welche Figuren und Fähigkeiten tatsächlich existieren. Saira anschließend mit stabiler technischer ID `saira` ergänzen, ohne bestehende IDs oder Reihenfolgen als Speicherreferenzen umzudeuten.

- Auswahlkarte, Porträt, Beschreibung, deutsche Fähigkeits- und Verwandlungstexte, zugängliche Bildtexte und gegebenenfalls Animationen ergänzen. Saira braucht keine Verwandlung, sofern das gemeinsame Modell sie nicht voraussetzt.
- Zwei kurze Klingen als virtuelle Ausrüstung; Schattendoppelgänger und Fallenwahrnehmung als familiengerechte Fähigkeiten.
- Fähigkeiten an das gemeinsame Aktions- und Ressourcenmodell anbinden. Keine privilegierte reale GPS-Abkürzung oder Bewegungsgeschwindigkeit.
- Bestehende Figuren mit dem GDD abgleichen: Aerans Flöte, Velars Runen und Elemente, Vargs Wolfsgestalt und Ravenas Greifvogelgestalt samt rein virtueller Aufklärung.
- Keine Pflichtquest darf Saira oder einen anderen Helden ausschließen. Allgemeine Rätsellösungen und kostenlose Hinweise gewährleisten das.
- Falls bestehende Auswahl, Array-Zugriffe oder Typen fest vier Figuren voraussetzen, gezielt erweitern. Keine vollständige Neustrukturierung ohne belegten technischen Bedarf.
- Bestehende Spielstände mit ihrer gewählten Figur unverändert fortsetzen. Ein optionaler späterer Wechsel erhält Kampagnenfortschritt und verhindert Ausrüstungsverlust.
- Gleichwertige Gesamtstärke durch dieselben Referenzbegegnungen und Ressourcenbudgets nachweisen; konkrete Zahlen erst nach Analyse des Kampfsystems setzen.

## 8. Notwendige Tests und Abnahme

In dieser Dokumentationsphase werden keine Spieltests vorgetäuscht: Es gibt keine zugängliche Codebasis, daher wurden weder Build noch Anwendungstests ausgeführt. Die folgenden Tests gehören in die spätere Implementierung und sollen mit der vorhandenen Infrastruktur umgesetzt werden.

| Ebene | Wesentliche Fälle | Erfolgskriterium |
| --- | --- | --- |
| Inhaltsvalidierung | 30 eindeutige Episoden, fünf Kapitel, je sechs Episoden, 3–5 Ereignisse, vollständige Text- und Gegenstandsreferenzen | Keine Lücken, Zyklen oder unerreichbaren Pflichtziele |
| Textverträge | Fehlende Schlüssel, Parameter, Singular/Plural, Zahlen und Datumsformat | Typisierte vollständige deutsche Ressourcen; `de-DE`-Formatierung |
| Sprachprüfung | Alle sichtbaren Bereiche inklusive Fehler, Hinweise, Alternativtexte und Bilder mit Text | Keine unbeabsichtigten englischen Texte; technische Eigennamen gezielt zulassen |
| Speicherkompatibilität | Tatsächliche alte Fixtures, fehlende neue Felder, neuere unbekannte Version, beschädigte Daten | Kein Löschen oder stilles Überschreiben; bekannte Spielstände bleiben spielbar |
| Pause und Vergabe | App-Ende vor/nach Ereignisabschluss, doppelte Aktionen, Neustart während Belohnung, Ortswechsel | Bestätigter Fortschritt bleibt erhalten; jede einmalige Belohnung genau einmal |
| Kampagne | Alle Story-Abhängigkeiten, Gegenstandsumwandlung, Rückgabe in Episode 30 | Vollständiger Abschluss ohne Goldkauf und ohne optionale Funde |
| Heldenbalance | Referenzkämpfe, Schutz, Heilung/Vermeidung, Bosse, Questfähigkeit | Jeder der fünf Helden kann bestehen; keine Klassenblockade |
| Routing | Privatweg, fehlende Verbindung, Flussbarriere, schwierige Querung, fehlende Daten, abgelaufene Prüfung, kein Rundweg | Ungeeignete oder ungeprüfte Routen werden nicht aktiv |
| Standortadapter | Berechtigung abgelehnt/entzogen, grobe Genauigkeit, Sprünge, Ausfall, Wiederaufnahme | Deutsche Rückmeldung, sichere Pause, kein falscher Fortschritt |
| Kampfsicherheit | Bewegung vor Start und im Kampf, sichere Bestätigung, lange Pause | Keine Kampfeingabe unterwegs, keine Strafe oder automatische Runde |
| Oberfläche | Intro überspringen/wiederholen, fünf Auswahlen, Tagebuch, Fehlerzustände | Verständliche deutsche Bedienung und bestehende Fortsetzung |
| Barrierefreiheit | Große Schrift, Kontrast, Tastatur/Screenreader soweit unterstützt, reduzierte Bewegung, Ton aus | Keine ausschließlich visuellen oder akustischen Pflichtinformationen |
| Geräteversuch | Reale begleitete, zuvor geprüfte Fußwege und mehrere mobile Geräte | GPS-Grenzen, Akkunutzung, sichere Haltemöglichkeiten und Pausen nachvollziehbar |

Die kombinatorische Kampagnenprüfung umfasst mindestens 5 Helden × 3 Distanzmodi × 30 Episoden = 450 automatisierbare Episoden-Abschlüsse in einer passenden Simulation. Sie prüft Erreichbarkeit, Belohnungen und Voraussetzungen; sie ersetzt keine redaktionelle Prüfung, Balancebewertung oder reale Routenprüfung. Mindestens ein vollständiger manueller Kampagnendurchlauf und gezielte Prüfungen aller heldenspezifischen Varianten sind zusätzlich einzuplanen. Für reproduzierbare Standorttests simulierte Weggraphen und Messfolgen einsetzen, keine zufälligen echten Zielkoordinaten und keine Pflichtabhängigkeit von öffentlichen APIs.

## 9. Priorisierte Implementierungsreihenfolge

| Priorität | Arbeitspaket | Konkretes Ergebnis und Freigabekriterium |
| --- | --- | --- |
| P0 | Repository-Zugriff und belegter Ist-Zustand | Branch/Commit, Projektanweisungen und Funktionsmatrix mit Dateibelegen; aktuelle Speicherung und Tests verstanden |
| P1 | Kleine Lokalisierungsgrundlage | Vorhandene Lösung erweitern oder `de.ts` plus typisierten Adapter einführen; eine risikoarme Oberfläche vollständig deutsch, Spielstände unverändert |
| P1 | Bestehende GPS-Sicherheit prüfen | Zufallsziele, Bewegungsinteraktion und ungeprüfte Routen erkennen; falls vorhanden gezielt sicher begrenzen, Fortschritt erhalten |
| P2 | Inhalts- und Speicherverträge | Stabile IDs, validiertes Kampagnenmodell und getestete additive Kompatibilität; keine Speicherbereinigung |
| P2 | Intro und fünf Helden | GDD-Intro, vollständige Auswahl einschließlich Saira und kompatible Fortsetzung alter Spielstände |
| P3 | Episode 1 vollständig durchgängig | Deutsche Texte, Ereignisse, allgemeine und heldenspezifische Lösungen, Kampf, Pause, Story-Fund, einmalige Belohnung; Routing zunächst nur simuliert |
| P3 | Sicheres Routensystem als separater Strang | OSM-Fußwegadapter, Eignungsprozess, Prüfstatus, Vorschau und Ausfallpfade; echte Routen bis zur belegten Prüfung deaktiviert |
| P4 | Kapitel I, dann II–V | Inhalte kapitelweise bis 30 ausbauen, Abhängigkeiten und Bossbalance mit allen Helden prüfen |
| P4 | Vollständige deutsche Oberfläche | Restliche UI, Inventar, Fähigkeiten, Meldungen, Einstellungen und Sicherheit zentral migriert; keine englischen Standardtexte |
| P5 | Begleitete Geräte- und Routenabnahme | Datenschutz, Barrierefreiheit, Standortfehler und konkret geprüfte Routen bewerten; kein automatischer Produktivstart |
| P5 | Stabilisierung und Erweiterungsvertrag | Regressionen, sämtliche Kampagnen-/Helden-/Moduskombinationen und alte Spielstände geprüft; weitere Welten integrierbar |

Bei belegten akuten Sicherheitsproblemen hat die gezielte Absicherung Vorrang vor Inhaltsausbau. Aufwand, vorhandene Testbefehle und konkrete Dateipatches können erst nach dem Audit seriös angegeben werden. Es gibt in diesem Plan keine automatische Veröffentlichung und keinen Git Push.

## 10. Nächster konkreter Schritt

Zuerst Zugriff auf die tatsächliche Codebasis herstellen, beide lokalen Entwürfe mit dem Repository zusammenführen und die Ist-Zustandsmatrix mit Belegen vervollständigen. Danach ist ein kleiner erster Implementierungsschritt sinnvoll: die vorhandene Textinfrastruktur prüfen beziehungsweise einen zentralen deutschen Ressourcenkatalog mit typisiertem Zugriff anlegen und genau eine vorhandene Oberfläche darüber ausgeben. Das überprüft die Architektur bei geringem Eingriff und ohne Änderungen an Kampf, GPS oder Spielständen. Die konkrete Oberfläche wird anhand des Audits gewählt.

## 11. Arbeitsregeln für alle Folgearbeiten

- Keine bestehenden Spielstände löschen, auch nicht indirekt durch inkompatible IDs oder automatischen Reset.
- Keine funktionierenden Features entfernen und keine vollständige Neustrukturierung ohne belegten technischen Grund.
- Keine kostenpflichtigen APIs integrieren und keine ungeprüften GPS-Routen aktivieren.
- Keine automatische Veröffentlichung und kein Git Push ohne ausdrückliche Freigabe.
- Erst vorhandene Infrastruktur verstehen, dann Änderungen klein, konkret und überprüfbar umsetzen.
