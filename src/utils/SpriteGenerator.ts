import Phaser from 'phaser';

export class SpriteGenerator {

  static createCharacterSprite(scene: Phaser.Scene): void {
    // Check if textures already exist
    if (scene.textures.exists('penguin-down')) {
      return;
    }

    const graphics = scene.add.graphics();
    const spriteSize = 64;

    // Create individual textures for each direction
    this.createDirectionalSprite(scene, graphics, 'down', spriteSize);
    this.createDirectionalSprite(scene, graphics, 'up', spriteSize);
    this.createDirectionalSprite(scene, graphics, 'left', spriteSize);
    this.createDirectionalSprite(scene, graphics, 'right', spriteSize);

    graphics.destroy();
  }

  private static createDirectionalSprite(scene: Phaser.Scene, graphics: Phaser.GameObjects.Graphics, direction: string, size: number) {
    const rt = scene.add.renderTexture(0, 0, size, size);
    rt.setVisible(false);

    graphics.clear();

    const centerX = size / 2;
    const centerY = size / 2;

    // Shadow
    graphics.fillStyle(0x000000, 0.2);
    graphics.fillEllipse(centerX, centerY + 22, 25, 8);

    // Body (black)
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillEllipse(centerX, centerY + 5, 32, 36);

    // White belly
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillEllipse(centerX, centerY + 8, 22, 26);

    // Wings based on direction
    graphics.fillStyle(0x1A1A1A, 1);
    if (direction === 'left') {
      graphics.fillEllipse(centerX - 18, centerY + 5, 12, 20);
      graphics.fillEllipse(centerX + 12, centerY + 5, 8, 18);
    } else if (direction === 'right') {
      graphics.fillEllipse(centerX + 18, centerY + 5, 12, 20);
      graphics.fillEllipse(centerX - 12, centerY + 5, 8, 18);
    } else {
      graphics.fillEllipse(centerX - 14, centerY + 5, 10, 18);
      graphics.fillEllipse(centerX + 14, centerY + 5, 10, 18);
    }

    // Head
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillCircle(centerX, centerY - 10, 14);

    // Eyes based on direction
    graphics.fillStyle(0xFFFFFF, 1);
    if (direction === 'left') {
      graphics.fillCircle(centerX - 8, centerY - 12, 5);
      graphics.fillCircle(centerX - 2, centerY - 12, 4);
    } else if (direction === 'right') {
      graphics.fillCircle(centerX + 8, centerY - 12, 5);
      graphics.fillCircle(centerX + 2, centerY - 12, 4);
    } else if (direction === 'up') {
      graphics.fillCircle(centerX - 5, centerY - 14, 4);
      graphics.fillCircle(centerX + 5, centerY - 14, 4);
    } else {
      graphics.fillCircle(centerX - 6, centerY - 10, 5);
      graphics.fillCircle(centerX + 6, centerY - 10, 5);
    }

    // Pupils
    graphics.fillStyle(0x000000, 1);
    if (direction === 'left') {
      graphics.fillCircle(centerX - 9, centerY - 12, 3);
      graphics.fillCircle(centerX - 3, centerY - 12, 2);
    } else if (direction === 'right') {
      graphics.fillCircle(centerX + 9, centerY - 12, 3);
      graphics.fillCircle(centerX + 3, centerY - 12, 2);
    } else if (direction === 'up') {
      graphics.fillCircle(centerX - 5, centerY - 15, 2);
      graphics.fillCircle(centerX + 5, centerY - 15, 2);
    } else {
      graphics.fillCircle(centerX - 6, centerY - 9, 3);
      graphics.fillCircle(centerX + 6, centerY - 9, 3);
    }

    // Beak
    graphics.fillStyle(0xFFA500, 1);
    if (direction === 'left') {
      graphics.fillTriangle(
        centerX - 12, centerY - 8,
        centerX - 6, centerY - 6,
        centerX - 6, centerY - 10
      );
    } else if (direction === 'right') {
      graphics.fillTriangle(
        centerX + 12, centerY - 8,
        centerX + 6, centerY - 6,
        centerX + 6, centerY - 10
      );
    } else if (direction === 'up') {
      graphics.fillTriangle(
        centerX, centerY - 18,
        centerX - 3, centerY - 12,
        centerX + 3, centerY - 12
      );
    } else {
      graphics.fillTriangle(
        centerX, centerY - 4,
        centerX - 4, centerY - 8,
        centerX + 4, centerY - 8
      );
    }

    // Feet
    graphics.fillStyle(0xFFA500, 1);
    graphics.fillEllipse(centerX - 8, centerY + 22, 10, 5);
    graphics.fillEllipse(centerX + 8, centerY + 22, 10, 5);

    rt.draw(graphics);
    rt.saveTexture(`penguin-${direction}`);
    rt.destroy();
  }


  static createIceTextureGenerated(scene: Phaser.Scene): void {
    // Check if textures already exist
    if (scene.textures.exists('ice-tile')) {
      return;
    }

    const size = 64;
    const graphics = scene.add.graphics();

    // Generate a beautiful ice texture with realistic patterns
    const rt1 = scene.add.renderTexture(0, 0, size, size);
    rt1.setVisible(false);

    // Base ice layer with gradient
    graphics.clear();
    graphics.fillGradientStyle(0xF0F8FF, 0xE0F0FF, 0xD0E8FF, 0xC0E0FF, 1, 1, 1, 1);
    graphics.fillRect(0, 0, size, size);

    // Add ice crystal patterns
    graphics.lineStyle(1, 0xB8E6FF, 0.6);
    for (let i = 0; i < 8; i++) {
      const centerX = Phaser.Math.Between(5, size - 5);
      const centerY = Phaser.Math.Between(5, size - 5);
      const radius = Phaser.Math.Between(3, 8);

      // Draw hexagonal ice crystal
      const sides = 6;
      graphics.beginPath();
      for (let j = 0; j <= sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (j === 0) {
          graphics.moveTo(x, y);
        } else {
          graphics.lineTo(x, y);
        }
      }
      graphics.strokePath();
    }

    // Add random ice cracks
    graphics.lineStyle(0.5, 0x9DD9FF, 0.4);
    for (let i = 0; i < 5; i++) {
      graphics.beginPath();
      graphics.moveTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.lineTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.strokePath();
    }

    // Add surface shine
    graphics.fillStyle(0xFFFFFF, 0.15);
    graphics.fillEllipse(size / 2, size / 4, size * 0.8, size / 6);

    // Subtle texture noise
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, size);
      const y = Phaser.Math.Between(0, size);
      const opacity = Phaser.Math.FloatBetween(0.05, 0.15);
      graphics.fillStyle(0xFFFFFF, opacity);
      graphics.fillCircle(x, y, 0.5);
    }

    rt1.draw(graphics);
    rt1.saveTexture('ice-tile');
    rt1.destroy();

    // Broken ice tile
    const rt2 = scene.add.renderTexture(0, 0, size, size);
    rt2.setVisible(false);

    graphics.clear();
    graphics.fillStyle(0xA8D8EA, 0.8);
    graphics.fillRect(0, 0, size, size);

    // Heavy cracks for broken state
    graphics.lineStyle(2, 0x4A90A4, 0.8);
    for (let i = 0; i < 8; i++) {
      graphics.beginPath();
      graphics.moveTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.lineTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.lineTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.strokePath();
    }

    // Dark depth spots
    for (let i = 0; i < 4; i++) {
      const x = Phaser.Math.Between(0, size);
      const y = Phaser.Math.Between(0, size);
      graphics.fillStyle(0x1E3A8A, 0.4);
      graphics.fillCircle(x, y, Phaser.Math.Between(3, 8));
    }

    rt2.draw(graphics);
    rt2.saveTexture('ice-tile-broken');
    rt2.destroy();

    // Safe path tile
    const rt3 = scene.add.renderTexture(0, 0, size, size);
    rt3.setVisible(false);

    graphics.clear();
    graphics.fillStyle(0x5E35B1, 0.9);
    graphics.fillRect(0, 0, size, size);

    // Stone texture
    graphics.lineStyle(1, 0x4527A0, 0.5);
    for (let y = 0; y < size; y += 8) {
      for (let x = 0; x < size; x += 8) {
        if (Math.random() > 0.5) {
          graphics.strokeRect(x, y, 8, 8);
        }
      }
    }

    // Highlight
    graphics.fillStyle(0x7E57C2, 0.3);
    graphics.fillEllipse(size / 2, size / 3, size * 0.8, size * 0.3);

    rt3.draw(graphics);
    rt3.saveTexture('safe-path-tile');
    rt3.destroy();

    graphics.destroy();
  }

  // Keep the old method for backward compatibility
  static createIceTexture(scene: Phaser.Scene): void {
    this.createIceTextureGenerated(scene);
  }
}