# Planner de Rotina

<!-- Badges de CI e cobertura: adicionados pelo Calvo junto com o ci.yml -->

Sistema que organiza a rotina e decide **quando** fazer cada tarefa. O usuário cadastra a rotina fixa (aula, trabalho, sono) e as tarefas com duração, prazo e prioridade; o sistema distribui blocos de trabalho nos horários livres das semanas até o prazo, respeitando o limite diário. Se não houver tempo suficiente, ele avisa em vez de montar um plano impossível.

O planejamento usa um **algoritmo determinístico** (prazo mais próximo e prioridade), sem IA: os mesmos dados geram sempre o mesmo plano.

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
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checa tipos e gera a versão de produção em `dist/` |
| `npm run lint` | Análise estática (ESLint) |
| `npm run typecheck` | Checagem de tipos |
| `npm run test` | Testes automatizados |
| `npm run test:coverage` | Testes + relatório de cobertura em `coverage/` |

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
