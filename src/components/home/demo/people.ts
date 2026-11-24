import danaQasim from '~/assets/home/people/dana-qasim.jpg';
import danielWeber from '~/assets/home/people/daniel-weber.jpg';
import karimAziz from '~/assets/home/people/karim-aziz.jpg';
import monaKhalil from '~/assets/home/people/mona-khalil.jpg';
import nadiaHaddad from '~/assets/home/people/nadia-haddad.jpg';
import priyaRaman from '~/assets/home/people/priya-raman.jpg';
import raniaSaleh from '~/assets/home/people/rania-saleh.jpg';
import samiDarwish from '~/assets/home/people/sami-darwish.jpg';
import sarahMitchell from '~/assets/home/people/sarah-mitchell.jpg';
import tariqBashir from '~/assets/home/people/tariq-bashir.jpg';
import weiChen from '~/assets/home/people/wei-chen.jpg';
import yusufRahman from '~/assets/home/people/yusuf-rahman.jpg';

/** A fictional executive from the design's sample mandate (Halden Consumer Group, CFO). */
export interface SamplePerson {
  readonly name: string;
  readonly first: string;
  readonly title: string;
  readonly company: string;
  readonly photo: string;
}

function person(
  name: string,
  title: string,
  company: string,
  photo: { src: string },
): SamplePerson {
  return { name, first: name.split(' ')[0] ?? name, title, company, photo: photo.src };
}

export const people = {
  tariq: person('Tariq Bashir', 'Group Financial Controller', 'Gulf Table Group', tariqBashir),
  yusuf: person('Yusuf Rahman', 'Deputy CFO', 'Palm Coast Foods', yusufRahman),
  dana: person('Dana Qasim', 'Head of FP&A', 'Sands Food Co.', danaQasim),
  sami: person('Sami Darwish', 'Group Treasurer', 'Al Noor Beverages', samiDarwish),
  rania: person('Rania Saleh', 'VP Finance', 'Najd Harvest Foods', raniaSaleh),
  mona: person('Mona Khalil', 'CFO', 'Crescent Food Industries', monaKhalil),
  nadia: person('Nadia Haddad', 'CFO', 'Jade Eastern Mills', nadiaHaddad),
  priya: person('Priya Raman', 'Divisional CFO', 'Sahara Dairy Group', priyaRaman),
  sarah: person('Sarah Mitchell', 'CFO', 'Alderwick Dairy', sarahMitchell),
  karim: person('Karim Aziz', 'CFO', 'Calder Brands', karimAziz),
  daniel: person('Daniel Weber', 'Finance Director', 'Atlas Central Foods', danielWeber),
  wei: person('Wei Chen', 'Group CFO', 'Ridge Gulf Agro', weiChen),
} as const;

/** The interviewer's own camera tile in the co-pilot mock-up. */
export const interviewerPhoto = tariqBashir.src;
