import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

export class MainMenuScene extends Phaser.Scene {
  private snowParticles: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create gradient background
    this.createBackground();

    // Create snow particles
    this.createSnowEffect();

    // Title with ice crystal effect
    const titleText = this.add.text(width / 2, height / 3 + 20, '❄ ICE PATH ❄', {
      fontSize: '64px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#0D47A1',
      strokeThickness: 6,
      shadow: {
        offsetX: 0,
        offsetY: 4,
        color: 'rgba(13, 71, 161, 0.5)',
        blur: 10,
        fill: true
      }
    });
    titleText.setOrigin(0.5);

    const subText = this.add.text(width / 2, height / 3 + 85, '크리스탈 기억력 퍼즐', {
      fontSize: '24px',
      color: '#E1F5FE',
      fontStyle: 'italic'
    });
    subText.setOrigin(0.5);

    // Crystal ice button
    const buttonGraphics = this.add.graphics();
    const buttonX = width / 2;
    const buttonY = height / 2 + 50;
    const buttonWidth = 240;
    const buttonHeight = 70;

    // Draw crystal button
    const drawButton = (color: number, alpha: number = 1) => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(color, alpha);
      buttonGraphics.fillRoundedRect(
        buttonX - buttonWidth / 2,
        buttonY - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        15
      );
      buttonGraphics.lineStyle(2, 0xFFFFFF, 0.8);
      buttonGraphics.strokeRoundedRect(
        buttonX - buttonWidth / 2,
        buttonY - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        15
      );
    };

    drawButton(0x42A5F5);

    const startButton = this.add.zone(buttonX, buttonY, buttonWidth, buttonHeight);
    startButton.setInteractive({ useHandCursor: true });

    const startText = this.add.text(buttonX, buttonY, '게임 시작', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    startText.setOrigin(0.5);

    // Button hover effects
    startButton.on('pointerover', () => {
      drawButton(0x64B5F6);
      this.tweens.add({
        targets: startText,
        scale: 1.1,
        duration: 100
      });
    });

    startButton.on('pointerout', () => {
      drawButton(0x42A5F5);
      this.tweens.add({
        targets: startText,
        scale: 1,
        duration: 100
      });
    });

    startButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 255, 255, 255);
      this.time.delayedCall(500, () => {
        this.scene.start('GamePlay', { level: 1, score: 0 });
      });
    });

    // High score with crystal icon
    const highScore = localStorage.getItem('icePathHighScore') || '0';
    const highScoreText = this.add.text(width / 2, height - 100, `💎 최고 점수: ${highScore}`, {
      fontSize: '24px',
      color: '#FFE082',
      stroke: '#0D47A1',
      strokeThickness: 3
    });
    highScoreText.setOrigin(0.5);

    // Add sparkle effect to high score
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.createSparkle(highScoreText.x - 50, highScoreText.y);
        this.createSparkle(highScoreText.x + 50, highScoreText.y);
      },
      loop: true
    });
  }

  private createBackground() {
    const { width, height } = this.cameras.main;

    // Create gradient rectangles
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
      rect.setDepth(-10);
    }
  }

  private createSnowEffect() {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < GAME_CONFIG.PARTICLES.SNOW_COUNT; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-height, height);
      const size = Phaser.Math.Between(2, 6);
      const speed = Phaser.Math.Between(
        GAME_CONFIG.PARTICLES.SNOW_SPEED.min,
        GAME_CONFIG.PARTICLES.SNOW_SPEED.max
      );

      const snowflake = this.add.rectangle(x, y, size, size, 0xFFFFFF, 0.8);
      snowflake.setDepth(-5);

      this.tweens.add({
        targets: snowflake,
        y: height + 10,
        x: x + Phaser.Math.Between(-50, 50),
        duration: (height - y) * (100 / speed),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000),
        onRepeat: () => {
          snowflake.x = Phaser.Math.Between(0, width);
          snowflake.y = -10;
        }
      });

      // Add rotation to larger snowflakes
      if (size > 4) {
        this.tweens.add({
          targets: snowflake,
          angle: 360,
          duration: Phaser.Math.Between(3000, 6000),
          repeat: -1
        });
      }

      this.snowParticles.push(snowflake);
    }
  }

  private createSparkle(x: number, y: number) {
    const sparkle = this.add.star(x, y, 4, 3, 8, 0xFFFFFF);
    sparkle.setAlpha(0);

    this.tweens.add({
      targets: sparkle,
      alpha: 1,
      scaleX: 1.5,
      scaleY: 1.5,
      angle: 180,
      duration: 500,
      yoyo: true,
      onComplete: () => {
        sparkle.destroy();
      }
    });
  }
}