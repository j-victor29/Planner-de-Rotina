import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

// Exemplo de teste unitário de componente (modelo para a equipe).
describe('Button', () => {
  it('mostra o texto e chama onClick ao clicar', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Gerar plano</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Gerar plano' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fica desabilitado e não dispara onClick enquanto carrega', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Salvar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Salvar' });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(onClick).not.toHaveBeenCalled();
  });
});
