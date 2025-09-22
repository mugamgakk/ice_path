import Phaser from 'phaser';
import { SpriteGenerator } from '../utils/SpriteGenerator';

export class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Preloader' });
  }

  preload() {
    // No external assets to load - everything is generated
  }

  create() {
    // Always use generated penguin character
    SpriteGenerator.createCharacterSprite(this);

    // Always use generated ice textures
    SpriteGenerator.createIceTextureGenerated(this);

    // Start main menu
    this.scene.start('MainMenu');
  }
}