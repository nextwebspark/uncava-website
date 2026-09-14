export type SecurityIcon = 'grid' | 'mail' | 'eye' | 'shield-minus';

export interface SecurityPoint {
  readonly icon: SecurityIcon;
  readonly title: string;
  readonly body: string;
  readonly shortBody: string;
}

export const securityPoints: readonly SecurityPoint[] = [
  {
    icon: 'grid',
    title: 'Isolated workspaces',
    body: 'Every read is scoped to your firm’s workspace on the server. Another firm’s data is never one bad link away.',
    shortBody: 'Every read is scoped to your firm on the server.',
  },
  {
    icon: 'mail',
    title: 'Invitation-only',
    body: 'No one joins a workspace by signing up with the right email domain. Every member arrives by invitation.',
    shortBody: 'Every member arrives by invitation.',
  },
  {
    icon: 'eye',
    title: 'Read-only client seats',
    body: 'Clients see only the mandates they’re attached to. Access is checked on every request, not remembered.',
    shortBody: 'Clients see their own mandates and edit nothing.',
  },
  {
    icon: 'shield-minus',
    title: 'Spreadsheets stay out of the model',
    body: 'When AI helps map a spreadsheet it sees column headers and value shapes — never the names, salaries or notes in the cells.',
    shortBody: 'AI sees spreadsheet headers, never cell values.',
  },
];
