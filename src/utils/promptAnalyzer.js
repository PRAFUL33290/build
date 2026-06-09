// Prompt analyzer - transforms a child's prompt into game configuration

const GAME_TYPES = {
  platformer: ['saute', 'plateforme', 'jump', 'platform', 'monte', 'grimpe'],
  maze: ['labyrinthe', 'maze', 'chemin', 'sortie', 'trouve', 'cherche'],
  collect: ['récupère', 'collecte', 'ramasse', 'attrape', 'collect', 'gather', 'étoile', 'cristal', 'pièce', 'coin', 'star'],
  dodge: ['évite', 'esquive', 'dodge', 'fuit', 'échappe', 'survie'],
  topdown: ['explore', 'aventure', 'adventure', 'monde', 'world', 'parcours'],
};

const HEROES = {
  chevalier: ['chevalier', 'knight', 'guerrier', 'warrior'],
  panda: ['panda', 'ours', 'bear'],
  robot: ['robot', 'machine', 'androïde'],
  chat: ['chat', 'cat', 'chaton', 'kitten'],
  astronaute: ['astronaute', 'astronaut', 'cosmonaute', 'espace'],
  princesse: ['princesse', 'princess', 'reine', 'queen'],
  pirate: ['pirate', 'corsaire', 'marin'],
  dragon: ['dragon', 'dragonneau'],
  lapin: ['lapin', 'rabbit', 'bunny'],
  ninja: ['ninja', 'samurai', 'samouraï'],
};

const THEMES = {
  forest: ['forêt', 'forest', 'arbre', 'tree', 'jungle', 'bois'],
  space: ['espace', 'space', 'étoile', 'star', 'planète', 'planet', 'galaxie', 'lune', 'moon'],
  castle: ['château', 'castle', 'donjon', 'tour', 'kingdom', 'royaume'],
  city: ['ville', 'city', 'rue', 'street', 'building', 'immeuble'],
  ocean: ['océan', 'ocean', 'mer', 'sea', 'eau', 'water', 'sous-marin', 'plage'],
  india: ['inde', 'india', 'temple', 'maharaja', 'bollywood'],
  fantasy: ['magique', 'magic', 'fée', 'fairy', 'licorne', 'unicorn', 'sorcier', 'wizard'],
};

const COLLECTIBLES = {
  forest: { name: 'cristaux', emoji: '💎' },
  space: { name: 'étoiles', emoji: '⭐' },
  castle: { name: 'clés dorées', emoji: '🔑' },
  city: { name: 'pièces', emoji: '🪙' },
  ocean: { name: 'perles', emoji: '🫧' },
  india: { name: 'gemmes', emoji: '💠' },
  fantasy: { name: 'potions', emoji: '🧪' },
};

const ENEMIES = {
  forest: { name: 'loups', emoji: '🐺' },
  space: { name: 'météorites', emoji: '☄️' },
  castle: { name: 'fantômes', emoji: '👻' },
  city: { name: 'voitures folles', emoji: '🚗' },
  ocean: { name: 'requins', emoji: '🦈' },
  india: { name: 'serpents', emoji: '🐍' },
  fantasy: { name: 'trolls', emoji: '👹' },
};

function findMatch(text, mapping) {
  const lower = text.toLowerCase();
  for (const [key, keywords] of Object.entries(mapping)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return key;
    }
  }
  return null;
}

export function analyzePrompt(prompt) {
  const lower = prompt.toLowerCase();

  // Detect game type
  let gameType = findMatch(lower, GAME_TYPES) || 'collect';

  // Detect hero
  let hero = findMatch(lower, HEROES) || 'chat';

  // Detect theme
  let theme = findMatch(lower, THEMES) || 'fantasy';

  // Get collectibles and enemies based on theme
  const collectible = COLLECTIBLES[theme] || COLLECTIBLES.fantasy;
  const enemy = ENEMIES[theme] || ENEMIES.fantasy;

  // Generate game name
  const heroNames = {
    chevalier: 'Chevalier',
    panda: 'Panda',
    robot: 'Robot',
    chat: 'Chat',
    astronaute: 'Astronaute',
    princesse: 'Princesse',
    pirate: 'Pirate',
    dragon: 'Dragon',
    lapin: 'Lapin',
    ninja: 'Ninja',
  };

  const themeNames = {
    forest: 'la Forêt',
    space: "l'Espace",
    castle: 'le Château',
    city: 'la Ville',
    ocean: "l'Océan",
    india: "l'Inde",
    fantasy: 'le Monde Magique',
  };

  const gameName = `${heroNames[hero]} dans ${themeNames[theme]}`;

  return {
    gameName,
    gameType,
    hero,
    theme,
    collectible,
    enemy,
    difficulty: 'medium',
    maxCollectibles: 10,
    maxEnemies: 5,
    lives: 3,
    winCondition: `Récupère ${10} ${collectible.name} pour gagner !`,
    loseCondition: `Tu perds si tu n'as plus de vies !`,
    prompt,
  };
}
