import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../helpers/renderApp';

describe('modo demonstração (RF14)', () => {
  it('a página inicial mostra a semana de exemplo sem login', async () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Sua semana' })).toBeInTheDocument();
    expect(screen.getByText(/semana de exemplo/i)).toBeInTheDocument();
    expect(await screen.findByRole('region', { name: 'Linha do tempo' })).toBeInTheDocument();
    expect(screen.getAllByText('Estudar para prova de Cálculo').length).toBeGreaterThan(0);
  });

  it('criar tarefa na semana pede para criar conta', async () => {
    renderApp('/');
    await userEvent.click(screen.getByRole('button', { name: 'Nova tarefa' }));
    expect(await screen.findByRole('dialog', { name: 'Criar conta' })).toBeInTheDocument();
  });

  it.each([
    ['/tarefas', 'Tarefas', 'Quer organizar as suas tarefas?'],
    ['/rotina', 'Rotina fixa', 'Quer cadastrar a sua rotina?'],
    ['/perfil', 'Perfil', 'Quer um plano feito para o seu ritmo?'],
  ])('%s mostra o exemplo com convite para criar conta', async (path, title, cta) => {
    renderApp(path);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: cta })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Nova tarefa|Novo compromisso/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Editar|^Excluir/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta grátis' }));
    expect(await screen.findByRole('dialog', { name: 'Criar conta' })).toBeInTheDocument();
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

describe('login (RF01)', () => {
  it('recuperar senha envia o link', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getAllByRole('button', { name: 'Entrar' })[0]!);
    const login = await screen.findByRole('dialog', { name: 'Entrar' });
    await user.click(within(login).getByRole('button', { name: 'Esqueci minha senha' }));

    const reset = await screen.findByRole('dialog', { name: 'Recuperar senha' });
    await user.type(within(reset).getByLabelText('E-mail da conta'), 'ana@teste.com');
    await user.click(within(reset).getByRole('button', { name: 'Enviar link' }));
    expect(await within(reset).findByText('Confira seu e-mail')).toBeInTheDocument();
  });

  it('entrar com Google leva ao passo a passo na primeira vez', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/');
    await user.click(screen.getAllByRole('button', { name: 'Entrar' })[0]!);
    await user.click(await screen.findByRole('button', { name: 'Continuar com Google' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/bem-vindo'));
    expect(await screen.findByRole('heading', { name: 'Vamos montar a sua semana' })).toBeInTheDocument();
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

describe('passo a passo (RF15)', () => {
  async function register(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: 'Começar grátis' }));
    const dialog = await screen.findByRole('dialog', { name: 'Criar conta' });
    await user.type(within(dialog).getByLabelText('Nome'), 'Ana Souza');
    await user.type(within(dialog).getByLabelText('E-mail'), 'ana@teste.com');
    await user.type(within(dialog).getByLabelText('Senha'), 'Senha123');
    await user.type(within(dialog).getByLabelText('Confirmar senha'), 'Senha123');
    await user.click(within(dialog).getByRole('button', { name: 'Criar conta' }));
    await screen.findByRole('heading', { name: 'Vamos montar a sua semana' });
  }

  it('tela cheia: sem menu e sem acesso às outras páginas até concluir', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/');
    await register(user);
    expect(screen.queryByRole('navigation', { name: 'Menu principal' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Menu inferior' })).not.toBeInTheDocument();

    await router.navigate('/tarefas');
    await waitFor(() => expect(router.state.location.pathname).toBe('/bem-vindo'));
  });

  it('avisa sono curto, aceita só meia em meia hora, permite voltar e conclui', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/');
    await register(user);

    // Passo 1: sono
    const bedtime = screen.getByLabelText('Vou dormir às');
    await user.clear(bedtime);
    await user.type(bedtime, '0100');
    expect(bedtime).toHaveValue('01:00');
    expect(screen.getByText(/Dormir menos de 8h/)).toBeInTheDocument();
    await user.clear(bedtime);
    await user.type(bedtime, '2300');
    expect(screen.queryByText(/Dormir menos de 8h/)).not.toBeInTheDocument();

    // Passo 1: compromisso com horário quebrado errado e depois certo
    await user.type(screen.getByLabelText('Nome'), 'Aula');
    await user.type(screen.getByLabelText('Começa às'), '1915');
    await user.type(screen.getByLabelText('Termina às'), '2230');
    await user.click(screen.getByRole('button', { name: 'Adicionar compromisso' }));
    expect(screen.getByText('Use horários de meia em meia hora (ex.: 19:00 ou 19:30).')).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Começa às'));
    await user.type(screen.getByLabelText('Começa às'), '1930');
    await user.click(screen.getByRole('button', { name: 'Adicionar compromisso' }));
    expect(await screen.findByRole('button', { name: 'Remover Aula' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    // Passo 2: preferências (dia de descanso) e voltar
    await screen.findByRole('heading', { name: 'Como você quer trabalhar?' });
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(await screen.findByRole('heading', { name: 'Seu sono' })).toBeInTheDocument();
    expect(screen.getByLabelText('Vou dormir às')).toHaveValue('23:00');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await screen.findByRole('heading', { name: 'Como você quer trabalhar?' });
    await user.click(screen.getByRole('button', { name: 'domingo' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    // Passo 3: primeira tarefa com duração digitada
    await user.type(await screen.findByLabelText('Título'), 'Trabalho de História');
    await user.type(screen.getByLabelText('Quanto tempo leva?'), '3h30');
    await user.click(screen.getByRole('button', { name: 'Criar e ver minha semana' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(await screen.findByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument();
    expect((await screen.findAllByText('Trabalho de História')).length).toBeGreaterThan(0);
  });
});
