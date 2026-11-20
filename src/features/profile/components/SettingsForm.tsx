import type { UserSettings } from '@/domain';

export interface SettingsFormProps {
  value: UserSettings;
  onSubmit: (settings: UserSettings) => Promise<void>;
}

/** RF11, RF12 — limite diário e janela de horário. Etapa 2. */
export function SettingsForm(_props: SettingsFormProps) {
  return <div data-component="SettingsForm">SettingsForm</div>;
}
