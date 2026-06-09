// Game Engine - Renders and runs the mini-game on HTML5 Canvas

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

const COLLECTIBLE_COLORS = {
  forest: '#00FF88',
  space: '#FFD700',
  castle: '#FFD700',
  city: '#FFD700',
  ocean: '#00FFFF',
  india: '#FF4081',
  fantasy: '#E040FB',
};

const ENEMY_COLORS = {
  forest: '#FF4444',
  space: '#FF6600',
  castle: '#AAAAFF',
  city: '#FF0000',
  ocean: '#555555',
  india: '#00AA00',
  fantasy: '#FF4444',
};

export class GameEngine {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;
    this.running = false;
    this.gameOver = false;
    this.won = false;

    // Game state
    this.score = 0;
    this.lives = config.lives || 3;
    this.maxCollectibles = config.maxCollectibles || 10;

    // Player
    this.player = {
      x: canvas.width / 2 - 15,
      y: canvas.height / 2 - 15,
      width: 30,
      height: 30,
      speed: this.getSpeed(),
      dx: 0,
      dy: 0,
    };

    // Input
    this.keys = {};

    // Entities
    this.collectibles = [];
    this.enemies = [];
    this.particles = [];

    // Invincibility after hit
    this.invincible = false;
    this.invincibleTimer = 0;

    // Animation
    this.animFrame = 0;
    this.lastTime = 0;

    // Callbacks
    this.onScoreChange = null;
    this.onLivesChange = null;
    this.onGameOver = null;
    this.onWin = null;

    this.init();
  }

  getSpeed() {
    switch (this.config.difficulty) {
      case 'easy': return 3;
      case 'hard': return 5;
      default: return 4;
    }
  }

  getEnemySpeed() {
    switch (this.config.difficulty) {
      case 'easy': return 1;
      case 'hard': return 3;
      default: return 2;
    }
  }

  init() {
    // Generate collectibles
    for (let i = 0; i < this.maxCollectibles; i++) {
      this.collectibles.push({
        x: Math.random() * (this.canvas.width - 20) + 10,
        y: Math.random() * (this.canvas.height - 20) + 10,
        width: 16,
        height: 16,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    // Generate enemies
    const numEnemies = Math.min(this.config.maxEnemies || 5, 5);
    for (let i = 0; i < numEnemies; i++) {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      switch (side) {
        case 0: x = Math.random() * this.canvas.width; y = 0; break;
        case 1: x = this.canvas.width; y = Math.random() * this.canvas.height; break;
        case 2: x = Math.random() * this.canvas.width; y = this.canvas.height; break;
        default: x = 0; y = Math.random() * this.canvas.height; break;
      }
      this.enemies.push({
        x,
        y,
        width: 24,
        height: 24,
        dx: (Math.random() - 0.5) * this.getEnemySpeed() * 2,
        dy: (Math.random() - 0.5) * this.getEnemySpeed() * 2,
      });
    }

    // Input handlers
    this.handleKeyDown = (e) => {
      this.keys[e.key] = true;
      e.preventDefault();
    };
    this.handleKeyUp = (e) => {
      this.keys[e.key] = false;
      e.preventDefault();
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  loop() {
    if (!this.running) return;

    const now = performance.now();
    const dt = (now - this.lastTime) / 16.67; // normalize to ~60fps
    this.lastTime = now;

    this.update(dt);
    this.render();
    this.animFrame++;

    requestAnimationFrame(() => this.loop());
  }

  update(dt) {
    if (this.gameOver || this.won) return;

    // Player movement
    this.player.dx = 0;
    this.player.dy = 0;

    if (this.keys['ArrowUp'] || this.keys['z'] || this.keys['Z']) this.player.dy = -1;
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) this.player.dy = 1;
    if (this.keys['ArrowLeft'] || this.keys['q'] || this.keys['Q']) this.player.dx = -1;
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) this.player.dx = 1;

    // Normalize diagonal
    if (this.player.dx !== 0 && this.player.dy !== 0) {
      this.player.dx *= 0.707;
      this.player.dy *= 0.707;
    }

    this.player.x += this.player.dx * this.player.speed * dt;
    this.player.y += this.player.dy * this.player.speed * dt;

    // Bounds
    this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
    this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));

    // Invincibility
    if (this.invincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // Collectibles
    this.collectibles.forEach((c) => {
      if (!c.collected && this.collides(this.player, c)) {
        c.collected = true;
        this.score++;
        this.addParticles(c.x + c.width / 2, c.y + c.height / 2, COLLECTIBLE_COLORS[this.config.theme]);
        if (this.onScoreChange) this.onScoreChange(this.score);

        // Win condition
        if (this.score >= this.maxCollectibles) {
          this.won = true;
          if (this.onWin) this.onWin();
        }
      }
    });

    // Enemies
    this.enemies.forEach((e) => {
      e.x += e.dx * dt;
      e.y += e.dy * dt;

      // Bounce off walls
      if (e.x <= 0 || e.x >= this.canvas.width - e.width) e.dx *= -1;
      if (e.y <= 0 || e.y >= this.canvas.height - e.height) e.dy *= -1;

      e.x = Math.max(0, Math.min(this.canvas.width - e.width, e.x));
      e.y = Math.max(0, Math.min(this.canvas.height - e.height, e.y));

      // Collision with player
      if (!this.invincible && this.collides(this.player, e)) {
        this.lives--;
        this.invincible = true;
        this.invincibleTimer = 90; // ~1.5 seconds
        this.addParticles(this.player.x + 15, this.player.y + 15, '#FF0000');
        if (this.onLivesChange) this.onLivesChange(this.lives);

        if (this.lives <= 0) {
          this.gameOver = true;
          if (this.onGameOver) this.onGameOver();
        }
      }
    });

    // Update particles
    this.particles = this.particles.filter(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.life--;
      return p.life > 0;
    });
  }

  addParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x, y,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        life: 20 + Math.random() * 10,
        color,
        size: 3 + Math.random() * 4,
      });
    }
  }

  collides(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  render() {
    const ctx = this.ctx;
    const theme = THEME_COLORS[this.config.theme] || THEME_COLORS.fantasy;

    // Background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = theme.ground;
    ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }

    // Draw decorative elements based on theme
    this.renderThemeDecorations(ctx, theme);

    // Draw collectibles
    const collectColor = COLLECTIBLE_COLORS[this.config.theme] || '#FFD700';
    this.collectibles.forEach((c) => {
      if (c.collected) return;
      const bob = Math.sin((this.animFrame * 0.05) + c.bobOffset) * 3;
      ctx.fillStyle = collectColor;
      ctx.shadowColor = collectColor;
      ctx.shadowBlur = 8;
      // Draw pixel diamond shape
      const cx = c.x + c.width / 2;
      const cy = c.y + c.height / 2 + bob;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx + 8, cy);
      ctx.lineTo(cx, cy + 8);
      ctx.lineTo(cx - 8, cy);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw enemies
    const enemyColor = ENEMY_COLORS[this.config.theme] || '#FF4444';
    this.enemies.forEach((e) => {
      ctx.fillStyle = enemyColor;
      // Draw enemy as pixel X
      ctx.fillRect(e.x + 2, e.y + 2, 8, 8);
      ctx.fillRect(e.x + 14, e.y + 2, 8, 8);
      ctx.fillRect(e.x + 8, e.y + 8, 8, 8);
      ctx.fillRect(e.x + 2, e.y + 14, 8, 8);
      ctx.fillRect(e.x + 14, e.y + 14, 8, 8);
    });

    // Draw player
    if (!this.invincible || Math.floor(this.animFrame / 5) % 2 === 0) {
      const heroData = HERO_SPRITES[this.config.hero] || HERO_SPRITES.chat;
      ctx.fillStyle = heroData.color;
      // Draw pixel character
      const px = this.player.x;
      const py = this.player.y;
      // Body
      ctx.fillRect(px + 8, py, 14, 6); // head top
      ctx.fillRect(px + 4, py + 6, 22, 12); // body
      ctx.fillRect(px + 8, py + 18, 14, 8); // legs
      // Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(px + 10, py + 3, 4, 4);
      ctx.fillRect(px + 18, py + 3, 4, 4);
      ctx.fillStyle = '#000000';
      ctx.fillRect(px + 11, py + 4, 2, 2);
      ctx.fillRect(px + 19, py + 4, 2, 2);
      // Accent color
      ctx.fillStyle = theme.accent;
      ctx.fillRect(px + 10, py + 10, 10, 4);
    }

    // Draw particles
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  renderThemeDecorations(ctx, theme) {
    // Simple background decorations based on theme
    ctx.fillStyle = theme.accent + '22';
    const t = this.config.theme;
    if (t === 'space') {
      // Stars
      for (let i = 0; i < 30; i++) {
        const sx = (i * 137) % this.canvas.width;
        const sy = (i * 97) % this.canvas.height;
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.3 + Math.sin(this.animFrame * 0.02 + i) * 0.2;
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1;
    } else if (t === 'forest') {
      ctx.fillStyle = '#0F3D0F';
      for (let i = 0; i < 8; i++) {
        const tx = (i * 89) % this.canvas.width;
        const ty = (i * 61) % this.canvas.height;
        ctx.fillRect(tx, ty, 4, 12);
        ctx.fillRect(tx - 4, ty - 4, 12, 4);
      }
    } else if (t === 'ocean') {
      ctx.fillStyle = '#003D5C';
      for (let i = 0; i < 10; i++) {
        const bx = ((i * 73) + this.animFrame * 0.2) % this.canvas.width;
        const by = (i * 53) % this.canvas.height;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
