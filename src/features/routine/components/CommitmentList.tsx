import type { FixedCommitment } from '@/domain';

export interface CommitmentListProps {
  commitments: FixedCommitment[];
  onEdit: (commitment: FixedCommitment) => void;
  onDelete: (id: string) => void;
}

/** Etapa 2: implementar a partir do Figma. */
export function CommitmentList(_props: CommitmentListProps) {
  return <div data-component="CommitmentList">CommitmentList</div>;
}
