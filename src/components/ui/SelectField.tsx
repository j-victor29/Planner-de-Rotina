export interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
}

/** Etapa 2: implementar a partir do Figma. */
export function SelectField(_props: SelectFieldProps) {
  return <div data-component="SelectField">SelectField</div>;
}
