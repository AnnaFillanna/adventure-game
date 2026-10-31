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
    moreAbilities: '+{count} weitere',
    startAdventure: 'Abenteuer starten',
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
      title: 'Das Flüstern im Sand',
      description: 'Die erste Episode beginnt. Ein Flüstern trägt die erste Botschaft.',
      event_1: { title: 'Ankunft', description: 'Die Helden betreten die Wüste.' },
      storyProgress: 'Der Sand flüstert von alten Zeichen.',
    },
    '02': {
      title: 'Die stumme Glocke',
      description: 'Eine Glocke ohne Klang. Ein Rätsel, das gelöst werden muss.',
      event_1: { title: 'Die Glocke', description: 'Die Helden finden die stumme Glocke.' },
      storyProgress: 'Das erste Zeichen wird offenbart.',
    },
    '03': {
      title: 'Die gestohlene Laterne',
      description: 'Licht, das gestohlen wurde. Eine Nacht ohne Ende.',
      event_1: { title: 'Finsternis', description: 'Die Helden suchen das Licht.' },
      storyProgress: 'Das zweite Zeichen liegt vor ihnen.',
    },
    '04': {
      title: 'Zeichen unter dem Nebel',
      description: 'Nebel verborgen. Zeichen versteckt. Eine Prüfung wartet.',
      event_1: { title: 'Im Nebel', description: 'Die Helden navigieren durch den Nebel.' },
      storyProgress: 'Das dritte Zeichen wird sichtbar.',
    },
    '05': {
      title: 'Das Gedächtnis der Weiden',
      description: 'Bäume, die sich erinnern. Ein Speicher von Geistern.',
      event_1: { title: 'Erinnerung', description: 'Die Weiden erzählen ihre Geschichten.' },
      storyProgress: 'Das vierte Zeichen ist nahe.',
    },
    '06': {
      title: 'Die Krone des Moorhüters',
      description: 'Der Boss des ersten Kapitels. Der Hüter der verfluchten Lande.',
      event_1: { title: 'Boss-Kampf', description: 'Die Helden stellen sich dem Moorhüter.' },
      storyProgress: 'Das erste Kartenfragment wurde gesichert.',
    },
    '07': {
      title: 'Die Stadt im Spiegel',
      description: 'Ein Spiegel offenbart eine verborgene Welt. Eine Stadt unter Wasser.',
      event_1: { title: 'Der Spiegel', description: 'Die Helden betreten die gespiegelte Stadt.' },
      storyProgress: 'Das erste Geheimnis der versunkenen Welt.',
    },
    '08': {
      title: 'Der Fährmann der Erinnerungen',
      description: 'Ein Fährmann ohne Boot. Erinnerungen als Währung.',
      event_1: { title: 'Überfahrt', description: 'Der Fährmann helft den Helden über.' },
      storyProgress: 'Die Marke des Fährmanns wird erhalten.',
    },
    '09': {
      title: 'Die leeren Seiten',
      description: 'Ein Archiv ohne Wissen. Bücher ohne Worte.',
      event_1: { title: 'Archiv', description: 'Die Helden suchen das Wissen.' },
      storyProgress: 'Das erste Blatt der Schwertchronik wird gefunden.',
    },
    '10': {
      title: 'Ein Handel ohne Gold',
      description: 'Banditen mit Gewissen. Ein Handel, der Gold nicht braucht.',
      event_1: { title: 'Verhandlung', description: 'Die Helden verhandeln mit Banditen.' },
      storyProgress: 'Der Archivschlüssel wird gewährt.',
    },
    '11': {
      title: 'Die Rune der Gezeiten',
      description: 'Ein Mechanismus des Wassers. Gezeiten, die Geheimnisse bewachen.',
      event_1: { title: 'Rätsel', description: 'Die Helden entziffern die Gezeiten.' },
      storyProgress: 'Die Rune wird aktiviert.',
    },
    '12': {
      title: 'Das Herz der Tiefe',
      description: 'Der Boss des zweiten Kapitels. Die Hüterin der versunkenen Pfade.',
      event_1: { title: 'Boss-Kampf', description: 'Die Helden stellen sich der Hüterin.' },
      storyProgress: 'Das zweite Kartenfragment wurde gesichert.',
    },
    '13': {
      title: 'Funken am Horizont',
      description: 'Feuer am Himmel. Ein Berg, der brennt.',
      event_1: { title: 'Ankunft', description: 'Die Helden erreichen das Aschegebirge.' },
      storyProgress: 'Die erste Spur der Schmiedin.',
    },
    '14': {
      title: 'Das singende Erz',
      description: 'Erz mit einer Stimme. Ein Splitter aus Licht.',
      event_1: { title: 'Erz', description: 'Die Helden finden das singende Erz.' },
      storyProgress: 'Der Lichtsplitter wird gewonnen.',
    },
    '15': {
      title: 'Der zornige Wind',
      description: 'Ein junger Drache. Angst, die sich in Sturm verwandelt.',
      event_1: { title: 'Drache', description: 'Die Helden beruhigen den Drachen.' },
      storyProgress: 'Die Drachenfeder wird erhalten.',
    },
    '16': {
      title: 'Die verborgenen Signalfeuer',
      description: 'Feuer, die die Wahrheit tragen. Ein Pfad, der mit Licht gezeichnet ist.',
      event_1: { title: 'Signale', description: 'Die Helden folgen den Signalen.' },
      storyProgress: 'Die Signalkarte wird gewonnen.',
    },
    '17': {
      title: 'Der Schlüssel aus Sonnenmetall',
      description: 'Ein Schlüssel aus Licht. Das Material der Sonne selbst.',
      event_1: { title: 'Schmiede', description: 'Die Schmiedin schmiedet den Schlüssel.' },
      storyProgress: 'Der Sonnenschlüssel wird erhalten.',
    },
    '18': {
      title: 'Unter den Flügeln der Asche',
      description: 'Der Boss des dritten Kapitels. Der Aschedrache selbst.',
      event_1: { title: 'Boss-Kampf', description: 'Die Helden bekämpfen den Aschedrachen.' },
      storyProgress: 'Das dritte Kartenfragment wurde gesichert.',
    },
    '19': {
      title: 'Das Tor ohne Schatten',
      description: 'Ein Tor, das nur bei Licht offenbar wird.',
      event_1: { title: 'Tor', description: 'Die Helden öffnen das Festungstor.' },
      storyProgress: 'Eintritt in die Schattenfestung.',
    },
    '20': {
      title: 'Die gefangene Kartografin',
      description: 'Ein Kartograph, der die Wahrheit kennt.',
      event_1: { title: 'Befreiung', description: 'Die Helden befreien die Kartografin.' },
      storyProgress: 'Neue Karten werden enthüllt.',
    },
    '21': {
      title: 'Der versiegelte Brief',
      description: 'Eine Nachricht aus der Vergangenheit.',
      event_1: { title: 'Brief', description: 'Die Helden lesen den Brief.' },
      storyProgress: 'Ein Geheimnis der Festung.',
    },
    '22': {
      title: 'Drei Spiegel, ein Versprechen',
      description: 'Spiegel, die die Vergangenheit zeigen.',
      event_1: { title: 'Spiegel', description: 'Die Helden schauen in die Spiegel.' },
      storyProgress: 'Das Versprechen wird erneuert.',
    },
    '23': {
      title: 'Das geteilte Licht',
      description: 'Licht, das geteilt wird. Macht, die verteilt ist.',
      event_1: { title: 'Teilung', description: 'Die Helden teilen das Licht.' },
      storyProgress: 'Die Kraft wird vereint.',
    },
    '24': {
      title: 'Der Schattenvogt',
      description: 'Der Boss des vierten Kapitels. Der letzte Wächter der Dunkelheit.',
      event_1: { title: 'Boss-Kampf', description: 'Die Helden stellen sich dem Vogt.' },
      storyProgress: 'Das vierte Kartenfragment wurde gesichert.',
    },
    '25': {
      title: 'Wo die Zeichen zusammenfinden',
      description: 'Der Ort, an dem alles zusammenkommt.',
      event_1: { title: 'Zusammenkunft', description: 'Die Zeichen finden sich zusammen.' },
      storyProgress: 'Der Weg zum Schwert wird klar.',
    },
    '26': {
      title: 'Die Prüfung der offenen Hand',
      description: 'Eine Prüfung des Herzens. Nicht des Schwertes.',
      event_1: { title: 'Prüfung', description: 'Die Helden werden geprüft.' },
      storyProgress: 'Das Herz wird offenbart.',
    },
    '27': {
      title: 'Der gebrochene Schutzkreis',
      description: 'Ein Schutz, der bricht. Ein Kreis, der sich schließt.',
      event_1: { title: 'Bruch', description: 'Der Schutzkreis wird restauriert.' },
      storyProgress: 'Der Weg wird frei.',
    },
    '28': {
      title: 'Das Erwachen des Ersten Lichts',
      description: 'Das Schwert antwortet. Licht kehrt zurück.',
      event_1: { title: 'Erwachen', description: 'Das Schwert erwacht.' },
      storyProgress: 'Das Licht wird geboren.',
    },
    '29': {
      title: 'Wenn die Nacht zerbricht',
      description: 'Der Abschied von der Dunkelheit.',
      event_1: { title: 'Zerbrechen', description: 'Die Nacht bricht an.' },
      storyProgress: 'Ein neuer Tag beginnt.',
    },
    '30': {
      title: 'Das Licht, das wir teilen',
      description: 'Der Boss des fünften Kapitels. Die letzte Prüfung.',
      event_1: { title: 'Finale', description: 'Die Helden kämpfen für das Licht.' },
      storyProgress: 'Das Schwert des Ersten Lichts ist erhoben.',
    },
  },
};
