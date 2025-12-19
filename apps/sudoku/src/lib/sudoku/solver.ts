import type { Digit, Grid } from './types';
import { cloneGrid, isValidPlacement } from './grid';

export type SolveStats = {
  guesses: number;
  maxBranch: number;
};

function candidates(grid: Grid, idx: number): Digit[] {
  if (grid[idx] !== 0) return [];
  const out: Digit[] = [];
  for (let d = 1 as Digit; d <= 9; d = (d + 1) as Digit) {
    if (isValidPlacement(grid, idx, d)) out.push(d);
  }
  return out;
}

function findBestEmpty(grid: Grid): { idx: number; cands: Digit[] } | null {
  let bestIdx = -1;
  let best: Digit[] | null = null;

  for (let i = 0; i < 81; i++) {
    if (grid[i] !== 0) continue;
    const c = candidates(grid, i);
    if (c.length === 0) return { idx: i, cands: [] };
    if (best === null || c.length < best.length) {
      best = c;
      bestIdx = i;
      if (c.length === 1) break;
    }
  }

  if (best === null) return null;
  return { idx: bestIdx, cands: best };
}

export function solve(grid: Grid): Grid | null {
  return solveWithStats(grid).solution;
}

export function solveWithStats(grid: Grid): {
  solution: Grid | null;
  stats: SolveStats;
} {
  const work = cloneGrid(grid);
  const stats: SolveStats = { guesses: 0, maxBranch: 0 };

  // quick validation for filled cells
  for (let i = 0; i < 81; i++) {
    const v = work[i];
    if (v === 0) continue;
    work[i] = 0;
    if (!isValidPlacement(work, i, v)) return { solution: null, stats };
    work[i] = v;
  }

  const backtrack = (): boolean => {
    const best = findBestEmpty(work);
    if (!best) return true; // solved
    if (best.cands.length === 0) return false;

    if (best.cands.length > 1) {
      stats.guesses += 1;
      stats.maxBranch = Math.max(stats.maxBranch, best.cands.length);
    }

    for (const d of best.cands) {
      work[best.idx] = d;
      if (backtrack()) return true;
      work[best.idx] = 0;
    }
    return false;
  };

  return { solution: backtrack() ? work : null, stats };
}

export function countSolutions(grid: Grid, limit: number = 2): number {
  const work = cloneGrid(grid);

  // validate
  for (let i = 0; i < 81; i++) {
    const v = work[i];
    if (v === 0) continue;
    work[i] = 0;
    if (!isValidPlacement(work, i, v)) return 0;
    work[i] = v;
  }

  let count = 0;

  const dfs = () => {
    if (count >= limit) return;

    const best = findBestEmpty(work);
    if (!best) {
      count += 1;
      return;
    }

    if (best.cands.length === 0) return;

    for (const d of best.cands) {
      work[best.idx] = d;
      dfs();
      work[best.idx] = 0;
      if (count >= limit) return;
    }
  };

  dfs();
  return count;
}
