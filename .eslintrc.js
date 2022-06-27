module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'jest/globals': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': './tsconfig.eslint.json',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'comma-dangle': ['error', 'always-multiline'],
    'no-trailing-spaces': 'error',
    'indent': ['error', 2],
    'max-len': ['error', { 'code': 180 }],
    'no-console': ['error'],
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'no-var': ['error'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'jest/expect-expect': [
      'error',
      {
        'assertFunctionNames': ['expect*'],
      },
    ],
  }
};
