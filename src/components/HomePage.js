import React, { useState } from 'react';
import { moderatePrompt } from '../utils/moderation';
import { analyzePrompt } from '../utils/promptAnalyzer';

const EXAMPLE_PROMPTS = [
  "Je veux un jeu avec un panda dans l'espace qui récupère des étoiles.",
  "Un chevalier doit récupérer des cristaux dans une forêt magique.",
  "Un chat ninja qui évite des fantômes dans un château.",
  "Une princesse explore un labyrinthe sous l'océan.",
  "Un robot qui saute sur des plateformes dans la ville.",
];

function HomePage({ onSubmit }) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const moderation = moderatePrompt(prompt);
    if (!moderation.safe) {
      setError(moderation.message);
      return;
    }

    setIsLoading(true);
    // Simulate analysis time
    setTimeout(() => {
      const config = analyzePrompt(prompt);
      setIsLoading(false);
      onSubmit(config);
    }, 1500);
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 pixel-border">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl text-center text-purple-800 mb-2 font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace" }}>
          🎮 Mini Game Creator
        </h1>
        <p className="text-center text-purple-600 mb-8 text-sm"
           style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}>
          Crée ton jeu avec une phrase !
        </p>

        {/* Prompt Form */}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-bold text-purple-700 mb-2">
            ✨ Décris ton jeu en une phrase :
          </label>
          <textarea
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); setError(''); }}
            placeholder="Ex: Je veux un jeu avec un panda dans l'espace qui récupère des étoiles..."
            className="w-full p-4 border-3 border-purple-300 rounded-xl text-base resize-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            rows={3}
            maxLength={200}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {prompt.length}/200
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg pixel-btn disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span> Création en cours...
              </span>
            ) : (
              '🚀 Créer mon jeu !'
            )}
          </button>
        </form>

        {/* Examples */}
        <div className="mt-8">
          <p className="text-sm font-bold text-purple-600 mb-3">💡 Exemples d'idées :</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(ex)}
                className="text-xs bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-purple-700 hover:bg-purple-100 transition-colors text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Limits */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs font-bold text-yellow-700 mb-2">📋 Règles du créateur :</p>
          <ul className="text-xs text-yellow-600 space-y-1">
            <li>• Maximum 1 niveau</li>
            <li>• Maximum 1 personnage principal</li>
            <li>• Maximum 5 ennemis</li>
            <li>• Maximum 10 objets à collecter</li>
            <li>• Pas de contenu violent ou inapproprié</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
