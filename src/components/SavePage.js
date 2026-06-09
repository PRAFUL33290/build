import React, { useState } from 'react';
import { generateGameCode } from '../github/codeGenerator';

function SavePage({ config, onBack, onHome }) {
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState(
    config.gameName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  );
  const [adultApproved, setAdultApproved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [downloadReady, setDownloadReady] = useState(false);

  const handleDownload = () => {
    const code = generateGameCode(config);
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repoName}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadReady(true);
  };

  const handleGitHubSave = async () => {
    if (!adultApproved) {
      setError("⚠️ Un adulte doit valider avant la publication !");
      return;
    }
    if (!githubToken) {
      setError("⚠️ Un token GitHub est nécessaire.");
      return;
    }

    setSaving(true);
    setError('');

    try {
      const code = generateGameCode(config);
      const readme = generateReadme(config);

      // Create repo
      const repoResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repoName,
          description: `🎮 ${config.gameName} - Créé avec Mini Game Creator`,
          homepage: '',
          private: false,
          auto_init: true,
        }),
      });

      if (!repoResponse.ok) {
        const data = await repoResponse.json();
        throw new Error(data.message || 'Erreur lors de la création du dépôt');
      }

      const repo = await repoResponse.json();

      // Wait a moment for repo initialization
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Push index.html
      await pushFile(githubToken, repo.full_name, 'index.html', code, '🎮 Add game');
      await pushFile(githubToken, repo.full_name, 'README.md', readme, '📝 Add README');

      // Enable GitHub Pages
      try {
        await fetch(`https://api.github.com/repos/${repo.full_name}/pages`, {
          method: 'POST',
          headers: {
            Authorization: `token ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: { branch: 'main', path: '/' },
          }),
        });
      } catch (e) {
        // Pages might not be available, that's ok
      }

      setSaved(true);
    } catch (err) {
      setError(`❌ Erreur : ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 pixel-border">
        <h2 className="text-xl text-center text-purple-800 mb-6 font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '14px' }}>
          💾 Sauvegarder ton jeu
        </h2>

        {saved ? (
          <div className="text-center">
            <p className="text-6xl mb-4">🎉</p>
            <p className="text-xl font-bold text-green-600 mb-2">Jeu sauvegardé !</p>
            <p className="text-sm text-gray-600 mb-6">
              Ton jeu a été publié sur GitHub. Un adulte peut maintenant activer GitHub Pages pour le rendre jouable en ligne !
            </p>
            <button
              onClick={onHome}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold pixel-btn hover:bg-purple-600"
            >
              🏠 Créer un autre jeu
            </button>
          </div>
        ) : (
          <>
            {/* Download Option */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-700 mb-2">📥 Télécharger le jeu</h3>
              <p className="text-sm text-green-600 mb-3">
                Télécharge ton jeu en un seul fichier HTML jouable hors-ligne !
              </p>
              <button
                onClick={handleDownload}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-bold pixel-btn hover:bg-green-600"
              >
                📥 Télécharger {repoName}.html
              </button>
              {downloadReady && (
                <p className="text-xs text-green-600 mt-2 text-center">✅ Fichier téléchargé !</p>
              )}
            </div>

            {/* GitHub Option */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-700 mb-2">🐙 Publier sur GitHub</h3>
              <p className="text-sm text-blue-600 mb-3">
                Un adulte peut publier le jeu sur GitHub pour le partager en ligne.
              </p>

              <div className="mb-3">
                <label className="block text-xs font-bold text-blue-700 mb-1">
                  Nom du dépôt :
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value.replace(/[^a-z0-9-]/g, ''))}
                  className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs font-bold text-blue-700 mb-1">
                  🔑 Token GitHub (adulte) :
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  L'adulte doit créer un token avec les permissions "repo".
                </p>
              </div>

              {/* Adult Validation */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adultApproved}
                    onChange={(e) => setAdultApproved(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-xs text-yellow-700">
                    <strong>👨‍👩‍👧 Validation adulte :</strong> Je suis un adulte et j'autorise la publication de ce jeu sur GitHub. J'ai vérifié que le contenu est approprié.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              <button
                onClick={handleGitHubSave}
                disabled={!adultApproved || !githubToken || saving}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold pixel-btn hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '⏳ Publication en cours...' : '🚀 Publier sur GitHub'}
              </button>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              ← Retour au jeu
            </button>
          </>
        )}
      </div>
    </div>
  );
}

async function pushFile(token, repoFullName, path, content, message) {
  // Get existing file SHA if it exists
  let sha;
  try {
    const getResponse = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${path}`, {
      headers: { Authorization: `token ${token}` },
    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }
  } catch (e) {
    // File doesn't exist yet
  }

  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
  };
  if (sha) body.sha = sha;

  const response = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to push ${path}`);
  }
}

function generateReadme(config) {
  return `# 🎮 ${config.gameName}

Un mini-jeu créé avec **Mini Game Creator** !

## 🎯 Objectif
${config.winCondition}

## 🎮 Comment jouer
- Utilise les **flèches directionnelles** ou **ZQSD** pour te déplacer
- Récupère tous les objets tout en évitant les ennemis
- Tu as **${config.lives} vies** !

## 📋 Détails
- **Type** : ${config.gameType}
- **Héros** : ${config.hero}
- **Décor** : ${config.theme}
- **Difficulté** : ${config.difficulty}

## 🛠️ Créé avec
[Mini Game Creator](https://github.com) - Crée ton jeu avec une phrase !

---
*Ce jeu a été créé par un enfant avec l'aide d'un adulte.* 👨‍👩‍👧
`;
}

export default SavePage;
