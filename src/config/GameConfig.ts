export const GAME_CONFIG = {
  TILE_SIZE: 64,
  INITIAL_GRID_SIZE: 5,
  MAX_GRID_SIZE: 10,
  PATH_REVEAL_TIME: 3000,
  PLAYER_MOVE_DURATION: 200,
  JUMP_DISTANCE: 1,

  COLORS: {
    // Winter Crystal Ice Theme
    ICE: 0xE3F2FD,           // Light crystalline ice
    ICE_BORDER: 0x90CAF9,    // Ice blue border
    SAFE_PATH: 0x5E35B1,     // Deep purple path
    SAFE_PATH_GLOW: 0x7E57C2, // Purple glow
    PLAYER: 0xFF6B6B,        // Warm red contrast
    BROKEN_ICE: 0xBBDEFB,    // Shattered ice blue
    PARTICLE: 0xFFFFFF,      // Snow white
    BACKGROUND_TOP: 0x0D47A1, // Deep blue sky
    BACKGROUND_BOTTOM: 0x64B5F6, // Light blue horizon
  },

  DIFFICULTY: {
    LEVEL_INCREMENT: 1,
    TIME_DECREASE_PER_LEVEL: 200,
    MIN_REVEAL_TIME: 1000
  },

  PARTICLES: {
    SNOW_COUNT: 200,
    SNOW_SPEED: { min: 20, max: 60 },
    ICE_SHARD_COUNT: 12,
    SPARKLE_COUNT: 8
  }
};