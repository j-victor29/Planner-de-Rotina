# Testes de integração

Rodam contra o **Firebase Emulator** (Auth + Firestore), nunca contra o banco real.
O projeto `demo-planner` só existe localmente.

```bash
npm run test:integration
```

Requisitos: Java 21 ou superior (o emulador do Firestore usa Java).
O comando liga os emuladores, roda `tests/integration/**/*.test.ts` e desliga tudo no final.
