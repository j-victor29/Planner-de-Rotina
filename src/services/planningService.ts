import type { AppServices } from './AppServices';
import type { PlanResult } from '@/domain';

/**
 * RF04 / RF09 — orquestra o recálculo: lê os dados nos repositórios,
 * chama generatePlan (domínio puro) e salva o resultado.
 * Implementação: etapa 2.
 */
export async function recalculatePlan(
  _services: AppServices,
  _now: string,
): Promise<PlanResult> {
  throw new Error('recalculatePlan: não implementado (etapa 2)');
}
