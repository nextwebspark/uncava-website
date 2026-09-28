export interface AiSafeguard {
  readonly title: string;
  readonly body: string;
  readonly shortTitle: string;
  readonly shortBody: string;
}

export const aiSafeguards: readonly AiSafeguard[] = [
  {
    title: 'Marked in purple.',
    body: 'AI output is labelled, with its sources or the sentence it came from.',
    shortTitle: 'Marked in purple',
    shortBody: 'Labelled, with its sources.',
  },
  {
    title: 'Suggestions, not decisions.',
    body: 'Nothing is filed or written until a consultant chooses.',
    shortTitle: 'Suggestions only',
    shortBody: 'A consultant decides.',
  },
  {
    title: 'Names pseudonymised.',
    body: 'Client names and contact details are masked before text reaches the model.',
    shortTitle: 'Names pseudonymised',
    shortBody: 'Masked before the model.',
  },
  {
    title: 'Guarded and budgeted.',
    body: 'Prompt-injection guards and per-user limits on every AI call.',
    shortTitle: 'Guarded and budgeted',
    shortBody: 'Per-user limits on AI.',
  },
];
