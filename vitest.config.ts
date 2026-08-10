import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: 'coverage',
      include: ['src/**/*.{js,ts}'],
      exclude: ['src/bin/tikuicli.ts'],
      reporter: ['html', 'json-summary', 'text-summary', 'lcov', 'clover'],
    },
  },
});
