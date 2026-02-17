import { GRAVITY, JUMP_VELOCITY, GROUND_Y, PLAYER_HEIGHT } from './constants';
import type { PlayerState } from './types';

export function applyGravity(player: PlayerState, deltaTime: number): PlayerState {
  if (player.isGrounded) {
    return player;
  }

  const newVelocityY = player.velocityY + GRAVITY * deltaTime;
  const newY = player.y + newVelocityY * deltaTime;

  const groundPosition = GROUND_Y - PLAYER_HEIGHT;
  
  if (newY >= groundPosition) {
    return {
      ...player,
      y: groundPosition,
      velocityY: 0,
      isGrounded: true,
      isJumping: false,
    };
  }

  return {
    ...player,
    y: newY,
    velocityY: newVelocityY,
    isGrounded: false,
  };
}

export function jump(player: PlayerState): PlayerState {
  if (!player.isGrounded) {
    return player;
  }

  return {
    ...player,
    velocityY: JUMP_VELOCITY,
    isGrounded: false,
    isJumping: true,
  };
}
