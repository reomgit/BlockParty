'use client';
import { useState, useCallback, useEffect } from 'react';
import GameBoard from './GameBoard';
import { GameStats } from './GameStats';
import { NextPiece } from './NextPiece';
import { ControlsGuide } from './ControlsGuide';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createEmptyBoard,
  getRandomTetromino,
  TETROMINOES,
  GRID_WIDTH,
  GRID_HEIGHT,
  lineClearPoints,
} from '@/lib/tetris';
import { useInterval } from '@/hooks/useInterval';

type Player = {
  pos: { x: number; y: number };
  tetromino: (keyof typeof TETROMINOES)[][];
  shape: keyof Omit<typeof TETROMINOES, '0'>;
  collided: boolean;
};

const TetrisGame = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState<Player | null>(null);
  const [nextPiece, setNextPiece] = useState<keyof Omit<
    typeof TETROMINOES,
    '0'
  > | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const resetPlayer = useCallback(() => {
    const newShape = nextPiece || getRandomTetromino();
    const newNextPiece = getRandomTetromino();
    const newTetromino = TETROMINOES[newShape].shape;

    const newPlayer: Player = {
      pos: { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 },
      tetromino: newTetromino as (keyof typeof TETROMINOES)[][],
      shape: newShape,
      collided: false,
    };
    
    if (checkCollision(newPlayer, board)) {
      setGameOver(true);
      setDropTime(null);
    } else {
      setPlayer(newPlayer);
      setNextPiece(newNextPiece);
    }
  }, [nextPiece, board]);
  
  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(0);
    setDropTime(1000);
    setGameOver(false);
    setIsPaused(false);
    setNextPiece(getRandomTetromino());
    resetPlayer();
  };

  const checkCollision = (
    player: Player,
    board: (keyof typeof TETROMINOES)[][],
    move: { x: number; y: number } = { x: 0, y: 0 }
  ): boolean => {
    for (let y = 0; y < player.tetromino.length; y++) {
      for (let x = 0; x < player.tetromino[y].length; x++) {
        if (player.tetromino[y][x] !== 0) {
          const newY = y + player.pos.y + move.y;
          const newX = x + player.pos.x + move.x;

          if (
            newY >= GRID_HEIGHT ||
            newX < 0 ||
            newX >= GRID_WIDTH ||
            (board[newY] && board[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const updatePlayerPos = useCallback(({ x, y, collided }: { x: number; y: number; collided?: boolean }) => {
    setPlayer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        pos: { x: prev.pos.x + x, y: prev.pos.y + y },
        collided: collided !== undefined ? collided : prev.collided,
      };
    });
  }, []);

  const movePlayer = (dir: -1 | 1) => {
    if (!player || gameOver || isPaused) return;
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const rotatePlayer = () => {
    if (!player || gameOver || isPaused) return;
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    
    // Transpose
    clonedPlayer.tetromino = clonedPlayer.tetromino[0].map((_: any, colIndex: number) =>
      clonedPlayer.tetromino.map((row: any[]) => row[colIndex])
    );
    // Reverse each row to rotate
    clonedPlayer.tetromino.reverse();

    // Wall kick
    const initialPos = clonedPlayer.pos.x;
    let offset = 1;
    while(checkCollision(clonedPlayer, board)) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1: -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        clonedPlayer.pos.x = initialPos; // Can't rotate
        return;
      }
    }
    setPlayer(clonedPlayer);
  };
  
  const drop = useCallback(() => {
    if (!player || gameOver || isPaused) return;
    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1 });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }, [player, board, gameOver, isPaused, updatePlayerPos]);

  const hardDrop = () => {
    if (!player || gameOver || isPaused) return;
    let y = 0;
    while (!checkCollision(player, board, { x: 0, y: y + 1 })) {
      y++;
    }
    updatePlayerPos({ x: 0, y, collided: true });
  };


  useEffect(() => {
    if (player?.collided) {
      setBoard((prevBoard) => {
        const newBoard = JSON.parse(JSON.stringify(prevBoard));
        player.tetromino.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              newBoard[y + player.pos.y][x + player.pos.x] = player.shape;
            }
          });
        });

        // Check for line clears
        let linesCleared = 0;
        for(let y = newBoard.length - 1; y >= 0; y--) {
          if (newBoard[y].every((cell: any) => cell !== 0)) {
            linesCleared++;
            newBoard.splice(y, 1);
          }
        }
        if (linesCleared > 0) {
          const newRows = Array.from(Array(linesCleared), () => Array(GRID_WIDTH).fill(0));
          newBoard.unshift(...newRows);

          setLines(prev => prev + linesCleared);
          setScore(prev => prev + lineClearPoints[linesCleared - 1] * (level + 1));
        }

        return newBoard;
      });
      resetPlayer();
    }
  }, [player, resetPlayer, level]);

  useEffect(() => {
    const newLevel = Math.floor(lines / 10);
    if(newLevel > level) {
      setLevel(newLevel);
      setDropTime(1000 / (newLevel + 1) + 200);
    }
  }, [lines, level])

  useInterval(drop, dropTime);

  const move = useCallback((e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') movePlayer(-1);
      if (e.key === 'ArrowRight') movePlayer(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') rotatePlayer();
      if (e.key === ' ') hardDrop();
      if (e.key === 'p' || e.key === 'P') setIsPaused(p => !p);
    },
    [drop, hardDrop, gameOver, isPaused]
  );
  
  useEffect(() => {
    document.addEventListener('keydown', move);
    return () => document.removeEventListener('keydown', move);
  }, [move]);

  const displayBoard = createEmptyBoard();
  board.forEach((row, y) => row.forEach((cell, x) => (displayBoard[y][x] = cell)));
  if (player) {
    // Ghost piece
    let ghostY = player.pos.y;
    while (!checkCollision(player, board, { x: 0, y: ghostY - player.pos.y + 1 })) {
      ghostY++;
    }
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          if (displayBoard[y + ghostY]?.[x + player.pos.x] === 0) {
            displayBoard[y + ghostY][x + player.pos.x] = 'ghost';
          }
          displayBoard[y + player.pos.y][x + player.pos.x] = player.shape;
        }
      });
    });
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
      <div className="w-full lg:w-56 flex lg:flex-col gap-4 order-2 lg:order-1">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-primary font-headline text-3xl">Block Party</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={startGame} className="w-full" disabled={!gameOver}>
              {gameOver ? 'New Game' : 'Restart'}
            </Button>
            {!gameOver && (
              <Button onClick={() => setIsPaused(p => !p)} variant="outline" className="w-full mt-2">
                {isPaused ? 'Resume' : 'Pause (P)'}
              </Button>
            )}
          </CardContent>
        </Card>
        {!gameOver && (
          <>
            <GameStats score={score} lines={lines} level={level} />
            <NextPiece piece={nextPiece} />
          </>
        )}
      </div>
      
      <div className="relative order-1 lg:order-2">
        <GameBoard board={displayBoard as (keyof typeof TETROMINOES)[][]} />
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <div className="text-center text-white p-4 bg-card rounded-lg shadow-2xl">
              <h2 className="text-4xl font-bold text-primary">{isPaused ? "Paused" : "Game Over"}</h2>
              {!isPaused && <p className="mt-2 text-xl">Final Score: {score}</p>}
              {gameOver && <Button onClick={startGame} className="mt-4">Play Again</Button>}
              {isPaused && <Button onClick={() => setIsPaused(false)} className="mt-4">Resume</Button>}
            </div>
          </div>
        )}
      </div>
      
      <div className="w-full lg:w-56 order-3">
        <ControlsGuide />
      </div>
    </div>
  );
};

export default TetrisGame;
