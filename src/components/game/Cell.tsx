import React from 'react';
import { TETROMINOES } from '@/lib/tetris';
import { cn } from '@/lib/utils';

type CellProps = {
  type: keyof typeof TETROMINOES;
  isGhost?: boolean;
};

const Cell = ({ type, isGhost }: CellProps) => {
  const color = TETROMINOES[type]?.color;

  return (
    <div
      className={cn(
        'aspect-square w-full',
        isGhost && 'bg-white/20 rounded-sm',
        type !== 0 && !isGhost && 'border-t-[1px] border-l-[1px] border-r-black/50 border-b-black/50'
      )}
      style={{
        backgroundColor: type !== 0 && !isGhost ? color : undefined,
        boxShadow: type !== 0 && !isGhost ? 'inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.4)' : 'none'
      }}
    />
  );
};

export default React.memo(Cell);
