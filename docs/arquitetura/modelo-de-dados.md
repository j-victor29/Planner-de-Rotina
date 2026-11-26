# Modelo de dados (Firestore)

Todos os dados ficam sob o documento do usuário. Isso simplifica as regras de segurança (RNF05) e a exclusão de conta (RF13).

```
users/{uid}                         name, email, onboardingCompleted, createdAt
users/{uid}/settings/main           dailyLimitMinutes, weekendLimitMinutes, sleepStart, sleepEnd,
                                    preferredPeriod, restDays[], breakMinutes
users/{uid}/commitments/{id}        title, weekdays[], start, end
users/{uid}/tasks/{id}              title, durationMinutes, deadline, priority, createdAt
users/{uid}/plan/current            blocks[]: { id, taskId, date, start, end, pinned, done }
```

- O plano fica em **um único documento** (`plan/current`): cada recálculo grava tudo de uma vez, sem deixar blocos pela metade.
- Horários do dia em **minutos desde 00:00**; datas como `YYYY-MM-DD`; instantes como `YYYY-MM-DDTHH:mm` (horário local).
- Dias da semana: `0` = domingo … `6` = sábado.
- O sono pode atravessar a meia-noite (ex.: `sleepStart` 1380 = 23:00, `sleepEnd` 420 = 07:00).
- Senhas nunca passam pelo Firestore: ficam só no Firebase Authentication (RNF02).
- Regras: `firestore.rules` na raiz (cada `uid` só acessa `users/{uid}/**`). Testadas no emulador em `tests/integration/`.
