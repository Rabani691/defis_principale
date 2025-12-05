  "use client"; 

import React, { useEffect, useRef, useState, useCallback } from 'react';
 
const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  PLAYER_SPEED: 6,
  BULLET_SPEED: 10,
  ENEMY_BASE_SPEED: 1.5,
  SPAWN_RATE: 2000, // ms between spawns
  POWERUP_DURATION: 5000,
  MEME_CYCLE_TIME: 10000,
};

 // Types d’ennemis avec humour sur Windows/Mac
const ENEMY_TYPES = [
  { name: 'ADS', label: 'PUBS', emoji: '📢', color: '#ff6b6b', points: 10, health: 1, speed: 1, 
    deathQuip: '"Votre période d’essai est terminée !"' },

  { name: 'FORCE UPDATES', label: 'MAJ\nFORCÉES', emoji: '🔄', color: '#ffd93d', points: 15, health: 1, speed: 0.8, 
    deathQuip: '"Mise à jour… non je rigole, vive la liberté !"' },

  { name: 'LICENSE', label: 'LICENCE', emoji: '📜', color: '#ff9f43', points: 20, health: 2, speed: 0.7, 
    deathQuip: '"Pas de licence ? Pas de souci avec le Libre !"' },

  { name: 'VULNERABILITY', label: 'VULN', emoji: '🔓', color: '#ee5a5a', points: 25, health: 2, speed: 0.6, 
    deathQuip: '"Corrigé par la communauté !"' },

  { name: 'DRM', label: 'DRM', emoji: '🔒', color: '#a55eea', points: 25, health: 2, speed: 0.6, 
    deathQuip: '"DRM ? Plutôt DRMeh…"' },

  { name: 'BIG UPDATE', label: 'MAJ\n40GB', emoji: '💾', color: '#5f27cd', points: 30, health: 3, speed: 0.5, 
    deathQuip: '"Mise à jour de 40GB REFUSÉE !"' },

  { name: 'APPLE TAX', label: 'APPLE\nTAX', emoji: '💸', color: '#00d2d3', points: 35, health: 3, speed: 0.5, 
    deathQuip: '"Apple Tax ? Plutôt Crapple Tax !"' },

  { name: 'BLOATWARE', label: 'BOUFFE\nRAM', emoji: '🗑️', color: '#ff6348', points: 40, health: 4, speed: 0.4, 
    deathQuip: '"Bloat ? sudo rm -rf !"' },

  { name: 'BSOD', label: 'BSOD', emoji: '💀', color: '#0078d4', points: 50, health: 5, speed: 0.3, 
    deathQuip: '"Écran bleu de la MORT… ou de l’ENNUI !"'},
];

// Types de power-ups
const POWERUP_TYPES = [
  { name: 'PackageManager', emoji: '📦', effect: 'fireRate', 
    description: 'apt-get install dakka !' },

  { name: 'CommunityPatch', emoji: '🛡️', effect: 'shield', 
    description: 'Bouclier communautaire activé !' },

  { name: 'RefurbishedParts', emoji: '🔧', effect: 'ram', 
    description: '+RAM grâce au réemploi !' },

  { name: 'OpenSourceLove', emoji: '❤️', effect: 'health', 
    description: 'Le Libre guérit tout !' },
];

// Seuils d'amélioration
const UPGRADE_THRESHOLDS = [
  { score: 100, type: 'ram', value: '8 Go', 
    quip: 'Amélioration RAM ! Plus d’onglets = plus de puissance !' },

  { score: 300, type: 'disk', value: 'SSD', 
    quip: 'SSD installé ! Démarrage ultra-rapide !' },

  { score: 600, type: 'cpu', value: 'Double Cœur', 
    quip: 'CPU amélioré ! Le multitâche décolle !' },

  { score: 1000, type: 'ram', value: '16 Go', 
    quip: 'ENCORE PLUS de RAM ! Chrome peut venir !' },

  { score: 1500, type: 'cpu', value: 'Quad Core', 
    quip: 'Quad Core ! Puissance maximale du manchot !' },

  { score: 2500, type: 'gpu', value: 'Intégrée', 
    quip: 'GPU activé ! Le gaming sous Linux commence !' },
];

// Memes affichés
const MEME_CAPTIONS = [
  { text: 'J’utilise Arch btw', emoji: '🐧' },
  { text: 'sudo fais-moi un sandwich', emoji: '🥪' },
  { text: 'rm -rf windows/', emoji: '🗑️' },
  { text: 'Linux est gratuit… si ton temps ne compte pas 😅', emoji: '⏰' },
  { text: 'C’est l’année du bureau Linux !', emoji: '🎉' },
  { text: 'Ça marche sur MA machine', emoji: '🤷' },
  { text: 'As-tu essayé de l’éteindre et rallumer ?', emoji: '🔌' },
  { text: 'GNU/Linux intensifie', emoji: '🦬' },
  { text: 'Au fait, j’ai compilé mon noyau', emoji: '⚙️' },
  { text: 'Tux > Le pingouin de Windows', emoji: '🏆' },
];

// ============================================================================
// GAME TYPES
// ============================================================================

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Player extends GameObject {
  health: number;
  maxHealth: number;
  shield: boolean;
  fireRate: number;
}

interface Bullet extends GameObject {
  speed: number;
}

interface Enemy extends GameObject {
  type: typeof ENEMY_TYPES[number];
  health: number;
  speed: number;
}

interface PowerUp extends GameObject {
  type: typeof POWERUP_TYPES[number];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface GameState {
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  powerups: PowerUp[];
  particles: Particle[];
  score: number;
  level: number;
  communityPoints: number;
  pcStats: {
    ram: string;
    disk: string;
    cpu: string;
    gpu: string;
  };
  gameOver: boolean;
  paused: boolean;
  currentMeme: typeof MEME_CAPTIONS[number];
  lastQuip: string;
  quipTimer: number;
  upgradeAnimation: string | null;
}

// ============================================================================
// MAIN GAME COMPONENT
// ============================================================================

const TuxResistance: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const lastSpawnRef = useRef<number>(0);
  const lastShotRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const memeTimerRef = useRef<number>(0);
  
  const [displayState, setDisplayState] = useState({
    score: 0,
    level: 1,
    health: 100,
    ram: '4 GB',
    disk: 'HDD',
    cpu: 'Single Core',
    gpu: 'None',
    communityPoints: 0,
    meme: MEME_CAPTIONS[0],
    quip: '',
    gameOver: false,
    upgradeAnimation: null as string | null,
  });

  // Initialize game state
  const initGame = useCallback((): GameState => {
    return {
      player: {
        x: GAME_CONFIG.WIDTH / 2 - 25,
        y: GAME_CONFIG.HEIGHT - 80,
        width: 50,
        height: 50,
        health: 100,
        maxHealth: 100,
        shield: false,
        fireRate: 1,
      },
      bullets: [],
      enemies: [],
      powerups: [],
      particles: [],
      score: 0,
      level: 1,
      communityPoints: 0,
      pcStats: {
        ram: '4 GB',
        disk: 'HDD',
        cpu: 'Single Core',
        gpu: 'None',
      },
      gameOver: false,
      paused: false,
      currentMeme: MEME_CAPTIONS[0],
      lastQuip: '',
      quipTimer: 0,
      upgradeAnimation: null,
    };
  }, []);

  // Spawn enemy
  const spawnEnemy = useCallback((state: GameState, now: number) => {
    if (now - lastSpawnRef.current < GAME_CONFIG.SPAWN_RATE / state.level) return;
    
    const availableTypes = ENEMY_TYPES.filter((_, i) => i < ENEMY_TYPES.length);
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    state.enemies.push({
      x: Math.random() * (GAME_CONFIG.WIDTH - 40),
      y: -50,
      width: 40,
      height: 40,
      type,
      health: type.health,
      speed: type.speed * GAME_CONFIG.ENEMY_BASE_SPEED * (1 + state.level * 0.1),
    });
    
    lastSpawnRef.current = now;
  }, []);

  // Spawn powerup (10% chance when enemy dies)
  const maybeSpawnPowerup = useCallback((x: number, y: number, state: GameState) => {
    if (Math.random() > 0.1) return;
    
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    state.powerups.push({
      x,
      y,
      width: 30,
      height: 30,
      type,
    });
  }, []);

  // Create explosion particles
  const createExplosion = useCallback((x: number, y: number, state: GameState, color: string) => {
    for (let i = 0; i < 10; i++) {
      state.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
        color,
        size: Math.random() * 4 + 2,
      });
    }
  }, []);

  // Check collision
  const checkCollision = (a: GameObject, b: GameObject): boolean => {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  };

  // Check upgrades
  const checkUpgrades = useCallback((state: GameState) => {
    for (const upgrade of UPGRADE_THRESHOLDS) {
      if (state.score >= upgrade.score) {
        const currentValue = state.pcStats[upgrade.type as keyof typeof state.pcStats];
        if (currentValue !== upgrade.value) {
          state.pcStats[upgrade.type as keyof typeof state.pcStats] = upgrade.value;
          state.lastQuip = upgrade.quip;
          state.quipTimer = 180;
          state.upgradeAnimation = upgrade.type;
          setTimeout(() => {
            if (gameStateRef.current) {
              gameStateRef.current.upgradeAnimation = null;
            }
          }, 2000);
        }
      }
    }
  }, []);

  // Shoot bullet
  const shoot = useCallback((state: GameState, now: number) => {
    const cooldown = 200 / state.player.fireRate;
    if (now - lastShotRef.current < cooldown) return;
    
    state.bullets.push({
      x: state.player.x + state.player.width / 2 - 3,
      y: state.player.y,
      width: 6,
      height: 15,
      speed: GAME_CONFIG.BULLET_SPEED,
    });
    
    lastShotRef.current = now;
  }, []);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const state = gameStateRef.current;
    
    if (!canvas || !ctx || !state || state.gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const keys = keysRef.current;

    // Update meme
    if (timestamp - memeTimerRef.current > GAME_CONFIG.MEME_CYCLE_TIME) {
      state.currentMeme = MEME_CAPTIONS[Math.floor(Math.random() * MEME_CAPTIONS.length)];
      memeTimerRef.current = timestamp;
    }

    // Decrease quip timer
    if (state.quipTimer > 0) state.quipTimer--;

    // Player movement
    if ((keys.has('arrowleft') || keys.has('a')) && state.player.x > 0) {
      state.player.x -= GAME_CONFIG.PLAYER_SPEED;
    }
    if ((keys.has('arrowright') || keys.has('d')) && state.player.x < GAME_CONFIG.WIDTH - state.player.width) {
      state.player.x += GAME_CONFIG.PLAYER_SPEED;
    }
    
    // Shooting
    if (keys.has(' ') || keys.has('space')) {
      shoot(state, timestamp);
    }

    // Spawn enemies
    spawnEnemy(state, timestamp);

    // Update bullets
    state.bullets = state.bullets.filter(bullet => {
      bullet.y -= bullet.speed;
      return bullet.y > -bullet.height;
    });

    // Update enemies
    state.enemies = state.enemies.filter(enemy => {
      enemy.y += enemy.speed;
      
      // Check if enemy reached bottom
      if (enemy.y > GAME_CONFIG.HEIGHT) {
        state.player.health -= 10;
        return false;
      }
      
      // Check collision with player
      if (checkCollision(enemy, state.player)) {
        if (state.player.shield) {
          state.player.shield = false;
          createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, state, '#00ffff');
          state.lastQuip = 'Shield blocked! Community saves the day!';
          state.quipTimer = 120;
          return false;
        }
        state.player.health -= 25;
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, state, '#ff0000');
        return false;
      }
      
      return true;
    });

    // Check bullet-enemy collisions
    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const bullet = state.bullets[i];
      for (let j = state.enemies.length - 1; j >= 0; j--) {
        const enemy = state.enemies[j];
        if (checkCollision(bullet, enemy)) {
          enemy.health--;
          state.bullets.splice(i, 1);
          
          if (enemy.health <= 0) {
            state.score += enemy.type.points;
            state.communityPoints += Math.floor(enemy.type.points / 5);
            state.lastQuip = enemy.type.deathQuip;
            state.quipTimer = 90;
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, state, '#00ff41');
            maybeSpawnPowerup(enemy.x, enemy.y, state);
            state.enemies.splice(j, 1);
            
            // Level up every 200 points
            const newLevel = Math.floor(state.score / 200) + 1;
            if (newLevel > state.level) {
              state.level = newLevel;
              state.lastQuip = `Level ${newLevel}! The penguin grows stronger!`;
              state.quipTimer = 150;
            }
          }
          break;
        }
      }
    }

    // Update powerups
    state.powerups = state.powerups.filter(powerup => {
      powerup.y += 2;
      
      if (checkCollision(powerup, state.player)) {
        state.lastQuip = powerup.type.description;
        state.quipTimer = 120;
        
        switch (powerup.type.effect) {
          case 'fireRate':
            state.player.fireRate = 3;
            setTimeout(() => {
              if (gameStateRef.current) gameStateRef.current.player.fireRate = 1;
            }, GAME_CONFIG.POWERUP_DURATION);
            break;
          case 'shield':
            state.player.shield = true;
            break;
          case 'ram':
            state.communityPoints += 50;
            break;
          case 'health':
            state.player.health = Math.min(state.player.maxHealth, state.player.health + 25);
            break;
        }
        return false;
      }
      
      return powerup.y < GAME_CONFIG.HEIGHT;
    });

    // Update particles
    state.particles = state.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      return particle.life > 0;
    });

    // Check upgrades
    checkUpgrades(state);

    // Check game over
    if (state.player.health <= 0) {
      state.gameOver = true;
    }

    // Clear and draw
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_CONFIG.WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_CONFIG.HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < GAME_CONFIG.HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_CONFIG.WIDTH, y);
      ctx.stroke();
    }

    // Draw particles
    state.particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life / 30;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      ctx.globalAlpha = 1;
    });

    // Draw bullets
    ctx.fillStyle = '#00ff41';
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 10;
    state.bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    ctx.shadowBlur = 0;

    // Draw enemies as text labels
    state.enemies.forEach(enemy => {
      const enemyType = enemy.type as typeof ENEMY_TYPES[number];
      const boxWidth = 70;
      const boxHeight = 40;
      
      // Draw background box
      ctx.fillStyle = enemyType.color || '#ff6b6b';
      ctx.shadowColor = enemyType.color || '#ff6b6b';
      ctx.shadowBlur = 10;
      ctx.fillRect(enemy.x - 15, enemy.y, boxWidth, boxHeight);
      ctx.shadowBlur = 0;
      
      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(enemy.x - 15, enemy.y, boxWidth, boxHeight);
      
      // Draw text label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const label = enemyType.label || enemyType.name;
      const lines = label.split('\n');
      const lineHeight = 12;
      const startY = enemy.y + boxHeight / 2 - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, enemy.x - 15 + boxWidth / 2, startY + index * lineHeight);
      });
      
      // Health bar
      if (enemy.type.health > 1) {
        const healthPercent = enemy.health / enemy.type.health;
        ctx.fillStyle = '#333';
        ctx.fillRect(enemy.x - 15, enemy.y - 8, boxWidth, 4);
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff41' : '#ff4444';
        ctx.fillRect(enemy.x - 15, enemy.y - 8, boxWidth * healthPercent, 4);
      }
    });

    // Draw powerups
    ctx.font = '24px Arial';
    state.powerups.forEach(powerup => {
      ctx.fillText(powerup.type.emoji, powerup.x + powerup.width / 2, powerup.y + powerup.height - 5);
    });

    // Draw player
    ctx.font = '48px Arial';
    ctx.fillText('🐧', state.player.x + state.player.width / 2, state.player.y + state.player.height - 5);
    
    // Draw shield if active
    if (state.player.shield) {
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Update display state for React UI
    setDisplayState({
      score: state.score,
      level: state.level,
      health: state.player.health,
      ram: state.pcStats.ram,
      disk: state.pcStats.disk,
      cpu: state.pcStats.cpu,
      gpu: state.pcStats.gpu,
      communityPoints: state.communityPoints,
      meme: state.currentMeme,
      quip: state.quipTimer > 0 ? state.lastQuip : '',
      gameOver: state.gameOver,
      upgradeAnimation: state.upgradeAnimation,
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [shoot, spawnEnemy, createExplosion, maybeSpawnPowerup, checkUpgrades]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === ' ') e.preventDefault();
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle mouse click for shooting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = () => {
      if (gameStateRef.current && !gameStateRef.current.gameOver) {
        shoot(gameStateRef.current, performance.now());
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [shoot]);

  // Initialize and start game
  useEffect(() => {
    gameStateRef.current = initGame();
    memeTimerRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initGame, gameLoop]);

  // Restart game
  const restartGame = () => {
    gameStateRef.current = initGame();
    memeTimerRef.current = performance.now();
    setDisplayState(prev => ({ ...prev, gameOver: false }));
  };

  return (
<div className="relative flex flex-col items-center justify-center min-h-screen p-4 scanlines crt-flicker">
  {/* Titre */}
    {/* Titre */}
  <h1 className="font-pixel text-center text-sm md:text-base text-black text-primary mb-4">
    <span className="block font-bold text-cyan-500 mb-1">
      Lève-toi, Guerrier Pingouin !
    </span>
    <span className="block text-slate-700">
      Le monde se noie sous les pubs, les mises à jour forcées et les licences hors de prix.
    </span>
    <span className="block text-slate-600 italic">
      Toi seul peux restaurer la liberté numérique.
    </span>
  </h1>


  <div className="flex flex-col lg:flex-row gap-4 items-start">
    {/* HUD gauche */}
    <div className="hud-panel rounded-lg p-4 w-full lg:w-48 space-y-3 bg-black">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">
        Spécifications du PC Scolaire
      </div>

      <div className="space-y-2">
        <StatDisplay 
          label="RAM" 
          value={displayState.ram} 
          highlight={displayState.upgradeAnimation === 'ram'} 
        />
        <StatDisplay 
          label="Disque" 
          value={displayState.disk} 
          highlight={displayState.upgradeAnimation === 'disk'} 
        />
        <StatDisplay 
          label="CPU" 
          value={displayState.cpu} 
          highlight={displayState.upgradeAnimation === 'cpu'} 
        />
        <StatDisplay 
          label="GPU" 
          value={displayState.gpu} 
          highlight={displayState.upgradeAnimation === 'gpu'} 
        />
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Santé</span>
          <span className="text-primary">{displayState.health}%</span>
        </div>
        <div className="stat-bar h-2 rounded mt-1">
          <div 
            className="stat-bar-fill h-full rounded transition-all duration-300"
            style={{ width: `${displayState.health}%` }}
          />
        </div>
      </div>
    </div>

    {/* Canvas du jeu */}
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.WIDTH}
        height={GAME_CONFIG.HEIGHT}
        className="retro-border rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* Quip / réplique drôle */}
      {displayState.quip && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/90 border border-primary/50 rounded px-4 py-2 text-sm text-primary text-glow animate-float">
          {displayState.quip}
        </div>
      )}

      {/* Écran Game Over */}
      {displayState.gameOver && (
        <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center rounded-lg">
          <h2 className="font-pixel text-2xl text-destructive mb-4">CRASH SYSTÈME !</h2>
          <p className="text-foreground mb-2">Score final : {displayState.score}</p>
          <p className="text-muted-foreground text-sm mb-4 max-w-md text-center px-4">
            💡 Astuce : Avec NIRD, passer à Linux permet d’économiser et de faire durer le matériel. 
            Plus de mises à jour forcées ou de licences hors de prix !
          </p>
          <button
            onClick={restartGame}
            className="bg-primary bg-blue-500 text-white px-6 py-2 rounded font-pixel text-xs hover:bg-primary/80 transition-colors"
          >
            REDÉMARRER
          </button>
        </div>
      )}
    </div>

    {/* HUD droite */}
    <div className="hud-panel rounded-lg p-4 w-full bg-black lg:w-48 space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground uppercase">Score</span>
          <span className="font-pixel text-sm text-primary text-glow">{displayState.score}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground uppercase">Niveau</span>
          <span className="font-pixel text-sm text-secondary text-glow-cyan">{displayState.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground uppercase">Communauté</span>
          <span className="font-pixel text-sm text-accent">{displayState.communityPoints}</span>
        </div>
      </div>

      {/* Meme du moment */}
      <div className="border-t border-border pt-3">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Mème du Moment
        </div>
        <div className="bg-muted/50 rounded p-2 text-center">
          <div className="text-2xl mb-1">{displayState.meme.emoji}</div>
          <div className="text-xs text-foreground">{displayState.meme.text}</div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="border-t border-border pt-3">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Contrôles</div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>← → ou A/D : Se déplacer</div>
          <div>ESPACE / Clic : Tirer</div>
        </div>
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="mt-4 text-xs text-black text-center">
    <span className="text-primary">🐧</span> Propulsé par l’Open Source & l’Amour de la Communauté <span className="text-primary">🐧</span>
    <br />
  </div>
</div>

  );
};

// Stat display component
const StatDisplay: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ 
  label, 
  value, 
  highlight 
}) => (
  <div className={`flex justify-between text-sm ${highlight ? 'animate-pulse' : ''}`}>
    <span className="text-muted-foreground">{label}</span>
    <span className={highlight ? 'text-accent font-bold' : 'text-foreground'}>{value}</span>
  </div>
);

export default TuxResistance;
