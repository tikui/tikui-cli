module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
    'node',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/application.ts',
  ],
  coverageReporters: [
    'html',
    'json-summary',
    'text-summary',
    'lcov',
    'clover',
  ],
  testEnvironment: 'node',
};
