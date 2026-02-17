export interface PlayerState {
  x: number;
  y: number;
  velocityY: number;
  isGrounded: boolean;
  isJumping: boolean;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: number;
}

export interface GameState {
  player: PlayerState;
  obstacles: Obstacle[];
  score: number;
  speed: number;
  isRunning: boolean;
  lastObstacleSpawn: number;
  nextObstacleId: number;
}

export type GameStatus = 'idle' | 'running' | 'paused' | 'gameover';
