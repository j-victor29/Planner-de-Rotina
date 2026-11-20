# ADR 001 — Stack tecnológica

**Status:** aceita · 20/11/2026

## Contexto
Projeto acadêmico com equipe pequena, necessidade de deploy simples, autenticação segura e testes automatizados no GitHub Actions (P8).

## Decisão
- **Front-end:** Vite + React + TypeScript.
- **Back-end gerenciado:** Firebase Authentication + Cloud Firestore.
- **Hospedagem:** Vercel.
- **Testes:** Vitest + Testing Library (unitário/integração), Firebase Emulator (integração), Playwright (E2E).
- **Qualidade:** ESLint + TypeScript estrito; cobertura via Vitest (v8).

## Consequências
- Não há servidor próprio para manter; a segurança dos dados depende das regras do Firestore, que precisam ser testadas no emulador.
- Hash de senha e sessões são responsabilidade do Firebase Auth.
