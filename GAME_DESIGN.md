# Adventure Game – Game Design Document

Stand: 30.10.2026. Status: Konzeptentwurf zur Umsetzung; keine Aussage über bereits vorhandene Funktionen. Zielrepository: `AnnaFillanna/adventure-game`. Die Codebasis war bei Erstellung nicht zugänglich. Dieser lokale Entwurf muss nach Wiederherstellung des Zugriffs mit dem Repository abgeglichen werden.

## 1. Vision und Zielgruppe

Adventure Game verbindet reale Spaziergänge mit einer zusammenhängenden Fantasy-RPG-Geschichte. Familien und Kinder erkunden mit dem Smartphone öffentlich zugängliche Fußwege. Unterwegs werden virtuelle Begegnungen, Hinweise und Sammelfunde freigeschaltet. Die reale Umgebung bleibt unverändert: Eine versunkene Brücke oder eine Schattenfestung existiert ausschließlich in der Geschichte und bezeichnet kein reales Gewässer, Gebäude oder Betretungsziel.

Das Spiel motiviert durch Neugier, gemeinsame Entscheidungen und eine abgeschlossene Geschichte. Es gibt keine täglichen Pflichten, Verlustserien oder Strafen für ausgelassene Tage. Eine Tagesepisode bezeichnet eine Spaziergangseinheit, keinen Kalendertag. Die erste Kampagne umfasst 30 Episoden in fünf Kapiteln. Ein Kind kann sie mit jedem der fünf Helden abschließen, ohne Geld auszugeben und ohne seltene Ausrüstung zu benötigen.

Ziel ist familienfreundliche Spannung ohne Blut, drastische Gewalt oder Schockeffekte. Besiegte Kreaturen lösen sich in Nebel auf, werden beruhigt oder vertrieben. Begleitende Erwachsene beurteilen die reale Wegsicherheit; die Anwendung kann sie nicht garantieren. Eine konkrete Altersfreigabe ist vor Veröffentlichung gesondert zu prüfen.

## 2. Sprache und Präsentation

Die vollständige Anwendung erscheint auf Deutsch (`de-DE`): Oberfläche, Charakterauswahl, Dialoge, Geschichte, Zwischensequenzen, Quests, Kampf, Inventar, Gegenstände, Fähigkeiten, Verwandlungen, Belohnungen, Fehler, Benachrichtigungen, Einstellungen und Sicherheitshinweise. Englisch bleibt technischen Bezeichnern im Quellcode vorbehalten. Unvermeidbare Namen wie Adventure Game und Aeran sind Eigennamen.

Texte sind kurz, verständlich und vorlesbar. Wichtige Informationen werden niemals nur durch Farbe, Ton oder Animation vermittelt. Dialoge sind überspringbar und im Tagebuch nachlesbar. Schriftvergrößerung, ausreichende Kontraste und reduzierte Bewegung gehören zu den Abnahmekriterien. Die technische Architektur der zentralen Texte steht in `IMPLEMENTATION_ROADMAP.md`.

## 3. Intro: Der Turm des letzten Magiers

**Inszenierung:** Goldener Sand zieht über eine weite Wüstenlandschaft. Fünf Helden stehen vor einem gewaltigen alten Turm. In seinem Tor entzündet sich blaues Licht. Ein mächtiger, bärtiger Magier tritt heraus; sein Stab wirft einen Kreis aus Sternen auf den Sand. Die Szene wird vor dem Spaziergang im Stillstand gezeigt und benötigt weder GPS noch eine reale Bewegung.

**Erzähler:** „Wo einst sieben Flüsse rauschten, flüstert heute nur der Sand. Doch im Turm des letzten Magiers brennt noch ein Licht.“

**Magier:** „Aeran. Velar. Varg. Ravena. Saira. Ihr seid meinem Ruf gefolgt. Hinter den Dünen erwacht eine Dunkelheit, die selbst die Sterne verschlingt.“

**Aeran:** „Dann geben wir der Welt ihre Stimme zurück.“

**Ravena:** „Sag uns, wo wir anfangen sollen.“

**Magier:** „Sucht das Schwert des Ersten Lichts. Nur seine Kraft kann die dunklen Kreaturen aufhalten. Findet es und bringt es zu mir zurück.“

**Velar:** „Und wenn der Weg verborgen ist?“

**Magier:** „Folgt den zerbrochenen Zeichen. Was getrennt wurde, wird euch gemeinsam den Weg weisen.“

**Varg:** „Wir werden die Spur finden.“

**Saira:** „Und auf das achten, was im Schatten bleibt.“

**Erzähler:** „Fünf Helden. Ein Versprechen. Wessen Geschichte wirst du erzählen?“

Anschließend erscheint die Charakterauswahl mit allen fünf Figuren, Beschreibung und Fähigkeiten. Alle sind sofort verfügbar. Die übrigen vier bleiben Verbündete der Erzählung; für die Hauptgeschichte ist kein Mehrspielermodus erforderlich. Nach einer Vorschau bestätigt die Familie die Wahl. Ein späterer Heldenwechsel darf keine Geschichte löschen; seine genaue Bedienung wird bei der Umsetzung mit dem vorhandenen Speichermodell abgestimmt.

## 4. Die fünf spielbaren Helden

| Held | Aussehen und Rolle | Fähigkeiten und taktischer Schwerpunkt | Alternative für Story-Hindernisse |
| --- | --- | --- | --- |
| Aeran – Der Harmonist | Muskulöser, blonder Krieger mit magischer Flöte | Klangresonanz enthüllt Zeichen; Heilklang heilt; Tiermelodie beruhigt Tiere; Schallwelle schwächt mehrere Gegner | Öffnet Siegel durch harmonische Resonanz |
| Velar – Der Volkhv | Muskulöser rothaariger Magier | Elementarmagie, Runenlesen, Schutzschilde; Wechsel zwischen Angriff und Schutz | Entschlüsselt dieselben Siegel durch Runen |
| Varg – Der Wolfswandler | Dunkelhaariger, kräftiger Krieger | Wolfsgestalt, Spürsinn, Stärke und Geschwindigkeit; gezielte Angriffe | Erspürt verborgene Mechanismen und Spuren |
| Ravena – Die Himmelsjägerin | Kräftige rothaarige Kriegerin | Greifvogelgestalt, Windmagie, virtuelle Luftaufklärung; Kontrolle und Übersicht | Erkennt die Anordnung des Mechanismus aus virtueller Vogelperspektive |
| Saira – Die Schattenkriegerin (Arbeitstitel) | Athletische Heldin mit zwei kurzen Klingen | Schattendoppelgänger, Fallenwahrnehmung, präzise Doppelschläge; Täuschung und Entschärfung | Findet die sichere Schaltung eines Mechanismus |

**Balancevorgabe:** Vergleichbare Gesamtstärke bei unterschiedlichen Spielstilen. Als erster Testansatz erhalten alle dasselbe Gesamtbudget für Angriff, Schutz, Heilung beziehungsweise Vermeidung und Kontrolle. Konkrete Zahlen werden erst am vorhandenen Kampfsystem ausgerichtet. Jeder Held besitzt eine verlässliche Standardaktion ohne Verbrauchsgegenstand, eine Schutzoption und eine charakteristische Fähigkeit. Gegnerresistenzen dürfen keinen Helden vollständig aussperren.

Jedes zwingende Hindernis bietet eine allgemeine Lösung, einen kostenlosen Hinweis und optional eine heldenspezifische Darstellung. Verwandlungen verändern virtuelle Fähigkeiten und Animationen, niemals die reale Bewegungsanforderung. Ravenas Aufklärung fordert weder Höhenzugang noch Drohnen; Vargs Geschwindigkeit fordert kein Rennen. Sairas Fallen sind ausschließlich virtuelle Rätsel. Kein exklusiver Charakter, Gegenstand oder Goldbetrag sperrt die Hauptgeschichte.

## 5. Spielablauf und Spaziergänge

1. Episode und Distanzmodus wählen; Fortschritt und Ausrüstung prüfen.
2. Geeignete Route vorschlagen, deren Eignung gesondert prüfen und durch eine erwachsene Begleitperson bestätigen lassen.
3. Unterwegs knappe, zurückhaltende Hinweise erhalten; Aufmerksamkeit gilt dem Weg.
4. Freigeschaltete Ereignisse an einem tatsächlich geeigneten Ort im Stillstand öffnen.
5. Dialog, Rätsel oder rundenbasierten Kampf abschließen und Fortschritt sichern.
6. Abschluss lesen, Story-Fund ins Tagebuch übernehmen und nächste Episode freischalten.

| Modus | Ungefähre Distanz | Inhalt und Gleichwertigkeit |
| --- | --- | --- |
| Kurzes Abenteuer | 1 km | Kompakte Verteilung aller Pflicht-Ereignisse |
| Normales Abenteuer | 2–3 km | Mehr Abstand und optionale Entdeckungen |
| Großes Abenteuer | 4–5 km | Zusätzliche optionale Begegnungen und Atmosphäre |

Alle Modi liefern denselben zwingenden Story-Fortschritt. Die Entfernungen sind Zielbereiche, keine Garantie und keine Pflicht trotz ungeeigneter Bedingungen. Größere Routen dürfen keine exklusiven Pflichtgegenstände oder überlegene Story-Ausrüstung enthalten. Optionales Gold erhält eine begrenzte Zusatzmenge; die endgültigen Werte werden getestet. Es gibt keine Vorgabe, alle Ereignisse auf getrennten GPS-Punkten unterzubringen: mehrere Ereignisse können nach kurzer Pause am selben sicheren Ort gespielt werden.

**Pause und Fortsetzung:** Jederzeit pausieren, auch im Kampf. Aktuelle Episode, Ereigniszustand, Kampfzustand, gewährte Belohnungen und gewählter Modus bleiben erhalten. Bei Fortsetzung an einem anderen Ort wird nur der verbleibende Spaziergang neu geplant. Die Geschichte startet nicht neu, erreichte Ziele zählen nicht doppelt. Abbruch, schlechtes Wetter, fehlendes GPS oder verpasste Tage kosten weder Gold noch Leben. Das Spiel fordert keine Rückkehr zum alten realen Wegpunkt.

## 6. Sicherheit, GPS und Routing

Es werden keine zufälligen GPS-Koordinaten als echte Ziele erzeugt. Langfristige Grundlage sind OpenStreetMap-Fußwegdaten und ein Routingdienst auf dieser Datenbasis, beispielsweise eine selbst betriebene GraphHopper- oder Valhalla-Instanz. Es wird keine kostenpflichtige API vorausgesetzt oder in dieser Phase integriert. Öffentliche Dienste werden nur unter Einhaltung ihrer Nutzungsvorgaben geplant; freie Software bedeutet nicht kostenlosen Betrieb. Kartenattribution und Lizenzen müssen berücksichtigt werden.

**Planungskette:** Startbereich → zugänglichen Fußweggraphen laden → Wegpunktkandidaten an geeigneten, verbundenen Wegabschnitten bilden → Fußgängerrouten berechnen → Distanz und möglichst Rundweg zum Ausgangspunkt optimieren → Eignung gesondert bewerten → Vorschau und Bestätigung. Luftliniennähe allein genügt weder für Erreichbarkeit noch für das Freischalten eines Ziels auf der anderen Seite eines Flusses oder einer Straße.

**Ausschluss beziehungsweise gesonderte Prüfung:** private oder gesperrte Wege, Baustellen, motorisierte Verkehrswege ohne geeigneten Gehweg, schwierige Querungen, Bahnanlagen, Gewässerzugänge, Abgründe, nicht erlaubte oder nicht verbundene Flächen. Tags wie `access`, `foot`, `highway`, `crossing`, `surface`, `sac_scale`, `lit` und `opening_hours` sind Hinweise, keine Sicherheitsgarantie. Fehlende Angaben werden nicht als „sicher“ interpretiert. Tageslicht, Wetter, aktuelle Sperrungen, Steigung, Kinderwagenbedarf und Zustand vor Ort müssen zusätzlich berücksichtigt werden.

Eine Route erhält einen Prüfstatus mit Herkunft, Zeitpunkt, offenen Unsicherheiten und gegebenenfalls örtlicher Prüfung. Ungeprüfte Vorschläge werden nicht automatisch zu aktiven Spielrouten. Bestätigung durch Erwachsene ersetzt keine fehlende technische Eignungsprüfung. Lassen sich geeignete Wege nicht belegen, wird keine GPS-Route gestartet; bereits freigeschaltete Inhalte und Pausen bleiben zugänglich. Ein Demonstrationsmodus verwendet klar gekennzeichnete simulierte Daten und schaltet kein echtes Routing frei.

**Im Betrieb:** GPS-Ungenauigkeit und Sprünge abfangen, Entfernung nur aus plausiblen Messungen ableiten. GPS-Ausfall führt zur Pause mit verständlicher Erklärung. Ereignisse werden gesammelt beziehungsweise vorgemerkt; ein unzugänglicher Wegpunkt lässt sich sicher ersetzen. Keine Zeitlimits für Ankunft, kein reales Fliehen vor Gegnern, keine plötzlichen Richtungswechsel, kein Betreten gefährlicher Orte. Bei Hindernissen anhalten und durch Erwachsene neu planen lassen. Ein Rundweg ist wünschenswert; ein nicht möglicher Rundweg wird vor Start deutlich ausgewiesen.

Kämpfe und längere Dialoge öffnen nur nach ausdrücklicher Bestätigung eines sicheren Halts. Bewegungsdaten können zusätzlich sperren oder pausieren, beweisen aber keinen sicheren Standort. Bei Bewegung bleiben Eingaben und Animationen pausiert; keine Strafe oder verpasste Runde. Sicherheitshinweis: „Bleib an einem sicheren Ort stehen. Achte auf Wege und Verkehr. Spiele mit einer erwachsenen Begleitperson.“

Standortdaten sind besonders sparsam zu behandeln: keine öffentliche Kinderposition, keine öffentliche Routenhistorie, kein Hintergrundtracking ohne Bedarf. Speicherort, Aufbewahrung, Einwilligung und Löschfunktionen müssen vor einer späteren Veröffentlichung festgelegt werden. Story-Fortschritt muss unabhängig von einer gespeicherten GPS-Spur erhalten bleiben.

## 7. Kampf und Gegner

Virtuelle, rundenbasierte Begegnungen bieten „Angreifen“, „Fähigkeit“, „Gegenstand“, „Schützen“ und „Begegnung pausieren“. Die Handlung wartet unbegrenzt auf die Familie. Gegnerabsichten werden verständlich angezeigt. Niederlagen führen zu einem kostenlosen erneuten Versuch oder einer leichteren Hilfsvariante am sicheren Standort, ohne Verlust von Story-Funden oder realen Rückweg.

| Gegnergruppe | Verhalten | Familienfreundliche Auflösung |
| --- | --- | --- |
| Sumpfuntote | Langsame Angriffe, Nebelschleier; laden Schutz und Reinigung zum Lernen ein | Fluch löst sich, Gestalten finden Ruhe |
| Banditen | Täuschung, Schilde, gestohlene Vorräte; Dialogalternative | Aufgabe, Versöhnung oder Rückgabe der Beute |
| Drachenkreaturen | Angekündigte Glut, Panzerung, Windstöße; Schutz vor Spezialangriffen | Rückzug oder Beruhigung statt Tötung |
| Schattenwächter | Siegel, Doppelbilder, wechselnde Schutzphasen | Schatten zerfallen bei gelöstem Siegel |
| Kapitelbosse | Mehrere klar angekündigte Phasen, kostenlose Lernhilfe | Reinigung, Befreiung oder Bannung |

Kapitelbosse sind der Moorhüter (Episode 6), die Hüterin der Tiefe (12), der Aschedrache (18), der Schattenvogt (24) und der Nachtkern (29). Episode 30 bildet den ruhigen Abschluss. Alle Bossmechaniken besitzen eine heldenunabhängige Lösung und sind mit jedem Helden ohne gekaufte Verbrauchsgegenstände schaffbar.

## 8. Gold, Gegenstände und Fortschritt

Goldmünzen werden als virtuelle Funde während der Spaziergänge gesammelt und zusätzlich als fest definierte Episodenbelohnung vergeben. Sie bezahlen Heiltränke, Ausrüstung, Waffenverbesserungen, optionale Hinweise und zusätzliche Hilfsmittel. Pflichtinformationen bleiben kostenlos. Gold ist keine Freischaltbedingung der Geschichte, es gibt keinen Kaufzwang und keine kostenpflichtigen Zufallsbelohnungen.

Als vorläufige Rechenbasis gewähren die Episoden 1–6 jeweils 20, 7–12 jeweils 25, 13–18 jeweils 30, 19–24 jeweils 35 und 25–30 jeweils 40 Gold. Das ergibt 900 garantiertes Gold für einen vollständigen Durchlauf in jedem Modus. Beispielpreise: Heiltrank 10, Hinweis mit zusätzlicher Komforterklärung 5, einfache Ausrüstung 40, Waffenverbesserung 60, zusätzlicher Hilfsgegenstand 15 Gold. Das sind Testwerte, kein freigegebenes Balancing. Heilung und Standardausrüstung müssen auch ohne Goldkäufe einen vollständigen Durchlauf erlauben.

Die folgende Planung nennt Gold und zusätzliche Belohnungen pro Episode. Story-Funde sind eigene, nicht verkäufliche Questgegenstände beziehungsweise dauerhafte Journalmarkierungen. Einmalige Vergabe und getrennte Kennzeichnung verhindern Doppelbelohnungen nach Pause oder Wiederholung. Ein späterer Wiederholungsmodus darf Story-Freischaltungen nicht zurücksetzen; zusätzliche Ökonomie wird getrennt begrenzt. Inventarfüllung blockiert niemals einen Pflichtfund. Ausrüstung verändert Spielstil und Komfort, nicht die Zugangsberechtigung zur Kampagne.

## 9. Kampagnenplanung: 30 Episoden

Alle Ereignisse sind virtuelle Inhalte, die an geeigneten Haltepunkten ausgelöst werden. Jede Episode enthält vier Pflicht-Ereignisse. Hindernisse und Orte sind erzählerisch; kein reales Moor, Bergwerk, Dach, Gewässer oder Bauwerk muss betreten werden. Die angegebenen Story-Funde sind in jedem Distanzmodus erreichbar.

### Kapitel I: Die verfluchten Lande – Tage 1–6

#### 01 – Das Flüstern im Sand

- **Geschichte:** Nach dem Auftrag weist ein verwehter Botenstein den Weg in die verfluchten Lande.
- **Hauptziel:** Die erste Spur zum Schwert sichern.
- **Ereignisse:** 1. Botschaft des Magiers lesen; 2. Fußspuren virtuell untersuchen; 3. einen Nebelschatten im Lernkampf bannen; 4. den Botenstein zusammensetzen.
- **Gegner/Hindernisse:** Nebelschatten, beschädigte Inschrift; kostenlose Rätselhilfe.
- **Sammelobjekte:** Goldmünzen, drei Steinsplitter, Kartenfragment des Grenzpfads.
- **Belohnungen:** 20 Gold, ein Heiltrank, freigeschaltetes Tagebuch.
- **Story-Fortschritt:** Das erste Kartenfragment markiert das Dorf Dämmerhain.
- **Übergang:** Eine stumme Glocke ruft aus dem Nebel.

#### 02 – Die stumme Glocke

- **Geschichte:** Dämmerhain wird von einem Fluch zum Schweigen gebracht.
- **Hauptziel:** Die Nachricht der Glockenhüterin hörbar machen.
- **Ereignisse:** 1. Hüterin treffen; 2. Glockenzeichen ordnen; 3. Sumpfuntoten beruhigen oder bannen; 4. Glockenerinnerung abspielen.
- **Gegner/Hindernisse:** Ein Sumpfuntoter, verstummte Klangzeichen.
- **Sammelobjekte:** Goldmünzen, Klangsplitter, Glockensiegel.
- **Belohnungen:** 20 Gold, ein Schutztrank.
- **Story-Fortschritt:** Das Glockensiegel bewahrt die Worte über den Moorpfad.
- **Übergang:** Ein Händler meldet verschwundene Vorräte.

#### 03 – Die gestohlene Laterne

- **Geschichte:** Banditen haben eine Laterne entwendet, die verfluchten Nebel sichtbar macht.
- **Hauptziel:** Die Laterne zurückgewinnen.
- **Ereignisse:** 1. Händler befragen; 2. Vorratsspuren vergleichen; 3. Banditen durch Gespräch oder Übungskampf überzeugen; 4. Laterne entzünden.
- **Gegner/Hindernisse:** Banditenspäher, widersprüchliche Spuren.
- **Sammelobjekte:** Goldmünzen, zurückgegebene Vorräte, Nebellaterne.
- **Belohnungen:** 20 Gold, einfacher Reiseumhang.
- **Story-Fortschritt:** Die Nebellaterne enthüllt verborgene Kartenlinien.
- **Übergang:** Auf der Karte erscheint eine zerstörte virtuelle Brücke.

#### 04 – Zeichen unter dem Nebel

- **Geschichte:** Alte Wegzeichen erzählen von einem Lichtorden und seinem verlorenen Übergang.
- **Hauptziel:** Den Übergang in der Kartenvision rekonstruieren.
- **Ereignisse:** 1. Kartenvision öffnen; 2. drei Wegzeichen finden; 3. Nebelschleier bannen; 4. Brückenmuster lösen.
- **Gegner/Hindernisse:** Zwei kleine Sumpfuntote, Symbolrätsel; kein reales Brückenüberqueren.
- **Sammelobjekte:** Goldmünzen, Wegzeichen, Rune der Verbindung.
- **Belohnungen:** 20 Gold, ein Heiltrank.
- **Story-Fortschritt:** Die Rune aktiviert den virtuellen Zugang zum Moorheiligtum.
- **Übergang:** Eine Stimme im Heiligtum bittet um Erinnerung.

#### 05 – Das Gedächtnis der Weiden

- **Geschichte:** Der Geist einer Hüterin erinnert sich nur bruchstückhaft an den Ursprung des Fluchs.
- **Hauptziel:** Die Erinnerung der Hüterin vervollständigen.
- **Ereignisse:** 1. Geist anhören; 2. Erinnerungsbilder ordnen; 3. eingeschüchtertes Fantasietier beruhigen; 4. Schutzzeichen erhalten.
- **Gegner/Hindernisse:** Angstnebel, verlorene Erinnerungsreihenfolge.
- **Sammelobjekte:** Goldmünzen, Erinnerungssamen, Weidensiegel.
- **Belohnungen:** 20 Gold, kostenloser Boss-Hinweis im Tagebuch.
- **Story-Fortschritt:** Das Weidensiegel schützt erzählerisch vor dem Fluch des Moorhüters.
- **Übergang:** Der Moorhüter erwacht unter einer schwarzen Krone.

#### 06 – Die Krone des Moorhüters

- **Geschichte:** Der Hüter ist selbst Gefangener des Fluchs.
- **Hauptziel:** Seine Schattenkrone lösen und ihn befreien.
- **Ereignisse:** 1. Schutzzeichen einsetzen; 2. angekündigte Nebelphase abwehren; 3. Kronensiegel im Bosskampf brechen; 4. den befreiten Hüter befragen.
- **Gegner/Hindernisse:** Kapitelboss Moorhüter, wechselnde Schutzphase.
- **Sammelobjekte:** Goldmünzen, gereinigter Kronensplitter, Flusskartenfragment.
- **Belohnungen:** 20 Gold, Abzeichen „Freund der verfluchten Lande“, ein Ausrüstungszeichen.
- **Story-Fortschritt:** Das zweite Kartenfragment zeigt den Weg zu den versunkenen Pfaden.
- **Übergang:** Unter dem Kartenlicht erscheint eine Stadt unter Wasser.

### Kapitel II: Die versunkenen Pfade – Tage 7–12

#### 07 – Die Stadt im Spiegel

- **Geschichte:** Eine Kartenvision zeigt eine versunkene Stadt, deren Stimmen noch zu hören sind.
- **Hauptziel:** Den Namen ihres alten Eingangs herausfinden.
- **Ereignisse:** 1. Flusskarte entfalten; 2. Spiegelbilder vergleichen; 3. Schattenfisch als virtuelle Wächtererscheinung bannen; 4. Eingangsnamen zusammensetzen.
- **Gegner/Hindernisse:** Spiegelwächter, verdrehte Schrift; kein Zugang zu realem Wasser.
- **Sammelobjekte:** Goldmünzen, Spiegelscherben, Namensplakette.
- **Belohnungen:** 25 Gold, ein Heiltrank.
- **Story-Fortschritt:** Die Namensplakette öffnet das erste Stadtsiegel.
- **Übergang:** Ein Fährmann ohne Boot wartet in der Vision.

#### 08 – Der Fährmann der Erinnerungen

- **Geschichte:** Der Fährmann kann verlorene Erinnerungen über einen imaginären Fluss tragen.
- **Hauptziel:** Seine zerbrochene Erinnerungsmarke heilen.
- **Ereignisse:** 1. Fährmann anhören; 2. Erinnerungsstücke zuordnen; 3. Nebelwächter überwinden; 4. Marke zusammenfügen.
- **Gegner/Hindernisse:** Nebelwächter, Zuordnungsrätsel.
- **Sammelobjekte:** Goldmünzen, Erinnerungskiesel, Fährmarke.
- **Belohnungen:** 25 Gold, Reisehandschuhe.
- **Story-Fortschritt:** Die Fährmarke ermöglicht die virtuelle Überfahrt zur Bibliothek.
- **Übergang:** In der Bibliothek fehlen alle Seiten über das Schwert.

#### 09 – Die leeren Seiten

- **Geschichte:** Ein Schatten hat das Wissen der Stadt aus ihren Büchern gelöst.
- **Hauptziel:** Den ersten Teil der Schwertchronik wiederherstellen.
- **Ereignisse:** 1. Archivarin treffen; 2. schwebende Schriftzeichen sortieren; 3. kleinen Schattenwächter bannen; 4. Chronik lesen.
- **Gegner/Hindernisse:** Schattenwächter, vertauschte Buchstaben.
- **Sammelobjekte:** Goldmünzen, Tintenkristalle, Chronikblatt des Bundes.
- **Belohnungen:** 25 Gold, ein Schutztrank.
- **Story-Fortschritt:** Das Blatt erklärt: Das Schwert wurde durch einen gemeinsamen Schwur versiegelt.
- **Übergang:** Ein Banditenhauptmann bietet einen gestohlenen Schlüssel an.

#### 10 – Ein Handel ohne Gold

- **Geschichte:** Der Hauptmann will Hilfe für seine verängstigten Gefährten statt Bezahlung.
- **Hauptziel:** Vertrauen gewinnen und den Archivschlüssel erhalten.
- **Ereignisse:** 1. Angebot anhören; 2. verschwundene Vorratszeichen finden; 3. Schattennebel durch Rätsel oder Kampf lösen; 4. Schlüssel geschenkt bekommen.
- **Gegner/Hindernisse:** Schattennebel, Misstrauen der Banditen.
- **Sammelobjekte:** Goldmünzen, Vorratszeichen, Archivschlüssel.
- **Belohnungen:** 25 Gold, ein Heiltrank.
- **Story-Fortschritt:** Der Schlüssel öffnet das versiegelte Tiefenarchiv; es gibt keine Goldschranke.
- **Übergang:** Das Archiv antwortet nur auf eine alte Rune.

#### 11 – Die Rune der Gezeiten

- **Geschichte:** Ein mechanisches Wasserspiel bewahrt die letzte Nachricht der Stadthüter.
- **Hauptziel:** Den Rhythmus der Gezeitenrune entschlüsseln.
- **Ereignisse:** 1. Mechanismus betrachten; 2. Symbolfolge ausprobieren; 3. Spiegelwächter ablenken oder bannen; 4. Rune aktivieren.
- **Gegner/Hindernisse:** Spiegelwächter, Rhythmusrätsel mit visueller und textlicher Alternative.
- **Sammelobjekte:** Goldmünzen, Zahnradzeichen, Gezeitenrune.
- **Belohnungen:** 25 Gold, kostenloser Hinweis auf die Bossphasen.
- **Story-Fortschritt:** Die Rune ruft die Hüterin der Tiefe.
- **Übergang:** Die Hüterin hält die Helden zunächst für Schattenboten.

#### 12 – Das Herz der Tiefe

- **Geschichte:** Die verfluchte Hüterin bewacht den Weg zum Aschegebirge.
- **Hauptziel:** Ihre Prüfung bestehen und den Fluch lösen.
- **Ereignisse:** 1. Bundesschwur vorlesen; 2. Spiegelbilder im Bosskampf unterscheiden; 3. Gezeitenrune anwenden; 4. Nachricht der Hüterin empfangen.
- **Gegner/Hindernisse:** Kapitelboss Hüterin der Tiefe, erkennbare Spiegelphasen.
- **Sammelobjekte:** Goldmünzen, Tiefenperle, Bergkartenfragment.
- **Belohnungen:** 25 Gold, Abzeichen „Bewahrer der versunkenen Pfade“, ein Ausrüstungszeichen.
- **Story-Fortschritt:** Das dritte Kartenfragment markiert eine Schmiede im Aschegebirge.
- **Übergang:** Die Tiefenperle zeigt einen Drachen im roten Himmel.

### Kapitel III: Das Aschegebirge – Tage 13–18

#### 13 – Funken am Horizont

- **Geschichte:** Eine Schmiedin sucht das erloschene Feuer ihrer Ahnen.
- **Hauptziel:** Den Zugang zur virtuellen Bergschmiede finden.
- **Ereignisse:** 1. Schmiedin treffen; 2. Funkenzeichen sammeln; 3. kleine Glutechse beruhigen oder vertreiben; 4. Schmiedetor öffnen.
- **Gegner/Hindernisse:** Drachenkreatur Glutechse, verriegeltes Symboltor.
- **Sammelobjekte:** Goldmünzen, Funkenzeichen, Schmiedemarke.
- **Belohnungen:** 30 Gold, ein Heiltrank.
- **Story-Fortschritt:** Die Schmiedemarke gewährt Zugang zum Wissen über die Schwertfassung.
- **Übergang:** Für die Fassung fehlt ein besonderer Erzsplitter.

#### 14 – Das singende Erz

- **Geschichte:** Ein Erzgeist erinnert sich an den Klang des Ersten Lichts.
- **Hauptziel:** Den echten Lichtsplitter unter Attrappen erkennen.
- **Ereignisse:** 1. Erzgeist anhören; 2. Muster vergleichen; 3. Steinhülle virtuell lösen; 4. Lichtsplitter bergen.
- **Gegner/Hindernisse:** Steinwächter, Mustervergleich mit optionalem Ton; kein reales Graben.
- **Sammelobjekte:** Goldmünzen, Erzproben, singender Lichtsplitter.
- **Belohnungen:** 30 Gold, ein Schutztrank.
- **Story-Fortschritt:** Der Splitter ist das erste Material zur späteren Schwertfassung.
- **Übergang:** Ein Winddrache versperrt die nächste Kartenpassage.

#### 15 – Der zornige Wind

- **Geschichte:** Ein junger Drache schützt aus Angst sein zerbrochenes Nest in der Vision.
- **Hauptziel:** Den Drachen beruhigen und seine Botschaft verstehen.
- **Ereignisse:** 1. Drachenabsicht erkennen; 2. virtuelle Nestteile ordnen; 3. angekündigte Windstöße schützen; 4. Vertrauen gewinnen.
- **Gegner/Hindernisse:** Winddrache, Schutzbegegnung ohne Tötung.
- **Sammelobjekte:** Goldmünzen, Nestzeichen, Drachenfeder.
- **Belohnungen:** 30 Gold, Windtalisman als Komfortausrüstung.
- **Story-Fortschritt:** Die Drachenfeder übermittelt eine Warnung vor dem Aschedrachen.
- **Übergang:** Ein alter Signalstein nennt einen Weg durch den Aschenebel.

#### 16 – Die verborgenen Signalfeuer

- **Geschichte:** Erloschene Signalzeichen verschlüsseln den Pfad zur Lichtschmiede.
- **Hauptziel:** Die virtuelle Signalkette wiederherstellen.
- **Ereignisse:** 1. Signalstein lesen; 2. drei Lichtmuster lösen; 3. Ascheschatten bannen; 4. Signalkarte sichern.
- **Gegner/Hindernisse:** Ascheschatten, Logikrätsel; kein Entzünden echter Feuer.
- **Sammelobjekte:** Goldmünzen, Lichtzeichen, Signalkarte.
- **Belohnungen:** 30 Gold, ein Heiltrank.
- **Story-Fortschritt:** Die Signalkarte erschließt die letzte Schmiedekammer.
- **Übergang:** Dort liegt ein zerbrochener Schlüssel aus Sonnenmetall.

#### 17 – Der Schlüssel aus Sonnenmetall

- **Geschichte:** Die Schmiedin kann den Schlüssel nur mit dem geretteten Lichtsplitter erneuern.
- **Hauptziel:** Den Sonnenschlüssel herstellen.
- **Ereignisse:** 1. Bauplan lesen; 2. Schlüsselstücke ausrichten; 3. Schmiede gegen eine Glutechse schützen; 4. fertigen Schlüssel prüfen.
- **Gegner/Hindernisse:** Glutechse, Formrätsel ohne Geschicklichkeitszeitlimit.
- **Sammelobjekte:** Goldmünzen, Schlüsselstücke, Sonnenschlüssel.
- **Belohnungen:** 30 Gold, kostenlose einfache Waffenverbesserung.
- **Story-Fortschritt:** Der Schlüssel öffnet später das Tor der Schattenfestung; der Lichtsplitter wird als verbaut markiert.
- **Übergang:** Der Aschedrache legt seinen Schatten über die Schmiede.

#### 18 – Unter den Flügeln der Asche

- **Geschichte:** Ein Schattenkristall hält den Aschedrachen gefangen.
- **Hauptziel:** Den Kristall lösen und den Drachen befreien.
- **Ereignisse:** 1. Drachenfeder als Vertrauenszeichen zeigen; 2. Glutphase schützen; 3. Kristall im Bosskampf reinigen; 4. Drachenbotschaft empfangen.
- **Gegner/Hindernisse:** Kapitelboss Aschedrache, klar angekündigte Glut- und Ruhephasen.
- **Sammelobjekte:** Goldmünzen, gereinigter Kristall, Festungskartenfragment.
- **Belohnungen:** 30 Gold, Abzeichen „Freund der Drachen“, ein Ausrüstungszeichen.
- **Story-Fortschritt:** Das vierte Kartenfragment vervollständigt den Weg zur Schattenfestung.
- **Übergang:** Der Drache warnt: „Hinter jenem Tor werden selbst Erinnerungen bewacht.“

### Kapitel IV: Die Schattenfestung – Tage 19–24

#### 19 – Das Tor ohne Schatten

- **Geschichte:** Das Festungstor erkennt den Sonnenschlüssel, verbirgt aber seine Schließordnung.
- **Hauptziel:** Das virtuelle Außentor öffnen.
- **Ereignisse:** 1. Festungskarte zusammensetzen; 2. Sonnenschlüssel einsetzen; 3. Schattenwächter überwinden; 4. Torzeichen ordnen.
- **Gegner/Hindernisse:** Schattenwächter, Schließrätsel; keine reale Festung betreten.
- **Sammelobjekte:** Goldmünzen, Torzeichen, äußeres Festungssiegel.
- **Belohnungen:** 35 Gold, ein Heiltrank.
- **Story-Fortschritt:** Das äußere Festungssiegel erschließt den ersten Hof der Vision.
- **Übergang:** Eine gefangene Kartografin sendet eine Lichtnachricht.

#### 20 – Die gefangene Kartografin

- **Geschichte:** Die Kartografin kennt den Weg zum inneren Archiv.
- **Hauptziel:** Ihre virtuelle Bannzelle entsiegeln.
- **Ereignisse:** 1. Nachricht entziffern; 2. Bannlinien vergleichen; 3. Wächter ablenken oder bannen; 4. Kartografin befreien.
- **Gegner/Hindernisse:** Schattenwächter, Bannmuster; kein reales Verstecken.
- **Sammelobjekte:** Goldmünzen, Bannsplitter, Innenhofplan.
- **Belohnungen:** 35 Gold, schützende Armschienen.
- **Story-Fortschritt:** Der Innenhofplan zeigt das Archiv und einen gemeinsamen Zugang für alle Helden.
- **Übergang:** Im Archiv liegt ein versiegelter Brief des Magiers.

#### 21 – Der versiegelte Brief

- **Geschichte:** Ein alter Brief bestätigt, dass der Magier das Schwert schon früher gesucht hat.
- **Hauptziel:** Den Brief bewahren und seinen gesicherten Inhalt entziffern.
- **Ereignisse:** 1. Archiv durchsuchen; 2. Siegelrätsel lösen; 3. Schriftenschatten bannen; 4. lesbaren Briefteil ins Tagebuch übernehmen.
- **Gegner/Hindernisse:** Schriftenschatten, fehlender letzter Absatz.
- **Sammelobjekte:** Goldmünzen, Wachssiegel, Brief des Magiers.
- **Belohnungen:** 35 Gold, ein Schutztrank.
- **Story-Fortschritt:** Gesichert ist nur die frühere Suche, keine böse Absicht; der mögliche Twist bleibt offen.
- **Übergang:** Ein Name aus dem Brief steht auf drei Erinnerungsspiegeln.

#### 22 – Drei Spiegel, ein Versprechen

- **Geschichte:** Spiegel zeigen Mut, Fürsorge und Zusammenhalt als Grundlage des alten Bundes.
- **Hauptziel:** Die drei Bundessymbole vereinen.
- **Ereignisse:** 1. Mutbild lösen; 2. Fürsorgeentscheidung treffen; 3. Zusammenhaltsbild ergänzen; 4. Spiegelwächter durch den Bund beruhigen.
- **Gegner/Hindernisse:** Spiegelwächter, drei zugängliche Entscheidungsrätsel ohne falschen Moralpfad.
- **Sammelobjekte:** Goldmünzen, drei Bundessymbole, Bundessiegel.
- **Belohnungen:** 35 Gold, ein Heiltrank.
- **Story-Fortschritt:** Das Bundessiegel öffnet den Saal des Schattenvogts.
- **Übergang:** Der Vogt fordert den Beweis, dass Licht geteilt werden kann.

#### 23 – Das geteilte Licht

- **Geschichte:** Gefangene Lichtfunken verlieren allein ihre Kraft, stärken sich aber gemeinsam.
- **Hauptziel:** Die Lichtfunken zu einer Laterne verbinden.
- **Ereignisse:** 1. Funken befragen; 2. Verbindungsmuster legen; 3. Schattenangriff abwehren; 4. Bundeslaterne entzünden.
- **Gegner/Hindernisse:** Schattenwächter, Verbindungsrätsel mit kostenloser Hilfe.
- **Sammelobjekte:** Goldmünzen, Lichtfunken, Bundeslaterne.
- **Belohnungen:** 35 Gold, kostenloser Boss-Hinweis.
- **Story-Fortschritt:** Die Bundeslaterne enthüllt die echten Siegel des Vogts.
- **Übergang:** Der Schattenvogt tritt aus seinen Doppelbildern hervor.

#### 24 – Der Schattenvogt

- **Geschichte:** Der Vogt bewacht den letzten Weg zur Ruhestätte des Schwertes.
- **Hauptziel:** Seine Siegel lösen und den Lichtpfad öffnen.
- **Ereignisse:** 1. Bundeslaterne einsetzen; 2. echte Siegel im Bosskampf erkennen; 3. Schutzphase durchstehen; 4. Vogt vom Schatten lösen.
- **Gegner/Hindernisse:** Kapitelboss Schattenvogt, Doppelbilder und angekündigte Schutzphasen.
- **Sammelobjekte:** Goldmünzen, Siegelsplitter, Sternenkompass.
- **Belohnungen:** 35 Gold, Abzeichen „Licht der Schattenfestung“, ein Ausrüstungszeichen.
- **Story-Fortschritt:** Der Sternenkompass weist zum Heiligtum des Ersten Lichts.
- **Übergang:** Sein Zeiger leuchtet nur im Zusammenspiel aller bisherigen Zeichen.

### Kapitel V: Das Schwert des Ersten Lichts – Tage 25–30

#### 25 – Wo die Zeichen zusammenfinden

- **Geschichte:** Die Karten und Runen bilden gemeinsam den Zugang zum Heiligtum.
- **Hauptziel:** Den Sternenkompass vollständig ausrichten.
- **Ereignisse:** 1. Kartenfragmente verbinden; 2. Verbindungs- und Gezeitenrune zuordnen; 3. kleinen Schattenwächter bannen; 4. Kompass ausrichten.
- **Gegner/Hindernisse:** Schattenwächter, Rückblickrätsel mit Tagebuchhilfe.
- **Sammelobjekte:** Goldmünzen, Sternzeichen, vollständige Lichtkarte.
- **Belohnungen:** 40 Gold, ein Heiltrank.
- **Story-Fortschritt:** Die Lichtkarte zeigt den erzählerischen Zugang zum Heiligtum.
- **Übergang:** Ein stiller Wächter fragt nach dem Sinn des Heldentums.

#### 26 – Die Prüfung der offenen Hand

- **Geschichte:** Der Wächter prüft Hilfsbereitschaft statt Reichtum oder Kampfstärke.
- **Hauptziel:** Ein verlorenes Lichtwesen unterstützen.
- **Ereignisse:** 1. Wächter anhören; 2. Lichtwesen suchen; 3. Erinnerungsstücke schenken, ohne Inventarkosten; 4. Antwort gemeinsam formulieren.
- **Gegner/Hindernisse:** Zweifelnebel, verständliches Entscheidungsrätsel; keine Goldforderung.
- **Sammelobjekte:** Goldmünzen, Erinnerungsgaben als Episodenobjekte, Zeichen der Fürsorge.
- **Belohnungen:** 40 Gold, ein Schutztrank.
- **Story-Fortschritt:** Das Zeichen öffnet den inneren Heiligtumsring unabhängig von der gewählten Formulierung.
- **Übergang:** Das Schwert leuchtet hinter einem gebrochenen Schutzkreis.

#### 27 – Der gebrochene Schutzkreis

- **Geschichte:** Der Schutzkreis kann das Schwert erst wieder tragen, wenn seine Runen verbunden sind.
- **Hauptziel:** Den Schutzkreis reparieren.
- **Ereignisse:** 1. Bruchstellen ansehen; 2. Runenfolge rekonstruieren; 3. Schattenwelle im Stillstand abwehren; 4. Schutzkreis schließen.
- **Gegner/Hindernisse:** Schattenwächter, Runenrätsel ohne Zeitdruck.
- **Sammelobjekte:** Goldmünzen, Runenstücke, Siegel des Schutzkreises.
- **Belohnungen:** 40 Gold, kostenloser Wiederherstellungsvorrat für das Finale.
- **Story-Fortschritt:** Der Kreis zeigt die erforderliche Schwertfassung aus dem Sonnenschlüssel.
- **Übergang:** Eine Stimme erinnert daran, dass Macht Verantwortung bedeutet.

#### 28 – Das Erwachen des Ersten Lichts

- **Geschichte:** Die gesammelten Bundeszeichen erwecken das legendäre Schwert.
- **Hauptziel:** Das Schwert aus seinem Bann lösen.
- **Ereignisse:** 1. Sonnenschlüssel zur Fassung wandeln; 2. Bundessiegel einsetzen; 3. Lichtprüfung als Rätsel oder Kampf bestehen; 4. Schwert annehmen.
- **Gegner/Hindernisse:** Lichtprüfung, symbolische Fassung; jeder Held kann die Questwaffe tragen.
- **Sammelobjekte:** Goldmünzen, Lichtkern, Schwert des Ersten Lichts.
- **Belohnungen:** 40 Gold, Questfähigkeit „Erstes Licht“.
- **Story-Fortschritt:** Das Schwert ist gefunden; seine Questfähigkeit ist für alle fünf Helden gleich zugänglich. Der Sonnenschlüssel wird als umgewandelt dokumentiert.
- **Übergang:** Der Nachtkern erhebt sich auf dem virtuellen Rückweg zum Magier.

#### 29 – Wenn die Nacht zerbricht

- **Geschichte:** Der Ursprung der Schatten versucht, das zurückkehrende Licht zu verschlingen.
- **Hauptziel:** Den Nachtkern bannen und den Rückweg in der Erzählung öffnen.
- **Ereignisse:** 1. Verbündetenbotschaften sammeln; 2. angekündigte Schattenphasen schützen; 3. Erstes Licht im Bosskampf einsetzen; 4. Nachtkern versiegeln.
- **Gegner/Hindernisse:** Finaler Kapitelboss Nachtkern; kostenlose Hilfe und erneuter Versuch, kein reales Fliehen.
- **Sammelobjekte:** Goldmünzen, Bundesfunken, gereinigtes Nachtsiegel.
- **Belohnungen:** 40 Gold, Abzeichen „Träger des Ersten Lichts“.
- **Story-Fortschritt:** Das Nachtsiegel belegt den Bann; das Schwert bleibt bis zur Übergabe gesichert.
- **Übergang:** Am Horizont der Geschichte öffnet sich erneut das Tor des Magierturms.

#### 30 – Das Licht, das wir teilen

- **Geschichte:** Die Helden bringen das Schwert zum Magier zurück und erinnern sich an ihre Verbündeten.
- **Hauptziel:** Den Auftrag abschließen und den Frieden feiern.
- **Ereignisse:** 1. Turm in einer Zwischenszene erreichen; 2. Schwert dem Magier übergeben; 3. gemeinsame Schutzzeremonie erleben; 4. Erinnerungsbuch und Abspann öffnen.
- **Gegner/Hindernisse:** Kein Pflichtkampf; kurzer Rückblick mit kostenloser Hilfe.
- **Sammelobjekte:** Goldmünzen, Dankesbriefe, Chronik des Ersten Lichts.
- **Belohnungen:** 40 Gold, Abschlussabzeichen „Gemeinsam für das Licht“, kosmetisches Erinnerungszeichen.
- **Story-Fortschritt:** Hauptgeschichte abgeschlossen; das Schwert schützt im Turm die Welt. Die Questwaffe wird als übergeben markiert und ihr Fund bleibt im Tagebuch erhalten.
- **Übergang:** Optional deutet ein ferner Leuchtturm eine neue Geschichte an; der Abschluss bleibt vollständig und verlangt keine Fortsetzung.

## 10. Offene Designidee: Das Geheimnis des Magiers

Der Magier könnte verschweigen, dass das Schwert die Kraft seiner Träger bindet oder nur durch freiwillig geteiltes Licht sicher wirkt. Das ist eine offene Designidee, keine beschlossene Enthüllung und kein verstecktes zweites Pflichtende. Der Brief in Episode 21 belegt vorerst ausschließlich eine frühere Suche. Vor einer Umsetzung sind Motivation, familiengerechte Auflösung und die Konsequenzen für Episode 30 redaktionell festzulegen. Kein bereits freigegebener Text darf versehentlich eine böse Absicht als Tatsache behaupten. Die Basiskampagne endet mit erfolgreicher Rückgabe und gemeinsamer Schutzzeremonie.

## 11. Langfristige Erweiterbarkeit

Kampagneninhalte werden von Bewegung, Routing, Kampf, Inventar und Textdarstellung getrennt. Eine Kampagne definiert stabile Kennungen, Kapitel, Episoden, Bedingungen, Ereignisse, Story-Funde, Belohnungen und Textschlüssel. Die reale Route liefert nur geeignete Begegnungsgelegenheiten und Bewegungsfortschritt; sie kennt keine konkreten Handlungsorte der Fantasywelt.

| Spätere Welt | Inhaltliche Ausprägung | Gemeinsam nutzbare Systeme |
| --- | --- | --- |
| Piraten | Schatzkarten, Inselvisionen, Mannschaften | Kartenfragmente, Dialoge, Rundwege, Inventar |
| Dinosaurier | Forschung, Spuren, virtuelle Tiere | Sammeln, Beruhigung, Wissensrätsel |
| Zombies | Altersgerecht stilisierte Flüche statt drastischer Gewalt | Rundenkampf, Reinigung, Schutz |
| Detektivgeschichten | Zeugenaussagen, Indizien, Schlussfolgerungen | Hinweise, Tagebuch, Bedingungen |
| Saisonale Abenteuer | Kurze Zusatzgeschichten ohne Teilnahmezwang | Episoden, kosmetische Belohnungen, Lokalisierung |

Keine Erweiterung darf echtes Wasser, gefährliche Orte, Verfolgungsbewegung oder nächtliche Teilnahme voraussetzen. Saisonales Auslassen kostet keinen Hauptfortschritt. Neue Welten benötigen eigene redaktionelle und sicherheitsbezogene Abnahme; die Spielstände früherer Kampagnen bleiben erhalten.

## 12. Abnahmekriterien des Designs

- Genau fünf Kapitel mit je sechs vollständig beschriebenen Episoden; jede Episode hat 3–5 Ereignisse und einen dauerhaften Story-Fortschritt.
- Alle 30 Episoden sind mit jedem der fünf Helden und in jedem Distanzmodus abschließbar; kein verpflichtender Goldkauf.
- Pause, App-Neustart und Wechsel des realen Startorts verlieren keinen bestätigten Fortschritt und gewähren keine doppelten Belohnungen.
- Sämtliche sichtbaren Texte sind deutsch, zentral referenzierbar und für spätere Sprachen erweiterbar.
- Keine zufälligen echten GPS-Ziele, keine aktivierten ungeprüften Routen, keine Kämpfe während Bewegung.
- Keine Strafen für Pausen oder ausgelassene Tage; kein realer Flucht-, Richtungswechsel- oder Gefahrenauftrag.
- Die Geschichte endet nach Episode 30 vollständig. Der mögliche Magier-Twist bleibt bis zur ausdrücklichen Designentscheidung offen.
