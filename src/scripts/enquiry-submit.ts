/**
 * The function answers in a second or two (longer on a cold start) and the page stays put until
 * then, so the button says it is working. Without JavaScript the form still posts, just silently.
 */
export function showSendingOnSubmit(form: Element | null): void {
  if (!(form instanceof HTMLFormElement)) return;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!button) return;
  const label = button.textContent;

  form.addEventListener('submit', (event) => {
    if (button.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }
    button.textContent = 'Sending…';
    button.setAttribute('aria-disabled', 'true');
    button.classList.add('cursor-wait');
    form.setAttribute('aria-busy', 'true');
  });

  // Back from the thanks page restores this page from cache with the button still "Sending…".
  window.addEventListener('pageshow', () => {
    button.textContent = label;
    button.removeAttribute('aria-disabled');
    button.classList.remove('cursor-wait');
    form.removeAttribute('aria-busy');
  });
}
