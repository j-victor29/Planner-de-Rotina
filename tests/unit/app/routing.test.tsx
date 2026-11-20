import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

// Garante que cada rota abre a página certa (teste de fumaça do esqueleto).
describe('rotas', () => {
  it.each([
    ['/login', 'Entrar'],
    ['/cadastro', 'Criar conta'],
    ['/', 'Semana'],
    ['/tarefas', 'Tarefas'],
    ['/rotina', 'Rotina fixa'],
    ['/perfil', 'Perfil'],
  ])('%s mostra a página "%s"', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  });

  it('páginas logadas mostram o menu principal', () => {
    renderAt('/');
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument();
  });
});
