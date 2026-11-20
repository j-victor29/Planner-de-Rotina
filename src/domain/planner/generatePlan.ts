import type { PlanInput, PlanResult } from '../types';

/**
 * RF04, RF09, RF10 — algoritmo de planejamento.
 *
 * Função pura e determinística (RNF06): sem Date.now(), Math.random() ou I/O.
 * O instante atual chega em `input.now`.
 *
 * Passos previstos:
 * 1. Calcular os intervalos livres por dia (janela do usuário − compromissos fixos
 *    − blocos fixados/concluídos), a partir de `now` (P11).
 * 2. Ordenar as tarefas (RN06): prazo → prioridade → menor duração restante → criação.
 * 3. Para cada tarefa, distribuir blocos de 30 min a 2 h (RN07) ao longo dos dias
 *    até o prazo, respeitando o limite diário (RN04).
 * 4. O que não couber vira PlanAlert (RF10).
 *
 * Implementação: etapa 2 (com testes unitários).
 */
export function generatePlan(_input: PlanInput): PlanResult {
  throw new Error('generatePlan: não implementado (etapa 2)');
}
