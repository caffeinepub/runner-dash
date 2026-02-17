interface GameHUDProps {
  score: number;
  onJump: () => void;
}

export default function GameHUD({ score, onJump }: GameHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-amber-500/50">
        <div className="text-amber-400 text-3xl font-bold tracking-wider">
          {score.toLocaleString()}
        </div>
      </div>

      <button
        onClick={onJump}
        className="pointer-events-auto absolute bottom-12 right-12 w-24 h-24 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-full shadow-2xl flex items-center justify-center text-white font-bold text-xl border-4 border-amber-300 transition-all active:scale-95"
        aria-label="Jump"
      >
        JUMP
      </button>
    </div>
  );
}
