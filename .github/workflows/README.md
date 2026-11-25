# GitHub Actions & CI/CD — Responsável: João Victor (Calvo)

Este diretório contém a especificação dos fluxos de automação e integração contínua (CI) do projeto **Planner de Rotina**.

## 1. Pipeline de Integração Contínua (`ci.yml`)

O workflow é executado automaticamente em:
- Todo `push` direcionado à branch `main`.
- Todo `pull_request` aberto ou atualizado.

### Recursos de Segurança e Eficiência
- **Concorrência Inteligente:** Utiliza `concurrency` com `cancel-in-progress: true` no grupo `ci-${{ github.ref }}`, cancelando execuções obsoletas para economizar minutos de execução e feedback rápido.
- **Node.js Padronizado:** A versão é extraída diretamente do arquivo `.nvmrc` (Node.js 24), garantindo paridade entre desenvolvimento local e ambiente de runner.
- **Cache de Dependências:** Configurado `cache: npm` no `actions/setup-node@v4` para acelerar o tempo de instalação via `npm ci`.
- **Barreira Contra Testes Ignorados:** Antes dos testes, uma etapa em shell script inspeciona os arquivos de teste via `grep` regex para barrar qualquer uso acidental de `.skip`, `.todo`, `.only`, `xit(` ou `xdescribe(`. Isso impede que testes desabilitados mascarem regressões.

### Etapas de Validação Sequencial

1. `npm ci` — Instalação limpa e reproduzível das dependências a partir do `package-lock.json`.
2. `Bloquear testes ignorados` — Inspeção estática de integridade da suíte de testes.
3. `npm run lint` — Análise estática com ESLint (regras TypeScript, React e React Hooks).
4. `npm run typecheck` — Validação estrita de tipos com `tsc -b`.
5. `npm run test:coverage` — Execução da suíte de testes unitários com Vitest + V8, validando thresholds de cobertura.
6. `npm run build` — Compilação de tipos e empacotamento de produção via Vite (`dist/`).
7. `Upload do Artefato de Cobertura` — Coleta a pasta `coverage/` (incluindo `lcov.info` e relatórios HTML) através de `actions/upload-artifact@v4` com execução condicional `if: always()`.

---

## 2. Como Reproduzir a Validação Localmente

Antes de enviar commits para o repositório, execute a esteira completa:

```bash
# Instalar dependências exatas
npm ci

# Executar checagens de qualidade e cobertura
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

---

## 3. Deploy Contínuo (Vercel)

A publicação da aplicação é realizada via integração contínua com a plataforma **Vercel** (`vercel.json`), configurada para o framework Vite com destino em `dist/` e rewrites para SPA.

### Variáveis de Ambiente Necessárias (Produção / Preview):
As credenciais do Firebase especificadas em `.env.example` devem estar cadastradas nas configurações de ambiente do projeto na Vercel:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
