/**
 * Adventure Game - German Language Resource (Deutsch)
 * Complete localization strings for the game UI and content
 * 
 * Based on:
 * - GAME_DESIGN.md § 3 (Intro, Heroes)
 * - IMPLEMENTATION_ROADMAP.md § 3.2 (Structure)
 */

export const de = {
  // ============================================================================
  // 1. COMMON UI ELEMENTS
  // ============================================================================
  common: {
    continue: 'Weiter',
    pause: 'Pausieren',
    resume: 'Fortsetzen',
    back: 'Zurück',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    close: 'Schließen',
    ok: 'OK',
    error: 'Fehler',
    loading: 'Lädt...',
    yes: 'Ja',
    no: 'Nein',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
  },

  // ============================================================================
  // 2. START SCREEN
  // ============================================================================
  startScreen: {
    title: 'Adventure Game',
    subtitle: 'Deine Welt. Dein Abenteuer.',
    buttonStart: 'Neues Abenteuer',
    buttonContinue: 'Abenteuer fortsetzen',
    buttonLoadGame: 'Spielstand laden',
    welcomeMessage: 'Willkommen, Abenteurer!',
    description: 'Erkunde eine Fantasy-Welt voller Magie, Kämpfe und Geheimnisse.',
  },

  // ============================================================================
  // 3. CHARACTER SELECTION
  // ============================================================================
  // 3. CHARACTER SELECTION & STAT LABELS
  // ============================================================================
  characterSelection: {
    title: 'Wähle deinen Helden',
    subtitle: 'Wessen Geschichte wirst du erzählen?',
    selectHero: 'Helden auswählen',
    confirmSelection: 'Mit diesem Helden spielen',
    abilities: 'Fähigkeiten',
    specialAbility: 'Spezialfähigkeit',
    stats: 'Statistiken',
    description: 'Beschreibung',
    personality: 'Persönlichkeit',
  },

  statLabels: {
    health: 'Gesundheit',
    maxHealth: 'Max. Gesundheit',
    mana: 'Mana',
    maxMana: 'Max. Mana',
    attack: 'Angriff',
    defense: 'Verteidigung',
    magic: 'Magie',
    magicDefense: 'Magieverteidigung',
    speed: 'Geschwindigkeit',
  },

  // ============================================================================
  // 4. HEROES - Descriptions, Abilities, Stats
  // ============================================================================
  heroes: {
    aeran: {
      name: 'Aeran',
      title: 'Der Harmonist',
      class: 'Barde',
      description: 'Muskulöser, blonder Krieger mit magischer Holzflöte. Aeran wandert durch die Reiche und heilt durch Musik.',
      personality: 'Charmant, mutig, humorvoll',
      abilities: {
        healingMelody: {
          name: 'Heilende Melodie',
          description: 'Spiele eine sanfte Melodie, um Verbündete zu heilen',
        },
        animalWhisper: {
          name: 'Tierflüstern',
          description: 'Kommuniziere mit Tieren und erhalte Informationen',
        },
        soundShield: {
          name: 'Schallschild',
          description: 'Erschaffe eine schützende Schallbarriere',
        },
      },
      specialAbility: {
        name: 'Magisches Lied',
        description: 'Führe ein mächtiges magisches Lied auf, das Verbündete heilt und Gegner schwächt',
      },
    },

    velar: {
      name: 'Velar',
      title: 'Der Volkhv',
      class: 'Magier',
      description: 'Muskulöser rothaariger junger Magier mit Runenstab. Velar beherrscht Elementarmagie und alte Runen.',
      personality: 'Intelligent, entschlossen, geheimnisvoll',
      abilities: {
        fireMagic: {
          name: 'Feuermagie',
          description: 'Beschwöre Flammen, um Gegner zu treffen',
        },
        protectiveShield: {
          name: 'Schutzschild',
          description: 'Erschaffe ein magisches Schutzschild',
        },
        ancientRunes: {
          name: 'Alte Runen',
          description: 'Entziffere uralte Runen und offenbare ihre Kraft',
        },
      },
      specialAbility: {
        name: 'Elementarsturm',
        description: 'Beschwöre einen gewaltigen Elementarsturm mit vereinter Kraft aller Elemente',
      },
    },

    varg: {
      name: 'Varg',
      title: 'Der Wolfswandler',
      class: 'Krieger',
      description: 'Muskulöser dunkelhaariger Krieger, der sich in einen großen Wolf verwandeln kann. Varg ist wild, loyal und schützend.',
      personality: 'Wild, loyal, beschützend',
      abilities: {
        enhancedSenses: {
          name: 'Erweiterte Sinne',
          description: 'Nutze deine Wolfsinne, um verborgene Dinge zu entdecken',
        },
        wolfForm: {
          name: 'Wolfsgestalt',
          description: 'Verwandle dich in einen mächtigen Wolf',
        },
        powerfulAttack: {
          name: 'Kraftvoller Angriff',
          description: 'Starte einen verheerenden Angriff',
        },
      },
      specialAbility: {
        name: 'Wolfsverwandlung',
        description: 'Verwandle dich in einen riesigen Wolf mit erhöhtem Angriff und Geschwindigkeit',
      },
    },

    ravena: {
      name: 'Ravena',
      title: 'Die Himmelsjägerin',
      class: 'Kriegerin',
      description: 'Kräftige rothaarige Kriegerin, die sich in einen großen Greifvogel verwandeln kann. Ravena ist unabhängig, mutig und aufmerksam.',
      personality: 'Unabhängig, mutig, aufmerksam',
      abilities: {
        windMagic: {
          name: 'Windmagie',
          description: 'Beschwöre Windkräfte, um Gegner zu treffen',
        },
        aerialVision: {
          name: 'Luftaufklärung',
          description: 'Erhalte Überblick über das Schlachtfeld',
        },
        hiddenObjectDetection: {
          name: 'Geheime Objekterkennung',
          description: 'Erkenne verborgene Gegenstände und Hinweise',
        },
      },
      specialAbility: {
        name: 'Greifvogelverwandlung',
        description: 'Verwandle dich in einen mächtigen Greifvogel und überblicke alles',
      },
    },

    saira: {
      name: 'Saira',
      title: 'Die Schattenkriegerin',
      class: 'Schattenschalter',
      description: 'Athletische Heldin mit zwei kurzen Klingen. Saira beherrscht Schattendoppelgänger und Fallenwahrnehmung.',
      personality: 'Raffiniert, schnell, geheimnisvoll',
      abilities: {
        shadowClone: {
          name: 'Schattendoppelgänger',
          description: 'Erschaffe einen Schattenklon, um Gegner zu verwirren',
        },
        trapDetection: {
          name: 'Fallenwahrnehmung',
          description: 'Erkenne versteckte Fallen und Gefahren',
        },
        dualStrike: {
          name: 'Doppelschlag',
          description: 'Führe präzise Doppelschläge mit beiden Klingen aus',
        },
      },
      specialAbility: {
        name: 'Schattenbeherrschung',
        description: 'Nutze die Schatten, um blitzschnelle Angriffe auszuführen',
      },
    },
  },

  // ============================================================================
  // 5. INTRO SCENE - Tower and Dialogue
  // ============================================================================
  intro: {
    tower: {
      title: 'Der Turm des letzten Magiers',
      narration: 'Wo einst sieben Flüsse rauschten, flüstert heute nur der Sand. Doch im Turm des letzten Magiers brennt noch ein Licht.',
      magician: {
        line1: 'Aeran. Velar. Varg. Ravena. Saira. Ihr seid meinem Ruf gefolgt.',
        line2: 'Hinter den Dünen erwacht eine Dunkelheit, die selbst die Sterne verschlingt.',
      },
      aeran: {
        line: 'Dann geben wir der Welt ihre Stimme zurück.',
      },
      ravena: {
        line: 'Sag uns, wo wir anfangen sollen.',
      },
      magician2: {
        line1: 'Sucht das Schwert des Ersten Lichts.',
        line2: 'Nur seine Kraft kann die dunklen Kreaturen aufhalten.',
        line3: 'Findet es und bringt es zu mir zurück.',
      },
      velar: {
        line: 'Und wenn der Weg verborgen ist?',
      },
      magician3: {
        line1: 'Folgt den zerbrochenen Zeichen.',
        line2: 'Was getrennt wurde, wird euch gemeinsam den Weg weisen.',
      },
      varg: {
        line: 'Wir werden die Spur finden.',
      },
      saira: {
        line: 'Und auf das achten, was im Schatten bleibt.',
      },
      closing: 'Fünf Helden. Ein Versprechen. Wessen Geschichte wirst du erzählen?',
    },
  },

  // ============================================================================
  // 6. CAMPAIGNS - First Light (Desert Story)
  // ============================================================================
  campaigns: {
    firstLight: {
      title: 'Das Schwert des Ersten Lichts',
      description: 'Eine fünfteilige Kampagne in einer verzauberten Wüste',
      chapters: {
        chapter1: {
          title: 'Kapitel 1: Die verfluchten Lande',
          description: 'Der Anfang einer großen Abenteuerreise in verfluchten Landen',
        },
        chapter2: {
          title: 'Kapitel 2: Die Tiefenwelt',
          description: 'Hinab in die Mysterien der Erde',
        },
        chapter3: {
          title: 'Kapitel 3: Das Aschegebirge',
          description: 'Ein Berg voller Feuer und alter Magie',
        },
        chapter4: {
          title: 'Kapitel 4: Die Schattenfestung',
          description: 'Das Herz der Dunkelheit erwartet',
        },
        chapter5: {
          title: 'Kapitel 5: Das letzte Licht',
          description: 'Die finale Schlacht um die Welt',
        },
      },
    },
  },

  // ============================================================================
  // 7. QUEST & STORY
  // ============================================================================
  quests: {
    title: 'Questbuch',
    active: 'Aktive Quest',
    completed: 'Abgeschlossene Quests',
    rewards: 'Belohnung',
    progress: 'Fortschritt',
  },

  // ============================================================================
  // 8. COMBAT
  // ============================================================================
  combat: {
    title: 'Kampf',
    actions: {
      attack: 'Angriff',
      defend: 'Verteidigung',
      ability: 'Fähigkeit',
      item: 'Gegenstand',
      pause: 'Pausieren',
    },
    feedback: {
      hit: '{attacker} trifft {target}!',
      miss: '{attacker} verfehlt {target}!',
      criticalHit: 'Kritischer Treffer!',
      damaged: 'Du hast {amount} Schaden erlitten!',
      healed: 'Du wurdest um {amount} HP geheilt!',
      defeated: 'Du wurdest besiegt!',
      victory: 'Du hast gewonnen!',
    },
  },

  // ============================================================================
  // 9. INVENTORY & ITEMS
  // ============================================================================
  inventory: {
    title: 'Inventar',
    items: 'Gegenstände',
    equipment: 'Ausrüstung',
    artifacts: 'Artefakte',
    empty: 'Leer',
    quantity: '{amount}x {item}',
  },

  items: {
    goldCoin: 'Goldmünze',
    goldCoins: 'Goldmünzen',
    healthPotion: 'Heiltrank',
    manaPotion: 'Manatrank',
  },

  // ============================================================================
  // 10. ABILITIES
  // ============================================================================
  abilities: {
    cooldown: 'Abklingzeit: {seconds}s',
    manaCost: 'Manakosten: {amount}',
    notAvailable: 'Nicht verfügbar',
  },

  // ============================================================================
  // 11. TRANSFORMATIONS
  // ============================================================================
  transformations: {
    vargWolf: {
      name: 'Wolfsgestalt',
      description: 'Verwandle dich in einen mächtigen Wolf',
      active: 'Du hast dich in einen Wolf verwandelt!',
      inactive: 'Du hast deine menschliche Form zurückgewonnen',
    },
    ravenaEagle: {
      name: 'Greifvogelgestalt',
      description: 'Verwandle dich in einen großen Greifvogel',
      active: 'Du hast dich in einen Greifvogel verwandelt!',
      inactive: 'Du hast deine menschliche Form zurückgewonnen',
    },
  },

  // ============================================================================
  // 12. REWARDS
  // ============================================================================
  rewards: {
    gold: 'Goldmünzen: {amount}',
    xp: 'Erfahrung: {amount}',
    achievement: 'Erfolg: {achievement}',
    levelUp: 'Du bist Level {level}!',
    newAbility: 'Neue Fähigkeit freigeschaltet: {ability}',
  },

  // ============================================================================
  // 13. NOTIFICATIONS
  // ============================================================================
  notifications: {
    episodeCompleted: 'Episode abgeschlossen!',
    chapterCompleted: 'Kapitel abgeschlossen!',
    questCompleted: 'Quest abgeschlossen!',
    itemObtained: 'Erhalten: {item}',
    itemLost: 'Verloren: {item}',
  },

  // ============================================================================
  // 14. ERRORS
  // ============================================================================
  errors: {
    saveError: 'Spielstand konnte nicht gespeichert werden',
    loadError: 'Spielstand konnte nicht geladen werden',
    gpsError: 'GPS ist nicht verfügbar. Demo-Modus wird verwendet.',
    networkError: 'Verbindungsfehler',
    dataError: 'Fehler beim Laden der Daten',
    unknownError: 'Ein Fehler ist aufgetreten',
  },

  // ============================================================================
  // 15. SETTINGS
  // ============================================================================
  settings: {
    title: 'Einstellungen',
    sound: 'Sound',
    music: 'Musik',
    graphics: 'Grafik',
    language: 'Sprache',
    brightness: 'Helligkeit',
  },

  // ============================================================================
  // 16. SAFETY & ACCESSIBILITY
  // ============================================================================
  safety: {
    title: 'Sicherheit',
    warning: 'Bleib an einem sicheren Ort stehen. Achte auf Wege und Verkehr. Spiele mit einer erwachsenen Begleitperson.',
    gpsWarning: 'GPS wird benötigt, um das Abenteuer zu starten.',
    routeApproval: 'Bitte bestätige die Route, bevor du startest.',
  },

  accessibility: {
    title: 'Barrierefreiheit',
    contrast: 'Hoher Kontrast',
    textSize: 'Textgröße',
    reduceMotion: 'Bewegungen reduzieren',
  },
};
