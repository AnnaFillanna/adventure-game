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

  // Event 3: Convince bandits
  event3: {
    title: 'Banditen überzeugen',
    scene: 'Drei nervöse Banditen sitzen um ein kleines Feuer. Der Anführer sieht dich an – verwirrt, dann unversöhnt.',
    banditLeader: {
      intro: 'Wer da? Eine der Hirten des Magiers?',
      challenged: 'Komm dann näher, wenn du Mut hast!',
      defeated: 'Genug, genug! Wir geben euch die Laterne zurück. Sie flüstert, sie flüstert nachts – wir können nicht schlafen!'
    },
    buttons: {
      attack: 'Kämpfen',
      defend: 'Abwehren',
      help: 'Hinweis',
      retry: 'Nochmal versuchen'
    },
    combat: {
      playerAttack: 'Du schlägst zu.',
      playerDefend: 'Du schützt dich.',
      combatHelp: 'Ein unsichtbarer Helfer unterstützt dich!',
      banditAttack: 'Der Bandit schlägt zurück!',
      playerDefeated: 'Du wirst überwältigt. Versuch es nochmal.',
      banditDefeated: 'Der Anführer sinkt zu Boden. Die anderen Banditen geben auf.',
      combatRetry: 'Du atmest tief durch und versuchst es erneut.'
    },
    feedback: {
      combatStart: 'Der Bandit greift an!',
      combatHelp: 'Der Wind hilft dir – es ist, als ob der Magier selbst dich führt.'
    }
  },

  // Event 4: Light the lantern
  event4: {
    title: 'Laterne entzünden',
    scene: 'Die Laterne liegt vor dir, dunkel und kühl. Der Anführer reicht dir einen glimmenden Holzspan.',
    lantern: {
      intro: 'Zünde sie an. Vielleicht rettet sie dich vor dem, was kommt.',
      after: 'Die Laterne erwacht mit violettem Licht. Nebelpfade werden sichtbar – hundert neue Wege zeichnen sich in der Luft ab.'
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
