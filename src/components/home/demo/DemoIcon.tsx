import type { SectorIcon } from '~/lib/home-demo/uncover';

/** Line icons drawn inside the product mock-ups, as the app draws them (24×24, 1.8 stroke). */
const paths: Record<SectorIcon | CardIcon, string> = {
  dairy: 'M8 3h8v3l2 3v12H6V9l2-3z M6 13h12 M8 6h8',
  grain:
    'M12 21V8 M12 12c-3 0-4.5-2-4.5-4.5C10 7.5 12 9 12 12z M12 12c3 0 4.5-2 4.5-4.5C14 7.5 12 9 12 12z M12 16c-3 0-4.5-2-4.5-4.5C10 11.5 12 13 12 16z M12 16c3 0 4.5-2 4.5-4.5C14 11.5 12 13 12 16z',
  food: 'M7 3v8 M5 3v4a2 2 0 0 0 4 0V3 M7 11v10 M17 21V3c-2 1.5-3 4-3 7v3h3',
  drink: 'M10 3h4v3l2 3v12H8V9l2-3z M8 12h8',
  retail: 'M5 8h14l-1 13H6z M9 8V6a3 3 0 0 1 6 0v2',
  truck:
    'M3 6h11v10H3z M14 10h4l3 3v3h-7 M5.2 18a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0 M15.2 18a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0',
  building: 'M4 21V5l8-2v18 M12 9h8v12 M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2 M3 21h18',
  box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z M4 7.5l8 4.5 8-4.5 M12 12v9',
  leaf: 'M5 19c0-8 5-14 15-15-1 10-7 15-15 15z M5 19l8-8',
  egg: 'M12 3c3.5 0 6 6 6 10a6 6 0 0 1-12 0c0-4 2.5-10 6-10z',
  factory: 'M3 21V11l5 3v-3l5 3V7h4l1 14z M3 21h18',
  coffee: 'M5 9h11v5a5 5 0 0 1-10 0z M16 10h2a2 2 0 0 1 0 4h-2 M8 3v3M11 3v3',
  clock: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 7v5l3 2',
  more: 'M3.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0 -2.4 0 M10.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0 -2.4 0 M17.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0 -2.4 0',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
  phone: 'M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M11 18h2',
  mail: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M3 7l9 6 9-6',
  chat: 'M4 5h16v11H9l-5 4z',
  calendar:
    'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M3 10h18M8 3v4M16 3v4',
};

export type CardIcon = 'clock' | 'more' | 'eye' | 'phone' | 'mail' | 'chat' | 'calendar';

interface DemoIconProps {
  name: SectorIcon | CardIcon;
  class?: string;
}

export default function DemoIcon({ name, class: className }: DemoIconProps) {
  return (
    <svg
      class={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
