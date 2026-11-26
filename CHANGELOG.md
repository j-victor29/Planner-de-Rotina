# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Etapa 3 — Back-end (Firebase)
- Firebase Authentication: cadastro, login com e-mail e senha, login com Google, recuperação de senha e exclusão de conta com confirmação de identidade.
- Cloud Firestore: rotina, tarefas, preferências, plano e perfil por usuário; regras de segurança testadas no emulador.
- Passo a passo obrigatório em tela cheia (sono, compromissos, preferências, primeira tarefa), com voltar entre etapas.
- Sono define quando o planner pode colocar blocos (atravessa a meia-noite); aviso para menos de 8 h.
- Preferências novas: dias de descanso, período preferido, pausa entre blocos e limite no fim de semana.
- Horários e durações digitados (meia em meia hora).
- Modo demonstração com convite para criar conta em Tarefas, Rotina e Perfil.

### Etapa 2 — Front-end
- Algoritmo de planejamento (`generatePlan`) determinístico, com espalhamento dos blocos até o prazo, limite diário, janela de horário, blocos fixados/concluídos e alertas.
- Validações de tarefa, compromisso, preferências e cadastro.
- Serviços em memória (mock) com login simulado e isolamento entre contas; modo demonstração.
- Interface: linha do tempo de domingo a sábado (desktop) e por dia (celular), detalhes do bloco (mover, fixar, concluir), tarefas, rotina, perfil, login/cadastro em modal e passo a passo inicial.
- Tema claro e escuro, layout responsivo a partir de 360 px.

### Adicionado
- Esqueleto do projeto: Vite + React + TypeScript, camadas `domain`/`services`/`infra`/`features`.
- Contratos de serviços e tipos do domínio.
- Componentes e páginas vazios dos três módulos.
- Regras do Firestore com isolamento por usuário.
- Configuração de testes (Vitest), cobertura, lint e deploy na Vercel.
- Pastas e guias da equipe (requisitos, design, testes, CI).
