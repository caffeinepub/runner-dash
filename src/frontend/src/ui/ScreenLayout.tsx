import { ReactNode } from 'react';

interface ScreenLayoutProps {
  children: ReactNode;
}

export default function ScreenLayout({ children }: ScreenLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-amber-950/20">
      {children}
      
      <footer className="fixed bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} · Built with ❤️ using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-500 hover:text-amber-400 transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
