import type {
  ManifestoPillar,
  NewsArticle,
  PartyEvent,
  PartyMember,
} from '../types/party.ts';

export const PARTY_META = {
  name: 'Seema Sena Party',
  teluguName: 'సీమ సేన పార్టీ',
  tagline: 'Dignity, Water Equity, and Honest Governance for Andhra Pradesh',
  establishedDate: 'November 23, 2026',
  founderName: 'V Nagaraj',
  state: 'Andhra Pradesh',
  headquarters: '40-312, Gandhi Nagar, Kurnool & Amaravati Coordination Desk, Andhra Pradesh',
};

export const INITIAL_PILLARS: ManifestoPillar[] = [
  {
    index: '01',
    title: 'Water & Irrigation Equity',
    subtitle: 'Guaranteed canal water and tank restoration across Rayalaseema & upland AP',
    summary:
      'Every drought-prone mandal in Andhra Pradesh deserves an assured irrigation calendar, modernised lift projects, and desilted village tanks before summer distress begins.',
    keyCommitments: [
      'Time-bound completion of Handri-Neeva & Galeru-Nagari distributaries',
      'Solar-powered micro-irrigation subsidies for small and marginal farmers',
      'Real-time public reservoir and canal release ledger',
    ],
  },
  {
    index: '02',
    title: 'Youth Jobs & Agro-Industry',
    subtitle: 'Local value-addition corridors so Andhra youth thrive close to home',
    summary:
      'Stop distress migration by pairing district-level food processing, cold-chain clusters, and semiconductor/MSME skill parks across Kurnool, Tirupati, Vijayawada, and Visakhapatnam.',
    keyCommitments: [
      'Zero-interest seed capital for rural agri-tech and dairy cooperatives',
      'District apprenticeship compacts with state universities and polytechnics',
      'Transparent annual recruitment calendar for state civic services',
    ],
  },
  {
    index: '03',
    title: 'Clean Village & Town Governance',
    subtitle: 'Accountable panchayats, open ward budgets, and zero-commission welfare',
    summary:
      'Public funds belong in schools, primary health centres, and roads—not middlemen pockets. Every ward and gram panchayat expenditure will be audited in Telugu and English.',
    keyCommitments: [
      'Citizen-verified ward grievance resolution within 14 working days',
      'Direct-benefit transparency for pensions, housing, and crop insurance',
      'Upgraded 24x7 maternal and trauma care in every revenue division',
    ],
  },
  {
    index: '04',
    title: 'Telugu Pride & Social Harmony',
    subtitle: 'Preserving Rayalaseema & Coastal Andhra heritage with equal opportunity',
    summary:
      'From Telugu medium digital libraries to weaver and artisan clusters, Seema Sena Party stands for unity across every community, caste, and district of Andhra Pradesh.',
    keyCommitments: [
      'Handloom and stone-craft export clusters in Dharmavaram, Kurnool, and Mangalagiri',
      'Scholarships and residential hostels for rural girls and first-generation students',
      'Protection of temple, heritage, and community ecological commons',
    ],
  },
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-founding-declaration',
    title: 'V Nagaraj Announces Historic Founding Launch of Seema Sena Party on November 23, 2026',
    category: 'Press Releases',
    publishedAt: 'November 18, 2026',
    readTime: '4 min read',
    author: 'State Media Secretariat',
    location: 'Kurnool, Andhra Pradesh',
    summary:
      'Founder V Nagaraj unveiled the official party charter, yellow emblem, and statewide membership drive ahead of the November 23, 2026 Founding Day Sankalpa Sabha in Kurnool.',
    body: [
      'Addressing district coordinators, farmers, students, and civic volunteers in Kurnool today, Seema Sena Party Founder V Nagaraj formally released the party’s founding roadmap ahead of its historic establishment day on November 23, 2026.',
      'Rooted in the lived aspirations of Andhra Pradesh—and carrying the unmistakable yellow banner of sunrise, harvest, and public integrity—Seema Sena Party enters state politics with a pledge to keep irrigation water, youth employment, and honest ward governance at the centre of every legislative debate.',
      'V Nagaraj emphasized that membership will remain open and transparent across all 26 districts of Andhra Pradesh, giving ordinary citizens, farmers, weavers, and young graduates direct voice in constituency candidate selection and policy drafting.',
      'Preparations are now complete for the November 23 Founding Convention at St. Joseph Grounds in Kurnool, where the full Andhra Pradesh People’s Charter will be adopted in the presence of delegates from Rayalaseema, Coastal Andhra, and North Andhra.',
    ],
    quote: {
      text: 'Seema Sena Party is not built behind closed doors—it is forged in the fields, classrooms, and neighbourhoods of Andhra Pradesh for every family seeking dignity and fair opportunity.',
      attribution: 'V Nagaraj, Founder, Seema Sena Party',
    },
    imageUrl: '/src/assets/images/hero_andhra_rally_1795076805790.jpg',
    imageAlt: 'Seema Sena Party public convention stage adorned with golden yellow banners in Andhra Pradesh',
    featured: true,
  },
  {
    id: 'news-irrigation-charter',
    title: 'Rayalaseema & Upland Irrigation Equity Blueprint Released Ahead of Launch',
    category: 'Policy & Manifesto',
    publishedAt: 'November 14, 2026',
    readTime: '5 min read',
    author: 'Agricultural Policy Wing',
    location: 'Anantapur & Kadapa, AP',
    summary:
      'Detailed technical framework outlines canal lining, micro-irrigation support, and transparent reservoir allocation calendars for drought-prone mandals.',
    body: [
      'Seema Sena Party’s Agricultural Policy Wing published a 24-point technical white paper addressing chronic tail-end water shortages across Kurnool, Nandyal, Anantapur, Sri Sathya Sai, and YSR Kadapa districts.',
      'The blueprint calls for statutory water-release schedules before the Kharif and Rabi sowing windows, solar-powered drip kits for smallholders, and community-monitored check dams.',
      'Farmer delegations from 18 mandals contributed field data during drafting consultations held over the past six weeks.',
    ],
    quote: {
      text: 'When water reaches the last acre in Rayalaseema on time, the entire state economy rises with it.',
      attribution: 'V Nagaraj, Policy Consultation Address',
    },
    imageUrl: '/src/assets/images/news_irrigation_project_1795076805573.jpg',
    imageAlt: 'Sunlit stone-lined irrigation canal flowing beside green agricultural fields in Andhra Pradesh',
  },
  {
    id: 'news-tirupati-youth-forum',
    title: 'Tirupati & Chittoor Youth Policy Forum Draws Over 1,400 Engineering & Degree Delegates',
    category: 'District Tours',
    publishedAt: 'November 10, 2026',
    readTime: '3 min read',
    author: 'Yuva Sena Desk',
    location: 'Tirupati, Andhra Pradesh',
    summary:
      'Students, young entrepreneurs, and IT aspirants submitted district skill priorities for inclusion in the November 23 founding manifesto.',
    body: [
      'Young graduates and Polytechnic students across Tirupati and Chittoor districts gathered for an open-floor policy dialogue hosted by Seema Sena Party’s Yuva Sena organising committee.',
      'Key proposals included district-level agro-food testing labs, reliable state exam calendars, and co-working incubators for tier-2 towns across Andhra Pradesh.',
      'Every submitted recommendation has been logged into the party’s public policy docket ahead of the November 23 inaugural address.',
    ],
    quote: {
      text: 'Our graduates should never have to leave Andhra Pradesh out of compulsion—jobs and enterprise must grow in our own districts.',
      attribution: 'V Nagaraj, Founder, Seema Sena Party',
    },
    imageUrl: '/src/assets/images/news_youth_convention_1795076804964.jpg',
    imageAlt: 'Young graduates and civic delegates conversing at an Andhra Pradesh town hall forum',
  },
  {
    id: 'news-district-coordinators',
    title: 'Digital Membership Pass & 26-District Volunteer Network Activated Statewide',
    category: 'Press Releases',
    publishedAt: 'November 05, 2026',
    readTime: '3 min read',
    author: 'Organisational Secretariat',
    location: 'Vijayawada, Andhra Pradesh',
    summary:
      'Citizens across all 26 districts of Andhra Pradesh can now register online and verify their official SSP-2026 digital membership pass instantly.',
    body: [
      'To ensure seamless grassroots participation ahead of November 23, 2026, Seema Sena Party has launched its unified digital membership portal covering every Assembly Constituency in Andhra Pradesh.',
      'Each registered member receives a unique district-coded Membership ID (SSP-2026) and can select active participation across Primary, Youth, Women, or Farmers wings.',
    ],
    quote: {
      text: 'A transparent party begins with an accessible membership register open to every honest citizen.',
      attribution: 'V Nagaraj, Founder, Seema Sena Party',
    },
    imageUrl: '/src/assets/images/party_emblem_flag_1795076814335.jpg',
    imageAlt: 'Seema Sena Party golden yellow emblem featuring rising sun over hills and grain stalks',
  },
];

export const INITIAL_EVENTS: PartyEvent[] = [
  {
    id: 'evt-founding-day-kurnool',
    title: 'Seema Sena Party Founding Day & Sankalpa Sabha',
    category: 'Founding Day',
    dateIso: '2026-11-23',
    timeLabel: '10:00 AM – 02:30 PM IST',
    venue: 'St. Joseph College Grounds, Bellary Road',
    district: 'Kurnool',
    speaker: 'V Nagaraj (Party Founder) & State Executive Committee',
    description:
      'The official establishment ceremony of Seema Sena Party. Featuring the hoisting of the Yellow Sunrise Banner, adoption of the Andhra Pradesh People’s Charter, and keynote address by Founder V Nagaraj.',
    capacity: 25000,
    rsvpCount: 14820,
    isFlagship: true,
  },
  {
    id: 'evt-tirupati-youth-conclave',
    title: 'Yuva Sena Employment & Skill Summit',
    category: 'Youth Conventions',
    dateIso: '2026-11-29',
    timeLabel: '03:30 PM – 06:30 PM IST',
    venue: 'Mahathi Auditorium, Karakambadi Road',
    district: 'Tirupati',
    speaker: 'V Nagaraj & Yuva Sena Policy Panel',
    description:
      'Interactive town hall with university students, MSME founders, and first-time voters focused on Tirupati–Chittoor electronics and agro-processing job corridors.',
    capacity: 3000,
    rsvpCount: 1640,
  },
  {
    id: 'evt-anantapur-rythu-sabha',
    title: 'Rayalaseema Rythu & Water Rights Rally',
    category: 'Rallies',
    dateIso: '2026-12-06',
    timeLabel: '11:00 AM – 02:00 PM IST',
    venue: 'Arts College Ground, Subhash Road',
    district: 'Anantapur',
    speaker: 'V Nagaraj & Farmers Front Coordinators',
    description:
      'Public solidarity rally demanding assured Handri-Neeva irrigation releases, crop insurance accountability, and remunerative MSP procurement centres.',
    capacity: 15000,
    rsvpCount: 6290,
  },
  {
    id: 'evt-vijayawada-civic-townhall',
    title: 'Coastal & Capital Region Civic Governance Town Hall',
    category: 'Town Halls',
    dateIso: '2026-12-13',
    timeLabel: '04:00 PM – 07:00 PM IST',
    venue: 'Tummalapalli Kalakshetram',
    district: 'NTR (Vijayawada)',
    speaker: 'V Nagaraj & Urban Governance Advisory Board',
    description:
      'Open citizen consultation on municipal transparency, drainage infrastructure, small-trader credit, and equitable development across Krishna & Guntur.',
    capacity: 2200,
    rsvpCount: 1125,
  },
  {
    id: 'evt-vizag-north-andhra-meet',
    title: 'North Andhra Coastal Development & Youth Conclave',
    category: 'Town Halls',
    dateIso: '2026-12-20',
    timeLabel: '10:30 AM – 01:30 PM IST',
    venue: 'Gurajada Kalakshetram, Siripuram',
    district: 'Visakhapatnam',
    speaker: 'V Nagaraj & North Andhra Organisers',
    description:
      'Dialogue with fishermen associations, steel and port workers, and tribal welfare advocates from Visakhapatnam, Vizianagaram, and Srikakulam.',
    capacity: 2800,
    rsvpCount: 980,
  },
];

export const INITIAL_MEMBERS: PartyMember[] = [
  {
    memberId: 'SSP-KNL-2026-0001',
    fullName: 'V Nagaraj',
    phone: '9848000001',
    email: 'founder@seemasenaparty.in',
    district: 'Kurnool',
    constituency: 'Kurnool Urban',
    wing: 'Primary Member',
    joinedAt: '2026-11-01T09:00:00.000Z',
  },
  {
    memberId: 'SSP-ATP-2026-0002',
    fullName: 'Srinivasulu Reddy',
    phone: '9849123402',
    email: 'srinivas@example.in',
    district: 'Anantapur',
    constituency: 'Anantapur Urban',
    wing: 'Farmers Front (Rythu Sena)',
    joinedAt: '2026-11-12T11:30:00.000Z',
  },
  {
    memberId: 'SSP-TPT-2026-0003',
    fullName: 'Padmavathi Devi',
    phone: '9989123403',
    email: 'padmavathi@example.in',
    district: 'Tirupati',
    constituency: 'Tirupati',
    wing: "Women's Wing (Mahila Sena)",
    joinedAt: '2026-11-14T15:15:00.000Z',
  },
  {
    memberId: 'SSP-NTR-2026-0004',
    fullName: 'Karthikeya Varma',
    phone: '9701123404',
    email: 'karthik@example.in',
    district: 'NTR (Vijayawada)',
    constituency: 'Vijayawada Central',
    wing: 'Youth Wing (Yuva Sena)',
    joinedAt: '2026-11-16T10:45:00.000Z',
  },
];
