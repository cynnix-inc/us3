import type { Difficulty, Grid } from './types';
import { clueCount } from './grid';
import { solveWithStats } from './solver';

export type PuzzleRating = {
  score: number;
  estimated: Difficulty;
  clues: number;
  guesses: number;
  maxBranch: number;
};

export function ratePuzzle(grid: Grid): PuzzleRating {
  const clues = clueCount(grid);
  const { solution, stats } = solveWithStats(grid);

  // If unsolvable, treat as extreme (should not happen for generated puzzles).
  if (!solution) {
    return {
      score: Number.POSITIVE_INFINITY,
      estimated: 'extreme',
      clues,
      guesses: stats.guesses,
      maxBranch: stats.maxBranch,
    };
  }

  // Very simple scoring model (expandable):
  // - guessing is expensive
  // - fewer clues increases score modestly
  const score = stats.guesses * 25 + Math.max(0, 40 - clues) + Math.max(0, stats.maxBranch - 2) * 5;

  const estimated: Difficulty =
    score <= 10
      ? 'easy'
      : score <= 25
        ? 'medium'
        : score <= 45
          ? 'hard'
          : score <= 70
            ? 'expert'
            : score <= 95
              ? 'master'
              : 'extreme';

  return {
    score,
    estimated,
    clues,
    guesses: stats.guesses,
    maxBranch: stats.maxBranch,
  };
}
