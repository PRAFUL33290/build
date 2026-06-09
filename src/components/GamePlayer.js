import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine } from '../game-engine/GameEngine';

function GamePlayer({ config, onBack, onSave }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.lives || 3);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost

  const startGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, config);
    engine.onScoreChange = (s) => setScore(s);
    engine.onLivesChange = (l) => setLives(l);
    engine.onWin = () => setGameState('won');
    engine.onGameOver = () => setGameState('lost');
    engine.start();

    engineRef.current = engine;
    setScore(0);
    setLives(config.lives || 3);
    setGameState('playing');
  }, [config]);

  useEffect(() => {
    startGame();
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [startGame]);

  const handleRestart = () => {
    startGame();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-4 pixel-border">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-purple-800"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}>
            🎮 {config.gameName}
          </h2>
          <div className="flex gap-4 text-xs font-bold">
            <span className="text-yellow-600">⭐ {score}/{config.maxCollectibles || 10}</span>
            <span className="text-red-500">{'❤️'.repeat(Math.max(0, lives))}</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            className="w-full rounded-lg border-4 border-purple-900"
            style={{ imageRendering: 'pixelated' }}
            tabIndex={0}
          />

          {/* Win Screen */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-green-900/80 flex flex-col items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <p className="text-4xl mb-4">🎉</p>
                <p className="text-xl font-bold mb-2" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '16px' }}>
                  VICTOIRE !
                </p>
                <p className="text-sm mb-4">Tu as récupéré tous les objets !</p>
                <p className="text-2xl mb-6">Score: {score}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold pixel-btn hover:bg-green-600"
                  >
                    🔄 Rejouer
                  </button>
                  <button
                    onClick={onSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold pixel-btn hover:bg-blue-600"
                  >
                    💾 Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <p className="text-4xl mb-4">💀</p>
                <p className="text-xl font-bold mb-2" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '16px' }}>
                  GAME OVER
                </p>
                <p className="text-sm mb-4">Tu as perdu toutes tes vies !</p>
                <p className="text-2xl mb-6">Score: {score}/{config.maxCollectibles || 10}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold pixel-btn hover:bg-red-600"
                  >
                    🔄 Réessayer
                  </button>
                  <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-bold pixel-btn hover:bg-gray-600"
                  >
                    ✏️ Modifier
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls info */}
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            🎮 Contrôles : Flèches ou ZQSD
          </div>
          <div className="text-xs text-gray-500">
            🎯 {config.winCondition}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
          >
            ← Modifier
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 py-3 px-4 bg-yellow-400 text-yellow-900 rounded-xl font-bold pixel-btn hover:bg-yellow-500"
          >
            🔄 Recommencer
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold pixel-btn hover:from-blue-500 hover:to-blue-700"
          >
            💾 Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamePlayer;
