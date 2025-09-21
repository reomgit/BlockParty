'use client';

import { TETROMINOES } from '@/lib/tetris';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cell from './Cell';

type NextPieceProps = {
  piece: keyof Omit<typeof TETROMINOES, '0'> | null;
};

export function NextPiece({ piece }: NextPieceProps) {
  const shape = piece ? TETROMINOES[piece].shape : TETROMINOES['0'].shape;
  const grid = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));

  if (piece) {
    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const yOffset = piece === 'I' ? 1 : 0;
          const xOffset = piece === 'I' || piece === 'O' ? 0 : 1;
          if (grid[y + yOffset]) {
            grid[y + yOffset][x + xOffset] = piece;
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
