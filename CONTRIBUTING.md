# Como contribuir

Todos commitam direto na branch `main`, cada um na sua pasta, para evitar conflitos.

## Quem cuida de cada pasta

| Pasta | Responsável |
|---|---|
| `src/`, `docs/arquitetura/`, arquivos de configuração da raiz | Arquiteto / Dev fullstack |
| `docs/requisitos/`, `docs/relatorio/` | Eduardo Vinicius |
| `docs/design/` | Gabriel Cesar |
| `tests/`, `docs/testes/` | José Bruno |
| `.github/` | João Victor |
| `docs/ia/registro-uso-ia.md` | Todos |

Precisa mudar algo na pasta de outra pessoa? Abra uma **Issue** ou combine com ela.

## Commitando pelo site do GitHub (sem instalar nada)

1. Abra a sua pasta no GitHub.
2. Para editar: clique no arquivo → ícone de lápis → edite → **Commit changes**.
3. Para enviar arquivos (prints, .docx, .pdf): **Add file → Upload files** → **Commit changes**.
4. Antes de editar, recarregue a página para pegar a versão mais nova.

## Mensagens de commit

Formato: `tipo(área): descrição curta no presente`

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | nova funcionalidade | `feat(tasks): formulário de tarefa` |
| `fix` | correção de bug | `fix(planning): bloco ultrapassava o limite diário` |
| `test` | testes | `test(unit): BVA do limite diário` |
| `docs` | documentação | `docs(requisitos): adiciona personas` |
| `ci` | GitHub Actions | `ci: roda testes com cobertura` |
| `chore` | configuração, dependências | `chore: atualiza dependências` |

## Bugs

Abra uma **Issue** com: passos para reproduzir, resultado esperado, resultado obtido e print.

## Versões

- `v0.1.0` — primeira versão completa para testes (fim da etapa 3).
- `v1.0.0` — versão final após correções (etapa 4).
