# tests — responsável: **José Bruno**

| Pasta | Conteúdo | Comando |
|---|---|---|
| `unit/` | Testes unitários (Vitest + Testing Library, com mocks/stubs) | `npm run test` |
| `integration/` | Testes com o banco no Firebase Emulator | `npm run test` (com emuladores ligados) |
| `e2e/` | Testes ponta a ponta no navegador (Playwright) — configurado na etapa 3 | — |
| `non-functional/` | Desempenho (RNF01) e segurança | `npm run test` |
| `features/` | Cenários Gherkin (`.feature`), copiados do documento de requisitos | — |

Regras:

- Nome dos arquivos: `<assunto>.test.ts` ou `.test.tsx`.
- **Proibido** `it.skip`, `it.todo`, `.only` e teste sem `expect` (o lint bloqueia; regra eliminatória do professor).
- Use o alias `@/` para importar do código: `import { RULES } from '@/domain'`.
- `npm run test:coverage` gera o relatório em `coverage/` (meta: 70% em `src/domain` e `src/services`).
