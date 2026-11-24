/**
 * Sets inline styles through the CSSOM once the element exists. The CSP blocks `style` attributes
 * in markup, but not styles a script sets, so values only known at run time go through here. They
 * are absent from the static HTML, so use them only for state that JavaScript itself drives.
 */
export function runtimeStyle(styles: Record<string, string>) {
  return (el: HTMLElement | null) => {
    if (!el) return;
    for (const [property, value] of Object.entries(styles)) el.style.setProperty(property, value);
  };
}

/** The event the scroll storyteller sends when a pinned section reaches a new step. */
export interface PinStepDetail {
  readonly key: 'fx' | 'an';
  readonly index: number;
}

export const PIN_STEP_EVENT = 'uncava:pin-step';
