export interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time';
  error?: string;
  required?: boolean;
}

/** Etapa 2: implementar a partir do Figma. */
export function TextField(_props: TextFieldProps) {
  return <div data-component="TextField">TextField</div>;
}
