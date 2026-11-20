import type { FixedCommitmentInput } from '@/domain';

export interface CommitmentFormProps {
  initialValue?: FixedCommitmentInput;
  onSubmit: (input: FixedCommitmentInput) => Promise<void>;
  onCancel: () => void;
}

/** Etapa 2: implementar a partir do Figma. */
export function CommitmentForm(_props: CommitmentFormProps) {
  return <div data-component="CommitmentForm">CommitmentForm</div>;
}
