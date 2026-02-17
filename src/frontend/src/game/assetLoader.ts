import { ASSETS } from './assets';

export interface LoadedAssets {
  background: HTMLImageElement;
  spritesheet: HTMLImageElement;
  jump: HTMLImageElement;
  obstacles: HTMLImageElement;
  ground: HTMLImageElement;
}

export async function loadAssets(): Promise<LoadedAssets> {
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const [background, spritesheet, jump, obstacles, ground] = await Promise.all([
    loadImage(ASSETS.background),
    loadImage(ASSETS.spritesheet),
    loadImage(ASSETS.jump),
    loadImage(ASSETS.obstacles),
    loadImage(ASSETS.ground),
  ]);

  return { background, spritesheet, jump, obstacles, ground };
}
