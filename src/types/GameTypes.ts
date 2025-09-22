export interface GridPosition {
  x: number;
  y: number;
}

export interface PathTile {
  position: GridPosition;
  sprite?: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
  isPath: boolean;
  isRevealed: boolean;
  isBroken: boolean;
}

export interface GameState {
  level: number;
  score: number;
  lives: number;
  currentGridSize: number;
  pathRevealTime: number;
}

export interface PlayerState {
  gridPosition: GridPosition;
  isMoving: boolean;
  isJumping: boolean;
  canMove: boolean;
  facing: 'up' | 'down' | 'left' | 'right';
}