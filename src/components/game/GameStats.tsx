'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GameStatsProps = {
  score: number;
  lines: number;
  level: number;
};

const StatItem = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-start rounded-md bg-muted p-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-2xl font-bold text-primary">{value}</span>
  </div>
);

export function GameStats({ score, lines, level }: GameStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <StatItem label="Score" value={score} />
        <StatItem label="Lines" value={lines} />
        <StatItem label="Level" value={level} />
      </CardContent>
    </Card>
  );
}
