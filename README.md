# Planner de Rotina

[![CI](https://github.com/j-victor29/Planner-de-Rotina/actions/workflows/ci.yml/badge.svg)](https://github.com/j-victor29/Planner-de-Rotina/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/j-victor29/Planner-de-Rotina/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19-blue.svg)](.nvmrc)

Sistema que organiza a rotina e decide **quando** fazer cada tarefa. O usuário cadastra a rotina fixa (aula, trabalho, sono) e as tarefas com duração, prazo e prioridade; o sistema distribui blocos de trabalho nos horários livres das semanas até o prazo, respeitando o limite diário. Se não houver tempo suficiente, ele avisa em vez de montar um plano impossível.

O planejamento usa um **algoritmo determinístico** (prazo mais próximo e prioridade), sem IA: os mesmos dados geram sempre o mesmo plano.

**Aplicação publicada (Vercel):** https://planner-de-rotina.vercel.app/

## O que já foi implementado

### Front-end e Domínio (Etapa 2)
- **Algoritmo determinístico (`src/domain/planner/generatePlan.ts`):** distribuição dos blocos até o prazo respeitando janela de sono, limite diário e de fim de semana, dias de descanso, pausa entre blocos, período preferido, blocos fixados/concluídos e alertas de capacidade.
- **Rotas e interface (`src/features/`, `src/app/`):**
  - `/` — Visão semanal em linha do tempo (domingo a sábado no desktop e por dia no celular), com navegação entre semanas, legenda de prioridades, painel lateral de tarefas e ações nos blocos (mover, fixar e concluir).
  - `/tarefas` — Cadastro, listagem, prioridades, prazos e progresso no plano.
  - `/rotina` — Gerenciamento de compromissos fixos recorrentes.
  - `/perfil` — Preferências de sono, limite diário/fim de semana, período preferido, dias de descanso, pausa entre blocos e exclusão de conta.
  - `/bem-vindo` — Onboarding guiado em tela cheia (sono, compromissos, preferências e primeira tarefa).
- **Tema e modo demonstração:** tema claro/escuro, layout responsivo a partir de 360 px e modo demonstração pré-populado com serviços em memória (`npm run dev:mock`).

### Back-end e Infraestrutura (Etapa 3)
- **Firebase Authentication (`src/infra/firebase/`):** cadastro, login com e-mail/senha, login com Google, recuperação de senha e exclusão de conta com reautenticação.
- **Cloud Firestore (`firestore.rules`):** persistência de rotina, tarefas, preferências, plano e perfil isolados por usuário.
- **Deploy na Vercel (`vercel.json`):** hospedagem SPA publicada e funcional em [planner-de-rotina.vercel.app](https://planner-de-rotina.vercel.app/).

### Qualidade e CI/CD
- **Testes (`tests/`):** suíte unitária (`unit/`), de integração com Firebase Emulator (`integration/`) e não funcional de desempenho (`non-functional/`).
- **GitHub Actions (`.github/workflows/ci.yml`):** pipeline de CI e templates de Issues (`.github/ISSUE_TEMPLATE/`).

## Módulos

1. **Contas e perfil** — cadastro, login, limite diário, janela de horário.
2. **Rotina e tarefas** — compromissos fixos e tarefas.
3. **Planejamento** — geração do plano, visão semanal, mover, fixar e concluir blocos, alertas.

## Tecnologias

Vite · React · TypeScript · Firebase (Auth + Firestore) · Vercel · Vitest · Testing Library · ESLint

## Como rodar

Requisitos: Node.js 20.19 ou superior (recomendado: versão do `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # preencha as variáveis do Firebase (etapa 3)
npm run dev                  # http://localhost:5173
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (usa o Firebase do `.env.local`) |
| `npm run dev:mock` | Servidor sem Firebase, com dados só no navegador |
| `npm run build` | Checa tipos e gera a versão de produção em `dist/` |
| `npm run lint` | Análise estática (ESLint) |
| `npm run typecheck` | Checagem de tipos |
| `npm run test` | Testes automatizados |
| `npm run test:coverage` | Testes + relatório de cobertura em `coverage/` |
| `npm run test:integration` | Testes com o Firebase Emulator (precisa de Java 21+) |
| `npm run emulators` | Sobe os emuladores do Firebase (Auth + Firestore) |
| `npm run deploy:rules` | Publica `firestore.rules` no projeto Firebase |

## Estrutura

```
src/        código da aplicação (ver docs/arquitetura)
tests/      unit, integration, e2e, non-functional, features (Gherkin)
docs/       arquitetura, requisitos, relatório, design, testes, uso de IA
.github/    workflows do GitHub Actions
```

Arquitetura: [docs/arquitetura/README.md](docs/arquitetura/README.md) · Como contribuir: [CONTRIBUTING.md](CONTRIBUTING.md)

## Equipe

| Papel | Integrante |
|---|---|
| Dev fullstack e arquiteto | Cauã Vital |
| Product Owner e requisitos | Eduardo Vinícius |
| DevOps, CI/CD e repositório | João Victor |
| Interface e usabilidade | Gabriel Cesar |
| Testes | José Bruno |

## Versões

Ver [CHANGELOG.md](CHANGELOG.md).
