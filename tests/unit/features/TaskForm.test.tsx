import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskForm } from '@/features/tasks/TaskForm';

const TODAY = '2026-11-20';

describe('TaskForm (US03)', () => {
  it('envia a tarefa com a duração em minutos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<TaskForm today={TODAY} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Título'), 'TCC');
    await userEvent.clear(screen.getByLabelText('Duração (horas)'));
    await userEvent.type(screen.getByLabelText('Duração (horas)'), '10');
    await userEvent.selectOptions(screen.getByLabelText('e minutos'), '30');
    await userEvent.click(screen.getByRole('radio', { name: 'Alta' }));
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'TCC',
      durationMinutes: 630,
      deadline: '2026-11-27',
      priority: 'alta',
    });
  });

  it('mostra os erros de validação e não envia (RN01, RN02)', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm today={TODAY} onSubmit={onSubmit} />);

    await userEvent.clear(screen.getByLabelText('Duração (horas)'));
    await userEvent.type(screen.getByLabelText('Duração (horas)'), '0');
    const deadline = screen.getByLabelText('Prazo');
    await userEvent.clear(deadline);
    await userEvent.type(deadline, '2026-11-19');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('Informe o título da tarefa.')).toBeInTheDocument();
    expect(screen.getByText('A duração deve ser maior que zero.')).toBeInTheDocument();
    expect(screen.getByText('O prazo não pode ser anterior a hoje.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
