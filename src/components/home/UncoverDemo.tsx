import { useEffect, useRef, useState } from 'preact/hooks';
import DemoIcon from './demo/DemoIcon';
import {
  restingState,
  uncoverScenarios,
  uncoveredTotal,
  visibleRows,
  type UncoverState,
} from '~/lib/home-demo/uncover';

/**
 * The Companies view with the assistant beside it. When it scrolls into view the assistant types a
 * prompt, the table fills with tiered companies, and the adjacent sectors can be uncovered — by the
 * demo itself, or by the visitor pressing a suggestion. Without JavaScript it rests on the results.
 */
export default function UncoverDemo() {
  const [state, setState] = useState<UncoverState>(() => restingState(0));
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const uncover = (group: number) =>
    setState((s) =>
      s.phase !== 'results' || s.uncovered.includes(group)
        ? s
        : { ...s, uncovered: [group, ...s.uncovered], pressed: -1 },
    );

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const start = (index: number) => {
      clear();
      const scenario = uncoverScenarios[index];
      if (!scenario) return;
      if (reduce) {
        setState(restingState(index));
        return;
      }
      setState({
        scenario: index,
        typed: 0,
        phase: 'typing',
        stepsDone: 0,
        rowsShown: 0,
        uncovered: [],
        pressed: -1,
      });
      const patch = (next: Partial<UncoverState>) => setState((s) => ({ ...s, ...next }));
      let t = 250;
      for (let i = 1; i <= scenario.prompt.length; i++) {
        t += 22;
        later(t, () => patch({ typed: i }));
      }
      t += 200;
      later(t, () => patch({ phase: 'thinking', stepsDone: 0 }));
      t += 400;
      later(t, () => patch({ stepsDone: 1 }));
      t += 400;
      later(t, () => patch({ stepsDone: 2 }));
      t += 400;
      later(t, () => patch({ stepsDone: 3, phase: 'results' }));
      for (let r = 1; r <= scenario.base.length; r++) {
        t += 80;
        later(t, () => patch({ rowsShown: r }));
      }
      t += 2800;
      later(t, () => patch({ pressed: scenario.autoUncover }));
      t += 650;
      later(t, () => uncover(scenario.autoUncover));
      t += 5200;
      later(t, () => start((index + 1) % uncoverScenarios.length));
    };

    const el = root.current;
    if (!el) return clear;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start(0);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, []);

  const scenario = uncoverScenarios[state.scenario] ?? uncoverScenarios[0];
  if (!scenario) return null;
  const rows = visibleRows(state);
  const total = uncoveredTotal(state);
  const typing = state.phase === 'typing';
  const results = state.phase === 'results';
  const showSuggestions = results && state.rowsShown >= scenario.base.length;
  const [firstGroup, secondGroup] = scenario.groups;
  const emptyCards = [
    { cap: 'CLIENT’S SECTOR', adjacent: false, text: scenario.prompt },
    {
      cap: 'ADJACENT · TRANSFERABLE TALENT',
      adjacent: true,
      text: `${firstGroup.title} whose executives move well into ${scenario.sector}`,
    },
    {
      cap: 'ADJACENT · TRANSFERABLE TALENT',
      adjacent: true,
      text: `${secondGroup.title} with leaders who could move across`,
    },
    {
      cap: 'SIMILAR SIZE',
      adjacent: false,
      text: 'Groups similar in size to Halden Consumer Group',
    },
  ];

  return (
    <div
      ref={root}
      class="ux"
      role="group"
      aria-label="Interactive demo: searching and uncovering companies in Uncava"
    >
      <div class="ux-top">
        <span class="ux-mark"></span>
        <span class="font-semibold tracking-[.02em] text-d-text">HALDEN CONSUMER GROUP</span>
        <span class="ux-crumb">
          Positions <i>/</i> <span class="text-d-accent-soft">• Group Finance</span> <i>/</i>{' '}
          <b class="text-d-text">Chief Financial Officer</b>
        </span>
        <span class="flex-1"></span>
      </div>
      <div class="ux-body">
        <div class="ux-rail" aria-hidden="true">
          <span>←</span>
          <span>◇</span>
          <span class="on">▥</span>
          <span>◎</span>
          <span>✕</span>
          <span>➤</span>
          <span>▦</span>
          <span>☺</span>
        </div>
        <div class="ux-main">
          <div class="ux-tools" aria-hidden="true">
            <span class="ux-seg">
              <span class="on">▣ Companies</span>
              <span>☺ People</span>
            </span>
            <span class="ux-search">⌕ Search companies…</span>
            <span class="ux-ico">⌑ Save Search</span>
            <span class="ux-ico">
              ⏷ Show Filters <b class="ux-n">2</b>
            </span>
            <span class="ux-ai">✦ AI Research</span>
            <span class="ux-ico">
              ▥ Columns <b class="ux-n">15 hidden</b>
            </span>
            {total > 0 && <span class="ubadge">+{total} added</span>}
          </div>
          <div class="ux-table">
            <div class="ux-th">
              <span class="ux-cb"></span>
              <span>Company</span>
              <span>Links</span>
              <span>Fit</span>
              <span>Country</span>
              <span>Sector</span>
              <span>Revenue</span>
              <span>Employees</span>
              <span>Notes</span>
            </div>
            <div class="ux-rows">
              {rows.length === 0 && (
                <div class="ux-empty">Ask the Assistant, or set a filter, to see companies.</div>
              )}
              {rows.map((row) => (
                <div class={`ux-tr ${row.isNew ? 'fresh' : ''}`} key={`${row.sector}-${row.name}`}>
                  <span class="ux-cb"></span>
                  <span class="ux-co">
                    <span class="tlogo text-white">
                      <DemoIcon name={row.icon} class="block h-4 w-4" />
                    </span>
                    <span class="ux-ell font-semibold text-d-text">{row.name}</span>
                    {row.isNew && <span class="newtag">Uncovered</span>}
                  </span>
                  <span class="ux-links">
                    <i>◍</i>
                    <i>in</i>
                  </span>
                  <span>
                    <span class={`tfit ${row.tier === 1 ? 't1' : 't2'}`}>Tier {row.tier}</span>
                  </span>
                  <span class="ux-ell">{row.country}</span>
                  <span class="ux-ell">{row.sector}</span>
                  <span class="mono ux-ell">{row.revenue}</span>
                  <span class="mono ux-ell">{row.employees}</span>
                  <span class="ux-ell text-d-text-3">{row.note}</span>
                </div>
              ))}
            </div>
            <div class="ux-foot">
              <span class="ux-pg">‹</span>
              <span class="ux-pg on">1</span>
              <span class="ux-pg">›</span>
              <span>
                1 – {rows.length} of {results ? String(scenario.total + total) : '—'}
              </span>
              <span class="flex-1"></span>
              <span>Rows per page</span>
              <span class="ux-pg on w-auto px-3 py-0">50 ⌄</span>
            </div>
          </div>
        </div>
        <div class="ux-asst">
          <div class="ux-ah">
            <span class="ux-spark">✦</span>
            <b>Assistant</b>
            <span class="flex-1"></span>
            <span class="text-d-text-2">History</span>
            <span class="text-d-text-3">+</span>
            <span class="text-d-text-3">✕</span>
          </div>
          <div class="border-b border-b-[rgba(255,255,255,.07)] px-4 pt-0 pb-3">
            <span class="ux-chip">◇ Group Finance · Chief Financial Officer</span>
          </div>
          <div class="ux-feed">
            {typing && (
              <div class="ux-emptyA">
                <span class="text-[14px] text-d-text-1">Find companies for this mandate.</span>
                <span class="text-[12px] text-d-text-3">Suggested from your sector</span>
                <div class="ux-cards">
                  {emptyCards.map((c) => (
                    <div class={`ux-card ${c.adjacent ? 'adj' : ''}`} key={c.text}>
                      <span class={c.adjacent ? 'adjtag' : 'ux-cap'}>{c.cap}</span>
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!typing && <div class="ux-msg">{scenario.prompt}</div>}
            {!typing && (
              <div class="ux-steps">
                {scenario.steps.map((text, i) => (
                  <span
                    class={`ux-step ${
                      i < state.stepsDone
                        ? 'done'
                        : i === state.stepsDone && state.phase === 'thinking'
                          ? 'running'
                          : 'pending'
                    }`}
                    key={text}
                  >
                    <i></i>
                    {text}
                  </span>
                ))}
              </div>
            )}
            {results && (
              <span class="text-[14px] leading-[1.5] text-d-text-1">
                <b class="text-d-text">{scenario.lead}</b> {scenario.rest}
              </span>
            )}
            {showSuggestions && (
              <div class="flex flex-col gap-2.5">
                <span class="ux-cap">PLACES YOU MIGHT NOT HAVE LOOKED</span>
                {scenario.groups.map((group, i) => {
                  const done = state.uncovered.includes(i);
                  return (
                    <button
                      type="button"
                      class={`sugcard ${done ? 'done' : state.pressed === i ? 'press' : ''}`}
                      onClick={() => uncover(i)}
                      aria-pressed={done}
                      key={group.title}
                    >
                      <span class="adjtag">ADJACENT · TRANSFERABLE TALENT</span>
                      <span class="sg-t">{group.title}</span>
                      <span class="sg-w">{group.why}</span>
                      <span class="sg-cta">
                        {done
                          ? `✓ ${group.count} added to the list`
                          : `Add ${group.count} companies →`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {state.uncovered.length === scenario.groups.length && (
              <span class="text-[14px] leading-[1.5] text-d-green">
                You've uncovered {total} companies you hadn't searched for.
              </span>
            )}
          </div>
          <div class="ux-comp" aria-hidden="true">
            <div class="ux-box">
              <span class={typing ? 'text-d-text' : 'text-d-text-3'}>
                {typing ? scenario.prompt.slice(0, state.typed) : 'Ask for companies…'}
                <span class={`caret ${typing ? 'blink' : 'off'}`}></span>
              </span>
              <div class="flex items-center justify-between">
                <span class="text-[11px] text-d-text-3">Enter to send</span>
                <span
                  class={`sendbtn ${typing && state.typed >= scenario.prompt.length ? 'on' : ''}`}
                >
                  ↑
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
