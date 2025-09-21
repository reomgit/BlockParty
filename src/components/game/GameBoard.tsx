import React from 'react';
import Cell from './Cell';
import { GRID_HEIGHT, GRID_WIDTH, TETROMINOES } from '@/lib/tetris';

type GameBoardProps = {
  board: (keyof typeof TETROMINOES)[][];
};

const GameBoard = ({ board }: GameBoardProps) => {
  return (
    <div
      className="grid rounded-lg border-4 border-card bg-card/50 p-1 shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
        width: 'min(40vh, 300px)',
        height: 'min(80vh, 600px)',
      }}
    >
      {board.map((row, y) =>
        row.map((cellType, x) => (
          <Cell key={`${y}-${x}`} type={cellType} />
        ))
      )}
    </div>
  );
};

export default React.memo(GameBoard);
