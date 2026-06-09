// Content moderation for child safety
const BLOCKED_WORDS = [
  'kill', 'murder', 'blood', 'gore', 'death', 'die', 'dead',
  'sex', 'nude', 'porn', 'adult',
  'hate', 'racist', 'nazi',
  'drug', 'alcohol', 'smoke', 'cigarette',
  'gun', 'rifle', 'bomb', 'explosion', 'terrorist',
  'suicide', 'self-harm',
  'tuer', 'meurtre', 'sang', 'mort', 'mourir',
  'sexe', 'nu', 'porno', 'adulte',
  'haine', 'raciste',
  'drogue', 'alcool', 'fumer', 'cigarette',
  'fusil', 'bombe', 'terroriste',
  'suicide', 'automutilation',
  'politique', 'political', 'election',
];

export function moderatePrompt(prompt) {
  const lower = prompt.toLowerCase();
  const found = BLOCKED_WORDS.filter(word => lower.includes(word));
  
  if (found.length > 0) {
    return {
      safe: false,
      message: "⚠️ Ton idée contient des mots qui ne sont pas adaptés pour un jeu d'enfant. Essaie avec une autre idée plus fun ! 🎮",
      blockedWords: found,
    };
  }

  if (prompt.trim().length < 5) {
    return {
      safe: false,
      message: "✏️ Écris une phrase un peu plus longue pour décrire ton jeu !",
      blockedWords: [],
    };
  }

  return { safe: true, message: '', blockedWords: [] };
}
