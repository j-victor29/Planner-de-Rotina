import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../helpers/renderApp';

describe('modo demonstração', () => {
  it('a página inicial mostra a semana de exemplo sem login', async () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Sua semana' })).toBeInTheDocument();
    expect(screen.getByText(/semana de exemplo/i)).toBeInTheDocument();
    expect(await screen.findByRole('region', { name: 'Linha do tempo' })).toBeInTheDocument();
    expect(screen.getAllByText('Estudar para prova de Cálculo').length).toBeGreaterThan(0);
  });

  it('qualquer ação pede para criar conta', async () => {
    renderApp('/');
    await userEvent.click(screen.getByRole('button', { name: 'Nova tarefa' }));
    expect(await screen.findByRole('dialog', { name: 'Criar conta' })).toBeInTheDocument();
  });

  it.each([
    ['/tarefas', 'Tarefas'],
    ['/rotina', 'Rotina fixa'],
    ['/perfil', 'Perfil'],
  ])('%s abre a página "%s"', (path, title) => {
    renderApp(path);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  });

  it('rota desconhecida volta para a semana', () => {
    renderApp('/nao-existe');
    expect(screen.getByRole('heading', { level: 1, name: 'Sua semana' })).toBeInTheDocument();
  });

  it('o passo a passo exige login', async () => {
    renderApp('/bem-vindo');
    expect(screen.getByRole('heading', { level: 1, name: 'Sua semana' })).toBeInTheDocument();
    expect(await screen.findByRole('dialog', { name: 'Entrar' })).toBeInTheDocument();
  });
});

describe('cadastro e primeira tarefa (US01, US03)', () => {
  it('cadastra, passa pelo passo a passo e vê a tarefa planejada', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/');
    await user.click(screen.getAllByRole('button', { name: /Começar grátis|Criar conta/ })[0]!);

    const dialog = await screen.findByRole('dialog', { name: 'Criar conta' });
    await user.type(within(dialog).getByLabelText('Nome'), 'Ana Souza');
    await user.type(within(dialog).getByLabelText('E-mail'), 'ana@teste.com');
    await user.type(within(dialog).getByLabelText('Senha'), 'Senha123');
    await user.type(within(dialog).getByLabelText('Confirmar senha'), 'Senha123');
    await user.click(within(dialog).getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByRole('heading', { name: 'Vamos montar a sua semana' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/bem-vindo');

    await user.click(screen.getByRole('button', { name: 'Pular por enquanto' }));
    await user.click(await screen.findByRole('button', { name: 'Salvar e continuar' }));

    await user.type(await screen.findByLabelText('Título'), 'Trabalho de História');
    await user.click(screen.getByRole('button', { name: 'Criar e ver minha semana' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(screen.queryByText(/semana de exemplo/i)).not.toBeInTheDocument();
    expect((await screen.findAllByText('Trabalho de História')).length).toBeGreaterThan(0);
  });

  it('cadastro com senhas diferentes mostra erro', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Começar grátis' }));
    const dialog = await screen.findByRole('dialog', { name: 'Criar conta' });
    await user.type(within(dialog).getByLabelText('Senha'), 'Senha123');
    await user.type(within(dialog).getByLabelText('Confirmar senha'), 'Outra123');
    await user.click(within(dialog).getByRole('button', { name: 'Criar conta' }));
    expect(within(dialog).getByText('As senhas não conferem.')).toBeInTheDocument();
    expect(within(dialog).getByText('Informe seu nome.')).toBeInTheDocument();
  });
});
