export type IconName =
  | 'plus'
  | 'chevron-left'
  | 'chevron-right'
  | 'lock'
  | 'unlock'
  | 'check'
  | 'calendar'
  | 'list'
  | 'clock'
  | 'user'
  | 'logout'
  | 'trash'
  | 'edit'
  | 'alert'
  | 'close'
  | 'sparkle'
  | 'repeat'
  | 'move';

const PATHS: Record<IconName, string> = {
  plus: 'M12 5v14M5 12h14',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  lock: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z',
  unlock: 'M7 11V7a5 5 0 0 1 9.9-1M5 11h14v10H5z',
  check: 'M20 6 9 17l-5-5',
  calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  clock: 'M12 7v5l3 3M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  user: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  logout: 'M9 21H5V3h4M16 17l5-5-5-5M21 12H9',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  alert:
    'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  close: 'M18 6 6 18M6 6l12 12',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
  move: 'M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20',
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  /** Texto para leitores de tela; sem ele o ícone é decorativo. */
  title?: string;
}

export function Icon({ name, size = 20, className, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path d={PATHS[name]} />
    </svg>
  );
}
