# ADR 002 — Arquitetura em camadas com contratos

**Status:** aceita · 20/11/2026

## Contexto
O front-end (etapa 2) é feito antes do back-end (etapa 3) e precisa aceitar o Firebase sem retrabalho. A disciplina exige arquitetura testável e cobertura ≥ 70% nos serviços de negócio.

## Decisão
Separar `domain` (regras puras), `services` (contratos e orquestração), `infra` (mock e Firebase) e interface (`features`, `components`). A interface acessa dados só pelos contratos, via `useServices()`.

## Consequências
- Etapa 2 usa `infra/mock`; etapa 3 troca para `infra/firebase` mudando `VITE_DATA_SOURCE`.
- Domínio e serviços são testáveis sem navegador nem banco.
