# GitHub Actions — responsável: **Calvo**

O arquivo `ci.yml` deve ficar nesta pasta (exigência do professor). Passos que o projeto já suporta:

```bash
npm ci
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

- Node: versão em `.nvmrc` (24).
- O relatório de cobertura sai em `coverage/` (`lcov.info` e `coverage-summary.json`) para gerar o badge.
- Os badges de CI e cobertura vão no `README.md` da raiz.
- Deploy na Vercel: as variáveis `VITE_FIREBASE_*` de `.env.example` precisam ser cadastradas no projeto da Vercel.
