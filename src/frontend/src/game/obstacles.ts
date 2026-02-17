import type { Obstacle, GameState } from './types';
import {
  CANVAS_WIDTH,
  GROUND_Y,
  MIN_OBSTACLE_SPACING,
  MAX_OBSTACLE_SPACING,
  OBSTACLE_TYPES,
  OBSTACLE_BASE_WIDTH,
  OBSTACLE_BASE_HEIGHT,
} from './constants';

export function shouldSpawnObstacle(state: GameState, currentTime: number): boolean {
  const timeSinceLastSpawn = currentTime - state.lastObstacleSpawn;
  const minSpacing = MIN_OBSTACLE_SPACING / state.speed;
  return timeSinceLastSpawn > minSpacing * 1000;
}

export function spawnObstacle(state: GameState): Obstacle {
  const type = Math.floor(Math.random() * OBSTACLE_TYPES);
  const heightMultiplier = 1 + type * 0.3;
  const widthMultiplier = 1 + type * 0.2;

  return {
    id: state.nextObstacleId,
    x: CANVAS_WIDTH + 50,
    y: GROUND_Y - OBSTACLE_BASE_HEIGHT * heightMultiplier,
    width: OBSTACLE_BASE_WIDTH * widthMultiplier,
    height: OBSTACLE_BASE_HEIGHT * heightMultiplier,
    type,
  };
}

export function updateObstacles(obstacles: Obstacle[], speed: number, deltaTime: number): Obstacle[] {
  return obstacles
    .map(obstacle => ({
      ...obstacle,
      x: obstacle.x - speed * deltaTime,
    }))
    .filter(obstacle => obstacle.x + obstacle.width > -50);
}
