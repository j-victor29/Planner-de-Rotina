# ADR 003 — Planejamento determinístico no cliente

**Status:** aceita · 20/11/2026

## Contexto
O plano precisa ser reproduzível para ser testável (RNF06) e rápido (RNF01). Não há servidor próprio.

## Decisão
O algoritmo é uma **função pura** em `src/domain/planner/generatePlan.ts`, executada no navegador. Ele não lê relógio nem gera números aleatórios: o instante atual chega como parâmetro (`now`). A ordenação segue RN06 (prazo → prioridade → menor duração restante → criação), sempre com desempate total.

## Consequências
- Mesma entrada → mesmo plano, verificável por teste.
- Nenhuma IA é usada no planejamento.
- Se o volume crescer muito, o algoritmo pode ser movido para uma Cloud Function sem mudar a interface do domínio.
