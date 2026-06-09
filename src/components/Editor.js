import React, { useState } from 'react';

const HEROES_OPTIONS = [
  { id: 'chevalier', label: '⚔️ Chevalier' },
  { id: 'panda', label: '🐼 Panda' },
  { id: 'robot', label: '🤖 Robot' },
  { id: 'chat', label: '🐱 Chat' },
  { id: 'astronaute', label: '🧑‍🚀 Astronaute' },
  { id: 'princesse', label: '👸 Princesse' },
  { id: 'pirate', label: '🏴‍☠️ Pirate' },
  { id: 'dragon', label: '🐉 Dragon' },
  { id: 'lapin', label: '🐰 Lapin' },
  { id: 'ninja', label: '🥷 Ninja' },
];

const THEME_OPTIONS = [
  { id: 'forest', label: '🌲 Forêt' },
  { id: 'space', label: '🚀 Espace' },
  { id: 'castle', label: '🏰 Château' },
  { id: 'city', label: '🏙️ Ville' },
  { id: 'ocean', label: '🌊 Océan' },
  { id: 'india', label: '🕌 Inde' },
  { id: 'fantasy', label: '✨ Fantasy' },
];

const GAME_TYPE_OPTIONS = [
  { id: 'collect', label: '⭐ Collecte' },
  { id: 'platformer', label: '🦘 Plateforme' },
  { id: 'maze', label: '🧩 Labyrinthe' },
  { id: 'dodge', label: '💨 Esquive' },
  { id: 'topdown', label: '🗺️ Aventure' },
];

const DIFFICULTY_OPTIONS = [
  { id: 'easy', label: '😊 Facile' },
  { id: 'medium', label: '😐 Moyen' },
  { id: 'hard', label: '😤 Difficile' },
];

function Editor({ config, onDone, onBack }) {
  const [localConfig, setLocalConfig] = useState({ ...config });

  const updateConfig = (key, value) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleDone = () => {
    onDone(localConfig);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 pixel-border">
        <h2 className="text-xl text-center text-purple-800 mb-6 font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '14px' }}>
          ✏️ Personnalise ton jeu
        </h2>

        {/* Game Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-purple-700 mb-1">
            🏷️ Nom du jeu :
          </label>
          <input
            type="text"
            value={localConfig.gameName}
            onChange={(e) => updateConfig('gameName', e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
            maxLength={50}
          />
        </div>

        {/* Game Type */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-purple-700 mb-2">
            🎯 Type de jeu :
          </label>
          <div className="flex flex-wrap gap-2">
            {GAME_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateConfig('gameType', opt.id)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  localConfig.gameType === opt.id
                    ? 'bg-purple-500 text-white pixel-btn'
                    : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-purple-700 mb-2">
            🦸 Héros :
          </label>
          <div className="flex flex-wrap gap-2">
            {HEROES_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateConfig('hero', opt.id)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  localConfig.hero === opt.id
                    ? 'bg-green-500 text-white pixel-btn'
                    : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-purple-700 mb-2">
            🎨 Décor :
          </label>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateConfig('theme', opt.id)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  localConfig.theme === opt.id
                    ? 'bg-blue-500 text-white pixel-btn'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-purple-700 mb-2">
            💪 Difficulté :
          </label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateConfig('difficulty', opt.id)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  localConfig.difficulty === opt.id
                    ? 'bg-orange-500 text-white pixel-btn'
                    : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
          <p className="text-sm font-bold text-purple-700 mb-2">📝 Résumé :</p>
          <p className="text-sm text-purple-600">
            🎮 <strong>{localConfig.gameName}</strong><br />
            🦸 Héros : {HEROES_OPTIONS.find(h => h.id === localConfig.hero)?.label}<br />
            🎨 Décor : {THEME_OPTIONS.find(t => t.id === localConfig.theme)?.label}<br />
            🎯 Type : {GAME_TYPE_OPTIONS.find(g => g.id === localConfig.gameType)?.label}<br />
            💪 Difficulté : {DIFFICULTY_OPTIONS.find(d => d.id === localConfig.difficulty)?.label}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
          >
            ← Retour
          </button>
          <button
            onClick={handleDone}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold pixel-btn hover:from-green-500 hover:to-emerald-600"
          >
            🎮 Jouer !
          </button>
        </div>
      </div>
    </div>
  );
}

export default Editor;
