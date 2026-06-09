// Generates a standalone HTML game file

const HERO_SPRITES = {
  chevalier: { color: '#C0C0C0', emoji: '⚔️' },
  panda: { color: '#000000', emoji: '🐼' },
  robot: { color: '#4A90D9', emoji: '🤖' },
  chat: { color: '#FF9900', emoji: '🐱' },
  astronaute: { color: '#FFFFFF', emoji: '🧑‍🚀' },
  princesse: { color: '#FF69B4', emoji: '👸' },
  pirate: { color: '#8B4513', emoji: '🏴‍☠️' },
  dragon: { color: '#228B22', emoji: '🐉' },
  lapin: { color: '#FFDAB9', emoji: '🐰' },
  ninja: { color: '#2F2F2F', emoji: '🥷' },
};

const THEME_COLORS = {
  forest: { bg: '#1a472a', ground: '#2d5a27', accent: '#4CAF50' },
  space: { bg: '#0a0a2a', ground: '#1a1a4a', accent: '#6C63FF' },
  castle: { bg: '#3d3d5c', ground: '#4a4a6a', accent: '#FFD700' },
  city: { bg: '#2c3e50', ground: '#34495e', accent: '#E74C3C' },
  ocean: { bg: '#006994', ground: '#004466', accent: '#00BCD4' },
  india: { bg: '#FF6F00', ground: '#E65100', accent: '#FFD54F' },
  fantasy: { bg: '#4A148C', ground: '#6A1B9A', accent: '#E040FB' },
};

export function generateGameCode(config) {
  const heroData = HERO_SPRITES[config.hero] || HERO_SPRITES.chat;
  const themeData = THEME_COLORS[config.theme] || THEME_COLORS.fantasy;
  const speed = config.difficulty === 'easy' ? 3 : config.difficulty === 'hard' ? 5 : 4;
  const enemySpeed = config.difficulty === 'easy' ? 1 : config.difficulty === 'hard' ? 3 : 2;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${config.gameName} - Mini Game Creator</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  color: white;
}
h1 { margin-bottom: 10px; font-size: 18px; }
canvas { 
  border: 4px solid #2D2B55;
  border-radius: 8px;
  image-rendering: pixelated;
}
#hud { 
  display: flex; gap: 20px; margin: 10px 0; font-size: 14px; font-weight: bold;
}
#message {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-size: 24px; font-weight: bold; text-align: center; display: none;
  background: rgba(0,0,0,0.8); padding: 30px; border-radius: 12px;
}
.container { position: relative; }
button { 
  margin-top: 10px; padding: 10px 20px; font-size: 14px; font-weight: bold;
  border: 3px solid #2D2B55; border-radius: 8px; cursor: pointer;
  background: #6C63FF; color: white;
}
button:hover { background: #5a52e0; }
</style>
</head>
<body>
<h1>🎮 ${config.gameName}</h1>
<div id="hud">
  <span>⭐ Score: <span id="score">0</span>/${config.maxCollectibles || 10}</span>
  <span id="lives">❤️❤️❤️</span>
</div>
<div class="container">
  <canvas id="game" width="640" height="400"></canvas>
  <div id="message"></div>
</div>
<button onclick="restart()">🔄 Recommencer</button>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = 640, H = 400;
const config = ${JSON.stringify({ ...config, heroColor: heroData.color, themeBg: themeData.bg, themeGround: themeData.ground, themeAccent: themeData.accent, speed, enemySpeed })};

let player, collectibles, enemies, score, lives, gameOver, won, keys, invincible, invTimer, frame;

function init() {
  player = { x: W/2-15, y: H/2-15, w: 30, h: 30 };
  collectibles = [];
  enemies = [];
  score = 0; lives = 3; gameOver = false; won = false; keys = {}; invincible = false; invTimer = 0; frame = 0;
  
  for (let i = 0; i < ${config.maxCollectibles || 10}; i++) {
    collectibles.push({ x: Math.random()*(W-20)+10, y: Math.random()*(H-20)+10, w: 16, h: 16, got: false, bob: Math.random()*6.28 });
  }
  for (let i = 0; i < ${Math.min(config.maxEnemies || 5, 5)}; i++) {
    enemies.push({ x: Math.random()*W, y: Math.random()*H, w: 24, h: 24, dx: (Math.random()-0.5)*config.enemySpeed*2, dy: (Math.random()-0.5)*config.enemySpeed*2 });
  }
  document.getElementById('message').style.display = 'none';
  updateHUD();
}

function updateHUD() {
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = '❤️'.repeat(Math.max(0,lives));
}

function collides(a, b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }

function update() {
  if (gameOver || won) return;
  let dx = 0, dy = 0;
  if (keys['ArrowUp']||keys['z']||keys['Z']) dy = -1;
  if (keys['ArrowDown']||keys['s']||keys['S']) dy = 1;
  if (keys['ArrowLeft']||keys['q']||keys['Q']) dx = -1;
  if (keys['ArrowRight']||keys['d']||keys['D']) dx = 1;
  if (dx&&dy) { dx*=0.707; dy*=0.707; }
  player.x += dx*config.speed; player.y += dy*config.speed;
  player.x = Math.max(0, Math.min(W-player.w, player.x));
  player.y = Math.max(0, Math.min(H-player.h, player.y));
  
  if (invincible) { invTimer--; if (invTimer<=0) invincible=false; }
  
  collectibles.forEach(c => {
    if (!c.got && collides(player, c)) { c.got = true; score++; updateHUD(); if (score >= ${config.maxCollectibles || 10}) { won = true; showMsg('🎉 VICTOIRE !'); } }
  });
  
  enemies.forEach(e => {
    e.x += e.dx; e.y += e.dy;
    if (e.x<=0||e.x>=W-e.w) e.dx*=-1;
    if (e.y<=0||e.y>=H-e.h) e.dy*=-1;
    e.x = Math.max(0,Math.min(W-e.w,e.x));
    e.y = Math.max(0,Math.min(H-e.h,e.y));
    if (!invincible && collides(player, e)) {
      lives--; invincible=true; invTimer=90; updateHUD();
      if (lives<=0) { gameOver=true; showMsg('💀 GAME OVER'); }
    }
  });
}

function showMsg(txt) { const m=document.getElementById('message'); m.textContent=txt; m.style.display='block'; }

function render() {
  ctx.fillStyle='${themeData.bg}'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='${themeData.ground}'; ctx.lineWidth=1;
  for(let x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  
  collectibles.forEach(c => { if(c.got) return; const bob=Math.sin(frame*0.05+c.bob)*3; ctx.fillStyle='${themeData.accent}'; ctx.beginPath(); const cx=c.x+8,cy=c.y+8+bob; ctx.moveTo(cx,cy-8);ctx.lineTo(cx+8,cy);ctx.lineTo(cx,cy+8);ctx.lineTo(cx-8,cy);ctx.closePath();ctx.fill(); });
  
  enemies.forEach(e => { ctx.fillStyle='#FF4444'; ctx.fillRect(e.x+2,e.y+2,8,8);ctx.fillRect(e.x+14,e.y+2,8,8);ctx.fillRect(e.x+8,e.y+8,8,8);ctx.fillRect(e.x+2,e.y+14,8,8);ctx.fillRect(e.x+14,e.y+14,8,8); });
  
  if(!invincible||Math.floor(frame/5)%2===0) {
    const px=player.x,py=player.y;
    ctx.fillStyle='${heroData.color}';ctx.fillRect(px+8,py,14,6);ctx.fillRect(px+4,py+6,22,12);ctx.fillRect(px+8,py+18,14,8);
    ctx.fillStyle='#FFF';ctx.fillRect(px+10,py+3,4,4);ctx.fillRect(px+18,py+3,4,4);
    ctx.fillStyle='#000';ctx.fillRect(px+11,py+4,2,2);ctx.fillRect(px+19,py+4,2,2);
    ctx.fillStyle='${themeData.accent}';ctx.fillRect(px+10,py+10,10,4);
  }
  frame++;
}

function loop() { update(); render(); requestAnimationFrame(loop); }
function restart() { init(); }

window.addEventListener('keydown', e => { keys[e.key]=true; e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key]=false; e.preventDefault(); });

init();
loop();
</script>
</body>
</html>`;
}
