// Game Templates Index
// Each template defines a basic game structure that the engine uses

export const TEMPLATES = {
  collect: {
    id: 'collect',
    name: 'Collecte d\'objets',
    description: 'Récupère tous les objets en évitant les ennemis',
    mechanics: ['movement', 'collection', 'enemies'],
    winCondition: 'collect_all',
    loseCondition: 'no_lives',
  },
  platformer: {
    id: 'platformer',
    name: 'Plateforme',
    description: 'Saute de plateforme en plateforme',
    mechanics: ['movement', 'jump', 'platforms', 'collection'],
    winCondition: 'collect_all',
    loseCondition: 'no_lives',
  },
  maze: {
    id: 'maze',
    name: 'Labyrinthe',
    description: 'Trouve la sortie du labyrinthe',
    mechanics: ['movement', 'walls', 'exit'],
    winCondition: 'reach_exit',
    loseCondition: 'no_lives',
  },
  dodge: {
    id: 'dodge',
    name: 'Esquive',
    description: 'Évite les ennemis le plus longtemps possible',
    mechanics: ['movement', 'enemies', 'survival'],
    winCondition: 'survive_time',
    loseCondition: 'no_lives',
  },
  topdown: {
    id: 'topdown',
    name: 'Aventure Top-Down',
    description: 'Explore le monde et récupère des trésors',
    mechanics: ['movement', 'collection', 'enemies', 'exploration'],
    winCondition: 'collect_all',
    loseCondition: 'no_lives',
  },
};

export function getTemplate(gameType) {
  return TEMPLATES[gameType] || TEMPLATES.collect;
}
