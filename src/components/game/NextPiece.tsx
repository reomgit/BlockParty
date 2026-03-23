'use client';

import { TETROMINOES } from '@/lib/tetris';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cell from './Cell';

type NextPieceProps = {
  piece: keyof Omit<typeof TETROMINOES, '0' | 'ghost'> | null;
};

export function NextPiece({ piece }: NextPieceProps) {
  const grid = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));

  if (piece) {
    const shape = TETROMINOES[piece].shape;
    
    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          // Centering logic for different piece sizes in the 4x4 preview
          let yOffset = 0;
          let xOffset = 0;

          if (piece === 'I') {
            yOffset = 0;
            xOffset = 0;
          } else if (piece === 'O') {
            yOffset = 1;
            xOffset = 1;
          } else {
            // 3x3 pieces
            yOffset = 0;
            xOffset = 0;
          }

          const targetY = y + yOffset;
          const targetX = x + xOffset;

          // Safe assignment with bounds check
          if (grid[targetY] && targetX >= 0 && targetX < 4) {
            grid[targetY][targetX] = piece;
          }
        }
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid aspect-square"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <Cell key={`${y}-${x}`} type={cell as keyof typeof TETROMINOES} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
