import fc from 'fast-check';

import easy1 from '../__fixtures__/easy1.json';
import {
  countSolutions,
  generateDailyPuzzle,
  generatePuzzle,
  gridToString,
  isValidCompleteGrid,
  parseGrid,
  solve,
} from '../index';

describe('sudoku engine', () => {
  it('solves a known puzzle', () => {
    const puzzle = parseGrid(easy1.puzzle);
    const solved = solve(puzzle);
    expect(solved).not.toBeNull();
    expect(gridToString(solved!)).toBe(easy1.solution);
  });

  it('validates uniqueness', () => {
    const puzzle = parseGrid(easy1.puzzle);
    expect(countSolutions(puzzle, 2)).toBe(1);
  });

  it('generates deterministic daily puzzles (same date/difficulty)', () => {
    const d1 = generateDailyPuzzle({
      dateISO: '2025-12-19',
      difficulty: 'easy',
    });
    const d2 = generateDailyPuzzle({
      dateISO: '2025-12-19',
      difficulty: 'easy',
    });
    expect(d1.puzzle).toBe(d2.puzzle);
    expect(d1.solution).toBe(d2.solution);
  });

  it('generates a puzzle with a unique solution and a valid solution grid', () => {
    const { puzzle, solution } = generatePuzzle({
      seed: 'seed-1',
      difficulty: 'easy',
    });
    const puzzleGrid = parseGrid(puzzle);
    expect(countSolutions(puzzleGrid, 2)).toBe(1);

    const solutionGrid = parseGrid(solution);
    expect(isValidCompleteGrid(solutionGrid)).toBe(true);
  });

  it('property: generated puzzles are uniquely solvable (sampled)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 30 }), (seed) => {
        const { puzzle } = generatePuzzle({ seed, difficulty: 'easy' });
        const grid = parseGrid(puzzle);
        return countSolutions(grid, 2) === 1;
      }),
      { seed: 424242, numRuns: 25 },
    );
  });
});
