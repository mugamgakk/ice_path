import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';
import type { GridPosition, PathTile, GameState, PlayerState } from '../types/GameTypes';

export class GamePlayScene extends Phaser.Scene {
  private grid: PathTile[][] = [];
  private player!: Phaser.GameObjects.Image;
  private playerState!: PlayerState;
  private gameState!: GameState;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private path: GridPosition[] = [];
  private startPos!: GridPosition;
  private endPos!: GridPosition;
  private scoreText!: Phaser.GameObjects.Text;
  private isPathRevealed: boolean = true;
  private snowParticles: Phaser.GameObjects.Rectangle[] = [];
  private timerBar!: Phaser.GameObjects.Rectangle;
  private pathRevealTimer?: Phaser.Time.TimerEvent;
  private skipText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GamePlay' });
  }

  init(data: { level: number; score: number }) {
    this.gameState = {
      level: data.level || 1,
      score: data.score || 0,
      lives: 3,
      currentGridSize: Math.min(GAME_CONFIG.INITIAL_GRID_SIZE + Math.floor((data.level - 1) / 2), GAME_CONFIG.MAX_GRID_SIZE),
      pathRevealTime: Math.max(
        GAME_CONFIG.PATH_REVEAL_TIME - (data.level - 1) * GAME_CONFIG.DIFFICULTY.TIME_DECREASE_PER_LEVEL,
        GAME_CONFIG.DIFFICULTY.MIN_REVEAL_TIME
      )
    };
  }

  preload() {
    // Textures should already be created in Preloader
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fade in effect
    this.cameras.main.fadeIn(500, 255, 255, 255);

    // Create winter background
    this.createBackground();
    this.createSnowEffect();

    // UI with winter theme
    this.createUI();

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.generateGrid();
    this.generatePath();
    this.createPlayer();
    this.revealPath();

    // Add skip instruction
    this.skipText = this.add.text(
      width / 2,
      height - 50,
      '스페이스바: 바로 시작',
      {
        fontSize: '20px',
        color: '#FFE082',
        stroke: '#0D47A1',
        strokeThickness: 3
      }
    );
    this.skipText.setOrigin(0.5);
    this.skipText.setDepth(100);

    // Pulsing animation for skip text
    this.tweens.add({
      targets: this.skipText,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Set up path reveal timer
    this.pathRevealTimer = this.time.delayedCall(this.gameState.pathRevealTime, () => {
      this.startGame();
    });

    // Listen for spacebar during path reveal
    this.input.keyboard!.on('keydown-SPACE', () => {
      if (this.isPathRevealed && !this.playerState.canMove) {
        this.skipPathReveal();
      }
    });
  }

  private skipPathReveal() {
    if (this.pathRevealTimer) {
      this.pathRevealTimer.remove();
    }

    // Immediately hide timer bar
    if (this.timerBar) {
      this.tweens.killTweensOf(this.timerBar);
      this.timerBar.setVisible(false);
    }

    this.startGame();
  }

  private startGame() {
    this.hidePath();
    this.isPathRevealed = false;
    this.playerState.canMove = true;

    // Hide skip text
    if (this.skipText) {
      this.skipText.setVisible(false);
    }

    // Show ready message
    const readyText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      '시작!',
      {
        fontSize: '48px',
        color: '#64B5F6',
        stroke: '#0D47A1',
        strokeThickness: 6
      }
    );
    readyText.setOrigin(0.5);
    readyText.setDepth(100);

    this.tweens.add({
      targets: readyText,
      alpha: 0,
      scale: 1.5,
      duration: 500,
      onComplete: () => {
        readyText.destroy();
      }
    });
  }

  private createBackground() {
    const { width, height } = this.cameras.main;

    // Create gradient background
    for (let i = 0; i < 10; i++) {
      const y = (height / 10) * i;
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(GAME_CONFIG.COLORS.BACKGROUND_TOP),
        Phaser.Display.Color.ValueToColor(GAME_CONFIG.COLORS.BACKGROUND_BOTTOM),
        10,
        i
      );
      const rect = this.add.rectangle(
        width / 2,
        y + height / 20,
        width,
        height / 10,
        Phaser.Display.Color.GetColor(color.r, color.g, color.b)
      );
      rect.setDepth(-20);
    }
  }

  private createSnowEffect() {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-height, height);
      const size = Phaser.Math.Between(1, 3);
      const speed = Phaser.Math.Between(20, 40);

      const snowflake = this.add.rectangle(x, y, size, size, 0xFFFFFF, 0.6);
      snowflake.setDepth(-10);

      this.tweens.add({
        targets: snowflake,
        y: height + 10,
        x: x + Phaser.Math.Between(-30, 30),
        duration: (height - y) * (100 / speed),
        repeat: -1,
        onRepeat: () => {
          snowflake.x = Phaser.Math.Between(0, width);
          snowflake.y = -10;
        }
      });

      this.snowParticles.push(snowflake);
    }
  }

  private createUI() {
    const { width } = this.cameras.main;

    // Level text with ice effect
    this.add.text(30, 30, `❄ 레벨 ${this.gameState.level}`, {
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#0D47A1',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: 'rgba(13, 71, 161, 0.3)',
        blur: 4,
        fill: true
      }
    });

    // Score text with crystal effect
    this.scoreText = this.add.text(30, 70, `💎 점수: ${this.gameState.score}`, {
      fontSize: '24px',
      color: '#FFE082',
      stroke: '#0D47A1',
      strokeThickness: 3
    });

    // Timer bar
    const timerBarBg = this.add.rectangle(width / 2, 30, 200, 20, 0x000000, 0.3);
    timerBarBg.setStrokeStyle(2, 0xFFFFFF, 0.5);

    this.timerBar = this.add.rectangle(width / 2, 30, 196, 16, 0x64B5F6);

    this.tweens.add({
      targets: this.timerBar,
      scaleX: 0,
      duration: this.gameState.pathRevealTime,
      ease: 'Linear'
    });
  }

  private generateGrid() {
    const { width, height } = this.cameras.main;
    const gridSize = this.gameState.currentGridSize;
    const startX = (width - gridSize * GAME_CONFIG.TILE_SIZE) / 2;
    const startY = (height - gridSize * GAME_CONFIG.TILE_SIZE) / 2 + 20;

    this.grid = [];

    for (let y = 0; y < gridSize; y++) {
      this.grid[y] = [];
      for (let x = 0; x < gridSize; x++) {
        const tileX = startX + x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;
        const tileY = startY + y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;

        // Create ice tile using texture
        const tile = this.add.image(tileX, tileY, 'ice-tile');
        tile.setDisplaySize(GAME_CONFIG.TILE_SIZE - 4, GAME_CONFIG.TILE_SIZE - 4);

        this.grid[y][x] = {
          position: { x, y },
          sprite: tile,
          isPath: false,
          isRevealed: false,
          isBroken: false
        };

        // Add shimmer effect randomly
        if (Math.random() > 0.7) {
          this.time.delayedCall(Phaser.Math.Between(0, 3000), () => {
            if (!this.grid[y][x].isBroken) {
              this.createTileShimmer(tileX, tileY);
            }
          });
        }
      }
    }
  }

  private generatePath() {
    const gridSize = this.gameState.currentGridSize;

    this.startPos = { x: 0, y: Math.floor(gridSize / 2) };
    this.endPos = { x: gridSize - 1, y: Math.floor(gridSize / 2) };

    this.path = [];
    const visited = new Set<string>();
    const stack: GridPosition[] = [this.startPos];
    visited.add(`${this.startPos.x},${this.startPos.y}`);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      this.path.push(current);

      if (current.x === this.endPos.x && current.y === this.endPos.y) {
        break;
      }

      const neighbors = this.getValidNeighbors(current, visited, gridSize);

      if (neighbors.length > 0) {
        const next = Phaser.Math.RND.pick(neighbors);
        visited.add(`${next.x},${next.y}`);
        stack.push(next);
      } else {
        stack.pop();
        this.path.pop();
      }
    }

    this.path.forEach(pos => {
      this.grid[pos.y][pos.x].isPath = true;
    });
  }

  private getValidNeighbors(pos: GridPosition, visited: Set<string>, gridSize: number): GridPosition[] {
    const neighbors: GridPosition[] = [];
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];

    for (const dir of directions) {
      const newX = pos.x + dir.x;
      const newY = pos.y + dir.y;

      if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        const key = `${newX},${newY}`;
        if (!visited.has(key)) {
          if (newX === this.endPos.x && newY === this.endPos.y) {
            return [{ x: newX, y: newY }];
          }
          neighbors.push({ x: newX, y: newY });
        }
      }
    }

    return neighbors;
  }

  private createPlayer() {
    const startTile = this.grid[this.startPos.y][this.startPos.x];


    // Create image with penguin texture
    if (this.textures.exists('penguin-down')) {
      try {
        // Create character image with larger size and proper centering
        this.player = this.add.image(startTile.sprite!.x, startTile.sprite!.y, 'penguin-down') as any;
        this.player.setDisplaySize(GAME_CONFIG.TILE_SIZE * 0.8, GAME_CONFIG.TILE_SIZE * 0.8); // 80% of tile size
        this.player.setOrigin(0.5, 0.5); // Ensure proper centering
        this.player.setDepth(10);
      } catch (error) {
        // Fallback: create a simple colored circle
        this.player = this.add.circle(startTile.sprite!.x, startTile.sprite!.y, GAME_CONFIG.TILE_SIZE * 0.3, 0x00FF00) as any;
        this.player.setDepth(10);
      }
    } else {
      // Fallback: create a simple colored rectangle
      this.player = this.add.rectangle(startTile.sprite!.x, startTile.sprite!.y, GAME_CONFIG.TILE_SIZE * 0.6, GAME_CONFIG.TILE_SIZE * 0.6, 0xFF0000) as any;
      this.player.setDepth(10);
    }

    this.playerState = {
      gridPosition: { ...this.startPos },
      isMoving: false,
      isJumping: false,
      canMove: false,
      facing: 'down'
    };

    // Add idle breathing animation
    this.tweens.add({
      targets: this.player,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
  }

  private revealPath() {
    this.path.forEach(pos => {
      const tile = this.grid[pos.y][pos.x];
      if (tile.sprite) {
        const image = tile.sprite as Phaser.GameObjects.Image;
        image.setTexture('safe-path-tile');
        tile.isRevealed = true;

        // Add glow effect to path tiles
        this.tweens.add({
          targets: tile.sprite,
          alpha: 0.7,
          duration: 500,
          yoyo: true,
          repeat: 2
        });
      }
    });

    // Mark start and end
    const startTile = this.grid[this.startPos.y][this.startPos.x].sprite;
    const endTile = this.grid[this.endPos.y][this.endPos.x].sprite;

    if (startTile) {
      const startLabel = this.add.text(startTile.x, startTile.y, '🏁', {
        fontSize: '32px'
      });
      startLabel.setOrigin(0.5);
      startLabel.setDepth(5);

      this.time.delayedCall(this.gameState.pathRevealTime, () => {
        startLabel.destroy();
      });
    }

    if (endTile) {
      const endLabel = this.add.text(endTile.x, endTile.y, '🏆', {
        fontSize: '32px'
      });
      endLabel.setOrigin(0.5);
      endLabel.setDepth(5);
    }
  }

  private hidePath() {
    this.grid.forEach(row => {
      row.forEach(tile => {
        if (tile.sprite && !tile.isBroken) {
          const image = tile.sprite as Phaser.GameObjects.Image;
          image.setTexture('ice-tile');
          tile.isRevealed = false;
        }
      });
    });
  }

  private createTileShimmer(x: number, y: number) {
    const shimmer = this.add.rectangle(x, y, GAME_CONFIG.TILE_SIZE - 20, GAME_CONFIG.TILE_SIZE - 20, 0xFFFFFF, 0);
    shimmer.setDepth(1);

    this.tweens.add({
      targets: shimmer,
      alpha: 0.3,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        shimmer.destroy();
      }
    });
  }

  update() {
    if (!this.playerState.canMove || this.playerState.isMoving) return;

    let moveX = 0;
    let moveY = 0;
    let isJump = false;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      moveX = -1;
      this.playerState.facing = 'left';
      this.player.setTexture(`penguin-${this.playerState.facing}`);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      moveX = 1;
      this.playerState.facing = 'right';
      this.player.setTexture(`penguin-${this.playerState.facing}`);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      moveY = -1;
      this.playerState.facing = 'up';
      this.player.setTexture(`penguin-${this.playerState.facing}`);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      moveY = 1;
      this.playerState.facing = 'down';
      this.player.setTexture(`penguin-${this.playerState.facing}`);
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && (moveX !== 0 || moveY !== 0)) {
      isJump = true;
    }

    if (moveX !== 0 || moveY !== 0) {
      const jumpMultiplier = isJump ? 2 : 1;
      this.movePlayer(moveX * jumpMultiplier, moveY * jumpMultiplier, isJump);
    }
  }

  private movePlayer(dx: number, dy: number, isJump: boolean) {
    const newX = this.playerState.gridPosition.x + dx;
    const newY = this.playerState.gridPosition.y + dy;
    const gridSize = this.gameState.currentGridSize;

    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
      return;
    }

    const targetTile = this.grid[newY][newX];

    if (targetTile.isBroken) {
      return;
    }

    this.playerState.isMoving = true;
    this.playerState.isJumping = isJump;

    const jumpHeight = isJump ? -40 : 0;

    this.tweens.add({
      targets: this.player,
      x: targetTile.sprite!.x,
      y: targetTile.sprite!.y + jumpHeight,
      duration: GAME_CONFIG.PLAYER_MOVE_DURATION / 2,
      ease: 'Power2',
      onComplete: () => {
        if (isJump) {
          this.tweens.add({
            targets: this.player,
            y: targetTile.sprite!.y,
            duration: GAME_CONFIG.PLAYER_MOVE_DURATION / 2,
            ease: 'Bounce.out',
            onComplete: () => {
              this.onPlayerLand(newX, newY);
            }
          });
        } else {
          this.onPlayerLand(newX, newY);
        }
      }
    });

    this.playerState.gridPosition = { x: newX, y: newY };
  }

  private onPlayerLand(x: number, y: number) {
    const tile = this.grid[y][x];

    if (!tile.isPath) {
      this.breakIce(tile);
      this.playerFall();
    } else {
      this.playerState.isMoving = false;
      this.playerState.isJumping = false;

      // Keep current facing direction texture
      this.player.setTexture(`penguin-${this.playerState.facing}`);

      // Create landing effect
      this.createLandingEffect(tile.sprite!.x, tile.sprite!.y);

      if (x === this.endPos.x && y === this.endPos.y) {
        this.levelComplete();
      }
    }
  }

  private createLandingEffect(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      const particle = this.add.circle(
        x + Phaser.Math.Between(-10, 10),
        y + 20,
        2,
        0xFFFFFF,
        0.8
      );

      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-20, 20),
        y: particle.y + Phaser.Math.Between(-10, -30),
        alpha: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  private breakIce(tile: PathTile) {
    if (tile.sprite) {
      const image = tile.sprite as Phaser.GameObjects.Image;
      tile.isBroken = true;

      // Change to broken ice texture
      image.setTexture('ice-tile-broken');

      // Fade out animation
      this.tweens.add({
        targets: image,
        alpha: 0.3,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 300,
        ease: 'Power2'
      });

      // Create ice shards
      for (let i = 0; i < GAME_CONFIG.PARTICLES.ICE_SHARD_COUNT; i++) {
        const shard = this.add.polygon(
          image.x + Phaser.Math.Between(-20, 20),
          image.y + Phaser.Math.Between(-20, 20),
          [0, 0, 8, 0, 4, 12],
          GAME_CONFIG.COLORS.BROKEN_ICE
        );
        shard.setStrokeStyle(1, 0xFFFFFF, 0.5);

        this.tweens.add({
          targets: shard,
          x: shard.x + Phaser.Math.Between(-60, 60),
          y: shard.y + Phaser.Math.Between(40, 100),
          alpha: 0,
          angle: Phaser.Math.Between(180, 540),
          duration: 600,
          ease: 'Power2',
          onComplete: () => {
            shard.destroy();
          }
        });
      }

      // Create sparkles
      for (let i = 0; i < GAME_CONFIG.PARTICLES.SPARKLE_COUNT; i++) {
        this.time.delayedCall(i * 50, () => {
          const sparkle = this.add.star(
            image.x + Phaser.Math.Between(-30, 30),
            image.y + Phaser.Math.Between(-30, 30),
            4, 2, 6, 0xFFFFFF
          );
          sparkle.setAlpha(0.8);

          this.tweens.add({
            targets: sparkle,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
              sparkle.destroy();
            }
          });
        });
      }
    }
  }

  private playerFall() {
    this.playerState.canMove = false;

    this.tweens.add({
      targets: this.player,
      y: this.player.y + 300,
      alpha: 0,
      angle: 720,
      scaleX: 0,
      scaleY: 0,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => {
        this.cameras.main.shake(200, 0.01);
        this.gameOver();
      }
    });
  }

  private levelComplete() {
    this.playerState.canMove = false;
    this.gameState.score += 100 * this.gameState.level;

    // Update score display
    this.scoreText.setText(`💎 점수: ${this.gameState.score}`);

    // Victory effects
    const successText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      '✨ 레벨 완료! ✨',
      {
        fontSize: '56px',
        color: '#FFD700',
        stroke: '#0D47A1',
        strokeThickness: 8,
        shadow: {
          offsetX: 0,
          offsetY: 4,
          color: 'rgba(13, 71, 161, 0.5)',
          blur: 10,
          fill: true
        }
      }
    );
    successText.setOrigin(0.5);
    successText.setDepth(100);

    // Add fireworks effect
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 80, () => {
        this.createFirework(
          Phaser.Math.Between(100, this.cameras.main.width - 100),
          Phaser.Math.Between(100, this.cameras.main.height - 100)
        );
      });
    }

    this.tweens.add({
      targets: successText,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: 10,
      duration: 300,
      yoyo: true,
      repeat: 1,
      ease: 'Bounce.out'
    });

    this.time.delayedCall(1500, () => {
      this.cameras.main.fadeOut(300, 255, 255, 255);
      this.time.delayedCall(300, () => {
        this.scene.start('GamePlay', {
          level: this.gameState.level + 1,
          score: this.gameState.score
        });
      });
    });
  }

  private createFirework(x: number, y: number) {
    const colors = [0xFFD700, 0xFF6B6B, 0x64B5F6, 0xFFE082, 0xB39DDB];
    const color = Phaser.Math.RND.pick(colors);

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const star = this.add.star(x, y, 5, 3, 10, color);
      star.setDepth(90);

      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * 80,
        y: y + Math.sin(angle) * 80,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => {
          star.destroy();
        }
      });
    }
  }

  private gameOver() {
    const currentHighScore = parseInt(localStorage.getItem('icePathHighScore') || '0');
    if (this.gameState.score > currentHighScore) {
      localStorage.setItem('icePathHighScore', this.gameState.score.toString());
    }

    this.scene.start('GameOver', {
      score: this.gameState.score,
      level: this.gameState.level
    });
  }
}