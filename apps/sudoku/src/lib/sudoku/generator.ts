import type { Digit, Difficulty, Grid } from './types';
import { clueCount, cloneGrid, gridToString } from './grid';
import { createRng } from './rng';
import { countSolutions } from './solver';
import { isValidPlacement } from './grid';
import { ratePuzzle, type PuzzleRating } from './rating';

const DIFFICULTY_CLUES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 36, max: 49 },
  medium: { min: 32, max: 35 },
  hard: { min: 28, max: 31 },
  expert: { min: 24, max: 27 },
  master: { min: 22, max: 23 },
  extreme: { min: 17, max: 21 },
  adaptive: { min: 28, max: 36 },
};

function candidatesFor(grid: Grid, idx: number): Digit[] {
  const out: Digit[] = [];
  for (let d = 1 as Digit; d <= 9; d = (d + 1) as Digit) {
    if (isValidPlacement(grid, idx, d)) out.push(d);
  }
  return out;
}

function generateSolution(seed: string): Grid {
  const rng = createRng(seed);
  const grid: Grid = new Array(81).fill(0) as Grid;

  const fill = (): boolean => {
    // pick next empty
    let bestIdx = -1;
    let bestCands: Digit[] | null = null;

    for (let i = 0; i < 81; i++) {
      if (grid[i] !== 0) continue;
      const c = candidatesFor(grid, i);
      if (c.length === 0) return false;
      const shuffled = rng.shuffle(c);
      if (bestCands === null || shuffled.length < bestCands.length) {
        bestCands = shuffled;
        bestIdx = i;
        if (shuffled.length === 1) break;
      }
    }

    if (bestCands === null) return true;

    for (const d of bestCands) {
      grid[bestIdx] = d;
      if (fill()) return true;
      grid[bestIdx] = 0;
    }

    return false;
  };

  if (!fill()) throw new Error('Failed to generate solution grid');
  return grid;
}

export type GeneratedPuzzle = {
  puzzle: string;
  solution: string;
  clueCount: number;
  rating: PuzzleRating;
};

export function generatePuzzle(opts: { seed: string; difficulty: Difficulty }): GeneratedPuzzle {
  const rng = createRng(`puzzle:${opts.seed}:${opts.difficulty}`);
  const solutionGrid = generateSolution(`solution:${opts.seed}:${opts.difficulty}`);

  const { min, max } = DIFFICULTY_CLUES[opts.difficulty];
  const targetClues = rng.int(min, max);

  const puzzleGrid = cloneGrid(solutionGrid);

  // Symmetry preference: remove in pairs (i, 80-i)
  const positions = rng.shuffle([...Array(41).keys()]); // 0..40 (covers pairs)

  for (const p of positions) {
    if (clueCount(puzzleGrid) <= targetClues) break;

    const i = p;
    const j = 80 - p;

    const prevI = puzzleGrid[i];
    const prevJ = puzzleGrid[j];

    if (prevI === 0 || prevJ === 0) continue;
    if (clueCount(puzzleGrid) - (i === j ? 1 : 2) < min) continue;

    puzzleGrid[i] = 0;
    puzzleGrid[j] = 0;

    if (countSolutions(puzzleGrid, 2) !== 1) {
      puzzleGrid[i] = prevI;
      puzzleGrid[j] = prevJ;
    }
  }

  // If we didn't reach target, do another pass removing singles (best-effort)
  if (clueCount(puzzleGrid) > targetClues) {
    const singles = rng.shuffle([...Array(81).keys()]);
    for (const i of singles) {
      if (clueCount(puzzleGrid) <= targetClues) break;
      if (clueCount(puzzleGrid) - 1 < min) break;
      const prev = puzzleGrid[i];
      if (prev === 0) continue;
      puzzleGrid[i] = 0;
      if (countSolutions(puzzleGrid, 2) !== 1) puzzleGrid[i] = prev;
    }
  }

  const rating = ratePuzzle(puzzleGrid);

  return {
    puzzle: gridToString(puzzleGrid),
    solution: gridToString(solutionGrid),
    clueCount: clueCount(puzzleGrid),
    rating,
  };
}

export function generateDailyPuzzle(opts: {
  dateISO: string;
  difficulty: Difficulty;
}): GeneratedPuzzle {
  return generatePuzzle({
    seed: `daily:${opts.dateISO}`,
    difficulty: opts.difficulty,
  });
}
