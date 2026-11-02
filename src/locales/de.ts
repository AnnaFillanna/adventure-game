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
    buttonStart: 'Held wählen & Abenteuer öffnen',
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
    moreAbilities: '+{count} weitere',
    startAdventure: 'Kampagne öffnen',
    startingAdventure: 'Starte Abenteuer...',
    background: 'Hintergrund',
  },

  statLabels: {
    health: 'Gesundheit',
    maxHealth: 'Max. Gesundheit',
    hp: 'HP',
    mana: 'Mana',
    maxMana: 'Max. Mana',
    attack: 'Angriff',
    defense: 'Verteidigung',
    magic: 'Magie',
    magicDefense: 'Magieverteidigung',
    speed: 'Geschwindigkeit',
    level: 'Level',
    xp: 'XP',
    experience: 'Erfahrung',
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
  // 7. QUEST & STORY
  // ============================================================================
  quests: {
    title: 'Questbuch',
    log: 'Quest-Übersicht',
    active: 'Aktive Quests',
    activeCount: 'Aktive Quests ({count})',
    completed: 'Abgeschlossene Quests',
    completedCount: 'Abgeschlossen ({count})',
    rewards: 'Belohnung',
    progress: 'Fortschritt',
    empty: 'Keine aktiven Quests',
    noCompleted: 'Noch keine Quests abgeschlossen',
    close: 'Schließen',
  },

  // ============================================================================
  // 8. COMBAT
  // ============================================================================
  combat: {
    title: 'Kampf',
    vs: 'GEGEN',
    log: 'Kampfprotokoll',
    actions: {
      attack: 'Angriff',
      defend: 'Verteidigung',
      magic: 'Magie',
      ability: 'Fähigkeit',
      item: 'Gegenstand',
      pause: 'Pausieren',
      potion: 'Trank',
    },
    feedback: {
      hit: '{attacker} trifft {target}!',
      miss: '{attacker} verfehlt {target}!',
      criticalHit: 'Kritischer Treffer!',
      damaged: 'Du hast {amount} Schaden erlitten!',
      healed: 'Du wurdest um {amount} HP geheilt!',
      defeated: 'Du wurdest besiegt!',
      defeatMessage: 'Du wurdest im Kampf besiegt.',
      victory: 'Du hast gewonnen!',
      victoryMessage: '🎉 Sieg! 🎉',
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
    empty: 'Inventar ist leer',
    quantity: '{amount}x {item}',
    slots: 'Plätze: {used} / {max}',
    close: 'Schließen',
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

  // ============================================================================
  // 17. GPS SAFETY NOTICE
  // ============================================================================
  safetyNotice: {
    title: 'GPS-Abenteuer-Sicherheit',
    dismiss: 'Schließen',
    dismissAriaLabel: 'Sicherheitsmitteilung schließen',
    awareness: {
      title: 'Aufmerksamkeit:',
      text: 'Achte immer auf deine Umgebung, während du spielst',
    },
    supervision: {
      title: 'Elternaufsicht:',
      text: 'Kinder sollten nur unter angemessener Beaufsichtigung durch Erwachsene spielen',
    },
    avoidDangers: {
      title: 'Gefahren vermeiden:',
      text: 'Betritt nicht die Straße, Privatgrundstücke oder gefährliche Bereiche',
    },
    trespassing: {
      title: 'Gesetze beachten:',
      text: 'Beachte lokale Gesetze und die Eigentumsrechte anderer',
    },
    gpsAccuracy: {
      title: 'GPS-Genauigkeit:',
      text: 'Dein Standort ist möglicherweise nicht 100 % genau. Verlasse dich nicht darauf zur Navigation',
    },
    batteryData: {
      title: 'Akku und Daten:',
      text: 'GPS verbraucht erheblich Akku und Daten. Überwache dein Gerät',
    },
    emphasis: 'Durch das Spielen bestätigst du diese Sicherheitsrichtlinien.',
  },

  // ============================================================================
  // 18. CAMPAIGNS & CHAPTERS
  // ============================================================================
  campaigns: {
    firstLight: {
      title: 'Das Schwert des Ersten Lichts',
      description: 'Fünf Helden. Ein Schwert. Eine Chance, die Dunkelheit zu besiegen.',
    },
  },

  chapters: {
    '01': {
      title: 'Die verfluchten Lande',
      description: 'Der Anfang der Reise. Ein Ort der Echos und verlorenen Erinnerungen.',
      intro: 'Im Herzen der Wüste erwachen alte Flüche. Die Helden müssen den Weg durch die verfluchten Lande finden.',
      outro: 'Mit dem Krone des Moorhüters in der Hand erkennen die Helden das erste Kartenfragment.',
    },
    '02': {
      title: 'Die versunkenen Pfade',
      description: 'Ein Reich unter Wasser. Verlorene Städte und alte Geheimnisse.',
      intro: 'Ein Spiegel öffnet sich zu einer versunkenen Welt. Die Helden folgen den Spuren einer Zivilisation.',
      outro: 'Das zweite Kartenfragment zeigt den Weg zu einem Berg, der in Asche gehüllt ist.',
    },
    '03': {
      title: 'Das Aschegebirge',
      description: 'Ein Berg voller Kraft und Feuer. Drachen bewachen alte Schmieden.',
      intro: 'Der Wind trägt den Geruch von Feuer und Stein. Die Helden nähern sich dem dritten Kartenfragment.',
      outro: 'Mit dem Sonnenschlüssel bewaffnet, erkennen die Helden das Tor zur Schattenfestung.',
    },
    '04': {
      title: 'Die Schattenfestung',
      description: 'Ein Ort der Dunkelheit. Die letzte Bastion, bevor das Schwert offenbart wird.',
      intro: 'Die Festung erhebt sich am Horizont. Innen verbergen sich Prüfungen und Geheimnisse.',
      outro: 'Das vierte Kartenfragment offenbart den Weg zum Schwert des Ersten Lichts.',
    },
    '05': {
      title: 'Das Schwert des Ersten Lichts',
      description: 'Der Höhepunkt der Reise. Das Licht kehrt zurück in die Welt.',
      intro: 'Alle Zeichen führen hierher. Das Schwert wartet am Ort der Vereinigung.',
      outro: 'Das Schwert des Ersten Lichts wurde erhoben. Die Nacht bricht an.',
    },
  },

  // ============================================================================
  // 19. EPISODES
  // ============================================================================
  episodes: {
    '01': {
      title: "Das Flüstern im Sand",
      description: "Nach dem Auftrag weist ein verwehter Botenstein den Weg in die verfluchten Lande.",
      event_1: { title: "Botschaft des Magiers lesen", description: "Botschaft des Magiers lesen" },
      event_2: { title: "Fußspuren virtuell untersuchen", description: "Fußspuren virtuell untersuchen" },
      event_3: { title: "Einen Nebelschatten im Lernkampf bannen", description: "Einen Nebelschatten im Lernkampf bannen" },
      event_4: { title: "Den Botenstein zusammensetzen", description: "Den Botenstein zusammensetzen." },
      storyProgress: "Das erste Kartenfragment markiert das Dorf Dämmerhain.",
    },
    '02': {
      title: "Die stumme Glocke",
      description: "Dämmerhain wird von einem Fluch zum Schweigen gebracht.",
      event_1: { title: "Hüterin treffen", description: "Hüterin treffen" },
      event_2: { title: "Glockenzeichen ordnen", description: "Glockenzeichen ordnen" },
      event_3: { title: "Sumpfuntoten beruhigen oder bannen", description: "Sumpfuntoten beruhigen oder bannen" },
      event_4: { title: "Glockenerinnerung abspielen", description: "Glockenerinnerung abspielen." },
      storyProgress: "Das Glockensiegel bewahrt die Worte über den Moorpfad.",
    },
    '03': {
      title: "Die gestohlene Laterne",
      description: "Banditen haben eine Laterne entwendet, die verfluchten Nebel sichtbar macht.",
      event_1: { title: "Händler befragen", description: "Händler befragen" },
      event_2: { title: "Vorratsspuren vergleichen", description: "Vorratsspuren vergleichen" },
      event_3: { title: "Das Geheimnis der Banditen", description: "Das Geheimnis der Banditen" },
      event_4: { title: "Laterne entzünden", description: "Laterne entzünden." },
      storyProgress: "Die Nebellaterne enthüllt verborgene Kartenlinien.",
    },
    '04': {
      title: "Zeichen unter dem Nebel",
      description: "Alte Wegzeichen erzählen von einem Lichtorden und seinem verlorenen Übergang.",
      event_1: { title: "Kartenvision öffnen", description: "Kartenvision öffnen" },
      event_2: { title: "Drei Wegzeichen finden", description: "Drei Wegzeichen finden" },
      event_3: { title: "Nebelschleier bannen", description: "Nebelschleier bannen" },
      event_4: { title: "Brückenmuster lösen", description: "Brückenmuster lösen." },
      storyProgress: "Die Rune aktiviert den virtuellen Zugang zum Moorheiligtum.",
    },
    '05': {
      title: "Das Gedächtnis der Weiden",
      description: "Der Geist einer Hüterin erinnert sich nur bruchstückhaft an den Ursprung des Fluchs.",
      event_1: { title: "Geist anhören", description: "Geist anhören" },
      event_2: { title: "Erinnerungsbilder ordnen", description: "Erinnerungsbilder ordnen" },
      event_3: { title: "Eingeschüchtertes Fantasietier beruhigen", description: "Eingeschüchtertes Fantasietier beruhigen" },
      event_4: { title: "Schutzzeichen erhalten", description: "Schutzzeichen erhalten." },
      storyProgress: "Das Weidensiegel schützt erzählerisch vor dem Fluch des Moorhüters.",
    },
    '06': {
      title: "Die Krone des Moorhüters",
      description: "Der Hüter ist selbst Gefangener des Fluchs.",
      event_1: { title: "Schutzzeichen einsetzen", description: "Schutzzeichen einsetzen" },
      event_2: { title: "Angekündigte Nebelphase abwehren", description: "Angekündigte Nebelphase abwehren" },
      event_3: { title: "Kronensiegel im Bosskampf brechen", description: "Kronensiegel im Bosskampf brechen" },
      event_4: { title: "Den befreiten Hüter befragen", description: "Den befreiten Hüter befragen." },
      storyProgress: "Das zweite Kartenfragment zeigt den Weg zu den versunkenen Pfaden.",
    },
    '07': {
      title: "Die Stadt im Spiegel",
      description: "Eine Kartenvision zeigt eine versunkene Stadt, deren Stimmen noch zu hören sind.",
      event_1: { title: "Flusskarte entfalten", description: "Flusskarte entfalten" },
      event_2: { title: "Spiegelbilder vergleichen", description: "Spiegelbilder vergleichen" },
      event_3: { title: "Schattenfisch als virtuelle Wächtererscheinung bannen", description: "Schattenfisch als virtuelle Wächtererscheinung bannen" },
      event_4: { title: "Eingangsnamen zusammensetzen", description: "Eingangsnamen zusammensetzen." },
      storyProgress: "Die Namensplakette öffnet das erste Stadtsiegel.",
    },
    '08': {
      title: "Der Fährmann der Erinnerungen",
      description: "Der Fährmann kann verlorene Erinnerungen über einen imaginären Fluss tragen.",
      event_1: { title: "Fährmann anhören", description: "Fährmann anhören" },
      event_2: { title: "Erinnerungsstücke zuordnen", description: "Erinnerungsstücke zuordnen" },
      event_3: { title: "Nebelwächter überwinden", description: "Nebelwächter überwinden" },
      event_4: { title: "Marke zusammenfügen", description: "Marke zusammenfügen." },
      storyProgress: "Die Fährmarke ermöglicht die virtuelle Überfahrt zur Bibliothek.",
    },
    '09': {
      title: "Die leeren Seiten",
      description: "Ein Schatten hat das Wissen der Stadt aus ihren Büchern gelöst.",
      event_1: { title: "Archivarin treffen", description: "Archivarin treffen" },
      event_2: { title: "Schwebende Schriftzeichen sortieren", description: "Schwebende Schriftzeichen sortieren" },
      event_3: { title: "Kleinen Schattenwächter bannen", description: "Kleinen Schattenwächter bannen" },
      event_4: { title: "Chronik lesen", description: "Chronik lesen." },
      storyProgress: "Das Blatt erklärt: Das Schwert wurde durch einen gemeinsamen Schwur versiegelt.",
    },
    '10': {
      title: "Ein Handel ohne Gold",
      description: "Der Hauptmann will Hilfe für seine verängstigten Gefährten statt Bezahlung.",
      event_1: { title: "Angebot anhören", description: "Angebot anhören" },
      event_2: { title: "Verschwundene Vorratszeichen finden", description: "Verschwundene Vorratszeichen finden" },
      event_3: { title: "Schattennebel durch Rätsel oder Kampf lösen", description: "Schattennebel durch Rätsel oder Kampf lösen" },
      event_4: { title: "Schlüssel geschenkt bekommen", description: "Schlüssel geschenkt bekommen." },
      storyProgress: "Der Schlüssel öffnet das versiegelte Tiefenarchiv; es gibt keine Goldschranke.",
    },
    '11': {
      title: "Die Rune der Gezeiten",
      description: "Ein mechanisches Wasserspiel bewahrt die letzte Nachricht der Stadthüter.",
      event_1: { title: "Mechanismus betrachten", description: "Mechanismus betrachten" },
      event_2: { title: "Symbolfolge ausprobieren", description: "Symbolfolge ausprobieren" },
      event_3: { title: "Spiegelwächter ablenken oder bannen", description: "Spiegelwächter ablenken oder bannen" },
      event_4: { title: "Rune aktivieren", description: "Rune aktivieren." },
      storyProgress: "Die Rune ruft die Hüterin der Tiefe.",
    },
    '12': {
      title: "Das Herz der Tiefe",
      description: "Die verfluchte Hüterin bewacht den Weg zum Aschegebirge.",
      event_1: { title: "Bundesschwur vorlesen", description: "Bundesschwur vorlesen" },
      event_2: { title: "Spiegelbilder im Bosskampf unterscheiden", description: "Spiegelbilder im Bosskampf unterscheiden" },
      event_3: { title: "Gezeitenrune anwenden", description: "Gezeitenrune anwenden" },
      event_4: { title: "Nachricht der Hüterin empfangen", description: "Nachricht der Hüterin empfangen." },
      storyProgress: "Das dritte Kartenfragment markiert eine Schmiede im Aschegebirge.",
    },
    '13': {
      title: "Funken am Horizont",
      description: "Eine Schmiedin sucht das erloschene Feuer ihrer Ahnen.",
      event_1: { title: "Schmiedin treffen", description: "Schmiedin treffen" },
      event_2: { title: "Funkenzeichen sammeln", description: "Funkenzeichen sammeln" },
      event_3: { title: "Kleine Glutechse beruhigen oder vertreiben", description: "Kleine Glutechse beruhigen oder vertreiben" },
      event_4: { title: "Schmiedetor öffnen", description: "Schmiedetor öffnen." },
      storyProgress: "Die Schmiedemarke gewährt Zugang zum Wissen über die Schwertfassung.",
    },
    '14': {
      title: "Das singende Erz",
      description: "Ein Erzgeist erinnert sich an den Klang des Ersten Lichts.",
      event_1: { title: "Erzgeist anhören", description: "Erzgeist anhören" },
      event_2: { title: "Muster vergleichen", description: "Muster vergleichen" },
      event_3: { title: "Steinhülle virtuell lösen", description: "Steinhülle virtuell lösen" },
      event_4: { title: "Lichtsplitter bergen", description: "Lichtsplitter bergen." },
      storyProgress: "Der Splitter ist das erste Material zur späteren Schwertfassung.",
    },
    '15': {
      title: "Der zornige Wind",
      description: "Ein junger Drache schützt aus Angst sein zerbrochenes Nest in der Vision.",
      event_1: { title: "Drachenabsicht erkennen", description: "Drachenabsicht erkennen" },
      event_2: { title: "Virtuelle Nestteile ordnen", description: "Virtuelle Nestteile ordnen" },
      event_3: { title: "Angekündigte Windstöße schützen", description: "Angekündigte Windstöße schützen" },
      event_4: { title: "Vertrauen gewinnen", description: "Vertrauen gewinnen." },
      storyProgress: "Die Drachenfeder übermittelt eine Warnung vor dem Aschedrachen.",
    },
    '16': {
      title: "Die verborgenen Signalfeuer",
      description: "Erloschene Signalzeichen verschlüsseln den Pfad zur Lichtschmiede.",
      event_1: { title: "Signalstein lesen", description: "Signalstein lesen" },
      event_2: { title: "Drei Lichtmuster lösen", description: "Drei Lichtmuster lösen" },
      event_3: { title: "Ascheschatten bannen", description: "Ascheschatten bannen" },
      event_4: { title: "Signalkarte sichern", description: "Signalkarte sichern." },
      storyProgress: "Die Signalkarte erschließt die letzte Schmiedekammer.",
    },
    '17': {
      title: "Der Schlüssel aus Sonnenmetall",
      description: "Die Schmiedin kann den Schlüssel nur mit dem geretteten Lichtsplitter erneuern.",
      event_1: { title: "Bauplan lesen", description: "Bauplan lesen" },
      event_2: { title: "Schlüsselstücke ausrichten", description: "Schlüsselstücke ausrichten" },
      event_3: { title: "Schmiede gegen eine Glutechse schützen", description: "Schmiede gegen eine Glutechse schützen" },
      event_4: { title: "Fertigen Schlüssel prüfen", description: "Fertigen Schlüssel prüfen." },
      storyProgress: "Der Schlüssel öffnet später das Tor der Schattenfestung; der Lichtsplitter wird als verbaut markiert.",
    },
    '18': {
      title: "Unter den Flügeln der Asche",
      description: "Ein Schattenkristall hält den Aschedrachen gefangen.",
      event_1: { title: "Drachenfeder als Vertrauenszeichen zeigen", description: "Drachenfeder als Vertrauenszeichen zeigen" },
      event_2: { title: "Glutphase schützen", description: "Glutphase schützen" },
      event_3: { title: "Kristall im Bosskampf reinigen", description: "Kristall im Bosskampf reinigen" },
      event_4: { title: "Drachenbotschaft empfangen", description: "Drachenbotschaft empfangen." },
      storyProgress: "Das vierte Kartenfragment vervollständigt den Weg zur Schattenfestung.",
    },
    '19': {
      title: "Das Tor ohne Schatten",
      description: "Das Festungstor erkennt den Sonnenschlüssel, verbirgt aber seine Schließordnung.",
      event_1: { title: "Festungskarte zusammensetzen", description: "Festungskarte zusammensetzen" },
      event_2: { title: "Sonnenschlüssel einsetzen", description: "Sonnenschlüssel einsetzen" },
      event_3: { title: "Schattenwächter überwinden", description: "Schattenwächter überwinden" },
      event_4: { title: "Torzeichen ordnen", description: "Torzeichen ordnen." },
      storyProgress: "Das äußere Festungssiegel erschließt den ersten Hof der Vision.",
    },
    '20': {
      title: "Die gefangene Kartografin",
      description: "Die Kartografin kennt den Weg zum inneren Archiv.",
      event_1: { title: "Nachricht entziffern", description: "Nachricht entziffern" },
      event_2: { title: "Bannlinien vergleichen", description: "Bannlinien vergleichen" },
      event_3: { title: "Wächter ablenken oder bannen", description: "Wächter ablenken oder bannen" },
      event_4: { title: "Kartografin befreien", description: "Kartografin befreien." },
      storyProgress: "Der Innenhofplan zeigt das Archiv und einen gemeinsamen Zugang für alle Helden.",
    },
    '21': {
      title: "Der versiegelte Brief",
      description: "Ein alter Brief bestätigt, dass der Magier das Schwert schon früher gesucht hat.",
      event_1: { title: "Archiv durchsuchen", description: "Archiv durchsuchen" },
      event_2: { title: "Siegelrätsel lösen", description: "Siegelrätsel lösen" },
      event_3: { title: "Schriftenschatten bannen", description: "Schriftenschatten bannen" },
      event_4: { title: "Lesbaren Briefteil ins Tagebuch übernehmen", description: "Lesbaren Briefteil ins Tagebuch übernehmen." },
      storyProgress: "Gesichert ist nur die frühere Suche, keine böse Absicht; der mögliche Twist bleibt offen.",
    },
    '22': {
      title: "Drei Spiegel, ein Versprechen",
      description: "Spiegel zeigen Mut, Fürsorge und Zusammenhalt als Grundlage des alten Bundes.",
      event_1: { title: "Mutbild lösen", description: "Mutbild lösen" },
      event_2: { title: "Fürsorgeentscheidung treffen", description: "Fürsorgeentscheidung treffen" },
      event_3: { title: "Zusammenhaltsbild ergänzen", description: "Zusammenhaltsbild ergänzen" },
      event_4: { title: "Spiegelwächter durch den Bund beruhigen", description: "Spiegelwächter durch den Bund beruhigen." },
      storyProgress: "Das Bundessiegel öffnet den Saal des Schattenvogts.",
    },
    '23': {
      title: "Das geteilte Licht",
      description: "Gefangene Lichtfunken verlieren allein ihre Kraft, stärken sich aber gemeinsam.",
      event_1: { title: "Funken befragen", description: "Funken befragen" },
      event_2: { title: "Verbindungsmuster legen", description: "Verbindungsmuster legen" },
      event_3: { title: "Schattenangriff abwehren", description: "Schattenangriff abwehren" },
      event_4: { title: "Bundeslaterne entzünden", description: "Bundeslaterne entzünden." },
      storyProgress: "Die Bundeslaterne enthüllt die echten Siegel des Vogts.",
    },
    '24': {
      title: "Der Schattenvogt",
      description: "Der Vogt bewacht den letzten Weg zur Ruhestätte des Schwertes.",
      event_1: { title: "Bundeslaterne einsetzen", description: "Bundeslaterne einsetzen" },
      event_2: { title: "Echte Siegel im Bosskampf erkennen", description: "Echte Siegel im Bosskampf erkennen" },
      event_3: { title: "Schutzphase durchstehen", description: "Schutzphase durchstehen" },
      event_4: { title: "Vogt vom Schatten lösen", description: "Vogt vom Schatten lösen." },
      storyProgress: "Der Sternenkompass weist zum Heiligtum des Ersten Lichts.",
    },
    '25': {
      title: "Wo die Zeichen zusammenfinden",
      description: "Die Karten und Runen bilden gemeinsam den Zugang zum Heiligtum.",
      event_1: { title: "Kartenfragmente verbinden", description: "Kartenfragmente verbinden" },
      event_2: { title: "Verbindungs- und Gezeitenrune zuordnen", description: "Verbindungs- und Gezeitenrune zuordnen" },
      event_3: { title: "Kleinen Schattenwächter bannen", description: "Kleinen Schattenwächter bannen" },
      event_4: { title: "Kompass ausrichten", description: "Kompass ausrichten." },
      storyProgress: "Die Lichtkarte zeigt den erzählerischen Zugang zum Heiligtum.",
    },
    '26': {
      title: "Die Prüfung der offenen Hand",
      description: "Der Wächter prüft Hilfsbereitschaft statt Reichtum oder Kampfstärke.",
      event_1: { title: "Wächter anhören", description: "Wächter anhören" },
      event_2: { title: "Lichtwesen suchen", description: "Lichtwesen suchen" },
      event_3: { title: "Erinnerungsstücke schenken, ohne Inventarkosten", description: "Erinnerungsstücke schenken, ohne Inventarkosten" },
      event_4: { title: "Antwort gemeinsam formulieren", description: "Antwort gemeinsam formulieren." },
      storyProgress: "Das Zeichen öffnet den inneren Heiligtumsring unabhängig von der gewählten Formulierung.",
    },
    '27': {
      title: "Der gebrochene Schutzkreis",
      description: "Der Schutzkreis kann das Schwert erst wieder tragen, wenn seine Runen verbunden sind.",
      event_1: { title: "Bruchstellen ansehen", description: "Bruchstellen ansehen" },
      event_2: { title: "Runenfolge rekonstruieren", description: "Runenfolge rekonstruieren" },
      event_3: { title: "Schattenwelle im Stillstand abwehren", description: "Schattenwelle im Stillstand abwehren" },
      event_4: { title: "Schutzkreis schließen", description: "Schutzkreis schließen." },
      storyProgress: "Der Kreis zeigt die erforderliche Schwertfassung aus dem Sonnenschlüssel.",
    },
    '28': {
      title: "Das Erwachen des Ersten Lichts",
      description: "Die gesammelten Bundeszeichen erwecken das legendäre Schwert.",
      event_1: { title: "Sonnenschlüssel zur Fassung wandeln", description: "Sonnenschlüssel zur Fassung wandeln" },
      event_2: { title: "Bundessiegel einsetzen", description: "Bundessiegel einsetzen" },
      event_3: { title: "Lichtprüfung als Rätsel oder Kampf bestehen", description: "Lichtprüfung als Rätsel oder Kampf bestehen" },
      event_4: { title: "Schwert annehmen", description: "Schwert annehmen." },
      storyProgress: "Das Schwert ist gefunden; seine Questfähigkeit ist für alle fünf Helden gleich zugänglich. Der Sonnenschlüssel wird als umgewandelt dokumentiert.",
    },
    '29': {
      title: "Wenn die Nacht zerbricht",
      description: "Der Ursprung der Schatten versucht, das zurückkehrende Licht zu verschlingen.",
      event_1: { title: "Verbündetenbotschaften sammeln", description: "Verbündetenbotschaften sammeln" },
      event_2: { title: "Angekündigte Schattenphasen schützen", description: "Angekündigte Schattenphasen schützen" },
      event_3: { title: "Erstes Licht im Bosskampf einsetzen", description: "Erstes Licht im Bosskampf einsetzen" },
      event_4: { title: "Nachtkern versiegeln", description: "Nachtkern versiegeln." },
      storyProgress: "Das Nachtsiegel belegt den Bann; das Schwert bleibt bis zur Übergabe gesichert.",
    },
    '30': {
      title: "Das Licht, das wir teilen",
      description: "Die Helden bringen das Schwert zum Magier zurück und erinnern sich an ihre Verbündeten.",
      event_1: { title: "Turm in einer Zwischenszene erreichen", description: "Turm in einer Zwischenszene erreichen" },
      event_2: { title: "Schwert dem Magier übergeben", description: "Schwert dem Magier übergeben" },
      event_3: { title: "Gemeinsame Schutzzeremonie erleben", description: "Gemeinsame Schutzzeremonie erleben" },
      event_4: { title: "Erinnerungsbuch und Abspann öffnen", description: "Erinnerungsbuch und Abspann öffnen." },
      storyProgress: "Hauptgeschichte abgeschlossen; das Schwert schützt im Turm die Welt. Die Questwaffe wird als übergeben markiert und ihr Fund bleibt im Tagebuch erhalten.",
    },
  },
};
