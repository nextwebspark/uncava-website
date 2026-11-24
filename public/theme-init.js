/*
 * Applies the reader's light/dark choice before first paint on the blog, docs and legal pages.
 * A classic, render-blocking file rather than an inline script, so the CSP stays 'self' only.
 * The key matches THEME_STORAGE_KEY in src/lib/theme.ts (tests/theme-init.test.ts checks it).
 */
(function () {
  var scheme = 'dark';
  try {
    if (window.localStorage.getItem('uncava-theme') === 'light') scheme = 'light';
  } catch {
    /* Storage blocked: keep the default. */
  }
  document.documentElement.dataset.theme = scheme;
})();
