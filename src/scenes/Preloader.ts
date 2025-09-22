import Phaser from 'phaser';
import { SpriteGenerator } from '../utils/SpriteGenerator';

export class Preloader extends Phaser.Scene {
  private hasIceImage: boolean = false;

  constructor() {
    super({ key: 'Preloader' });
  }

  preload() {
    // Try to load the ice floor image
    this.load.image('ice-floor-base', '/assets/imgs/ice_floor.png');

    // Handle load error
    this.load.on('loaderror', (file: any) => {
      if (file.key === 'ice-floor-base') {
        console.log('Ice floor image not found, will generate texture instead');
        this.hasIceImage = false;
      }
    });

    this.load.on('filecomplete-image-ice-floor-base', () => {
      this.hasIceImage = true;
    });
  }

  create() {
    // Generate character sprites
    SpriteGenerator.createCharacterSprite(this);

    // Create ice textures - use image if available, otherwise generate
    if (this.hasIceImage) {
      SpriteGenerator.createIceTextureFromImage(this);
    } else {
      SpriteGenerator.createIceTextureGenerated(this);
    }

    // Start main menu
    this.scene.start('MainMenu');
  }
}