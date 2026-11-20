# Modelo de dados (Firestore)

Todos os dados ficam sob o documento do usuário. Isso simplifica as regras de segurança (RNF05) e a exclusão de conta (RF13).

```
users/{uid}                         perfil: name, email, createdAt
users/{uid}/settings/main           dailyLimitMinutes, windowStart, windowEnd
users/{uid}/commitments/{id}        title, weekdays[], start, end
users/{uid}/tasks/{id}              title, durationMinutes, deadline, priority, createdAt
users/{uid}/blocks/{id}             taskId, start, end, pinned, done
```

- Horários do dia em **minutos desde 00:00**; prazos como `YYYY-MM-DD`; instantes em ISO 8601.
- Senhas nunca passam pelo Firestore: ficam só no Firebase Authentication (RNF02).
- Regras: `firestore.rules` na raiz (cada `uid` só acessa `users/{uid}/**`).
