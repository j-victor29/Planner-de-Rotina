import { describe, expect, it } from 'vitest';
import { isValidEmail, validateSignIn, validateSignUp } from '@/domain';

describe('validateSignUp (RF01)', () => {
  const valid = { name: 'Ana', email: 'ana@teste.com', password: 'Senha123', confirmPassword: 'Senha123' };

  it('aceita dados válidos', () => {
    expect(validateSignUp(valid)).toEqual({});
  });

  it('senha com 7 caracteres é rejeitada; com 8 é aceita (BVA)', () => {
    expect(validateSignUp({ ...valid, password: '1234567', confirmPassword: '1234567' }).password).toBeDefined();
    expect(validateSignUp({ ...valid, password: '12345678', confirmPassword: '12345678' }).password).toBeUndefined();
  });

  it('rejeita nome vazio, e-mail inválido e senhas diferentes', () => {
    const errors = validateSignUp({ name: ' ', email: 'ana@', password: 'Senha123', confirmPassword: 'x' });
    expect(Object.keys(errors).sort()).toEqual(['confirmPassword', 'email', 'name']);
  });
});

describe('validateSignIn', () => {
  it('exige e-mail válido e senha', () => {
    expect(validateSignIn('', '')).toEqual({
      email: 'Informe um e-mail válido.',
      password: 'Informe sua senha.',
    });
    expect(validateSignIn('ana@teste.com', 'x')).toEqual({});
    expect(isValidEmail(' ana@teste.com ')).toBe(true);
  });
});
