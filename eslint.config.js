import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      'no-console': ['error'],
      'no-var': ['error'],
    },
  },
  {
    files: ['test/**/*.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect*'],
        },
      ],
    },
  },
);
