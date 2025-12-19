import type { Digit, Grid } from './types';

export function parseGrid(s: string): Grid {
  if (s.length !== 81) throw new Error(`Grid string must be 81 chars, got ${s.length}`);
  const out: Digit[] = [];
  for (let i = 0; i < 81; i++) {
    const c = s.charCodeAt(i) - 48;
    if (c < 0 || c > 9) throw new Error('Grid string must contain digits 0-9');
    out.push(c as Digit);
  }
  return out;
}

export function gridToString(grid: Grid): string {
  if (grid.length !== 81) throw new Error('Grid must be length 81');
  return grid.join('');
}

export function isValidPlacement(grid: Grid, idx: number, value: Digit): boolean {
  const row = Math.floor(idx / 9);
  const col = idx % 9;
  for (let c = 0; c < 9; c++) {
    const v = grid[row * 9 + c];
    if (c !== col && v === value) return false;
  }
  for (let r = 0; r < 9; r++) {
    const v = grid[r * 9 + col];
    if (r !== row && v === value) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      const j = r * 9 + c;
      const v = grid[j];
      if (j !== idx && v === value) return false;
    }
  }
  return true;
}

export function isValidCompleteGrid(grid: Grid): boolean {
  if (grid.length !== 81) return false;

  const seen = new Array<boolean>(10);
  // rows
  for (let r = 0; r < 9; r++) {
    seen.fill(false);
    for (let c = 0; c < 9; c++) {
      const v = grid[r * 9 + c];
      if (v === 0) return false;
      if (seen[v]) return false;
      seen[v] = true;
    }
  }

  // cols
  for (let c = 0; c < 9; c++) {
    seen.fill(false);
    for (let r = 0; r < 9; r++) {
      const v = grid[r * 9 + c];
      if (v === 0) return false;
      if (seen[v]) return false;
      seen[v] = true;
    }
  }

  // boxes
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      seen.fill(false);
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          const v = grid[r * 9 + c];
          if (v === 0) return false;
          if (seen[v]) return false;
          seen[v] = true;
        }
      }
    }
  }

  return true;
}

export function cloneGrid(grid: Grid): Grid {
  return grid.slice() as Grid;
}

export function clueCount(grid: Grid): number {
  let n = 0;
  for (const d of grid) if (d !== 0) n++;
  return n;
}
