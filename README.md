# Ice Path Game

A memory puzzle game built with Phaser.js and TypeScript.

## 🎮 How to Play

1. **Memorize the Path**: Watch the safe path reveal for a few seconds
2. **Navigate**: Use arrow keys to move your character
3. **Jump**: Press Spacebar + arrow key to jump 2 tiles
4. **Quick Start**: Press Spacebar during path reveal to start immediately
5. **Goal**: Reach the end without falling through the ice!

## 🎨 Customization

### Character Sprite
Place your character sprite at: `src/assets/imgs/character_sprite.png`
- Format: 128x128 PNG with 4 frames (64x64 each)
- Layout: `[Down][Up]` / `[Right][Left]`

### Ice Floor Texture
Place your ice texture at: `public/assets/imgs/ice_floor.png`
- Format: Any PNG image (will be resized to 64x64)

## 🚀 Development

```bash
npm install
npm run dev
```

Game runs at: http://localhost:5174/

## 🎯 Features

- ❄️ Winter-themed graphics with snow effects
- 🐧 Animated character with directional sprites
- 🧊 Realistic ice textures and breaking animations
- ⚡ Expert mode with instant start
- 💎 Score tracking and high scores
- 📱 Mobile and desktop responsive