import { PIN_STEP_EVENT, type PinStepDetail } from '~/components/home/demo/runtime-style';
import { stageDetail, stages } from '~/lib/home-demo/stages';

/**
 * Scroll storytelling for the home page, from the artboard: on a desktop-sized window the Map /
 * Assess / Rank / Report tabs and the six search stages pin to the screen and advance with the
 * scroll, and section headings fade up as they arrive. Phones, tall screens and reduced motion
 * keep the ordinary page. Each pinned section collapses once scrolled past, so going back up is
 * quick.
 */
export function startHomeStory(): void {
  const wanted =
    window.innerHeight < 1300 &&
    window.innerWidth > 1000 &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!wanted) return;

  const root = document.documentElement;
  root.classList.add('uv-scrolly');

  const lastStep: Record<string, number> = {};
  let lastY: number | undefined;
  let quietUntil = 0;
  let measuredFor = '';
  let measuredAt = 0;
  let panelWidth = 0;
  let frame = 0;

  const jumpTo = (top: number) => {
    window.scrollTo({ top, behavior: 'instant' });
    lastY = window.scrollY;
    quietUntil = Date.now() + 120;
    return top;
  };

  const sizeStagesPanel = (inner: HTMLElement) => {
    const panel = inner.querySelector<HTMLElement>('.an-text');
    if (!panel || panel.offsetWidth === panelWidth) return;
    panelWidth = panel.offsetWidth;
    // Measure the tallest stage's copy off-screen so the panel never jumps as stages change.
    const probe = panel.cloneNode(true) as HTMLElement;
    for (const [property, value] of [
      ['position', 'absolute'],
      ['visibility', 'hidden'],
      ['height', 'auto'],
      ['width', `${panel.offsetWidth}px`],
      ['left', '0'],
      ['top', '0'],
    ] as const) {
      probe.style.setProperty(property, value, 'important');
    }
    panel.parentNode?.appendChild(probe);
    const heading = probe.querySelector('h3');
    const weeks = heading?.nextElementSibling;
    const values = probe.querySelectorAll('.an-row > :last-child');
    let tallest = 0;
    stages.forEach((stage, i) => {
      if (heading) heading.textContent = `${i + 1}. ${stage.name}`;
      if (weeks) weeks.textContent = stage.weeks;
      stageDetail(stage).forEach((row, r) => {
        const cell = values[r];
        if (cell) cell.textContent = row.value;
      });
      tallest = Math.max(tallest, probe.scrollHeight);
    });
    probe.remove();
    if (tallest) inner.style.setProperty('--aph', `${Math.ceil(tallest + 14)}px`);
  };

  const header = document.querySelector<HTMLElement>('.site-header');

  const tick = () => {
    const viewport = window.innerHeight;
    // The header stays fixed over the page, so a pinned section sticks just below it.
    const headerHeight = header?.offsetHeight ?? 0;
    const pinHeight = viewport - headerHeight;
    let y = window.scrollY;
    const now = Date.now();
    const quiet = now < quietUntil;
    const goingUp = !quiet && lastY !== undefined && y < lastY - 6;
    const goingDown = !quiet && lastY !== undefined && y > lastY + 2;
    lastY = y;

    const key = `${viewport}x${window.innerWidth}`;
    const measure = measuredFor !== key || now - measuredAt > 500;
    if (measure) {
      measuredFor = key;
      measuredAt = now;
    }

    for (const wrap of document.querySelectorAll<HTMLElement>('.pin-wrap')) {
      const steps = Number(wrap.dataset['n']) || 1;
      const pin = wrap.dataset['pin'] as PinStepDetail['key'];
      const inner = wrap.querySelector<HTMLElement>('.pin-inner');

      if (measure && inner && pin !== 'an') {
        inner.style.setProperty(
          '--ps',
          String(Math.min(1, (pinHeight - 40) / (inner.offsetHeight || 1))),
        );
        inner.style.setProperty('--pih', `${inner.offsetHeight}px`);
      }
      if (measure && inner && pin === 'an') {
        sizeStagesPanel(inner);
        const panel = inner.querySelector<HTMLElement>('.an-text');
        const panelHeight = panel ? panel.offsetHeight : 240;
        const available = pinHeight - panelHeight - 40;
        const width = (inner.parentElement?.clientWidth ?? inner.offsetWidth) || inner.offsetWidth;
        inner.style.setProperty(
          '--asw',
          `${Math.floor(Math.max(600, Math.min(width, available / 0.58)))}px`,
        );
        inner.style.setProperty('--ps', '1');
      }

      const rect = wrap.getBoundingClientRect();
      if (wrap.classList.contains('pin-done')) {
        // Scrolling down again: re-arm a collapsed section while it is still below the screen.
        if (goingDown && rect.top > viewport + 10) {
          wrap.classList.remove('pin-done');
          lastStep[pin] = -1;
        }
        continue;
      }
      if (goingUp && rect.top < viewport && rect.bottom > 0) {
        // Scrolling up through a pinned section: drop the effect and show it as a normal section.
        const docTop = rect.top + y;
        const engaged = rect.top <= headerHeight;
        wrap.classList.add('pin-done');
        if (engaged) y = jumpTo(Math.max(0, docTop + Math.max(0, wrap.offsetHeight - viewport)));
        continue;
      }
      if (rect.bottom < -40) {
        const before = wrap.offsetHeight;
        wrap.classList.add('pin-done');
        const delta = wrap.offsetHeight - before;
        if (delta) y = jumpTo(y + delta);
        continue;
      }
      const travel = Math.max(1, wrap.offsetHeight - pinHeight);
      const progress = Math.min(1, Math.max(0, (headerHeight - rect.top) / travel));
      const index = Math.min(steps - 1, Math.floor(progress * steps));
      if (lastStep[pin] === index) continue;
      lastStep[pin] = index;
      window.dispatchEvent(
        new CustomEvent<PinStepDetail>(PIN_STEP_EVENT, { detail: { key: pin, index } }),
      );
    }
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      tick();
    });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.setTimeout(tick, 400);

  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('rv-in');
        reveal.unobserve(entry.target);
      }
    },
    { threshold: 0, rootMargin: '0px 0px -15% 0px' },
  );
  document.querySelectorAll('.sq-hrow, .faq-l, .sq-sec').forEach((el) => reveal.observe(el));
}
