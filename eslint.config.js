// eslint.config.js
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node, // Node.js globals
        ...globals.jest, // ✅ Jest globals (describe, it, expect, etc.)
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow console in Node.js files (or restrict as needed)
      'no-console': ['warn', { allow: ['error', 'warn', 'log', 'info'] }],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      ...globals.jest,
    },
  },
  {
    // Special rules for database connection file
    files: ['src/db/**/*.ts'],
    rules: {
      'no-console': 'off', // Allow console in DB files
    },
  },
];
