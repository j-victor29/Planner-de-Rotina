import { useSyncExternalStore } from 'react';

function hasMatchMedia() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/** true quando a media query combina (ex.: '(min-width: 960px)'). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (!hasMatchMedia()) return () => {};
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () => hasMatchMedia() && window.matchMedia(query).matches,
    () => false,
  );
}

export const DESKTOP_QUERY = '(min-width: 960px)';
