import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Editor from './components/Editor';
import GamePlayer from './components/GamePlayer';
import SavePage from './components/SavePage';

function App() {
  const [step, setStep] = useState(1);
  const [gameConfig, setGameConfig] = useState(null);

  const handlePromptSubmit = (config) => {
    setGameConfig(config);
    setStep(2);
  };

  const handleEditorDone = (updatedConfig) => {
    setGameConfig(updatedConfig);
    setStep(3);
  };

  const handleBackToEdit = () => {
    setStep(2);
  };

  const handleSave = () => {
    setStep(4);
  };

  const handleBackToHome = () => {
    setStep(1);
    setGameConfig(null);
  };

  return (
    <div className="min-h-screen p-4">
      {/* Step indicator */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-center gap-2 text-xs">
          {[
            { num: 1, label: '🎨 Imagine' },
            { num: 2, label: '✏️ Personnalise' },
            { num: 3, label: '🎮 Joue' },
            { num: 4, label: '💾 Sauvegarde' },
          ].map((s) => (
            <div
              key={s.num}
              className={`px-3 py-2 rounded-lg font-bold ${
                step === s.num
                  ? 'bg-yellow-300 text-purple-900'
                  : 'bg-white/20 text-white/60'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && <HomePage onSubmit={handlePromptSubmit} />}
      {step === 2 && gameConfig && (
        <Editor config={gameConfig} onDone={handleEditorDone} onBack={handleBackToHome} />
      )}
      {step === 3 && gameConfig && (
        <GamePlayer config={gameConfig} onBack={handleBackToEdit} onSave={handleSave} />
      )}
      {step === 4 && gameConfig && (
        <SavePage config={gameConfig} onBack={() => setStep(3)} onHome={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
