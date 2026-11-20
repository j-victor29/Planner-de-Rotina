export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
}

/** Etapa 2: implementar a partir do Figma. */
export function LoginForm(_props: LoginFormProps) {
  return <div data-component="LoginForm">LoginForm</div>;
}
