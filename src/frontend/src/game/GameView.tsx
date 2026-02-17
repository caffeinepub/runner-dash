import { useEffect, useRef, useState } from 'react';
import { RunnerLoop } from './runnerLoop';
import { GameRenderer } from './GameRenderer';
import { loadAssets } from './assetLoader';
import type { AudioManager } from '../audio/AudioManager';
import GameHUD from './GameHUD';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

interface GameViewProps {
  onGameOver: (score: number) => void;
  audioManager: AudioManager;
  isResuming?: boolean;
}

export default function GameView({ onGameOver, audioManager, isResuming = false }: GameViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopRef = useRef<RunnerLoop | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const lastScoreRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isActive = true;

    const initGame = async () => {
      try {
        const assets = await loadAssets();
        if (!isActive) return;

        const renderer = new GameRenderer(ctx, assets);
        rendererRef.current = renderer;

        const resumeScore = isResuming ? lastScoreRef.current : 0;
        const loop = new RunnerLoop(
          {
            onScoreUpdate: (newScore) => {
              setScore(newScore);
              lastScoreRef.current = newScore;
            },
            onGameOver: (finalScore) => {
              onGameOver(finalScore);
            },
            onJump: () => {
              audioManager.playSound('jump');
            },
          },
          resumeScore
        );
        loopRef.current = loop;

        setIsLoading(false);
        loop.start();

        let lastTime = performance.now();
        const render = (currentTime: number) => {
          if (!isActive) return;
          
          const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
          lastTime = currentTime;

          const state = loop.getState();
          renderer.render(state, deltaTime);

          animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);
      } catch (error) {
        console.error('Failed to load game assets:', error);
      }
    };

    initGame();

    return () => {
      isActive = false;
      if (loopRef.current) {
        loopRef.current.stop();
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onGameOver, audioManager, isResuming]);

  const handleJump = () => {
    if (loopRef.current) {
      loopRef.current.requestJump();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block"
          tabIndex={0}
        />
        
        {!isLoading && <GameHUD score={score} onJump={handleJump} />}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-2xl font-bold">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
}
