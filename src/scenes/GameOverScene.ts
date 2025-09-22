import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

export class GameOverScene extends Phaser.Scene {
  private snowParticles: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super({ key: 'GameOver' });
  }

  create(data: { score: number; level: number }) {
    const { width, height } = this.cameras.main;

    // Fade in effect
    this.cameras.main.fadeIn(500, 255, 255, 255);

    // Create winter background
    this.createBackground();
    this.createSnowEffect();

    // Game over text with ice effect
    const gameOverText = this.add.text(width / 2, height / 3 - 50, '❄ GAME OVER ❄', {
      fontSize: '64px',
      color: '#87CEEB',
      fontStyle: 'bold',
      stroke: '#0D47A1',
      strokeThickness: 8,
      shadow: {
        offsetX: 0,
        offsetY: 4,
        color: 'rgba(13, 71, 161, 0.5)',
        blur: 10,
        fill: true
      }
    });
    gameOverText.setOrigin(0.5);

    // Add frozen effect animation
    this.tweens.add({
      targets: gameOverText,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    // Score display with crystal icon
    const scoreText = this.add.text(width / 2, height / 2 - 60, `💎 최종 점수: ${data.score}`, {
      fontSize: '36px',
      color: '#FFE082',
      stroke: '#0D47A1',
      strokeThickness: 4
    });
    scoreText.setOrigin(0.5);

    // Level display
    const levelText = this.add.text(width / 2, height / 2 - 10, `도달 레벨: ${data.level}`, {
      fontSize: '28px',
      color: '#E1F5FE'
    });
    levelText.setOrigin(0.5);

    // High score check with celebration
    const highScore = parseInt(localStorage.getItem('icePathHighScore') || '0');

    if (data.score >= highScore && data.score > 0) {
      const newRecordText = this.add.text(width / 2, height / 2 + 40, '🏆 새로운 최고 기록! 🏆', {
        fontSize: '32px',
        color: '#FFD700',
        stroke: '#0D47A1',
        strokeThickness: 4
      });
      newRecordText.setOrigin(0.5);

      // Celebration animation
      this.tweens.add({
        targets: newRecordText,
        scaleX: 1.2,
        scaleY: 1.2,
        angle: 5,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Power2'
      });

      // Create sparkles around new record text
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.createSparkleCircle(newRecordText.x, newRecordText.y, 100);
        },
        loop: true
      });
    } else {
      const highScoreText = this.add.text(width / 2, height / 2 + 40, `최고 점수: ${highScore}`, {
        fontSize: '24px',
        color: '#FFE082'
      });
      highScoreText.setOrigin(0.5);
    }

    // Create crystal ice buttons
    const buttonY = height / 2 + 140;

    // Retry button
    const retryButton = this.createIceButton(width / 2 - 120, buttonY, '다시 하기', 0x42A5F5);
    retryButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 255, 255, 255);
      this.time.delayedCall(500, () => {
        this.scene.start('GamePlay', { level: 1, score: 0 });
      });
    });

    // Menu button
    const menuButton = this.createIceButton(width / 2 + 120, buttonY, '메인 메뉴', 0x64B5F6);
    menuButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 255, 255, 255);
      this.time.delayedCall(500, () => {
        this.scene.start('MainMenu');
      });
    });

    // Add ice crystals decoration
    this.createIceCrystals();
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
      rect.setDepth(-10);
    }
  }

  private createSnowEffect() {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-height, height);
      const size = Phaser.Math.Between(2, 5);
      const speed = Phaser.Math.Between(
        GAME_CONFIG.PARTICLES.SNOW_SPEED.min,
        GAME_CONFIG.PARTICLES.SNOW_SPEED.max
      );

      const snowflake = this.add.rectangle(x, y, size, size, 0xFFFFFF, 0.7);
      snowflake.setDepth(-5);

      this.tweens.add({
        targets: snowflake,
        y: height + 10,
        x: x + Phaser.Math.Between(-40, 40),
        duration: (height - y) * (100 / speed),
        repeat: -1,
        onRepeat: () => {
          snowflake.x = Phaser.Math.Between(0, width);
          snowflake.y = -10;
        }
      });

      if (size > 3) {
        this.tweens.add({
          targets: snowflake,
          angle: 360,
          duration: Phaser.Math.Between(4000, 8000),
          repeat: -1
        });
      }

      this.snowParticles.push(snowflake);
    }
  }

  private createIceButton(x: number, y: number, text: string, color: number): Phaser.GameObjects.Zone {
    const buttonWidth = 200;
    const buttonHeight = 60;

    // Create button graphics
    const graphics = this.add.graphics();

    const drawButton = (baseColor: number, hover: boolean = false) => {
      graphics.clear();

      // Main button
      graphics.fillStyle(baseColor, hover ? 0.95 : 0.85);
      graphics.fillRoundedRect(
        x - buttonWidth / 2,
        y - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        12
      );

      // Ice crystal border
      graphics.lineStyle(2, 0xFFFFFF, 0.9);
      graphics.strokeRoundedRect(
        x - buttonWidth / 2,
        y - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        12
      );

      // Inner glow
      if (hover) {
        graphics.fillStyle(0xFFFFFF, 0.2);
        graphics.fillRoundedRect(
          x - buttonWidth / 2 + 4,
          y - buttonHeight / 2 + 4,
          buttonWidth - 8,
          buttonHeight / 3,
          8
        );
      }
    };

    drawButton(color);

    // Button text
    const buttonText = this.add.text(x, y, text, {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);

    // Interactive zone
    const zone = this.add.zone(x, y, buttonWidth, buttonHeight);
    zone.setInteractive({ useHandCursor: true });

    // Hover effects
    zone.on('pointerover', () => {
      drawButton(color, true);
      this.tweens.add({
        targets: [buttonText, graphics],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });

    zone.on('pointerout', () => {
      drawButton(color, false);
      this.tweens.add({
        targets: [buttonText, graphics],
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    return zone;
  }

  private createIceCrystals() {
    const { width, height } = this.cameras.main;
    const positions = [
      { x: 50, y: 100 },
      { x: width - 50, y: 100 },
      { x: 80, y: height - 100 },
      { x: width - 80, y: height - 100 }
    ];

    positions.forEach((pos, index) => {
      const crystal = this.add.star(pos.x, pos.y, 6, 15, 30, 0x87CEEB);
      crystal.setAlpha(0.3);
      crystal.setDepth(-2);

      this.tweens.add({
        targets: crystal,
        angle: 360,
        duration: 10000 + index * 2000,
        repeat: -1,
        ease: 'Linear'
      });

      this.tweens.add({
        targets: crystal,
        alpha: 0.6,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 2000 + index * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut'
      });
    });
  }

  private createSparkleCircle(centerX: number, centerY: number, radius: number) {
    const sparkleCount = 8;

    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const sparkle = this.add.star(x, y, 4, 3, 8, 0xFFFFFF);
      sparkle.setAlpha(0);

      this.tweens.add({
        targets: sparkle,
        alpha: 1,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 400,
        yoyo: true,
        onComplete: () => {
          sparkle.destroy();
        }
      });
    }
  }
}