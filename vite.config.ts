import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/{unit,integration,non-functional}/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      // RNF04: cobertura mínima de 70% nos serviços de negócio centrais.
      include: ['src/domain/**/*.ts', 'src/services/**/*.ts'],
      exclude: ['**/*.d.ts', '**/index.ts', 'src/domain/types.ts', 'src/services/contracts/**'],
      thresholds: { lines: 70 },
    },
  },
});
