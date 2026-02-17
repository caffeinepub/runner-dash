import type { PlayerState, Obstacle } from './types';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from './constants';

export function checkCollision(player: PlayerState, obstacle: Obstacle): boolean {
  const playerLeft = player.x;
  const playerRight = player.x + PLAYER_WIDTH;
  const playerTop = player.y;
  const playerBottom = player.y + PLAYER_HEIGHT;

  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  const obstacleTop = obstacle.y;
  const obstacleBottom = obstacle.y + obstacle.height;

  const collisionPadding = 8;

  return (
    playerRight - collisionPadding > obstacleLeft &&
    playerLeft + collisionPadding < obstacleRight &&
    playerBottom - collisionPadding > obstacleTop &&
    playerTop + collisionPadding < obstacleBottom
  );
}
