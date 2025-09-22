// import './style.css';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GamePlayScene } from './scenes/GamePlayScene';
import { GameOverScene } from './scenes/GameOverScene';

// Create game container first
const appDiv = document.querySelector<HTMLDivElement>('#app');
if (appDiv) {
  appDiv.innerHTML = `
    <div style="width: 100%; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); padding: 20px; box-sizing: border-box;">
      <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 30px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
        <div id="game-container" style="border-radius: 15px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);"></div>
        <div style="margin-top: 20px; color: rgba(255,255,255,0.9); text-align: center;">
          <p style="font-size: 16px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">❄️ 방향키: 이동 • 스페이스바: 점프 • 경로 노출 시 스페이스바: 즉시 시작 ❄️</p>
        </div>
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
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER
    },
    scene: [Preloader, MainMenuScene, GamePlayScene, GameOverScene]
  };

  new Phaser.Game(config);
});