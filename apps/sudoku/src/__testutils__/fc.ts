import fc from 'fast-check';

/**
 * Shared fast-check configuration.
 * - fixed seed for reproducibility
 * - bump numRuns in CI if desired
 */
export function fcAssert<T>(property: fc.IProperty<T>) {
  const params: fc.Parameters<T> = {
    seed: 424242,
    numRuns: 200,
    endOnFailure: true,
  };
  return fc.assert(property, params);
}
