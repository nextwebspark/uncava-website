import { useEffect, useRef, useState } from 'preact/hooks';
import { people, interviewerPhoto } from './demo/people';
import { PIN_STEP_EVENT, runtimeStyle, type PinStepDetail } from './demo/runtime-style';
import {
  clampScore,
  criteria,
  maxPoints,
  reportSections,
  totals,
} from '~/lib/home-demo/assessment';
import {
  baseline,
  behaviouralCompetencies,
  rankCandidates,
  rebalance,
  scenarios,
  summarise,
  technicalCompetencies,
} from '~/lib/home-demo/ranking';

/**
 * "Map. Assess. Rank. Report." Four tabs, each a working view of the app. Once the section is in
 * view the tabs play in turn (or follow the scroll, on desktop); any interaction hands control to
 * the visitor. The static build renders the Map tab.
 */

type Tab = 0 | 1 | 2 | 3;
type CopilotView = 'live' | 'plan' | 'trans';

const TABS: readonly { num: string; label: string; sub: string; duration: string }[] = [
  { num: '01', label: 'Map', sub: 'Market intelligence', duration: '[animation-duration:9s]' },
  { num: '02', label: 'Assess', sub: 'Guided interviews', duration: '[animation-duration:14s]' },
  { num: '03', label: 'Rank', sub: 'Scenario ranking', duration: '[animation-duration:14s]' },
  { num: '04', label: 'Report', sub: 'Assessment report', duration: '[animation-duration:14s]' },
];
const TAB_SECONDS = [9, 14, 14, 14];

const photoByKey: Record<string, string> = {
  sarah: people.sarah.photo,
  daniel: people.daniel.photo,
  karim: people.karim.photo,
  nadia: people.nadia.photo,
  priya: people.priya.photo,
  wei: people.wei.photo,
};

function TabCopy({ tab }: { tab: Tab }) {
  const copy = [
    {
      label: '01 · MAP',
      title: 'Know where the talent sits',
      body: 'Every executive you map lands in a sector by seniority matrix, so deep pockets and empty ones show before the hiring manager asks.',
      points: [
        'Empty pockets hatched, so gaps are obvious',
        'Where talent sits, country by country',
        'Live from the mandate, shared as a report chapter',
      ],
      who: 'Helps the Head of TA walk into the brief meeting with the market view.',
    },
    {
      label: '02 · ASSESS',
      title: 'Guided interviews',
      body: "Book the interview in Uncava and the co-pilot joins you. It plans the questions from the candidate's CV, your notes and the brief, then tracks what has been evidenced as they talk.",
      points: [
        "A question plan built from the candidate's data against the JD",
        "Competencies ticked off live once they're answered in enough depth",
        'Housekeeping covered every time: notice, package, relocation, motivation',
        'Transcribed only with consent; the candidate can opt out at any time',
      ],
      who: 'Helps interviewers stay present in the conversation and leave with evidence they can compare.',
    },
    {
      label: '03 · RANK',
      title: 'Test the shortlist against changing priorities',
      body: 'Every candidate is scored against the competencies and weightings agreed at the brief. Move any weight, on your own or with the hiring manager, and see who leads and why.',
      points: [
        'Ranked on the weightings set at the brief',
        'AI can suggest a draft ranking from all the evidence; your team confirms it',
        'Save a scenario when requirements change',
        'Assessed scores never move, only the priorities',
      ],
      who: 'Helps the Head of TA and the hiring manager agree a shortlist they can both defend.',
    },
    {
      label: '04 · REPORT',
      title: 'Assess every candidate, report in one click',
      body: "Score each competency against the brief, with your notes as the evidence. AI can draft the scores and the write-up, and you adjust anything before it's reviewed and submitted.",
      points: [
        'A score and evidence for every criterion in the brief',
        'AI drafts, and never changes a score or section you wrote',
        'Career summary, value, concerns and motivation, written up for you',
        'Your notes stay with your team; client contacts never see them',
      ],
      who: 'Helps the team present every candidate the same way, so the hiring manager can compare them fairly.',
    },
  ][tab];
  if (!copy) return null;
  return (
    <div class="fx-in flex flex-col gap-4" key={tab}>
      <span class="mono stagelbl">{copy.label}</span>
      <h3 class="fx-h m-0">{copy.title}</h3>
      <p class="fx-p m-0">{copy.body}</p>
      <ul class="fx-list">
        {copy.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <span class="fx-who">{copy.who}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- Map */

const MATRIX: readonly [string, readonly number[]][] = [
  ['Board', [1, 0, 0, 0, 0, 1, 0]],
  ['C-Suite', [38, 12, 9, 6, 7, 0, 21]],
  ['N-1', [47, 14, 11, 8, 6, 3, 19]],
  ['N-2', [9, 0, 4, 0, 0, 0, 12]],
];
const SECTORS = [
  'Food & Beverage',
  'Dairy & Poultry',
  'Grocery Retail',
  'Distribution',
  'Consumer Goods',
  'Family Holdings',
  'Other',
];
/* Literal classes, so the static build staggers the cells without a style attribute. */
const CELL_DELAYS = [
  '[animation-delay:.8s]',
  '[animation-delay:.84s]',
  '[animation-delay:.88s]',
  '[animation-delay:.92s]',
  '[animation-delay:.96s]',
  '[animation-delay:1s]',
  '[animation-delay:1.04s]',
  '[animation-delay:1.08s]',
  '[animation-delay:1.12s]',
  '[animation-delay:1.16s]',
  '[animation-delay:1.2s]',
  '[animation-delay:1.24s]',
  '[animation-delay:1.28s]',
  '[animation-delay:1.32s]',
  '[animation-delay:1.36s]',
  '[animation-delay:1.4s]',
  '[animation-delay:1.44s]',
  '[animation-delay:1.48s]',
  '[animation-delay:1.52s]',
  '[animation-delay:1.56s]',
  '[animation-delay:1.6s]',
  '[animation-delay:1.64s]',
  '[animation-delay:1.68s]',
  '[animation-delay:1.72s]',
  '[animation-delay:1.76s]',
  '[animation-delay:1.8s]',
  '[animation-delay:1.84s]',
  '[animation-delay:1.88s]',
];
const COUNTRIES: readonly {
  name: string;
  count: number;
  bar: string;
  bubble: string;
  barDelay: string;
  bubbleDelay: string;
}[] = [
  {
    name: 'United Arab Emirates',
    count: 142,
    bar: 'w-full',
    bubble: 'left-[74%] top-[62%] size-[57px]',
    barDelay: '[animation-delay:2.4s]',
    bubbleDelay: '[animation-delay:2.3s]',
  },
  {
    name: 'Saudi Arabia',
    count: 118,
    bar: 'w-[83%]',
    bubble: 'left-[60%] top-[62%] size-[53px]',
    barDelay: '[animation-delay:2.48s]',
    bubbleDelay: '[animation-delay:2.4s]',
  },
  {
    name: 'Kuwait',
    count: 31,
    bar: 'w-[22%]',
    bubble: 'left-[63%] top-[47%] size-[35px]',
    barDelay: '[animation-delay:2.56s]',
    bubbleDelay: '[animation-delay:2.5s]',
  },
  {
    name: 'Qatar',
    count: 24,
    bar: 'w-[17%]',
    bubble: 'left-[70%] top-[57%] size-[33px]',
    barDelay: '[animation-delay:2.64s]',
    bubbleDelay: '[animation-delay:2.6s]',
  },
  {
    name: 'Türkiye',
    count: 19,
    bar: 'w-[13%]',
    bubble: 'left-[47%] top-[27%] size-[31px]',
    barDelay: '[animation-delay:2.72s]',
    bubbleDelay: '[animation-delay:2.7s]',
  },
  {
    name: 'Egypt',
    count: 14,
    bar: 'w-[10%]',
    bubble: 'left-[41%] top-[52%] size-[29px]',
    barDelay: '[animation-delay:2.8s]',
    bubbleDelay: '[animation-delay:2.8s]',
  },
  {
    name: 'United Kingdom',
    count: 11,
    bar: 'w-[8%]',
    bubble: 'left-[18%] top-[18%] size-[27px]',
    barDelay: '[animation-delay:2.88s]',
    bubbleDelay: '[animation-delay:2.9s]',
  },
  {
    name: 'Bahrain',
    count: 8,
    bar: 'w-[6%]',
    bubble: 'left-[67%] top-[53%] size-[26px]',
    barDelay: '[animation-delay:2.96s]',
    bubbleDelay: '[animation-delay:3s]',
  },
];

function cellLevel(value: number): string {
  if (value === 0) return 'l0';
  if (value >= 35) return 'l4';
  if (value >= 18) return 'l3';
  if (value >= 10) return 'l2';
  return 'l1';
}

function MapPane() {
  let cell = 0;
  return (
    <>
      <div class="fx-wtop">
        <span class="fx-dot"></span>
        <span>Talent mapping report</span>
        <i>/</i>
        <span class="text-d-text">Chief Financial Officer</span>
        <span class="flex-1"></span>
        <span class="fx-rec text-d-green">
          <i class="bg-d-green"></i>Live from the mandate
        </span>
      </div>
      <div class="fx-pane gap-0 p-0">
        <div class="sm-nav">
          <span>
            <i>↗</i>Mapping progress
          </span>
          <span class="on">
            <i>◍</i>Shape of the market
          </span>
          <span>
            <i>$</i>Remuneration
          </span>
          <span>
            <i>☺</i>Diversity &amp; DEI
          </span>
          <span>
            <i>♙</i>Ranking
          </span>
          <em>
            Talent mapping report, prepared for Halden Consumer Group. Generated live from the
            mandate's rows.
          </em>
        </div>
        <div class="sm-view">
          <div class="sm-scroll">
            <span class="sm-h">Where does the universe actually sit?</span>
            <span class="sm-sum">
              <b>Food &amp; beverage leads</b> the universe, deepest at N-1. Board-level coverage is{' '}
              <b>2 executives</b> across 7 sectors, and 10 of 28 sector × seniority pockets are
              still empty.
            </span>
            <div class="sm-kpis">
              <div class="sm-kpi fx-in [animation-delay:.2s]">
                <span>DEEPEST POCKET</span>
                <b class="text-[#8F97F8]">47</b>
                <em>food &amp; beverage · N-1</em>
              </div>
              <div class="sm-kpi fx-in [animation-delay:.35s]">
                <span>EMPTY POCKETS</span>
                <b>
                  10<small>/28</small>
                </b>
                <em>sector × seniority pairs</em>
              </div>
              <div class="sm-kpi warm fx-in [animation-delay:.5s]">
                <span>BOARD-LEVEL TOTAL</span>
                <b>2</b>
                <em>across all 7 sectors</em>
              </div>
              <div class="sm-kpi good fx-in [animation-delay:.65s]">
                <span>PLACED IN THE MATRIX</span>
                <b>
                  228<small>/380</small>
                </b>
                <em>60% of mapped executives</em>
              </div>
            </div>
            <div class="sm-card">
              <span class="sm-ct">Sector × seniority</span>
              <span class="sm-cs">
                228 executives placed · hatched = no executive identified yet · click a cell for
                detail
              </span>
              <div class="sm-mx">
                <span></span>
                {SECTORS.map((sector) => (
                  <span class="sm-colh" key={sector}>
                    {sector}
                  </span>
                ))}
                {MATRIX.map(([level, values], row) => [
                  <span class="sm-rowh" key={level}>
                    {level}
                  </span>,
                  ...values.map((value, col) => {
                    const delay = CELL_DELAYS[cell++] ?? '';
                    const gap = row === 1 && col === 5 ? 'gap' : '';
                    return (
                      <span
                        class={`sm-cell ${cellLevel(value)} ${gap} ${delay}`}
                        key={`${level}-${col}`}
                      >
                        {value === 0 ? '·' : value}
                      </span>
                    );
                  }),
                ])}
              </div>
              <span class="sm-foot">
                Only an executive with both a sector and a level can sit in a cell: <b>41</b> are
                mapped at no universe company and <b>111</b> have no seniority on file.
              </span>
            </div>
            <div class="sm-card">
              <span class="sm-ct">Where talent sits</span>
              <span class="sm-cs">
                geographic concentration · 367 located across 8 countries · 13 with no country on
                file · click a country for detail
              </span>
              <div class="flex items-stretch gap-5">
                <div class="sm-map" aria-hidden="true">
                  {COUNTRIES.map((country) => (
                    <span
                      class={`sm-bub ${country.bubble} ${country.bubbleDelay}`}
                      key={country.name}
                    >
                      {country.count}
                    </span>
                  ))}
                </div>
                <div class="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  {COUNTRIES.map((country, i) => (
                    <div class="sm-cty" key={country.name}>
                      <span>{country.name}</span>
                      <div class="fx-track">
                        <i
                          class={`fx-grow ${i === 0 ? '' : 'dim'} ${country.bar} ${country.barDelay}`}
                        ></i>
                      </div>
                      <b class="mono">{country.count}</b>
                    </div>
                  ))}
                </div>
              </div>
              <span class="sm-foot">
                <b>71%</b> of located talent sits in 2 countries, the UAE and Saudi Arabia.
                Efficient to work, but thin coverage outside the GCC core is a blind spot worth
                closing.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Assess */

function AssessPane({ view, onView }: { view: CopilotView; onView: (view: CopilotView) => void }) {
  const sarah = people.sarah;
  const views: readonly [CopilotView, string][] = [
    ['live', 'Live'],
    ['plan', 'Plan 6/14'],
    ['trans', 'Transcript'],
  ];
  return (
    <>
      <div class="fx-wtop">
        <span class="fx-dot"></span>
        <span>Interview</span>
        <i>/</i>
        <span class="text-d-text">Sarah Mitchell</span>
        <i>/</i>
        <span>Chief Financial Officer</span>
        <span class="flex-1"></span>
        <span class="mono">Booked through Uncava</span>
      </div>
      <div class="fx-pane gap-0 p-0">
        <div class="cp-call">
          <div class="cp-tile">
            <img
              src={sarah.photo}
              alt=""
              width="240"
              height="240"
              loading="lazy"
              decoding="async"
            />
            <span class="cp-name">Sarah Mitchell</span>
            <span class="cp-talk">
              <i></i>
              <i></i>
              <i></i>
            </span>
          </div>
          <div class="cp-self">
            <img
              src={interviewerPhoto}
              alt=""
              width="120"
              height="120"
              loading="lazy"
              decoding="async"
            />
            <span>You</span>
          </div>
          <div class="cp-bar">
            <span class="cp-pill">● 34:12</span>
            <span class="flex-1"></span>
            <span class="cp-btn">Mic</span>
            <span class="cp-btn">Cam</span>
            <span class="cp-btn red">Leave</span>
          </div>
        </div>
        <div class="cp">
          <div class="cp-head">
            <img src={sarah.photo} alt="" width="40" height="40" loading="lazy" decoding="async" />
            <div>
              <b>Sarah Mitchell</b>
              <span>
                <i></i>Confidential: first interview <em class="mono">34:12</em>
              </span>
            </div>
            <span class="text-d-text-3">···</span>
          </div>
          <div class="cp-tabs" role="tablist" aria-label="Co-pilot views">
            {views.map(([key, label]) => (
              <button
                type="button"
                role="tab"
                class={`cp-tb ${view === key ? 'on' : ''}`}
                aria-selected={view === key}
                onClick={() => onView(key)}
                key={key}
              >
                {label}
              </button>
            ))}
          </div>
          <div class="cp-body">
            {view === 'live' && (
              <div class="cp-view">
                <div class="cp-consent">
                  <b>✓ Consent recorded</b>
                  <span>Sarah agreed to transcription and can opt out at any time.</span>
                </div>
                <div class="cp-caprow">
                  <span class="cp-cap">COMPETENCIES</span>
                  <span class="cp-hint">checked when answered in depth</span>
                </div>
                <div class="cp-rows">
                  <div class="cpr ok [--d:2.2s]">
                    <i class="st"></i>
                    <span class="nm">Capital Markets</span>
                    <span class="lv">
                      <em class="a">Not yet</em>
                      <em class="b">Evidenced</em>
                    </span>
                    <span class="ev">
                      “Led the 2022 IPO workstream through to a Tadawul listing”
                    </span>
                  </div>
                  <div class="cpr ok [--d:4.0s]">
                    <i class="st"></i>
                    <span class="nm">Family Governance</span>
                    <span class="lv">
                      <em class="a">Not yet</em>
                      <em class="b">Evidenced</em>
                    </span>
                    <span class="ev">
                      “Monthly council pack; one dividend policy everyone signed”
                    </span>
                  </div>
                  <div class="cpr half [--d:5.6s]">
                    <i class="st"></i>
                    <span class="nm">Commercial Acumen</span>
                    <span class="lv">
                      <em class="a">Not yet</em>
                      <em class="b">Partial</em>
                    </span>
                    <span class="ev">Pricing rebuilt on dairy lines. Ask for the numbers.</span>
                  </div>
                  <div class="cpr ok [--d:7.4s]">
                    <i class="st"></i>
                    <span class="nm">Stakeholder Influence</span>
                    <span class="lv">
                      <em class="a">Not yet</em>
                      <em class="b">Evidenced</em>
                    </span>
                    <span class="ev">“Talked the board out of a dual listing on cost”</span>
                  </div>
                  {['Financial Control', 'Strategic Leadership', 'Change Management'].map(
                    (name) => (
                      <div class="cpr none" key={name}>
                        <i class="st"></i>
                        <span class="nm">{name}</span>
                        <span class="lv">
                          <em class="a">Not yet</em>
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <span class="cp-cap">TO FIND OUT</span>
                <div class="cp-rows">
                  <div class="cpf ok [--d:8.8s]">
                    <i class="bx"></i>
                    <span class="nm">Notice</span>
                    <span class="val">3 months</span>
                  </div>
                  <div class="cpf ok [--d:10.4s]">
                    <i class="bx"></i>
                    <span class="nm">Motivation</span>
                    <span class="val">Group CFO seat, listing ahead</span>
                  </div>
                  <div class="cpf half [--d:12.0s]">
                    <i class="bx"></i>
                    <span class="nm">Relocation</span>
                    <span class="val">Open to Riyadh, family to discuss</span>
                  </div>
                  {['Package', 'Expected'].map((name) => (
                    <div class="cpf none" key={name}>
                      <i class="bx"></i>
                      <span class="nm">{name}</span>
                      <span class="val none">Not asked yet</span>
                    </div>
                  ))}
                </div>
                <span class="cp-cap">LAST SAID</span>
                <div class="cp-said">
                  <span class="[animation-delay:.6s]">
                    <b>Sarah:</b> I led the IPO workstream in 2022, right through to listing on
                    Tadawul.
                  </span>
                  <span class="[animation-delay:2.4s]">
                    <b>Sarah:</b> Every month the family shareholders get a council pack from me.
                  </span>
                  <span class="[animation-delay:4.2s]">
                    <b>Sarah:</b> We rebuilt pricing on our dairy lines and margins improved.
                  </span>
                  <span class="[animation-delay:6.0s]">
                    <b>Sarah:</b> I talked the board out of a dual listing. The cost didn't add up.
                  </span>
                  <span class="[animation-delay:7.6s]">
                    <b>Sarah:</b> My notice period is three months.
                  </span>
                  <span class="[animation-delay:9.2s]">
                    <b>Sarah:</b> I want a group CFO seat with a listing ahead of it.
                  </span>
                  <span class="last [animation-delay:10.8s]">
                    <b>Sarah:</b> Riyadh could work. I'd need to talk it through with my family.
                  </span>
                </div>
                <div class="cp-nudge">
                  <b>✦ Still to cover: Financial Control, Package</b>
                  <span>Try: “How do you run month-end close across many entities?”</span>
                </div>
              </div>
            )}
            {view === 'plan' && (
              <div class="cp-view">
                <span class="cp-src">Built from her CV, your notes and the job description</span>
                <span class="cp-cap">FIT FOR THE ROLE</span>
                {[
                  ['Walk me through the 2022 listing. What did you own personally?', true],
                  ['How do you keep family shareholders aligned on dividends?', true],
                  ['Tell me about a time you challenged the CEO on capital allocation.', true],
                  ['How do you run month-end close across many entities?', false],
                  ['How have you led a finance team through a restructuring?', false],
                ].map(([question, asked]) => (
                  <span class={`cp-q ${asked ? 'ok' : ''}`} key={String(question)}>
                    <i></i>
                    {question}
                  </span>
                ))}
                <span class="cp-cap">FILL THE GAPS</span>
                {[
                  ['What notice period would you need to give?', true],
                  ['What is motivating you to look at a move now?', true],
                  ['Which markets have you worked in outside the UAE?', true],
                  ['How is your current package structured?', false],
                  ['Would you relocate to Riyadh for the right role?', false],
                ].map(([question, asked]) => (
                  <span class={`cp-q ${asked ? 'ok' : ''}`} key={String(question)}>
                    <i></i>
                    {question}
                  </span>
                ))}
              </div>
            )}
            {view === 'trans' && (
              <div class="cp-view">
                {[
                  [true, 'Tell us about taking a business through a listing.'],
                  [
                    false,
                    'I led the IPO workstream in 2022, from choosing the advisers to the prospectus.',
                  ],
                  [true, 'How did you manage the family shareholders?'],
                  [false, 'A council pack every month, and one dividend policy everyone signed.'],
                  [true, 'And your notice period?'],
                  [false, 'Three months.'],
                ].map(([mine, line]) => (
                  <span class="cp-line" key={String(line)}>
                    <img
                      src={mine ? interviewerPhoto : sarah.photo}
                      alt=""
                      width="26"
                      height="26"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>
                      <b class={mine ? 'me' : ''}>{mine ? 'You:' : 'Sarah Mitchell:'}</b> {line}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div class="cp-foot">
            <span>
              <i></i>Listening
            </span>
            <img
              src={interviewerPhoto}
              alt=""
              width="24"
              height="24"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Rank */

interface RankState {
  preset: number;
  technicalShare: number;
  technicalWeights: readonly number[];
  behaviouralWeights: readonly number[];
}

const rankFromPreset = (index: number): RankState => {
  const scenario = scenarios[index] ?? baseline;
  return {
    preset: index,
    technicalShare: scenario.technicalShare,
    technicalWeights: scenario.technicalWeights,
    behaviouralWeights: scenario.behaviouralWeights,
  };
};

function RankPane({
  rank,
  onPreset,
  onChange,
}: {
  rank: RankState;
  onPreset: (index: number) => void;
  onChange: (next: Partial<RankState>) => void;
}) {
  const rows = rankCandidates(rank);
  const summary = summarise(rows);
  const name = rank.preset >= 0 ? (scenarios[rank.preset]?.label ?? '') : 'Custom scenario';
  const share = rank.technicalShare;
  const valueOf = (event: Event) => Number((event.currentTarget as HTMLInputElement).value);
  return (
    <>
      <div class="fx-wtop">
        <span class="fx-dot"></span>
        <span>Talent mapping report</span>
        <i>/</i>
        <span class="text-d-text">Chief Financial Officer</span>
        <i>/</i>
        <span>Ranking</span>
        <span class="flex-1"></span>
        <span class="rk-scn">{name}</span>
        <button type="button" class="rk-reset" onClick={() => onPreset(0)}>
          ↺ Reset
        </button>
      </div>
      <div class="fx-pane gap-0 p-0">
        <div class="rk-main">
          <span class="sm-h">Candidate ranking</span>
          <span class="sm-sum">
            Rank under current priorities. Compare the trade-offs behind your shortlist.
          </span>
          <div class="rk-ins">
            <div class="flex items-center justify-between gap-2.5">
              <span class="sm-cap2">
                {rank.preset === 0 ? 'AGREED BASELINE' : 'SCENARIO VS AGREED BASELINE'}
              </span>
              <span class="rk-lead">{summary.leadChip}</span>
            </div>
            <span class="rk-msg">
              <b>{summary.headline}</b> {summary.detail}
            </span>
          </div>
          <div class="rk-presets">
            <span class="sm-cap2">SCENARIOS</span>
            {scenarios.map((scenario, i) => (
              <button
                type="button"
                class={`rk-p ${i === rank.preset ? 'on' : ''}`}
                aria-pressed={i === rank.preset}
                onClick={() => onPreset(i)}
                key={scenario.label}
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <div class="rk-table">
            <div class="rk-th">
              <span>Candidate</span>
              <span>Rank</span>
              <span>Baseline</span>
              <span>Scenario</span>
              <span>Rank shift</span>
              <span>Score shift</span>
            </div>
            <div class="rk-body">
              {rows.map((row) => {
                const shift = row.baselineRank - row.scenarioRank;
                const diff = row.scenarioScore - row.baselineScore;
                const tone = shift > 0 ? 'up' : shift < 0 ? 'down' : '';
                return (
                  <div
                    class={`rk-tr ${row.scenarioRank === 1 ? 'lead' : ''}`}
                    ref={runtimeStyle({ top: `${(row.scenarioRank - 1) * 52}px` })}
                    key={row.candidate.key}
                  >
                    <span class="rk-who">
                      <img
                        src={photoByKey[row.candidate.key]}
                        alt=""
                        width="30"
                        height="30"
                        loading="lazy"
                        decoding="async"
                      />
                      <span>
                        <b>{row.candidate.name}</b>
                        <em>{row.candidate.title}</em>
                      </span>
                    </span>
                    <span class="mono">{row.scenarioRank}</span>
                    <span class="mono text-d-text-2">{row.baselineScore.toFixed(1)}</span>
                    <span class="mono rk-sc">{row.scenarioScore.toFixed(1)}</span>
                    <span class={`rk-shift ${tone}`}>
                      {shift > 0 ? `▲ ${shift}` : shift < 0 ? `▼ ${-shift}` : 'No change'}
                    </span>
                    <span class={`mono rk-pts ${tone}`}>
                      {`${diff >= 0 ? '+' : ''}${diff.toFixed(2)} pts`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <span class="rk-note">
            Both levels of weighting apply together. Weighting changes influence, not assessed
            ability: scores are unchanged.
          </span>
        </div>
        <div class="rk-side">
          <div class="rk-card">
            <span class="rk-ct">Weighting</span>
            <span class="rk-sub">Group weighting</span>
            <div class="rk-gw">
              <div>
                <b class="mono text-d-inferred">{share}%</b>
                <span class="text-d-inferred">Technical</span>
              </div>
              <div class="text-right">
                <b class="mono text-d-warm">{100 - share}%</b>
                <span class="text-d-warm">Behavioural</span>
              </div>
            </div>
            <div class="rk-g">
              <i ref={runtimeStyle({ width: `${share}%` })}></i>
              <span class="rk-knob" ref={runtimeStyle({ left: `${share}%` })}></span>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={share}
                onInput={(event) => onChange({ technicalShare: valueOf(event) })}
                aria-label="Technical versus behavioural weighting"
              />
            </div>
            <span class="rk-sub text-[10px]">
              Overall = 10 × ({(share / 100).toFixed(2)} × Technical +{' '}
              {((100 - share) / 100).toFixed(2)} × Behavioural)
            </span>
          </div>
          <div class="rk-card">
            <span class="rk-ct">Competency weights</span>
            <div class="rk-grp">
              <span>Technical</span>
              <em>within group · 100%</em>
            </div>
            {technicalCompetencies.map((competency, i) => {
              const weight = rank.technicalWeights[i] ?? 0;
              return (
                <div class="rk-w" key={competency}>
                  <div class="rk-wl">
                    <span>{competency}</span>
                    <b class="mono">{weight}%</b>
                  </div>
                  <div class="rk-wb">
                    <i ref={runtimeStyle({ width: `${weight}%` })}></i>
                    <input
                      type="range"
                      min="0"
                      max="70"
                      step="5"
                      value={weight}
                      onInput={(event) =>
                        onChange({
                          technicalWeights: rebalance(rank.technicalWeights, i, valueOf(event)),
                        })
                      }
                      aria-label={`${competency} weight`}
                    />
                  </div>
                </div>
              );
            })}
            <div class="rk-grp b">
              <span>Behavioural</span>
              <em>within group · 100%</em>
            </div>
            {behaviouralCompetencies.map((competency, i) => {
              const weight = rank.behaviouralWeights[i] ?? 0;
              return (
                <div class="rk-w b" key={competency}>
                  <div class="rk-wl">
                    <span>{competency}</span>
                    <b class="mono">{weight}%</b>
                  </div>
                  <div class="rk-wb">
                    <i ref={runtimeStyle({ width: `${weight}%` })}></i>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={weight}
                      onInput={(event) =>
                        onChange({
                          behaviouralWeights: rebalance(rank.behaviouralWeights, i, valueOf(event)),
                        })
                      }
                      aria-label={`${competency} weight`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Report */

interface ReportState {
  scores: readonly (number | null)[];
  edited: readonly boolean[];
  view: 'scores' | 'report';
  open: number;
  section: number;
  drafted: boolean;
  pressed: boolean;
  flash: number;
}

const emptyReport = (): ReportState => ({
  scores: criteria.map(() => null),
  edited: criteria.map(() => false),
  view: 'scores',
  open: -1,
  section: 0,
  drafted: false,
  pressed: false,
  flash: -1,
});

const formatPoints = (value: number) => (value % 1 ? value.toFixed(1) : String(value));

function ReportPane({
  report,
  onChange,
  onDraft,
}: {
  report: ReportState;
  onChange: (next: Partial<ReportState>) => void;
  onDraft: () => void;
}) {
  const sum = totals(report.scores);
  const setScore = (index: number, value: number) => {
    const scores = report.scores.slice();
    const edited = report.edited.slice();
    scores[index] = clampScore(value);
    edited[index] = true;
    onChange({ scores, edited });
  };
  const criterionRow = (index: number) => {
    const criterion = criteria[index];
    if (!criterion) return null;
    const score = report.scores[index] ?? null;
    const max = maxPoints(criterion);
    const points = score == null ? null : (score / 10) * max;
    const open = report.open === index;
    const edited = report.edited[index];
    return (
      <div
        class={`as-row ${criterion.group === 'behavioural' ? 'b' : ''} ${open ? 'open' : ''} ${report.flash === index ? 'flash' : ''}`}
        key={criterion.name}
      >
        <div class="as-rt">
          <button
            type="button"
            class="as-name"
            onClick={() => onChange({ open: open ? -1 : index })}
            aria-expanded={open}
          >
            <i>{open ? '⌄' : '›'}</i>
            <span>{criterion.name}</span>
            <em class={edited ? 'you' : 'ai'}>{edited ? 'Edited' : score == null ? '' : '✦'}</em>
          </button>
          <span class="as-w">
            {criterion.weight}%<small>in group</small>
          </span>
          <span class="as-step">
            <button
              type="button"
              onClick={() => setScore(index, (score ?? criterion.draftScore) - 1)}
              aria-label={`Lower the ${criterion.name} score`}
            >
              −
            </button>
            <b class="mono">{score ?? '–'}</b>
            <button
              type="button"
              onClick={() => setScore(index, (score ?? criterion.draftScore) + 1)}
              aria-label={`Raise the ${criterion.name} score`}
            >
              +
            </button>
          </span>
          <span class="as-pts mono">
            {points == null ? '–' : formatPoints(points)}
            <small>/{formatPoints(max)}</small>
          </span>
        </div>
        {open && (
          <div class="as-det">
            <span>
              <b>Brief criterion:</b> {criterion.brief}
            </span>
            <span class="as-cap">EVIDENCE / RATIONALE</span>
            <div class="as-ev">{criterion.evidence}</div>
            <div class="as-df">
              <span>Missing evidence is an open question, not a low score.</span>
              <span>Clear score</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  const technical = criteria
    .map((c, i) => (c.group === 'technical' ? i : -1))
    .filter((i) => i >= 0);
  const behavioural = criteria
    .map((c, i) => (c.group === 'behavioural' ? i : -1))
    .filter((i) => i >= 0);
  const fixed = (value: number | null) => (value == null ? '–' : value.toFixed(1));
  return (
    <>
      <div class="fx-wtop">
        <span class="fx-dot"></span>
        <span>Shortlist</span>
        <i>/</i>
        <span class="text-d-text">Sarah Mitchell</span>
        <i>/</i>
        <span>Assessment</span>
        <span class="flex-1"></span>
        <span class="mono">Chief Financial Officer</span>
      </div>
      <div class="fx-pane gap-0 p-0">
        <div class="as">
          <div class="as-head">
            <img
              src={people.sarah.photo}
              alt=""
              width="52"
              height="52"
              loading="lazy"
              decoding="async"
            />
            <div class="flex min-w-0 flex-1 flex-col gap-0.75">
              <b>
                Sarah Mitchell <span class="as-in">in</span>
              </b>
              <span>Chief Financial Officer</span>
              <span class="as-co">
                <i>A</i>Alderwick Dairy · Dubai · United Arab Emirates
              </span>
            </div>
            <span class="as-status">
              <i></i>Shortlisted ⌄
            </span>
          </div>
          <div class="as-tabs">
            <span>Profile</span>
            <span>
              Notes <em>2</em>
            </span>
            <span class="on">Assessment</span>
            <span>Outreach</span>
            <span>Activity</span>
          </div>
          <div class="as-ai">
            <span>
              {report.drafted
                ? 'AI drafted 18 Nov 2026 · it never changes a score or section you wrote'
                : 'No scores yet. Score by hand, or let AI draft from the evidence.'}
            </span>
            <button
              type="button"
              class={`as-aib ${report.pressed ? 'press' : ''}`}
              onClick={onDraft}
            >
              ✦ Assess with AI
            </button>
          </div>
          <div class="as-sum">
            <div>
              <span class="as-cap">OVERALL SCORE</span>
              <b class="as-big mono">
                {fixed(sum.overall)}
                <small>/ 100</small>
              </b>
            </div>
            <div class="as-gp">
              <span class="as-cap text-d-inferred">TECHNICAL</span>
              <b class="mono text-d-inferred">
                {fixed(sum.technicalPoints)}
                <small>/60</small>
              </b>
            </div>
            <div class="as-gp">
              <span class="as-cap text-d-warm">BEHAVIOURAL</span>
              <b class="mono text-d-warm">
                {fixed(sum.behaviouralPoints)}
                <small>/40</small>
              </b>
            </div>
            <span class="as-draft ml-auto self-start">Draft</span>
          </div>
          <div class="as-seg">
            <button
              type="button"
              class={report.view === 'scores' ? 'on' : ''}
              aria-pressed={report.view === 'scores'}
              onClick={() => onChange({ view: 'scores' })}
            >
              Competency scores
            </button>
            <button
              type="button"
              class={report.view === 'report' ? 'on' : ''}
              aria-pressed={report.view === 'report'}
              onClick={() => onChange({ view: 'report' })}
            >
              Assessment report
            </button>
          </div>
          <div class="as-scroll">
            {report.view === 'scores' ? (
              <div class="as-list">
                <span class="as-meta">Scores out of 10 · {sum.scored} of 8 criteria scored</span>
                <div class="as-grp">
                  <span>
                    <i class="bg-d-inferred"></i>TECHNICAL <em>60% of total</em>
                  </span>
                  <span class="mono text-d-inferred">
                    {fixed(sum.technicalAverage)}
                    <small> /10 avg</small>
                  </span>
                </div>
                {technical.map(criterionRow)}
                <div class="as-grp text-d-warm">
                  <span>
                    <i class="bg-d-warm"></i>BEHAVIOURAL <em class="b">40% of total</em>
                  </span>
                  <span class="mono text-d-warm">
                    {fixed(sum.behaviouralAverage)}
                    <small> /10 avg</small>
                  </span>
                </div>
                {behavioural.map(criterionRow)}
              </div>
            ) : (
              <div class="as-list">
                {reportSections.map((section, i) => {
                  const open = report.section === i;
                  return (
                    <div
                      class={`as-sec ${open ? 'open' : ''}`}
                      ref={runtimeStyle({ 'animation-delay': `${(i * 0.12).toFixed(2)}s` })}
                      key={section.title}
                    >
                      <button
                        type="button"
                        class="as-sh"
                        aria-expanded={open}
                        onClick={() => onChange({ section: open ? -1 : i })}
                      >
                        <i>{open ? '⌄' : '›'}</i>
                        <b>{section.title}</b>
                        <em>✦</em>
                        <span class="as-draft">Draft</span>
                      </button>
                      <span class="as-st">{section.text}</span>
                    </div>
                  );
                })}
                <span class="as-meta italic">
                  Missing evidence is an open question, not an automatic negative. Your team sees
                  this assessment; client contacts never do.
                </span>
              </div>
            )}
          </div>
          <div class="as-foot">
            <span class="as-b2">Save draft</span>
            <span class="flex-1"></span>
            <span class="as-b1">Mark reviewed &amp; submit</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Showcase */

export default function FeatureShowcase() {
  const [tab, setTab] = useState<Tab>(0);
  const [live, setLive] = useState(false);
  const [auto, setAuto] = useState(false);
  const [copilot, setCopilot] = useState<CopilotView>('live');
  const [rank, setRank] = useState<RankState>(() => rankFromPreset(0));
  const [report, setReport] = useState<ReportState>(emptyReport);
  const root = useRef<HTMLDivElement>(null);
  const rankTimers = useRef<number[]>([]);
  const reportTimers = useRef<number[]>([]);
  const tabTimer = useRef(0);
  const autoRef = useRef(false);

  const stopRank = () => {
    rankTimers.current.forEach((id) => window.clearTimeout(id));
    rankTimers.current = [];
  };
  const stopReport = () => {
    reportTimers.current.forEach((id) => window.clearTimeout(id));
    reportTimers.current = [];
  };
  const takeControl = () => {
    autoRef.current = false;
    setAuto(false);
    window.clearTimeout(tabTimer.current);
  };

  const playRank = () => {
    stopRank();
    setRank(rankFromPreset(0));
    for (const [ms, preset] of [
      [3200, 1],
      [6600, 2],
      [10000, 3],
    ] as const) {
      rankTimers.current.push(window.setTimeout(() => setRank(rankFromPreset(preset)), ms));
    }
  };

  const draftAll = (keepEdited: boolean) =>
    setReport((r) => ({
      ...r,
      drafted: true,
      scores: criteria.map((c, i) =>
        keepEdited && r.edited[i] && r.scores[i] != null
          ? (r.scores[i] ?? c.draftScore)
          : c.draftScore,
      ),
    }));

  const playReport = () => {
    stopReport();
    setReport(emptyReport());
    const later = (ms: number, fn: () => void) =>
      reportTimers.current.push(window.setTimeout(fn, ms));
    const patch = (next: Partial<ReportState>) => setReport((r) => ({ ...r, ...next }));
    later(900, () => patch({ pressed: true }));
    later(1300, () => patch({ pressed: false }));
    criteria.forEach((c, i) =>
      later(1500 + i * 220, () =>
        setReport((r) => {
          const scores = r.scores.slice();
          scores[i] = c.draftScore;
          return { ...r, scores, drafted: i === criteria.length - 1 ? true : r.drafted };
        }),
      ),
    );
    later(4600, () => patch({ open: 1 }));
    later(6000, () => patch({ flash: 1 }));
    later(6400, () =>
      setReport((r) => {
        const scores = r.scores.slice();
        const edited = r.edited.slice();
        scores[1] = 9;
        edited[1] = true;
        return { ...r, scores, edited };
      }),
    );
    later(7400, () => patch({ flash: -1 }));
    later(8400, () => patch({ view: 'report', open: -1 }));
  };

  const showTab = (next: Tab) => {
    setTab(next);
    setCopilot('live');
    if (next === 2) playRank();
    else stopRank();
    if (next === 3) playReport();
    else stopReport();
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollDriven = () => document.documentElement.classList.contains('uv-scrolly');

    const advance = (current: Tab) => {
      tabTimer.current = window.setTimeout(
        () => {
          if (!autoRef.current) return;
          const next = ((current + 1) % 4) as Tab;
          showTab(next);
          advance(next);
        },
        (TAB_SECONDS[current] ?? 14) * 1000,
      );
    };

    const start = () => {
      setLive(true);
      if (scrollDriven()) return;
      setTab(1);
      setCopilot('live');
      if (reduce) return;
      autoRef.current = true;
      setAuto(true);
      advance(1);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    const onPinStep = (event: Event) => {
      const { key, index } = (event as CustomEvent<PinStepDetail>).detail;
      if (key !== 'fx') return;
      takeControl();
      setLive(true);
      showTab(index as Tab);
    };
    window.addEventListener(PIN_STEP_EVENT, onPinStep);

    return () => {
      observer.disconnect();
      window.removeEventListener(PIN_STEP_EVENT, onPinStep);
      window.clearTimeout(tabTimer.current);
      stopRank();
      stopReport();
    };
  }, []);

  const pick = (next: Tab) => {
    takeControl();
    setLive(true);
    showTab(next);
  };

  const onTabKey = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (((tab + step) % 4) + 4) % 4;
    pick(next as Tab);
    const buttons = root.current?.querySelectorAll<HTMLButtonElement>('.fx-tab');
    buttons?.[next]?.focus();
  };

  const visible: Tab = live ? tab : 0;

  return (
    <div ref={root}>
      <div class="fx-tabs" role="tablist" aria-label="Map, Assess, Rank and Report">
        {TABS.map((t, i) => {
          const selected = i === visible;
          return (
            <button
              type="button"
              role="tab"
              id={`fx-tab-${i}`}
              aria-controls="fx-panel"
              class={`fx-tab ${selected ? 'on' : ''}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => pick(i as Tab)}
              onKeyDown={onTabKey}
              key={t.label}
            >
              <span class="mono text-[12px]">{t.num}</span>
              <b>{t.label}</b>
              <span class="text-[14px]">{t.sub}</span>
              <i
                class={`fx-bar ${selected ? 'on' : ''} ${auto && live ? 'run' : ''} ${t.duration}`}
              ></i>
            </button>
          );
        })}
      </div>
      <div class="fx-stage" id="fx-panel" role="tabpanel" aria-labelledby={`fx-tab-${visible}`}>
        <div class="fx-copy">
          <TabCopy tab={visible} />
        </div>
        <div class="fx-win">
          {visible === 0 && <MapPane />}
          {visible === 1 && (
            <AssessPane
              view={copilot}
              onView={(view) => {
                takeControl();
                setCopilot(view);
              }}
            />
          )}
          {visible === 2 && (
            <RankPane
              rank={rank}
              onPreset={(index) => {
                stopRank();
                takeControl();
                setRank(rankFromPreset(index));
              }}
              onChange={(next) => {
                stopRank();
                takeControl();
                setRank((r) => ({ ...r, ...next, preset: -1 }));
              }}
            />
          )}
          {visible === 3 && (
            <ReportPane
              report={report}
              onChange={(next) => {
                stopReport();
                takeControl();
                setReport((r) => ({ ...r, pressed: false, flash: -1, ...next }));
              }}
              onDraft={() => {
                stopReport();
                takeControl();
                draftAll(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
