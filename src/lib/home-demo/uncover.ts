/**
 * "Search what you know. Uncover what you don't." Three assistant prompts for the Halden CFO
 * mandate, each returning a tiered list and three adjacent sectors to uncover. Every company is
 * fictional: the design's sample data, renamed so no real business appears as a result.
 */

export type SectorIcon =
  | 'dairy'
  | 'grain'
  | 'food'
  | 'drink'
  | 'retail'
  | 'truck'
  | 'building'
  | 'box'
  | 'leaf'
  | 'egg'
  | 'factory'
  | 'coffee';

export interface CompanyRow {
  readonly name: string;
  readonly employees: string;
  readonly tier: 1 | 2;
  readonly country: string;
  readonly revenue: string;
  readonly note: string;
  readonly icon: SectorIcon;
}

export interface AdjacentGroup {
  readonly label: string;
  readonly title: string;
  readonly why: string;
  readonly count: number;
  readonly rows: readonly CompanyRow[];
}

export interface UncoverScenario {
  readonly prompt: string;
  readonly sector: string;
  readonly total: number;
  /** The adjacent group the demo uncovers by itself. */
  readonly autoUncover: number;
  readonly lead: string;
  readonly rest: string;
  readonly steps: readonly [string, string, string];
  readonly base: readonly CompanyRow[];
  readonly groups: readonly [AdjacentGroup, AdjacentGroup, AdjacentGroup];
}

const row = (
  name: string,
  employees: string,
  tier: 1 | 2,
  country: string,
  revenue: string,
  note: string,
  icon: SectorIcon,
): CompanyRow => ({ name, employees, tier, country, revenue, note, icon });

const UAE = 'United Arab Emirates';
const KSA = 'Saudi Arabia';

const binSaad = row(
  'Bin Saad Markets',
  '1,000+',
  1,
  KSA,
  '$1B+',
  'Grocery retail, listed on Tadawul',
  'retail',
);
const alHamra = row(
  'Al Hamra Markets',
  '1,000+',
  2,
  KSA,
  '$1B+',
  'Grocery retail, listed on Tadawul',
  'retail',
);
const sahraFoods = row(
  'Al Sahra Foods',
  '1,000+',
  1,
  UAE,
  '—',
  'Family-owned flour, oils and foods',
  'grain',
);
const khorFood = row(
  'Khor Food Industries',
  '1,000+',
  2,
  UAE,
  '—',
  'Family-owned food manufacturer',
  'factory',
);

export const uncoverScenarios: readonly UncoverScenario[] = [
  {
    prompt: 'Food and beverage groups in the GCC with listing experience',
    sector: 'food & beverages',
    total: 24,
    autoUncover: 0,
    lead: '24 food & beverage groups',
    rest: 'match, tiered against the brief. Finance leaders with listing experience also sit in the sectors next door.',
    steps: [
      'Reading the CFO brief',
      'Searching food & beverages in the GCC',
      'Tiering companies against the brief',
    ],
    base: [
      row(
        'Rimal Dairy Co.',
        '10,000+',
        1,
        KSA,
        '$1B+',
        'Dairy and food, listed on Tadawul',
        'dairy',
      ),
      row(
        'Wahat Food Holding',
        '10,000+',
        1,
        KSA,
        '$1B+',
        'Food and retail holding, Tadawul',
        'building',
      ),
      row(
        'Sahil Foods Group',
        '1,000+',
        1,
        UAE,
        '$1B+',
        'Food and beverage, listed on ADX',
        'food',
      ),
      row('Qasr Restaurants', '10,000+', 1, UAE, '$1B+', 'Dual-listed on ADX and Tadawul', 'food'),
      row('Najd Agri Co.', '1,000+', 2, KSA, '$500M+', 'Dairy and agriculture, Tadawul', 'dairy'),
      row('Safa Dairy Foods', '1,000+', 2, KSA, '$500M+', 'Dairy and foodstuffs, Tadawul', 'dairy'),
      row(
        'Darb Food Holding',
        '1,000+',
        2,
        'Kuwait',
        '$500M+',
        'Food group, listed on Boursa Kuwait',
        'food',
      ),
      row(
        'Lusail Pastures',
        '—',
        2,
        'Qatar',
        '$100M+',
        'Dairy, listed on Qatar Stock Exchange',
        'dairy',
      ),
    ],
    groups: [
      {
        label: 'poultry & protein',
        title: 'Poultry and protein producers',
        why: 'Multi-entity groups with heavy consolidation work, much like Halden.',
        count: 18,
        rows: [
          row(
            'Tamr Protein Co.',
            '1,000+',
            1,
            KSA,
            '$100M+',
            'Poultry and protein, Tadawul',
            'egg',
          ),
          row('Wadi Poultry', '1,000+', 2, KSA, '—', 'Family-owned poultry producer', 'egg'),
          row('Noor Halal Foods', '—', 2, UAE, '—', 'Halal frozen foods', 'food'),
        ],
      },
      {
        label: 'grocery retail',
        title: 'Listed grocery retailers',
        why: 'CFOs who have already taken a business through a listing.',
        count: 14,
        rows: [
          binSaad,
          alHamra,
          row(
            'Corniche Grocers',
            '1,000+',
            2,
            UAE,
            '$500M+',
            'Premium grocery, listed on DFM',
            'retail',
          ),
        ],
      },
      {
        label: 'family food groups',
        title: 'Family-owned food groups',
        why: 'Finance leaders used to shareholder councils and family governance.',
        count: 11,
        rows: [
          sahraFoods,
          khorFood,
          row(
            'Marina Trading Group',
            '1,000+',
            2,
            UAE,
            '—',
            'Family-owned distribution and retail',
            'truck',
          ),
        ],
      },
    ],
  },
  {
    prompt: 'Family-owned consumer goods groups in Saudi Arabia',
    sector: 'consumer goods',
    total: 15,
    autoUncover: 1,
    lead: '15 family-owned groups',
    rest: 'in Saudi Arabia, tiered against the brief. Finance heads used to family governance also sit in nearby sectors.',
    steps: [
      'Reading the CFO brief',
      'Searching family-owned groups in Saudi Arabia',
      'Checking ownership and tiering',
    ],
    base: [
      row('Bin Faris Trading', '1,000+', 1, KSA, '—', 'Family-owned FMCG distribution', 'truck'),
      row(
        'Ardh Consumer Holding',
        '1,000+',
        1,
        KSA,
        '—',
        'Consumer products distribution',
        'truck',
      ),
      row(
        'Al Rasheed Group',
        '1,000+',
        1,
        KSA,
        '—',
        'Family group with food and distribution arms',
        'building',
      ),
      row('Rabwa Foods', '1,000+', 2, KSA, '—', 'Family-owned juices and dairy', 'drink'),
      row('Wadi Poultry', '1,000+', 2, KSA, '—', 'Family-owned poultry producer', 'egg'),
    ],
    groups: [
      {
        label: 'family holdings',
        title: 'Diversified family groups',
        why: 'Group CFOs who run finance across many family businesses.',
        count: 12,
        rows: [
          row(
            'Al Mansoori Holdings',
            '10,000+',
            1,
            UAE,
            '—',
            'Family-owned, retail to automotive',
            'building',
          ),
          row(
            'Sharq Industries',
            '10,000+',
            2,
            'Kuwait',
            '—',
            'Family-owned conglomerate',
            'building',
          ),
          row(
            'Al Bayan Group',
            '1,000+',
            2,
            KSA,
            '—',
            'Family-owned, food to technology',
            'building',
          ),
        ],
      },
      {
        label: 'grocery retail',
        title: 'Grocery retail chains',
        why: 'Finance leaders who know thin margins and high-volume supply.',
        count: 9,
        rows: [
          binSaad,
          alHamra,
          row(
            'Saffa Hypermarkets',
            '10,000+',
            2,
            UAE,
            '$1B+',
            'Hypermarkets, listed on ADX',
            'retail',
          ),
        ],
      },
      {
        label: 'food manufacturing',
        title: 'Private food manufacturers',
        why: 'CFOs who have managed plants, capex and supplier finance.',
        count: 15,
        rows: [
          sahraFoods,
          khorFood,
          row('Barq Frozen Foods', '—', 2, UAE, '—', 'Frozen foods, family-owned', 'food'),
        ],
      },
    ],
  },
  {
    prompt: 'Dairy and beverage makers in the UAE',
    sector: 'dairy & beverages',
    total: 13,
    autoUncover: 2,
    lead: '13 dairy and beverage makers',
    rest: 'in the UAE, tiered against the brief. Similar finance roles sit in adjacent sectors.',
    steps: [
      'Reading the CFO brief',
      'Searching dairy and beverages in the UAE',
      'Tiering companies against the brief',
    ],
    base: [
      row(
        'Sahil Foods Group',
        '1,000+',
        1,
        UAE,
        '$1B+',
        'Water, dairy and food, listed on ADX',
        'drink',
      ),
      row('Ghaf Dairy', '1,000+', 1, UAE, '—', 'Fresh dairy and juices', 'dairy'),
      row('Liwa Farms', '—', 1, UAE, '—', 'Dairy, juice and poultry', 'dairy'),
      row('Hajar Springs', '—', 2, UAE, '—', 'Bottled water and juices', 'drink'),
      row('Nakhla Juices', '—', 2, UAE, '—', 'Fresh juices and produce', 'drink'),
    ],
    groups: [
      {
        label: 'packaging',
        title: 'Food packaging suppliers',
        why: 'Finance leaders who price commodities and manage hedging.',
        count: 8,
        rows: [
          row('Sadaf Packaging', '1,000+', 1, UAE, '—', 'Food packaging, family-owned', 'box'),
          row('Raya Packaging Co.', '1,000+', 2, KSA, '—', 'Paper and plastic packaging', 'box'),
          row('Mina Food Pack', '—', 2, UAE, '—', 'Food packaging and disposables', 'box'),
        ],
      },
      {
        label: 'agribusiness',
        title: 'Agribusiness and feed',
        why: 'CFOs used to seasonal cash flow and supply contracts.',
        count: 10,
        rows: [
          row('Oasis Agri Holding', '1,000+', 1, UAE, '—', 'Agribusiness and animal feed', 'leaf'),
          row('Najd Feed Co.', '1,000+', 2, KSA, '—', 'Feed and agricultural services', 'leaf'),
          row('Green Dune Farms', '—', 2, UAE, '—', 'Farming and fresh produce', 'leaf'),
        ],
      },
      {
        label: 'food service',
        title: 'Food service and catering',
        why: 'Finance heads who run multi-site cost control.',
        count: 16,
        rows: [
          row(
            'Qasr Restaurants',
            '10,000+',
            1,
            UAE,
            '$1B+',
            'Dual-listed on ADX and Tadawul',
            'food',
          ),
          row('Skyline Catering', '1,000+', 2, UAE, '—', 'Airline and events catering', 'food'),
          row(
            'Bayt Franchise Group',
            '10,000+',
            2,
            'Kuwait',
            '—',
            'Family-owned franchise operator',
            'coffee',
          ),
        ],
      },
    ],
  },
];

export type UncoverPhase = 'typing' | 'thinking' | 'results';

export interface UncoverState {
  readonly scenario: number;
  readonly typed: number;
  readonly phase: UncoverPhase;
  /** Steps completed while thinking, 0–3. */
  readonly stepsDone: number;
  readonly rowsShown: number;
  /** Uncovered group indexes, most recent first. */
  readonly uncovered: readonly number[];
  readonly pressed: number;
}

export const restingState = (scenario = 0): UncoverState => {
  const s = uncoverScenarios[scenario] ?? uncoverScenarios[0];
  return {
    scenario,
    typed: s?.prompt.length ?? 0,
    phase: 'results',
    stepsDone: 3,
    rowsShown: s?.base.length ?? 0,
    uncovered: [],
    pressed: -1,
  };
};

export interface VisibleRow extends CompanyRow {
  readonly sector: string;
  readonly isNew: boolean;
}

/** The table's rows: uncovered groups first (newest on top), then the base results, 11 at most. */
export function visibleRows(state: UncoverState): VisibleRow[] {
  const scenario = uncoverScenarios[state.scenario];
  if (!scenario) return [];
  const rows: VisibleRow[] = [];
  for (const groupIndex of state.uncovered) {
    const group = scenario.groups[groupIndex];
    if (!group) continue;
    for (const r of group.rows) rows.push({ ...r, sector: group.label, isNew: true });
  }
  const shown = state.phase === 'results' ? state.rowsShown : 0;
  for (const r of scenario.base.slice(0, shown))
    rows.push({ ...r, sector: scenario.sector, isNew: false });
  return rows.slice(0, 11);
}

export function uncoveredTotal(state: UncoverState): number {
  const scenario = uncoverScenarios[state.scenario];
  if (!scenario) return 0;
  return state.uncovered.reduce((sum, i) => sum + (scenario.groups[i]?.count ?? 0), 0);
}
