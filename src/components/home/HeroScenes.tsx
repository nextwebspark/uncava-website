import { useEffect, useState } from 'preact/hooks';
import DemoIcon from './demo/DemoIcon';
import PayPanel from './demo/PayPanel';
import { people, type SamplePerson } from './demo/people';
import heroCompaniesBlur from '~/assets/home/screens/hero-companies-blur.webp';
import heroCompanies from '~/assets/home/screens/hero-companies.webp';

/**
 * The hero's background: four product scenes that play in turn — the Companies view, the
 * assistant finding distributors, the pipeline board, and the remuneration report. Decorative.
 */

type Scene = 'A' | 'B' | 'C' | 'D';

const PROMPT = 'Find the top 20 FMCG distributors in the UAE';
const STEPS = [
  'Reading your strategy filters',
  'Searching UAE FMCG distributors',
  'Ranking by size and fit to the brief',
];
const RESULTS: readonly { name: string; employees: string; tier: string; tint: string }[] = [
  { name: 'Sabkha Distribution', employees: '1,000+', tier: 'Tier 1', tint: 'bg-accent' },
  { name: 'Meridian Gulf Trading', employees: '1,000+', tier: 'Tier 1', tint: 'bg-accent-ink' },
  { name: 'Gulf Table Distribution', employees: '500+', tier: 'Tier 1', tint: 'bg-d-accent' },
  { name: 'Coastline FMCG', employees: '500+', tier: 'Tier 1', tint: 'bg-d-slate' },
  { name: 'Harbour Line Supplies', employees: '200+', tier: 'Tier 2', tint: 'bg-accent-ink' },
  { name: 'Dune Foods Distribution', employees: '200+', tier: 'Tier 2', tint: 'bg-d-slate' },
];

interface HeroState {
  scene: Scene;
  previous: Scene | '';
  typed: number;
  sent: boolean;
  step: number;
  rows: number;
}

const initial: HeroState = { scene: 'A', previous: '', typed: 0, sent: false, step: 0, rows: 0 };

type TaskTone = 'muted' | 'due' | 'overdue';

interface PipelineCard {
  person: SamplePerson;
  task: string;
  when: string;
  tone: TaskTone;
}

const toneText: Record<TaskTone, string> = {
  muted: 'text-d-text-3',
  due: 'text-d-warm',
  overdue: 'text-d-red',
};

const card = (person: SamplePerson, task: string, when: string, tone: TaskTone): PipelineCard => ({
  person,
  task,
  when,
  tone,
});

const identified = [
  card(people.tariq, 'Book first call', 'Tomorrow · 10:30', 'muted'),
  card(people.yusuf, 'Send the role brief', '21 Nov 2026', 'muted'),
  card(people.dana, 'Book first call', 'Tomorrow · 10:30', 'muted'),
  card(people.sami, 'Send the role brief', '21 Nov 2026', 'muted'),
  card(people.rania, 'Book first call', 'Tomorrow · 10:30', 'muted'),
  card(people.mona, 'Send the role brief', '21 Nov 2026', 'muted'),
];
const approached = [
  card(people.nadia, 'Follow up on intro email', 'Due today', 'due'),
  card(people.priya, 'Share profile with hiring manager', 'Overdue · 24 Oct 2026', 'overdue'),
];
const interested = [
  card(people.sarah, 'Follow up on intro email', 'Due today', 'due'),
  card(people.karim, 'Log call notes', 'Due today', 'due'),
];
const screening = [card(people.daniel, 'Reference check', 'Overdue · 12 Nov 2026', 'overdue')];
const dragged = card(
  people.wei,
  'Share profile with hiring manager',
  'Overdue · 24 Oct 2026',
  'overdue',
);

function CandidateCard({ item, class: className = '' }: { item: PipelineCard; class?: string }) {
  return (
    <div class={`pc2 ${className}`}>
      <div class="pc2-top">
        <span class="pc2-cb"></span>
        <span class="pc2-av">
          <img
            src={item.person.photo}
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        </span>
        <div class="pc2-id">
          <b>{item.person.name}</b>
          <span>{item.person.title}</span>
          <span class="pc2-co">{item.person.company}</span>
        </div>
        <span class="pc2-dots text-d-text-3">
          <DemoIcon name="more" />
        </span>
      </div>
      <div class="pc2-task">
        <b>{item.task}</b>
        <span class={toneText[item.tone]}>
          <DemoIcon name="clock" />
          {item.when}
        </span>
      </div>
      <div class="pc2-acts">
        <span class="text-d-green">
          <DemoIcon name="eye" />
        </span>
        <span class="pc2-sp"></span>
        <span class="text-d-accent-2">
          <DemoIcon name="phone" />
        </span>
        <span class="text-d-accent-2">
          <DemoIcon name="mail" />
        </span>
        <span class="text-d-accent-2">
          <DemoIcon name="chat" />
        </span>
        <span class="text-d-accent-2">
          <DemoIcon name="calendar" />
        </span>
      </div>
    </div>
  );
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function HeroScenes() {
  const [state, setState] = useState<HeroState>(initial);
  // Only the first scene is in the static HTML: the other three mount after load, well before
  // their turn at 8 seconds, so the first paint carries one scene instead of four.
  const [mounted, setMounted] = useState(false);
  const patch = (next: Partial<HeroState>) => setState((s) => ({ ...s, ...next }));

  useEffect(() => {
    const mount = window.setTimeout(() => setMounted(true), 1500);
    return () => window.clearTimeout(mount);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const timers: number[] = [];
    let clearPrevious = 0;
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const go = (scene: Scene) => {
      setState((s) => ({
        ...s,
        scene,
        previous: s.scene,
        ...(scene === 'B' ? { typed: 0, sent: false, step: 0, rows: 0 } : {}),
      }));
      window.clearTimeout(clearPrevious);
      clearPrevious = window.setTimeout(() => {
        setState((s) =>
          s.previous === 'B' && s.scene !== 'B'
            ? { ...s, previous: '', typed: 0, sent: false, step: 0, rows: 0 }
            : { ...s, previous: '' },
        );
      }, 650);
    };
    const loop = () => {
      go('A');
      let t = 8000;
      later(t, () => go('B'));
      t += 1200;
      for (let i = 1; i <= PROMPT.length; i++) {
        t += 55;
        later(t, () => patch({ typed: i }));
      }
      t += 500;
      later(t, () => patch({ sent: true, step: 0 }));
      for (const step of [1, 2, 3]) {
        t += 900;
        later(t, () => patch({ step }));
      }
      for (let r = 1; r <= RESULTS.length; r++) {
        t += 200;
        later(t, () => patch({ rows: r }));
      }
      t += 3800;
      later(t, () => go('C'));
      t += 8000;
      later(t, () => go('D'));
      t += 8500;
      later(t, loop);
    };
    loop();
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(clearPrevious);
    };
  }, []);

  const { scene, previous, typed, sent, step, rows } = state;
  const on = (s: Scene) => (scene === s ? 'on' : '');
  const running = (s: Scene) => (scene === s || previous === s ? 'run' : '');
  const typing = scene === 'B' && !sent;
  const camera = !sent ? 'cam-type' : rows > 0 ? 'cam-res' : 'cam-think';
  const drag = scene === 'C' || previous === 'C' ? 'go' : '';

  return (
    <div class="absolute inset-0" aria-hidden="true">
      <div class={`hscene ${on('A')} ${running('A')}`}>
        <div class="hero-bg hero-blur">
          <div class="hero-tilt">
            <img class="hero-pan" src={heroCompaniesBlur.src} alt="" width="900" height="562" />
          </div>
        </div>
        <div class="hero-bg focus">
          <div class="hero-tilt">
            <img
              class="hero-pan"
              src={heroCompanies.src}
              alt=""
              width="2000"
              height="1250"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {mounted && (
        <>
          <div class={`hscene ${on('B')}`}>
            <div class="hero-bg [perspective:2000px]">
              <div class="chat-tilt">
                <div class={`chat ${camera}`}>
                  <div class="chat-h">
                    <span class="h-7.5 w-7.5 rounded-[5px] bg-linear-135 from-accent to-d-inferred"></span>
                    Assistant
                    <span class="mono text-[15px] font-normal text-d-text-3">
                      Strategy · Halden Consumer Group
                    </span>
                  </div>
                  <div class="chat-b">
                    {sent && <div class="chat-u">{PROMPT}</div>}
                    {sent && (
                      <div class="chat-steps flex flex-col gap-3">
                        {STEPS.map((text, i) => (
                          <span
                            class={`chat-s ${i < step ? 'done' : i === step ? 'running' : ''}`}
                            key={text}
                          >
                            <i></i>
                            {text}
                          </span>
                        ))}
                      </div>
                    )}
                    {rows > 0 && (
                      <div class="chat-r">
                        <span class="pb-1.5 text-[20px] font-semibold">
                          Top 20 FMCG distributors · United Arab Emirates
                        </span>
                        {RESULTS.slice(0, rows).map((result) => (
                          <div class="chat-row" key={result.name}>
                            <b class={result.tint}>
                              <DemoIcon name="truck" class="block h-5 w-5" />
                            </b>
                            <span>{result.name}</span>
                            <span class="mono text-[17px] text-d-text-2">{result.employees}</span>
                            <span class="text-[15px] text-d-accent-soft">{result.tier}</span>
                          </div>
                        ))}
                        <span class="chat-more pt-2 text-[17px] text-d-text-3">
                          +15 more · File to universe
                        </span>
                      </div>
                    )}
                  </div>
                  <div class="chat-c">
                    <span class={typing ? 'text-d-text' : 'text-d-text-3'}>
                      {typing ? PROMPT.slice(0, typed) : 'Ask for companies…'}
                      <span class={`car ${typing ? '' : 'off'}`}></span>
                    </span>
                    <span class={`chat-send ${typing && typed >= PROMPT.length ? 'on' : ''}`}>
                      ↑
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class={`hscene ${on('C')} ${running('C')}`}>
            <div class="hero-bg [perspective:2000px]">
              <div class="big-tilt">
                <div class="board">
                  <div class="board-h">
                    Pipeline
                    <span class="mono text-[15px] font-normal text-d-text-3">
                      Halden Consumer Group · Chief Financial Officer
                    </span>
                  </div>
                  <div class="pcols">
                    <div class="pcol">
                      <div class="phead">
                        <i class="bg-d-text-3"></i>Identified<span>8</span>
                      </div>
                      <div class="pbody">
                        <div class="plist scrollA">
                          {identified.map((item) => (
                            <CandidateCard item={item} key={item.person.name} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div class="pcol">
                      <div class="phead">
                        <i class="bg-d-blue"></i>Approached
                        <span class={`cnt ${drag}`}>
                          <em class="a">6</em>
                          <em class="b">5</em>
                        </span>
                      </div>
                      <div class="pbody">
                        <div class="plist">
                          <div class={`pc2-ghost from ${drag}`}></div>
                          {approached.map((item) => (
                            <CandidateCard item={item} key={item.person.name} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div class="pcol">
                      <div class="phead">
                        <i class="bg-d-green"></i>Interested
                        <span class={`cnt ${drag}`}>
                          <em class="a">3</em>
                          <em class="b">4</em>
                        </span>
                      </div>
                      <div class="pbody">
                        <div class="plist">
                          <div class={`pc2-ghost to ${drag}`}></div>
                          {interested.map((item) => (
                            <CandidateCard item={item} key={item.person.name} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div class="pcol">
                      <div class="phead">
                        <i class="bg-d-warm"></i>Screening<span>2</span>
                      </div>
                      <div class="pbody">
                        <div class="plist">
                          {screening.map((item) => (
                            <CandidateCard item={item} key={item.person.name} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <CandidateCard item={dragged} class={`pc2-drag ${drag}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class={`hscene ${on('D')} ${running('D')}`}>
            <div class="hero-bg [perspective:2000px]">
              <div class="pay-tilt">
                <PayPanel variant="hero" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
