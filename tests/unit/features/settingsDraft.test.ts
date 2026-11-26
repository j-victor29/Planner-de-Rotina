import { describe, expect, it } from 'vitest';
import { fromDraft, toDraft } from '@/features/profile/settingsDraft';
import { SETTINGS } from '../../helpers/fixtures';

describe('rascunho das preferências', () => {
  it('ida e volta mantém as configurações', () => {
    const settings = { ...SETTINGS, weekendLimitMinutes: 300, restDays: [0 as const] };
    expect(fromDraft(toDraft(settings))).toEqual({ settings, errors: {} });
  });

  it('lê horários e durações digitados; 24:00 vira meia-noite', () => {
    const draft = { ...toDraft(SETTINGS), bedtime: '24:00', wake: '0730', limit: '2h30' };
    expect(fromDraft(draft).settings).toMatchObject({ sleepStart: 0, sleepEnd: 450, dailyLimitMinutes: 150 });
  });

  it('aponta o erro no campo certo', () => {
    const draft = {
      ...toDraft(SETTINGS),
      bedtime: '23:15',
      limit: '20',
      weekendDifferent: true,
      weekendLimit: 'x',
    };
    expect(fromDraft(draft)).toEqual({
      settings: null,
      errors: {
        bedtime: 'Use horários de meia em meia hora (ex.: 19:00 ou 19:30).',
        weekendLimit: 'Digite a duração em horas (ex.: 2, 2:30 ou 2h30).',
      },
    });
    expect(fromDraft({ ...toDraft(SETTINGS), limit: '20' }).errors).toEqual({
      limit: 'O limite diário deve ficar entre 1 e 16 horas.',
    });
    expect(fromDraft({ ...toDraft(SETTINGS), wake: '22:00' }).errors).toEqual({
      wake: 'Os horários de dormir e acordar não podem ser iguais.',
    });
  });
});
