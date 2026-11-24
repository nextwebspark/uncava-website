import { useEffect, useState } from 'preact/hooks';
import { PIN_STEP_EVENT, type PinStepDetail } from './demo/runtime-style';
import { stageDetail, stages, type StageDetailRow } from '~/lib/home-demo/stages';

/**
 * Six plates climbing from brief to hire, each holding the people still in play. Selecting a plate
 * (or scrolling, on desktop) shows what happens at that stage and who decides what.
 */

/* Each plate's place on the diagonal, as literal classes so the static build lays them out. */
const PLATE_POSITIONS = [
  'left-[3cqw] top-[3cqw]',
  'left-[18.2cqw] top-[10cqw]',
  'left-[33.4cqw] top-[17cqw]',
  'left-[48.6cqw] top-[24cqw]',
  'left-[63.8cqw] top-[31cqw]',
  'left-[79cqw] top-[38cqw]',
];

const LABEL_TONE: Record<StageDetailRow['tone'], string> = {
  muted: 'text-d-text-3',
  product: 'text-d-accent-soft',
  ai: 'text-d-inferred',
  team: 'text-d-green',
  client: 'text-d-warm',
};

export default function SearchStages() {
  const [active, setActive] = useState(0);
  const go = (index: number) =>
    setActive(((index % stages.length) + stages.length) % stages.length);

  useEffect(() => {
    const onPinStep = (event: Event) => {
      const { key, index } = (event as CustomEvent<PinStepDetail>).detail;
      if (key === 'an') setActive(index);
    };
    window.addEventListener(PIN_STEP_EVENT, onPinStep);
    return () => window.removeEventListener(PIN_STEP_EVENT, onPinStep);
  }, []);

  const stage = stages[active] ?? stages[0];
  if (!stage) return null;

  return (
    <div class="pin-inner an-pin">
      <div class="[container-type:inline-size] pt-12">
        <div class="scene">
          <div
            class="absolute top-[10cqw] left-[10cqw] w-[83.67cqw] origin-top-left rotate-[24.73deg] border-t border-dashed border-t-[rgba(163,169,250,.28)]"
            aria-hidden="true"
          ></div>
          {stages.map((s, i) => {
            const on = i === active ? 'on' : '';
            return (
              <button
                type="button"
                class={`stg ${PLATE_POSITIONS[i] ?? ''}`}
                onClick={() => go(i)}
                aria-pressed={i === active}
                aria-label={`Stage ${i + 1}: ${s.name}, ${s.volume}`}
                key={s.name}
              >
                <div class={`lift ${on}`}>
                  <div class={`plate ${on}`}>
                    <div class="face-side"></div>
                    <div class="face-front"></div>
                    <div class="face-top transform-3d">
                      {s.isBrief && (
                        <div class={`mini ${on ? 'text-[#C3C7FC]' : 'text-d-accent'}`}>
                          <div class="m-side"></div>
                          <div class="m-front"></div>
                          <div class="m-top"></div>
                        </div>
                      )}
                      {s.dots.length > 0 && (
                        <svg
                          class={`absolute inset-0 h-full w-full transition-[fill] duration-400 ${on ? 'fill-[#C3C7FC]' : 'fill-d-accent'}`}
                          viewBox="0 0 100 100"
                          aria-hidden="true"
                        >
                          {s.dots.map((dot, d) => (
                            <circle cx={dot.x} cy={dot.y} r="2.3" key={d} />
                          ))}
                        </svg>
                      )}
                    </div>
                  </div>
                  {s.checkpoint && <span class="chk" aria-hidden="true"></span>}
                </div>
                <span class={`stg-name ${on}`}>
                  {s.name}
                  <span class="stg-sub">{s.volume}</span>
                </span>
              </button>
            );
          })}
          <div class="an-legend absolute bottom-0 left-0 flex flex-wrap gap-7 text-[13px] text-d-text-2">
            <span class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-d-accent"></span>People in play
            </span>
            <span class="flex items-center gap-2">
              <span class="h-2.25 w-2.25 rotate-45 bg-d-warm"></span>Hiring-manager checkpoint: a
              live report link
            </span>
          </div>
        </div>
      </div>

      <div class="an-panel mt-10 flex flex-wrap overflow-hidden rounded-none border border-[rgba(255,255,255,.1)] bg-ink-0">
        <div class="an-text flex min-w-0 flex-[1_1_460px] flex-col gap-5.5 p-8" aria-live="polite">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-baseline gap-3.5">
              <h3 class="m-0 font-sans text-[24px] leading-[1.2] font-semibold tracking-[-.02em]">
                {active + 1}. {stage.name}
              </h3>
              <span class="mono text-[12px] text-d-text-3">{stage.weeks}</span>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="navbtn"
                onClick={() => go(active - 1)}
                aria-label="Previous stage"
              >
                ←
              </button>
              <button
                type="button"
                class="navbtn"
                onClick={() => go(active + 1)}
                aria-label="Next stage"
              >
                →
              </button>
            </div>
          </div>
          <dl class="m-0 flex flex-col">
            {stageDetail(stage).map((row) => (
              <div
                class="an-row grid grid-cols-[150px_minmax(0,1fr)] gap-5 border-t border-t-[rgba(255,255,255,.06)] px-0 py-3.25"
                key={row.label}
              >
                <dt class={`text-[14px] ${LABEL_TONE[row.tone]}`}>{row.label}</dt>
                <dd class="m-0 text-[15px] leading-[1.5] text-d-text-1">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
