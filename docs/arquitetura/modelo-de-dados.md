# Modelo de dados (Firestore)

Todos os dados ficam sob o documento do usuário. Isso simplifica as regras de segurança (RNF05) e a exclusão de conta (RF13).

```
users/{uid}                         perfil: name, email, createdAt
users/{uid}/settings/main           dailyLimitMinutes, windowStart, windowEnd
users/{uid}/commitments/{id}        title, weekdays[], start, end
users/{uid}/tasks/{id}              title, durationMinutes, deadline, priority, createdAt
users/{uid}/blocks/{id}             taskId, date, start, end, pinned, done
```

- Horários do dia em **minutos desde 00:00**; datas como `YYYY-MM-DD`; instantes como `YYYY-MM-DDTHH:mm` (horário local).
- Dias da semana: `0` = domingo … `6` = sábado.
- Senhas nunca passam pelo Firestore: ficam só no Firebase Authentication (RNF02).
- Regras: `firestore.rules` na raiz (cada `uid` só acessa `users/{uid}/**`).
