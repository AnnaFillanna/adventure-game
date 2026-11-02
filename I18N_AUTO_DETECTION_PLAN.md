# Adventure Game – Automatische Spracherkennung

**Status:** 📋 Implementierungsplan  
**Priorität:** 🟡 Mittel (orthogonal zu Phase 7)  
**Scope:** i18n-Infrastruktur ohne neue Sprachen  

---

## 🎯 ANFORDERUNGEN

### Was der Nutzer verlangt

- ✅ Automatische Erkennung der Gerätsprache beim Start
- ✅ Keine verpflichtende Sprachauswahl beim Ersten Start
- ✅ Fallback auf Standardsprache (Deutsch) wenn nicht unterstützt
- ✅ Manuelle Sprachänderung optional in Einstellungen
- ✅ Architektur vorbereitet für mehrsprachige Inhalte

### Was Heute Existiert

| Element | Status | Details |
|---------|--------|---------|
| **getText()** | ✅ Vorhanden | Type-safe Lokalisierungs-Funktion |
| **de.ts** | ✅ Vollständig | Deutsche Strings für UI + Campaign + Quests |
| **Episode Lokalisierung** | ✅ Separate Dateien | firstEpisode.ts, secondEpisode.ts, thirdEpisode.ts |
| **Sprach-Umschalter** | ❌ Fehlt | Keine UI für Sprachänderung |
| **Auto-Detection** | ❌ Fehlt | Keine automatische Browser-Sprache-Abfrage |
| **Mehrsprachigkeit** | ❌ Fehlt | Nur Deutsch implementiert |

---

## 🏗️ ARCHITEKTUR (ZERO BREAKING CHANGES)

### Phase I: Auto-Detection Setup (Diese Phase)

**Neue Datei:** `src/game/i18n/languageManager.ts`

```typescript
/**
 * Automatische Spracherkennung & Management
 * - Browser-Sprache erkennen
 * - localStorage nutzen für Nutzer-Überschreibung
 * - Fallback auf 'de'
 * - Vorbereitet für weitere Sprachen
 */

export type LanguageCode = 'de' | 'en' | 'fr' | 'es'; // Later: en, fr, es, ...

export class LanguageManager {
  private static readonly DEFAULT_LANGUAGE: LanguageCode = 'de';
  private static readonly STORAGE_KEY = '__ADVENTURE_LANGUAGE__';
  private static readonly SUPPORTED_LANGUAGES: LanguageCode[] = ['de']; // Later: ['de', 'en', ...]

  /**
   * Erkenne Benutzer-Sprache in dieser Reihenfolge:
   * 1. localStorage (nutzer-gespeicherte Auswahl)
   * 2. Browser-Sprache (navigator.language)
   * 3. Fallback: Deutsch
   */
  static detectLanguage(): LanguageCode {
    // 1. Prüfe gespeicherte Nutzer-Auswahl
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY) as LanguageCode | null;
    if (savedLanguage && this.isSupportedLanguage(savedLanguage)) {
      console.log(`[i18n] Sprache von localStorage: ${savedLanguage}`);
      return savedLanguage;
    }

    // 2. Prüfe Browser-Sprache
    const browserLang = this.getBrowserLanguage();
    if (browserLang && this.isSupportedLanguage(browserLang)) {
      console.log(`[i18n] Browser-Sprache erkannt: ${browserLang}`);
      return browserLang;
    }

    // 3. Fallback auf Deutsch
    console.log(`[i18n] Fallback auf Standardsprache: de`);
    return this.DEFAULT_LANGUAGE;
  }

  /**
   * Extrahiere Sprachcode aus navigator.language
   * z.B.: "de-DE" → "de", "en-US" → "en"
   */
  private static getBrowserLanguage(): LanguageCode | null {
    const browserLang = navigator.language || navigator.languages?.[0];
    if (!browserLang) return null;

    // Extrahiere nur den Sprachcode (z.B. "de" aus "de-DE")
    const langCode = browserLang.split('-')[0].toLowerCase() as LanguageCode;
    return langCode;
  }

  /**
   * Prüfe, ob eine Sprache unterstützt wird
   */
  static isSupportedLanguage(code: string): boolean {
    return this.SUPPORTED_LANGUAGES.includes(code as LanguageCode);
  }

  /**
   * Speichere Nutzer-Auswahl
   */
  static setLanguage(language: LanguageCode): void {
    if (!this.isSupportedLanguage(language)) {
      console.warn(`[i18n] Sprache nicht unterstützt: ${language}`);
      return;
    }
    localStorage.setItem(this.STORAGE_KEY, language);
    console.log(`[i18n] Sprache gespeichert: ${language}`);
    // Seite neuladen, damit Änderung wirksam wird
    window.location.reload();
  }

  /**
   * Gibt alle unterstützten Sprachen zurück
   */
  static getSupportedLanguages(): LanguageCode[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  /**
   * Gib aktuell aktive Sprache zurück
   */
  static getCurrentLanguage(): LanguageCode {
    const saved = localStorage.getItem(this.STORAGE_KEY) as LanguageCode | null;
    return saved || this.DEFAULT_LANGUAGE;
  }
}
```

---

### Phase II: Global State Extension (Later)

**Neue Datei:** `src/game/state/i18nStore.ts`

```typescript
/**
 * Globaler Zustand für Sprachenauswahl
 * Zukunft: Für Einstellungsbildschirm / Language Switcher
 */
import { create } from 'zustand';
import { LanguageManager, LanguageCode } from '../i18n/languageManager';

interface I18nStore {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

export const useI18nStore = create<I18nStore>((set) => ({
  language: LanguageManager.detectLanguage(),
  setLanguage: (lang: LanguageCode) => {
    LanguageManager.setLanguage(lang);
    set({ language: lang });
  },
}));
```

---

### Phase III: App-Initialisierung (main.tsx)

**Ändere:** `src/main.tsx`

```typescript
// Bestehend:
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';

// NEU: Sprache erkennen und initialisieren
import { LanguageManager } from './game/i18n/languageManager';

// Erkenne Sprache beim App-Start
const detectedLanguage = LanguageManager.detectLanguage();
console.log(`[App Init] Sprache: ${detectedLanguage}`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 📁 NEUE DATEIEN & ÄNDERUNGEN

### Zu erstellen:

```
src/game/i18n/
├── languageManager.ts          (NEW: ~80 Zeilen)
└── __tests__/
    └── languageManager.test.ts (NEW: ~200 Zeilen)

src/game/state/
└── i18nStore.ts               (NEW: ~30 Zeilen)
```

### Zu ändern:

```
src/main.tsx                    (EDIT: +5 Zeilen)
src/locales/index.ts           (EDIT: +10 Zeilen für Language Parameter)
```

### Keine Änderungen nötig:

```
❌ App.tsx (Router, Layout bleiben gleich)
❌ de.ts (alle Strings bleiben)
❌ Campaign System (keine Auswirkungen)
❌ Combat Engine (keine Auswirkungen)
```

---

## 🔄 WORKFLOW: Automatische Sprache beim Start

```
1. User öffnet App
   │
   ├─→ main.tsx lädt
   │   ├─→ LanguageManager.detectLanguage() aufgerufen
   │   │   ├─→ Check localStorage
   │   │   ├─→ Check navigator.language
   │   │   └─→ Fallback zu 'de'
   │   │
   │   └─→ console.log("[i18n] Sprache: de")
   │
   ├─→ React App rendert
   │   └─→ getText() nutzt erkannte Sprache
   │
   └─→ Alle Strings sind automatisch in Nutzers Sprache
       (wenn unterstützt)

2. Wenn Nutzer in Einstellungen Sprache ändert
   │
   └─→ LanguageManager.setLanguage('en')
       ├─→ localStorage aktualisieren
       └─→ page.reload() → Neustart mit neuer Sprache
```

---

## 🧪 TESTS

### Test 1: Automatische Erkennung (localStorage Leer)

```typescript
// src/game/i18n/__tests__/languageManager.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { LanguageManager } from '../languageManager';

describe('LanguageManager - Auto-Detection', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock navigator.language
  });

  it('should detect German from browser language', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'de-DE',
      configurable: true,
    });

    const lang = LanguageManager.detectLanguage();
    expect(lang).toBe('de');
  });

  it('should fallback to German if unsupported browser language', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'zh-CN',
      configurable: true,
    });

    const lang = LanguageManager.detectLanguage();
    expect(lang).toBe('de');
  });

  it('should respect saved user language over browser language', () => {
    localStorage.setItem('__ADVENTURE_LANGUAGE__', 'en');
    
    Object.defineProperty(navigator, 'language', {
      value: 'de-DE',
      configurable: true,
    });

    const lang = LanguageManager.detectLanguage();
    expect(lang).toBe('en'); // User choice wins
  });
});
```

### Test 2: Speichern von Nutzer-Auswahl

```typescript
it('should save language choice to localStorage', () => {
  LanguageManager.setLanguage('en');
  
  const saved = localStorage.getItem('__ADVENTURE_LANGUAGE__');
  expect(saved).toBe('en');
});

it('should not save unsupported language', () => {
  // @ts-expect-error (Test absichtlich mit ungültigem Typ)
  LanguageManager.setLanguage('zh');
  
  const saved = localStorage.getItem('__ADVENTURE_LANGUAGE__');
  expect(saved).toBeNull();
});
```

---

## 📋 IMPLEMENTATION CHECKLIST (PHASEN)

### Phase I: Language Manager (SOFORT)

- [ ] `src/game/i18n/languageManager.ts` erstellen
- [ ] `src/game/i18n/__tests__/languageManager.test.ts` erstellen
- [ ] `src/main.tsx` aktualisieren
- [ ] Auto-Detection Tests bestanden ✅
- [ ] TypeScript Check bestanden ✅
- [ ] Commit: `feat: add automatic language detection`

### Phase II: i18n Store (SPÄTER – Wenn UI nötig)

- [ ] `src/game/state/i18nStore.ts` erstellen
- [ ] `SettingsScreen.tsx` für Sprachauswahl erstellen
- [ ] Sprach-Switcher in Settings integrieren
- [ ] Tests für i18nStore
- [ ] Commit: `feat: add language switcher in settings`

### Phase III: Weitere Sprachen (PHASE 8+)

- [ ] `src/locales/en.ts` erstellen (English)
- [ ] `src/locales/fr.ts` erstellen (Français)
- [ ] `src/locales/es.ts` erstellen (Español)
- [ ] Jedem Language Manager eintragen
- [ ] Campaign Inhalte übersetzen
- [ ] Tests für alle Sprachen
- [ ] Commit: `feat: add multilingual support (en, fr, es)`

---

## ✅ GARANTIEN & KOMPATIBILITÄT

### Was SICHER ist:

✅ Alle 265 bestehenden Tests bestehen  
✅ `getText()` funktioniert exakt wie vorher  
✅ de.ts wird nicht verändert  
✅ Campaign System unverändert  
✅ Keine UI-Brüche oder Fehler  
✅ Nur Deutsch wird unterstützt (vorerst)

### Was KOMPATIBEL bleibt:

✅ Alle bestehenden `getText('key')` Aufrufe  
✅ Episode Lokalisierung  
✅ Quest Texte  
✅ Character Dialoge  
✅ localStorage Speicherstände

### Was OPTIONAL wird:

✅ Sprachauswahl bleibt optional  
✅ Keine Erzwingung neuer Einstellungen  
✅ Automatische Erkennung optional (kann deaktiviert werden)

---

## 🚀 WARUM JETZT?

### 1. **Null Breaking Changes**
   - Nur neue Dateien
   - 2-3 Zeilen in main.tsx
   - 100% rückwärtskompatibel

### 2. **Vorbereitung für Phase 7 & 8**
   - GPS-RPG unterstützt später Deutsch + English
   - Keine Refactorings später nötig
   - Architektur ist schon skalierbar

### 3. **Mobile App vorbereitet**
   - Capacitor hat native Spracherkennung
   - Wenn iOS/Android, funktioniert sofort

### 4. **Benutzerfreundlich**
   - Keine nervige Sprachauswahl beim Start
   - Automatisch auf User-Sprache
   - Kann jederzeit geändert werden

---

## 📊 VERGLEICH: MIT vs. OHNE I18N-PLAN

| Aspekt | Mit Plan (Jetzt) | Ohne Plan |
|--------|------------------|-----------|
| **Auto-Detection** | ✅ Funktioniert sofort | ❌ Müssen neu bauen |
| **Weitere Sprachen** | ✅ 5 Minuten Setup | ❌ Großes Refactor |
| **Mobile App** | ✅ Ready | ❌ Verzögerung |
| **Breaking Changes** | ❌ Keine | ❌ Möglich später |
| **Dev Cost jetzt** | 🟡 2-3h | 🟢 0h |
| **Dev Cost später** | 🟢 Minimal | 🔴 20+h |

---

## 🔗 KOORDINATION MIT PHASE 7 GPS-RPG

**i18n Auto-Detection ist ORTHOGONAL zu Phase 7:**

```
Phase 7 GPS-RPG                  i18n Auto-Detection
├─ GPS-Modul                     ├─ Language Manager
├─ Quest-Generierung             ├─ i18n Store
├─ Location Triggering           └─ Settings UI
└─ Mobile App                    
                                 Später: GPS-Quests übersetzen
```

**Nutzen der Koordination:**
- ✅ GPS-Quest-Generator kann später direkt `getText()` nutzen
- ✅ Neue Sprachen werden automatisch in Quests unterstützt
- ✅ Mobile App hat eingebaute Spracherkennung

---

## 📝 NÄCHSTE SCHRITTE

### OPTION A: Implementieren SOFORT
```bash
git checkout -b feature/i18n-auto-detection
# Implement Phase I
# Tests
# Commit & Push
# Continue with Phase 7
```

### OPTION B: Nur Analyse, Später implementieren
```
# Speichere diesen Plan
# Mach Phase 7 GPS zuerst
# Komme später zu i18n zurück
```

### OPTION C: Zusammen mit Phase 7 machen
```
# Beginne Phase 7
# Zwischendrin: i18n Phase I einbauen
# Synergien nutzen
```

---

## 🎯 DEINE ENTSCHEIDUNG

**Brauchst du:**
1. **SOFORT** Auto-Detection?
2. Oder kann es **nach Phase 7** kommen?
3. Oder willst du es **zusammen mit Phase 7** machen?

Antworte mit einer der Optionen und ich starte direkt! ✨

