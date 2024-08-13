import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.recommended,
  jest.configs['flat/recommended'],
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
      'jest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect*'],
        },
      ],
    },
  },
);
