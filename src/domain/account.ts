/** RF01 — dados do formulário de cadastro. */
export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/** RF01, RNF02 — valida o cadastro antes de enviar ao provedor de autenticação. */
export function validateSignUp(input: SignUpInput): Partial<Record<keyof SignUpInput, string>> {
  const errors: Partial<Record<keyof SignUpInput, string>> = {};
  if (!input.name.trim()) errors.name = 'Informe seu nome.';
  if (!isValidEmail(input.email)) errors.email = 'Informe um e-mail válido.';
  if (input.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = 'As senhas não conferem.';
  }
  return errors;
}

/** RF01 — valida o login (só formato; a senha é conferida pelo provedor). */
export function validateSignIn(email: string, password: string): { email?: string; password?: string } {
  const errors: { email?: string; password?: string } = {};
  if (!isValidEmail(email)) errors.email = 'Informe um e-mail válido.';
  if (!password) errors.password = 'Informe sua senha.';
  return errors;
}
