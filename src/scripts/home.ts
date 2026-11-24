import { h, hydrate, type ComponentType } from 'preact';
import FeatureShowcase from '~/components/home/FeatureShowcase';
import HeroScenes from '~/components/home/HeroScenes';
import SearchStages from '~/components/home/SearchStages';
import UncoverDemo from '~/components/home/UncoverDemo';
import { startHomeStory } from './home-story';

/**
 * The home page's only script. The product demos are already in the HTML (rendered at build time);
 * this hydrates them so they play and respond, then starts the scroll storytelling.
 */
const islands: Record<string, ComponentType> = {
  hero: HeroScenes,
  uncover: UncoverDemo,
  showcase: FeatureShowcase,
  stages: SearchStages,
};

// The hero hydrates at once; the demos further down wait until they are about to scroll into view,
// so the first paint is not competing with work for sections nobody can see yet.
const nearby = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      nearby.unobserve(entry.target);
      mount(entry.target as HTMLElement);
    }
  },
  { rootMargin: '600px 0px' },
);

function mount(el: HTMLElement): void {
  const component = islands[el.dataset['island'] ?? ''];
  if (component) hydrate(h(component, {}), el);
}

for (const el of document.querySelectorAll<HTMLElement>('[data-island]')) {
  if (el.dataset['island'] === 'hero') mount(el);
  else nearby.observe(el);
}

startHomeStory();
