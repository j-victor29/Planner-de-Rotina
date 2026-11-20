import type { SignUpData } from '@/services';

export interface RegisterFormProps {
  onSubmit: (data: SignUpData) => Promise<void>;
  error?: string;
}

/** Etapa 2: implementar a partir do Figma. */
export function RegisterForm(_props: RegisterFormProps) {
  return <div data-component="RegisterForm">RegisterForm</div>;
}
