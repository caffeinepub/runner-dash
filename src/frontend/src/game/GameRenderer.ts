import type { GameState } from './types';
import type { LoadedAssets } from './assetLoader';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GROUND_Y,
  RUN_ANIMATION_FRAMES,
  RUN_ANIMATION_SPEED,
} from './constants';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private assets: LoadedAssets;
  private backgroundOffset: number = 0;
  private groundOffset: number = 0;
  private animationTime: number = 0;

  constructor(ctx: CanvasRenderingContext2D, assets: LoadedAssets) {
    this.ctx = ctx;
    this.assets = assets;
  }

  public render(state: GameState, deltaTime: number): void {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.renderBackground(state.speed, deltaTime);
    this.renderGround(state.speed, deltaTime);
    this.renderPlayer(state.player, deltaTime);
    this.renderObstacles(state.obstacles);
  }

  private renderBackground(speed: number, deltaTime: number): void {
    const parallaxSpeed = speed * 0.3;
    this.backgroundOffset -= parallaxSpeed * deltaTime;
    
    const bgWidth = this.assets.background.width;
    const bgHeight = this.assets.background.height;
    const scale = CANVAS_HEIGHT / bgHeight;
    const scaledWidth = bgWidth * scale;

    if (this.backgroundOffset <= -scaledWidth) {
      this.backgroundOffset += scaledWidth;
    }

    this.ctx.drawImage(
      this.assets.background,
      this.backgroundOffset,
      0,
      scaledWidth,
      CANVAS_HEIGHT
    );
    this.ctx.drawImage(
      this.assets.background,
      this.backgroundOffset + scaledWidth,
      0,
      scaledWidth,
      CANVAS_HEIGHT
    );
  }

  private renderGround(speed: number, deltaTime: number): void {
    this.groundOffset -= speed * deltaTime;
    
    const groundWidth = this.assets.ground.width;
    const groundHeight = 128;

    if (this.groundOffset <= -groundWidth) {
      this.groundOffset += groundWidth;
    }

    const tilesNeeded = Math.ceil(CANVAS_WIDTH / groundWidth) + 1;
    for (let i = 0; i < tilesNeeded; i++) {
      this.ctx.drawImage(
        this.assets.ground,
        this.groundOffset + i * groundWidth,
        GROUND_Y,
        groundWidth,
        groundHeight
      );
    }
  }

  private renderPlayer(player: any, deltaTime: number): void {
    if (player.isGrounded) {
      this.animationTime += deltaTime;
      const frameIndex = Math.floor(this.animationTime / RUN_ANIMATION_SPEED) % RUN_ANIMATION_FRAMES;
      const frameWidth = 128;
      const frameHeight = 256;

      this.ctx.drawImage(
        this.assets.spritesheet,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight,
        player.x,
        player.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
    } else {
      this.ctx.drawImage(
        this.assets.jump,
        0,
        0,
        256,
        256,
        player.x,
        player.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
    }
  }

  private renderObstacles(obstacles: any[]): void {
    obstacles.forEach(obstacle => {
      const spriteSize = 170;
      const sourceX = (obstacle.type % 3) * spriteSize;
      
      this.ctx.drawImage(
        this.assets.obstacles,
        sourceX,
        0,
        spriteSize,
        spriteSize,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    });
  }
}
