import type { GameState, PlayerState } from './types';
import { applyGravity, jump } from './physics';
import { checkCollision } from './collision';
import { shouldSpawnObstacle, spawnObstacle, updateObstacles } from './obstacles';
import {
  PLAYER_X,
  GROUND_Y,
  PLAYER_HEIGHT,
  BASE_SPEED,
  SPEED_INCREMENT,
  MAX_SPEED,
  SCORE_INCREMENT,
} from './constants';

export interface RunnerLoopCallbacks {
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onJump?: () => void;
}

export class RunnerLoop {
  private state: GameState;
  private callbacks: RunnerLoopCallbacks;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep = 1 / 60;
  private scoreAccumulator: number = 0;
  private jumpRequested: boolean = false;

  constructor(callbacks: RunnerLoopCallbacks, resumeScore: number = 0) {
    this.callbacks = callbacks;
    this.state = this.createInitialState(resumeScore);
  }

  private createInitialState(resumeScore: number): GameState {
    return {
      player: {
        x: PLAYER_X,
        y: GROUND_Y - PLAYER_HEIGHT,
        velocityY: 0,
        isGrounded: true,
        isJumping: false,
      },
      obstacles: [],
      score: resumeScore,
      speed: BASE_SPEED + Math.floor(resumeScore / 500) * SPEED_INCREMENT,
      isRunning: true,
      lastObstacleSpawn: 0,
      nextObstacleId: 0,
    };
  }

  public requestJump(): void {
    this.jumpRequested = true;
  }

  public start(): void {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public getState(): GameState {
    return this.state;
  }

  private loop = (currentTime: number): void => {
    if (!this.state.isRunning) {
      return;
    }

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedTimeStep) {
      this.update(this.fixedTimeStep, currentTime);
      this.accumulator -= this.fixedTimeStep;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number, currentTime: number): void {
    if (this.jumpRequested && this.state.player.isGrounded) {
      this.state.player = jump(this.state.player);
      this.jumpRequested = false;
      if (this.callbacks.onJump) {
        this.callbacks.onJump();
      }
    }

    this.state.player = applyGravity(this.state.player, deltaTime);

    this.state.obstacles = updateObstacles(this.state.obstacles, this.state.speed, deltaTime);

    for (const obstacle of this.state.obstacles) {
      if (checkCollision(this.state.player, obstacle)) {
        this.state.isRunning = false;
        this.callbacks.onGameOver(Math.floor(this.state.score));
        return;
      }
    }

    if (shouldSpawnObstacle(this.state, currentTime / 1000)) {
      const newObstacle = spawnObstacle(this.state);
      this.state.obstacles.push(newObstacle);
      this.state.lastObstacleSpawn = currentTime / 1000;
      this.state.nextObstacleId++;
    }

    this.scoreAccumulator += deltaTime;
    if (this.scoreAccumulator >= 0.1) {
      this.state.score += SCORE_INCREMENT * this.scoreAccumulator;
      this.scoreAccumulator = 0;
      this.callbacks.onScoreUpdate(Math.floor(this.state.score));
    }

    const targetSpeed = BASE_SPEED + Math.floor(this.state.score / 500) * SPEED_INCREMENT;
    this.state.speed = Math.min(targetSpeed, MAX_SPEED);
  }
}
