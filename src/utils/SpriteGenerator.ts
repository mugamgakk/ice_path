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

  static createIceTextureFromImage(scene: Phaser.Scene): void {
    // Check if textures already exist
    if (scene.textures.exists('ice-tile')) {
      return;
    }

    const size = 64;
    const graphics = scene.add.graphics();

    // Regular ice tile using the loaded image
    const rt1 = scene.add.renderTexture(0, 0, size, size);
    rt1.setVisible(false);

    // Draw the ice floor image as base
    const iceImage = scene.add.image(size / 2, size / 2, 'ice-floor-base');
    iceImage.setDisplaySize(size, size);
    rt1.draw(iceImage);
    iceImage.destroy();

    rt1.saveTexture('ice-tile');
    rt1.destroy();

    // Broken ice tile - darken and add cracks
    const rt2 = scene.add.renderTexture(0, 0, size, size);
    rt2.setVisible(false);

    // Draw base ice image darker
    const brokenIceImage = scene.add.image(size / 2, size / 2, 'ice-floor-base');
    brokenIceImage.setDisplaySize(size, size);
    brokenIceImage.setTint(0x888888); // Darken the image
    rt2.draw(brokenIceImage);
    brokenIceImage.destroy();

    // Add crack overlay
    graphics.clear();
    graphics.lineStyle(2, 0x333333, 0.8);
    for (let i = 0; i < 5; i++) {
      graphics.beginPath();
      graphics.moveTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.lineTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.lineTo(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size));
      graphics.strokePath();
    }

    // Add dark spots for depth
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(0, size);
      const y = Phaser.Math.Between(0, size);
      graphics.fillStyle(0x000000, 0.3);
      graphics.fillCircle(x, y, Phaser.Math.Between(3, 8));
    }

    rt2.draw(graphics);
    rt2.saveTexture('ice-tile-broken');
    rt2.destroy();

    // Safe path tile - keep the stone texture for contrast
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
    this.createIceTextureFromImage(scene);
  }
}