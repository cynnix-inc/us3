const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  // Expo's recommended lint rules.
  ...compat.extends('expo'),

  // Ignore generated and non-app folders.
  {
    ignores: [
      'eslint.config.js',
      'node_modules/**',
      '.expo/**',
      '.expo-shared/**',
      'dist/**',
      'coverage/**',
      'web-build/**',
      // Supabase edge function code is deno-ish; lint later with a dedicated config.
      'supabase/**',
    ],
  },

  // Workspace-specific rules.
  {
    plugins: {
      'no-warning-comments': require('eslint-plugin-no-warning-comments'),
    },
    rules: {
      // Workspace rule: disallow console logs in production code.
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // Workspace rule: warn on task-marker comments.
      'no-warning-comments/no-warning-comments': [
        'warn',
        { terms: ['todo', 'fixme'], location: 'anywhere' },
      ],
    },
  },
];
