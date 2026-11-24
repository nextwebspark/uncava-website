import { oppositeScheme, parseScheme, THEME_STORAGE_KEY } from '~/lib/theme';

const root = document.documentElement;

function remember(scheme: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, scheme);
  } catch {
    // Storage blocked: the switch still applies to this page.
  }
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  button.hidden = false;
  button.addEventListener('click', () => {
    const next = oppositeScheme(parseScheme(root.dataset['theme']));
    // Hover and colour transitions would otherwise fade each element at its own pace.
    root.classList.add('theme-switching');
    root.dataset['theme'] = next;
    remember(next);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove('theme-switching')),
    );
  });
}
