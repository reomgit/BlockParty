export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

export const createEmptyBoard = (): (keyof typeof TETROMINOES | 0 | 'ghost')[][] =>
  Array.from(Array(GRID_HEIGHT), () => Array(GRID_WIDTH).fill(0));

export const TETROMINOES = {
  0: { shape: [[0]], color: 'transparent' }, // Represents an empty cell
  ghost: { shape: [[0]], color: 'rgba(255, 255, 255, 0.2)' },
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
    ],
    color: 'rgb(80, 227, 230)', // Cyan
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0],
    ],
    color: 'rgb(36, 95, 223)', // Blue
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L'],
    ],
    color: 'rgb(223, 173, 36)', // Orange
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O'],
    ],
    color: 'rgb(223, 217, 36)', // Yellow
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0],
    ],
    color: 'rgb(48, 211, 56)', // Green
  },
  T: {
    shape: [
      ['T', 'T', 'T'],
      [0, 'T', 0],
      [0, 0, 0],
    ],
    color: 'rgb(160, 32, 240)', // Purple
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0],
    ],
    color: 'rgb(227, 78, 78)', // Red
  },
};

export const getRandomTetromino = (): keyof Omit<typeof TETROMINOES, '0' | 'ghost'> => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return randTetromino as keyof Omit<typeof TETROMINOES, '0' | 'ghost'>;
};

export const lineClearPoints = [40, 100, 300, 1200];
