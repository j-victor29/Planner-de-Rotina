import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Endereço local fixo: é o que fica liberado na chave de API do Google Cloud.
  server: { host: 'localhost', port: 5173, strictPort: true },
  preview: { host: 'localhost', port: 5173, strictPort: true },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/{unit,non-functional}/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      // RNF04: cobertura mínima de 70% nos serviços de negócio centrais.
      include: ['src/domain/**/*.ts', 'src/services/**/*.ts'],
      exclude: [
        '**/*.d.ts',
        '**/index.ts',
        'src/domain/types.ts',
        'src/services/AppServices.ts',
        'src/services/contracts/**',
      ],
      thresholds: { lines: 70 },
    },
  },
});
