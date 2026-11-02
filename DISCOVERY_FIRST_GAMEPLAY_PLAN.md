# Adventure Game – Discovery-First Gameplay Plan

**Status:** 📋 Neue Philosophie & Design-Analyse  
**Fokus:** Entdecken statt Kämpfen  
**Scope:** Komplette Neubewertung der Spielarchitektur  

---

## 🧭 KERNPHILOSOPHIE: "ENTDECKEN STATT KÄMPFEN"

### Die Verschiebung

```
ALT (Kampf-zentriert):                NEU (Discovery-zentriert):
┌─────────────────────────┐           ┌─────────────────────────┐
│ Gegner → Kämpf → Sieg   │           │ Geheimnisse → Fragen    │
│                         │           │ → Entdeckungen → Aha!   │
│ Ziel: Besiegen          │           │ → Neue Geschichten      │
│ Emotion: Spannung       │           │                         │
│ Fokus: Mechanik         │           │ Ziel: Verstehen         │
└─────────────────────────┘           │ Emotion: Neugier        │
                                      │ Fokus: Atmosphäre       │
                                      └─────────────────────────┘
```

### Die fünf Säulen der Discovery

| Säule | Beispiel |
|-------|----------|
| **1. Überraschung** | "Warte, ein Geist?" / "Die Glocke kann sprechen?" |
| **2. Neugier-Trigger** | Frage offen lassen / Geheimnis andeuten |
| **3. Kleine Erfolge** | Dialog bestanden / Rätsel gelöst / Erinnerung wiederhergestellt |
| **4. Entdeckungs-Rhythmus** | Regelmäßige kleine Überraschungen, nicht überwältigend |
| **5. Belohnungs-Feedback** | "Du hast geholfen!" nicht "Du hast 100 XP verdient!" |

---

## 🔍 ARCHITEKTUR-ANALYSE: WAS EXISTIERT BEREITS?

### ✅ BEREITS DISCOVERY-FOKUSSIERT

| Komponente | Episode | Status |
|-----------|---------|--------|
| **Rätsel-Mechanik** | 1, 2, 3 | ✅ Vorhanden |
| **Geheimnisse/Story** | 1, 2, 3 | ✅ Vorhanden |
| **Hilfe-System** (kostenlos) | 1, 2, 3 | ✅ Vorhanden |
| **Wiederholung ohne Strafe** | 1, 2, 3 | ✅ Vorhanden |
| **Atmosphäre-Texte** | 1, 2, 3 | ✅ Vorhanden |
| **Neugier-Triggers** | 1, 2, 3 | ✅ Vorhanden |

### ⚠️ NOCH KAMPF-FOKUSSIERT

| Komponente | Episode | Problem |
|-----------|---------|---------|
| **Gegner-Begegnungen** | 1, 2, 3 | Nur Kampf als Lösung |
| **HP/XP-Fokus** | 1, 2, 3 | Zu mechanisch |
| **Combat UI** | 3 | Text-RPG-Gefühl |
| **"Gegner besiegen"** | 1, 2, 3 | Sollte optional sein |
| **Status-Anzeigen** | Überall | Ablenkung |

### 🎯 DIE GUTE NACHRICHT

**Episode 1 & 2 sind bereits ~70% Discovery-fokussiert!**

Sie haben:
- Rätsel (Pfade folgen, Glockenzeichen ordnen)
- Geheimnisse (Nabel-Lior, Glockenerinnerung)
- Hilfe-Optionen (kostenlos, kein Druck)
- Atmoshäre (Texte beschreiben Welt, nicht nur Kämpf)
- Wiederholung ohne Strafe

**Episode 3 ist die Abweichung** (zu kampf-zentriert).

---

## 📖 DAS KERN-PROBLEM: EPISODE 3 UND "KÄMPFE"

### Aktuelle Episode 3 Struktur

```
1. Dialog → Händler erklärt Problem
2. Rätsel → Spuren vergleichen  ✅ Discovery
3. KAMPF → Banditen besiegen    ❌ Combat-fokussiert
4. Celebration → Laterne anzünden ✅ Discovery
```

### Warum ist Event 3 problematisch?

- **"Kämpfen"** ist die einzige Lösung
- **HP-Balken** lenken ab
- **Keine Entscheidungskraft** – nur Buttons drücken
- **Keine Entdeckung** – Ergebnis ist vorhersehbar

### Besserer Ansatz für Event 3

```
Was, wenn die Banditen NICHT Gegner sind, sondern:
- Verwirrte Menschen (wie der Geist in Episode 2)
- Ein Geheimnis, das man VERSTEHEN muss (nicht besiegen)
- Mehrere Lösungswege (Kampf, Überzeugung, Flucht, Trick)
- Ein Rätsel: "Warum haben sie die Laterne geklaut?"
```

---

## 🎬 "ERSTE 5 MINUTEN" – DISCOVERY FLOW

### Beispiel: "Der Markt in Morgenlicht" (GPS-Quest aus Phase 7)

```
MINUTE 0:00 – Die Ankunft
└─→ Spieler geht in den Park
└─→ App zeigt: "🗺️ Ein neuer Ort erscheint..."
└─→ Keine Zeitvorgabe, keine Missionsleiste
└─→ Nur: "Du bist am Ziel. Schau dich um."

MINUTE 0:30 – Die Überraschung
└─→ UI öffnet sich sanft (keine Popup)
└─→ "🎭 Eine alte Händlerin sitzt auf einer Bank..."
└─→ Ein Bild/Emoji der Figur (nicht kämpfen!)
└─→ Dialog-Fragment: "Mein Korb... ich habe alles verloren..."
└─→ Spieler liest, fühlt sich in Geschichte hineinzogen
└─→ KEIN: "Level 5 Enemy ahead!"

MINUTE 1:00 – Die Entdeckung (erste Wahl)
└─→ Nur ZWEI intuitive Buttons:
    ├─→ "💬 Mit ihr sprechen"
    └─→ "↩️ Weitergehen (für später)"
└─→ Keine Eile, kein Timer
└─→ Spieler entscheidet aus Neugier

MINUTE 1:30 – Der Dialog
└─→ Klick: "Mit ihr sprechen"
└─→ Neue Szene öffnet sanft
└─→ Händlerin erzählt:
    "Ich war Marktverkäuferin. Ein Sturm kam plötzlich.
     Meine seltenen Kräuter – die besten aus der Gegend.
     Verschwunden wie Rauch. Ich weiß nicht, wohin..."

MINUTE 2:00 – Das Geheimnis
└─→ Text offenbart Möglichkeit, nicht Lösung:
    "Es heißt, die Kräuter sammeln sich in den alten
     Gärten. Aber wer würde dorthin gehen?"
└─→ Weitere Optionen:
    ├─→ "🔍 Nach den Kräutern suchen"
    ├─→ "💭 Ihre Geschichte anhören"
    ├─→ "⚔️ Den Sturm bekämpfen" (Geist-Begegnung, optional)
    └─→ "👋 Auf Wiedersehen"

MINUTE 2:30 – Kleine Erfolge (Spieler wählt: Suchen)
└─→ Neue Szenerie: "Du gehst zu den Gärten..."
└─→ Rätsel-Mini: "Die Kräuter sind versteckt.
                   Welche passen zu 'Morgen'?"
    ├─→ 🌅 Dill (Sonnenkraut)
    ├─→ 🌙 Salbei (Mondkraut)
    └─→ 💨 Minze (Windkraut)
└─→ Spieler denkt nach (nicht kämpft)

MINUTE 3:00 – Rätsel gelöst
└─→ "Du findest Dill und Minze. Die richtigen!"
└─→ Feedback: KEINE Zahlen, nur Story:
    "Die Kräuter duften noch frisch.
     Irgendjemand hat sie gerade verloren."
└─→ Neue Frage öffnet sich: "Wer?"

MINUTE 3:30 – Neue Entdeckung
└─→ Ein Hinweis auftauchen: "Fußabdrücke im Garten."
└─→ Optionen:
    ├─→ "🔎 Ihnen folgen (zu Ort B)"
    ├─→ "🏃 Schnell zur Händlerin zurück"
    └─→ "⏸️ Später machen (Save & Exit)"

MINUTE 4:00 – Nächste Entdeckung
└─→ Spieler folgt Spur → neuer Ort freigeschaltet
└─→ "Du entdeckst einen verlassenen Marktstand..."
└─→ Mini-Entdeckung: Alte Notiz auf Tisch
└─→ Text: "Die Kräuter verbergen ein Geheimnis..."
└─→ Frage offen: "Was ist das Geheimnis?"

MINUTE 4:30 – Entscheidungspunkt
└─→ Mehrere Wege:
    ├─→ "💬 Zurück zur Händlerin (Kräuter geben)"
    ├─→ "🔍 Weitere Hinweise suchen"
    ├─→ "📔 Im Tagebuch notieren"
    └─→ "⏸️ Pause"
└─→ Kein Druck, keine Zeitvorgabe
└─→ Spieler bestimmt Tempo

MINUTE 5:00 – SESSION-ENDE
└─→ Spieler hat folgende Erfahrungen gemacht:
    ✅ Eine Figur kennengelernt
    ✅ Ein Geheimnis entdeckt
    ✅ Ein Rätsel gelöst
    ✅ Mehrere Entscheidungen getroffen
    ✅ Eine neue Frage aufgeworfen
    ❌ KEINE Kämpfe
    ❌ KEINE Zahlen/XP-Anzeigen
    ❌ KEINE Zeitvorgaben
    ❌ KEINE Bestrafung für Pausen
```

---

## 🎮 GAMEPLAY LOOP: DISCOVERY CYCLE

```
┌─────────────────────────────────────────────────────┐
│          DISCOVERY CYCLE (Wiederholt)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. NEUES TREFFEN                                   │
│     ├─ Figur/Ort/Geheimnis                         │
│     └─ Visuell + kurzer Text                       │
│          ↓                                          │
│  2. ERSTE NEUGIER                                   │
│     ├─ "Was ist los?"                              │
│     ├─ "Wer ist das?"                              │
│     └─ "Warum passiert das?"                       │
│          ↓                                          │
│  3. INTERAKTION (2-3 intuitive Optionen)           │
│     ├─ "Sprechen"                                  │
│     ├─ "Untersuchen"                               │
│     ├─ "Helfen"                                    │
│     └─ "Gehen" (immer möglich)                     │
│          ↓                                          │
│  4. NEUE INFORMATION                                │
│     ├─ Dialog offenbart Geheimnis                  │
│     ├─ Oder: Rätsel präsentiert                    │
│     └─ Oder: Neue Frage gestellt                   │
│          ↓                                          │
│  5. KLEINE ERFOLGE                                  │
│     ├─ "Du hast geholfen"                          │
│     ├─ "Du hast es verstanden"                     │
│     ├─ "Du hast einen Hinweis gefunden"            │
│     └─ Feedback: Geschichtlich, nicht mechanisch   │
│          ↓                                          │
│  6. NÄCHSTE FRAGE / NEUE CHANCE                     │
│     ├─ "Was kommt als nächstes?"                   │
│     ├─ "Wem noch helfen?"                          │
│     ├─ "Welches Geheimnis lösen?"                  │
│     └─ Zurück zu 1.                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🗺️ PHASE 7 GPS NEUREINTERPRETATION

### Statt "Encounter Spawner" → "Discovery Trigger"

```
ALT (Action-RPG):
GPS-Position → Level-Match → Enemy Spawn → Combat
❌ "Gegner sind sofort da"
❌ "Muss kämpfen"
❌ "Zeitdruck"

NEU (Discovery-First):
GPS-Position → Ort erkannt → Figure/Geheimnis offenbart
                            → Frage gestellt
                            → Spieler entscheidet
                            → Mehrere Lösungswege
✅ "Überraschung, kein Druck"
✅ "Spieler entscheidet Tempo"
✅ "Mehrere Wege zum Ziel"
```

### Quest-Generierung unter Discovery-Philosophie

**Phase 7.3 GPS Quest Generator sollte folgende Typen generieren:**

```
1. ENCOUNTER (Begegnung mit Figur/Geist)
   └─ "Wer ist das?"
   └─ Dialog, Geheimnis, Bitte um Hilfe
   └─ Lösung: Zuhören, Verstehen, Helfen

2. DISCOVERY (Neuer Ort/Artefakt)
   └─ "Was ist dieser Ort?"
   └─ Rätsel, Hinweise, Geschichte
   └─ Lösung: Erkunden, Kombinieren, Verstehen

3. DECISION (Schwere Wahl)
   └─ "Was soll ich tun?"
   └─ Keine 'richtige' Antwort
   └─ Mehrere Konsequenzen
   └─ Lösung: Nach eigenem Gewissen handeln

4. MEMORY (Erinnerung/Aufklärung)
   └─ "Was ist hier passiert?"
   └─ Hinweise sammeln, Rätsel lösen
   └─ Lösung: Zusammenhänge erkennen

5. OPTIONAL_CONFLICT (Kampf optional)
   └─ "Gegner ist verängstigt, nicht böse"
   └─ Kampf ODER Überzeugung ODER Trick
   └─ Lösung: Spieler wählt
```

---

## 🎨 UI DESIGN: DISCOVERY-FIRST

### Prinzipien

```
❌ NEIN:
- Combat-Screen mit Lebensbalken
- Zahlen und Statistiken
- "Gegner-Besiegungen" zählen
- Timer und Zeitvorgaben
- "Quests abschließen" Menü
- Achievements für Kämpfe

✅ JA:
- Kurze, atmos­phärische Texte
- Nur aktuelle Entscheidung sichtbar
- "Du hast geholfen" statt "XP+100"
- Tagebuch für Geheimnis-Verfolgung
- Sanfte Übergänge zwischen Szenen
- "Diese Person erinnert sich an dich"
```

### UI-Beispiel: Event-Screen (Discovery-fokussiert)

```
┌─────────────────────────────────────┐
│  ← Zurück (optionale Schaltfläche) │
├─────────────────────────────────────┤
│                                     │
│   [Atmosphäre-Grafik/Emoji]         │
│    👤 ← Große, lebendige Icon      │
│                                     │
│   "Eine alte Händlerin sitzt auf   │
│    einer Bank. Sie sieht traurig    │
│    auf einen leeren Korb."          │
│                                     │
│   ─────────────────────────────────│
│                                     │
│   "Ich habe alles verloren.         │
│    Die Kräuter, die ich          │
│    angebaut habe..."                │
│                                     │
│   ─────────────────────────────────│
│                                     │
│   💬 "Mit ihr sprechen"              │
│   👋 "Weitergehen"                  │
│                                     │
│   ⏸️  Pausieren                     │
│                                     │
└─────────────────────────────────────┘
```

Keine Kämpf-UI sichtbar, wenn Kampf nicht notwendig ist.

---

## 🔧 ARCHITEKTUR-ÄNDERUNGEN

### Was BLEIBT

- ✅ Episode 1, 2, 3 Kampagne
- ✅ Rätsel-System
- ✅ Hilfssystem
- ✅ Speichern/Laden
- ✅ Inventar (aber mit weniger Fokus)
- ✅ Campaign Progression

### Was ÄNDERT

- ⚠️ Kampf wird optional gemacht
- ⚠️ Combat UI wird versteckt (wenn nicht nötig)
- ⚠️ XP/Gold-Anzeigen reduziert
- ⚠️ "Gegner besiegen" nicht das Ziel
- ⚠️ Mehr Fokus auf Story/Geheimnisse

### Was NEU KOMMT (Phase 7+)

- 🆕 Discovery-basierte GPS-Quests
- 🆕 Tagebuch für Rätsel-Verfolgung
- 🆕 Figuren, die sich an Spieler erinnern
- 🆕 Verzweigte Story-Konsequenzen
- 🆕 Atmosphäre statt Statistiken

---

## ✅ GARANTIEN

✅ **Episode 1-3 bleibt spielbar**  
✅ **Kampfmechanik funktioniert noch (falls nötig)**  
✅ **Alle 265+ Tests bestehen**  
✅ **Speicherstände kompatibel**  
✅ **Keine erzwungenen Kämpfe mehr**  
✅ **Mehrere Lösungswege für Events**  
✅ **Kein Kampf für optionale Geschichten**

---

## 📋 IMPLIKATIONEN FÜR PHASE 7 GPS-RPG

### GPS wird zum DISCOVERY ENGINE

```
Statt:
"Player at [52.5, 13.3] → Enemy Level 5 appears → FIGHT!"

Lieber:
"Player at [52.5, 13.3] → Story-Trigger: 'A woman
sits on a bench, waiting. She seems lost...'
→ EXPLORE, DECIDE, HELP"
```

### Quest-Generierungs-Architektur ändert sich

```
NICHT:
function generateQuest(heroLevel) {
  enemy = pickEnemy(heroLevel);
  return { type: 'combat', enemy };
}

SONDERN:
function generateQuest(heroLevel, location) {
  storyHook = pickHook(location);  // "Wer wartet hier?"
  decision = pickDecision(storyHook); // "Hilf oder geh?"
  return {
    type: 'discovery',
    storyHook,
    decisions: ['help', 'ignore', 'investigate']
  };
}
```

---

## 🎯 NÄCHSTE SCHRITTE

### Phase A: Architektur-Klarheit
- [ ] Alle bestehenden Kampf-Komponenten analysieren
- [ ] Entscheiden: Welche können optional werden?
- [ ] Neue "Discovery Event" Komponente skizzieren
- [ ] Alte Combat UI hinter Flag verstecken (für Later)

### Phase B: Episode 3 Reimplementierung
- [ ] Event 3 (Banditen) → "Geheimnisvolle Gruppe"
- [ ] Statt nur Kampf: Verstehen, Helfen, Trick
- [ ] Mehrere Lösungswege einführen

### Phase C: Phase 7 Neuorientierung
- [ ] GPS-Quest-Generator auf Discovery ausrichten
- [ ] Statt Kämpfe: Geheimnisse, Entdeckungen, Entscheidungen
- [ ] Atmosphäre-fokussierte Story-Hooks

---

## 🎬 ZUSAMMENFASSUNG

**Das Discovery-First Modell bedeutet:**

1. **Nicht was Man tut (kämpft), sondern WAS MAN VERSTEHT** ist das Ziel
2. **Geheimnisse statt Gegner** sind die Hindernisse
3. **Neugier statt Druck** motiviert Spieler
4. **Mehrere Lösungen statt eine Richtige**
5. **Kleine, regelmäßige Erfolgsmomente** statt großer Kampf-Siege
6. **Entdeckung beim echten Spaziergang** wird die zentrale Erfahrung

Dies ist eine grundsätzlich andere Spielphilosophie als traditionelle RPGs. Sie passt besser zu einem **Outdoor-Discovery-Game** als zu Action-Combat.

---

**Fragen zur Umsetzung?** 🧭

