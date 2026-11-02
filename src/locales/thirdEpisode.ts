export const thirdEpisode = {
  title: 'Die gestohlene Laterne',
  shortTitle: 'Laterne',
  description: 'Banditen haben eine Laterne entwendet, die verfluchten Nebel sichtbar macht.',
  chapter: 'Kapitel I: Die verfluchten Lande',
  chapterNumber: 1,
  episodeNumber: 3,

  // Event 1: Merchant inquiry
  event1: {
    title: 'Händler befragen',
    scene: 'Ein besorgter Händler steht vor seinem Karren mit verwüsteten Waren.',
    merchant: {
      intro: 'Ah, willkommen! Ihr kommt zur rechten Zeit. Diese Banditen sind eine Plage!',
      second: 'Eine glühende Laterne – dunkelviolett und warm wie ein Herz. Sie zeigt die unsichtbaren Nebelpfade.',
      third: 'Die Banditen haben sie gestohlen. Ohne sie kann ich die Wege durch den Fluch nicht lesen.'
    },
    button: 'Weiter hören'
  },

  // Event 2: Supply traces comparison
  event2: {
    title: 'Vorratsspuren vergleichen',
    scene: 'Verstreute Spuren im Sand zeigen den Weg der Banditen. Zwei Pfade divergieren – einer führt zu den Morgenquellen, einer zu den Abendklippen.',
    traces: {
      morning: 'Morgenquellen-Spur',
      evening: 'Abendklippen-Spur'
    },
    buttons: {
      morning: 'Morgenquellen folgen',
      evening: 'Abendklippen folgen',
      help: 'Hinweis'
    },
    feedback: {
      traceWrong: 'Die Abendklippen-Spur führt ins Nichts. Die Banditen sind nicht diesen Weg gegangen.',
      traceCorrect: 'Die Morgenquellen-Spur ist frisch! Hier haben die Banditen Halt gemacht.',
      traceHelp: 'Ein Zeichen im Sand: Morgentau glänzt auf den Steinen. Folge den glänzenden Spuren.'
    }
  },

  // Event 3: Encounter with cursed bandits (Discovery-based)
  event3: {
    title: 'Das Geheimnis der Banditen',
    scene: 'Drei nervöse Banditen sitzen um ein kleines Feuer. Der Anführer sieht dich an – verwirrt, angespannt, gequält.',
    banditLeader: {
      intro: 'Wer... wer bist du? Bist du gekommen, um sie zu holen?',
      problem: 'Diese Laterne... sie flüstert nachts. Der Geist darin schreit. Wir konnten nicht schlafen.',
      revelation: 'Wir haben sie nur genommen, um sie zum Schweigen zu bringen. Aber es wurde nur schlimmer...',
      hopeful: 'Vielleicht... vielleicht kannst du das Flüstern beenden. Du siehst nicht wie ein Soldat aus.'
    },
    buttons: {
      listen: '👂 Zuhören',
      investigate: '🔍 Fragen stellen',
      help: '🤝 Ich kann euch helfen',
      escape: '🏃 Gehen'
    },
    dialogue: {
      listening: 'Der Anführer atmet tief durch. Seine Angst wird sichtbar.',
      investigating: 'Je mehr du fragst, desto klarer wird das Bild: Sie sind Opfer, nicht Bösewichte.',
      curseProblem: 'Die Laterne ist nicht nur gestohlen – sie ist verflucht. Der Geist schreit nach Erlösung.',
      offering: 'Der Anführer sieht dir in die Augen. Hoffnung flackert auf.',
      thankful: 'Die Banditen entspannen sich. \"Danke. Danke, dass du verstanden hast.\"'
    },
    feedback: {
      banditGreeted: 'Du nähert dich langsam. Der Anführer beobachtet dich wachsam.',
      banditListening: 'Der Anführer beginnt zu sprechen. Seine Geschichte ist komplexer als erwartet.',
      curseRevealed: 'Die Wahrheit offenbart sich: Sie haben die Laterne gestohlen, weil der Geist sie quälte.',
      solutionChosen: 'Du findest eine Lösung. Die Banditen geben dir die Laterne.',
      banditThankful: 'Der Anführer reicht dir die Laterne mit dankbarem Blick.'
    }
  },

  // Event 4: Light the lantern
  event4: {
    title: 'Laterne entzünden',
    scene: 'Die Laterne liegt vor dir, dunkel und kühl. Der Anführer reicht dir einen glimmenden Holzspan.',
    lantern: {
      intro: 'Zünde sie an. Vielleicht bringt sie dem Geist Frieden.',
      after: 'Die Laterne erwacht mit violettem Licht. Der Geist-Schrei wird zu einem sanften Singen. Nebelpfade werden sichtbar – hundert neue Wege zeichnen sich in der Luft ab.'
    },
    button: 'Laterne entzünden',
    completion: 'Die Episode ist abgeschlossen.'
  },

  // Rewards
  rewards: {
    gold: 20,
    goldText: '20 Gold erhalten',
    item: 'Einfacher Reiseumhang',
    itemDescription: 'Ein dünner Umhang aus groben Fasern – nicht viel, aber warm genug für die Nächte in der Wüste.',
    xp: 100,
    xpText: '100 XP erhalten'
  },

  // Story progression
  storyProgress: 'Die Nebellaterne enthüllt verborgene Kartenlinien.',
  transition: 'Auf der Karte erscheint eine zerstörte virtuelle Brücke.',

  // Achievement
  achievement: 'Die Laterne bewacht dich nun auf deinem Weg.',
  nextEpisode: 'Episode 4: Zeichen unter dem Nebel ist jetzt verfügbar.'
};
