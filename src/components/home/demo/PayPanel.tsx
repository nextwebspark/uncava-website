/** The Remuneration report view: our offered band against 32 disclosed packages in the UAE. */

type DotTone = 'out' | 'interested' | 'talking' | 'neutral';

const toneClass: Record<DotTone, string> = {
  out: 'bg-d-red',
  interested: 'bg-d-green',
  talking: 'bg-d-blue',
  neutral: 'bg-d-text-3',
};

/* Positions are literal classes so the static build places every dot without a style attribute. */
const dots: readonly { left: string; tone: DotTone }[] = [
  { left: 'left-[7%]', tone: 'interested' },
  { left: 'left-[15%]', tone: 'out' },
  { left: 'left-[19%]', tone: 'out' },
  { left: 'left-[20.5%]', tone: 'out' },
  { left: 'left-[22%]', tone: 'out' },
  { left: 'left-[23.5%]', tone: 'out' },
  { left: 'left-[27%]', tone: 'neutral' },
  { left: 'left-[31%]', tone: 'out' },
  { left: 'left-[36.5%]', tone: 'interested' },
  { left: 'left-[41%]', tone: 'out' },
  { left: 'left-[48%]', tone: 'out' },
  { left: 'left-[49.5%]', tone: 'out' },
  { left: 'left-[50.5%]', tone: 'talking' },
  { left: 'left-[53%]', tone: 'interested' },
  { left: 'left-[58%]', tone: 'out' },
  { left: 'left-[62%]', tone: 'out' },
  { left: 'left-[63.5%]', tone: 'out' },
  { left: 'left-[66%]', tone: 'out' },
  { left: 'left-[72%]', tone: 'neutral' },
  { left: 'left-[86%]', tone: 'out' },
  { left: 'left-[96%]', tone: 'out' },
];

interface PayPanelProps {
  /** `hero` is the tilted background scene; `frame` the framed product view in its own section. */
  variant: 'hero' | 'frame';
}

export default function PayPanel({ variant }: PayPanelProps) {
  const legend: readonly [string, string][] = [
    ['bg-d-green', 'Interested or further'],
    ['bg-d-blue', 'In conversation'],
    ['bg-d-red', 'Out of process'],
  ];
  return (
    <div class="pay">
      <div class={`flex items-baseline gap-3.5 ${variant === 'frame' ? 'flex-wrap' : ''}`}>
        <span class="pay-title font-sans text-[26px] leading-[1.2] font-semibold tracking-[-.02em]">
          Are we underpaying, against real evidence?
        </span>
        <span class="mono text-[14px] text-d-text-3">Remuneration · live</span>
      </div>
      <div class="pay-i">
        Our offered ceiling (<b>AED 1.2M fixed pay</b>) sits at the <b>47th percentile</b> of 32
        disclosed packages in the UAE. 16 of 32 are priced above it.
      </div>
      <div class="pay-k">
        <div>
          <span>Disclosed packages</span>
          <strong class="text-d-accent-soft">32</strong>
        </div>
        <div>
          <span>Median disclosed</span>
          <strong>AED 1.2M</strong>
        </div>
        <div class="warm">
          <span>Our ceiling</span>
          <strong>47th</strong>
        </div>
        <div class="warm">
          <span>Priced above band</span>
          <strong>16/32</strong>
        </div>
      </div>
      <div class="pay-panel rounded-[8px] border border-[rgba(255,255,255,.08)] bg-ink-0 px-5 py-4.5">
        <div class="font-sans text-[17px] leading-[1.3] font-semibold">Disclosed compensation</div>
        <div class="pt-1 text-[13px] text-d-text-3">
          n = 32 named executives (in United Arab Emirates)
        </div>
        <div class="pctl">
          <span class="pseg">
            <span>Total package</span>
            <span class="on">Total fixed</span>
          </span>
          <span class="psel">
            United Arab Emirates<i>⌄</i>
          </span>
        </div>
        <div class="flex flex-wrap gap-5.5 text-[14px] text-d-text-2">
          {legend.map(([tone, label]) => (
            <span class="flex items-center gap-2" key={label}>
              <i class={`h-2.5 w-2.5 rounded-full ${tone}`}></i>
              {label}
            </span>
          ))}
          <span class="flex items-center gap-2">
            <i class="w-3.5 border-t-2 border-dashed border-t-d-red"></i>Median
          </span>
        </div>
        <div class="pchart">
          <span class="mono absolute top-1.5 left-[39.5%] -translate-x-1/2 text-[13px] tracking-[.04em] whitespace-nowrap text-d-accent-2">
            OUR OFFERED BAND
          </span>
          <span class="absolute top-7.5 left-[35%] h-28 w-[9%] rounded-[4px] border border-dashed border-[rgba(110,121,242,.6)] bg-[rgba(110,121,242,.12)]"></span>
          <span class="absolute top-6 left-[46%] h-37 border-l-2 border-dashed border-l-d-red"></span>
          <span class="absolute top-21.5 right-0 left-0 h-px bg-[rgba(255,255,255,.12)]"></span>
          {dots.map((dot, i) => (
            <span class={`pdot ${dot.left} ${toneClass[dot.tone]}`} key={i}></span>
          ))}
          <span class="pmed"></span>
          <span class="mono absolute top-37.5 left-[35%] -translate-x-1/2 text-[13px] whitespace-nowrap text-d-accent-2">
            AED 1.1M
          </span>
          <span class="mono absolute top-37.5 left-[44%] -translate-x-1/2 text-[13px] whitespace-nowrap text-d-accent-2">
            AED 1.2M
          </span>
          <span class="mono absolute top-44.5 left-[46%] -translate-x-1/2 text-[13px] whitespace-nowrap text-d-red">
            MEDIAN AED 1.2M
          </span>
        </div>
      </div>
    </div>
  );
}
