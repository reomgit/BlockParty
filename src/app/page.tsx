import TetrisGame from '@/components/game/TetrisGame';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 lg:p-8">
      <TetrisGame />
    </main>
  );
}
