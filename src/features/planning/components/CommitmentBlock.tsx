import type { FixedCommitment } from '@/domain';

export interface CommitmentBlockProps {
  commitment: FixedCommitment;
}

/** Etapa 2: implementar a partir do Figma. */
export function CommitmentBlock(_props: CommitmentBlockProps) {
  return <div data-component="CommitmentBlock">CommitmentBlock</div>;
}
