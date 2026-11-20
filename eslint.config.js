import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // Regra eliminatória do professor: nenhum teste pulado ou pendente.
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'it', property: 'skip', message: 'Testes com skip anulam a nota.' },
        { object: 'test', property: 'skip', message: 'Testes com skip anulam a nota.' },
        { object: 'describe', property: 'skip', message: 'Testes com skip anulam a nota.' },
        { object: 'it', property: 'todo', message: 'Testes pendentes não podem ir para o CI.' },
        { object: 'test', property: 'todo', message: 'Testes pendentes não podem ir para o CI.' },
        { object: 'it', property: 'only', message: 'Remova o .only antes do commit.' },
        { object: 'test', property: 'only', message: 'Remova o .only antes do commit.' },
        { object: 'describe', property: 'only', message: 'Remova o .only antes do commit.' },
      ],
    },
  },
]);
