import './style.css';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GamePlayScene } from './scenes/GamePlayScene';
import { GameOverScene } from './scenes/GameOverScene';

// Create game container first
const appDiv = document.querySelector<HTMLDivElement>('#app');
if (appDiv) {
  appDiv.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center">
      <div id="game-container" class="rounded-lg shadow-2xl"></div>
      <div class="mt-4 text-white text-center">
        <p class="text-sm">방향키: 이동 • 스페이스바: 점프 • 경로 노출 시 스페이스바: 즉시 시작</p>
      </div>
    </div>
  `;
}

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Preloader, MainMenuScene, GamePlayScene, GameOverScene]
  };

  const game = new Phaser.Game(config);
  console.log('Game initialized', game);
});