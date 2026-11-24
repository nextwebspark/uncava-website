import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts', 'functions/src/**/*.test.ts'],
    environment: 'node',
  },
});
