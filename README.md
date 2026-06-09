# 🎮 Mini Game Creator

**Crée ton jeu avec une phrase !**

Une application web qui permet aux enfants de créer leur propre mini-jeu 2D pixel art à partir d'un simple prompt en français.

## ✨ Fonctionnalités

- **Étape 1 - Imagine** : Écris une phrase pour décrire ton jeu
- **Étape 2 - Personnalise** : Modifie le héros, le décor, la difficulté...
- **Étape 3 - Joue** : Ton mini-jeu est généré en HTML5 Canvas !
- **Étape 4 - Sauvegarde** : Télécharge ou publie sur GitHub (avec validation adulte)

## 🎯 Types de jeux supportés

- ⭐ Collecte d'objets
- 🦘 Plateforme
- 🧩 Labyrinthe
- 💨 Esquive
- 🗺️ Aventure top-down

## 🎨 Thèmes disponibles

- 🌲 Forêt
- 🚀 Espace
- 🏰 Château
- 🏙️ Ville
- 🌊 Océan
- 🕌 Inde
- ✨ Fantasy

## 🦸 Héros disponibles

Chevalier, Panda, Robot, Chat, Astronaute, Princesse, Pirate, Dragon, Lapin, Ninja

## 🛡️ Sécurité enfants

- Modération des prompts (blocage de contenu inapproprié)
- Pas de données personnelles collectées
- Publication GitHub uniquement avec validation adulte
- Pas de contenu violent ou inapproprié

## 🚀 Installation

```bash
npm install
npm start
```

## 🏗️ Structure du projet

```
src/
├── components/      # Composants React (HomePage, Editor, GamePlayer, SavePage)
├── game-engine/     # Moteur de jeu Canvas HTML5
├── github/          # Générateur de code pour export/GitHub
├── templates/       # Templates de jeux
└── utils/           # Analyseur de prompts, modération
```

## 📋 Limites de création

- Maximum 1 niveau
- Maximum 1 personnage principal
- Maximum 5 ennemis
- Maximum 10 objets à collecter
- Pas de multijoueur
- Pas de contenu violent

## 🎮 Contrôles

- **Flèches directionnelles** ou **ZQSD** pour se déplacer
- Récupère tous les objets en évitant les ennemis !

---

*Créé avec ❤️ pour les jeunes créateurs de jeux*