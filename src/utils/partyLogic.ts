import type {
  DistrictOption,
  EventCategory,
  MembershipFormInput,
  MembershipWing,
  NewsArticle,
  NewsCategory,
  PartyEvent,
  RsvpFormInput,
} from '../types/party.ts';

export const AP_DISTRICTS: DistrictOption[] = [
  { name: 'Kurnool', code: 'KNL', region: 'Rayalaseema' },
  { name: 'Nandyal', code: 'NDL', region: 'Rayalaseema' },
  { name: 'Anantapur', code: 'ATP', region: 'Rayalaseema' },
  { name: 'Sri Sathya Sai', code: 'SSS', region: 'Rayalaseema' },
  { name: 'YSR Kadapa', code: 'KDP', region: 'Rayalaseema' },
  { name: 'Annamayya', code: 'ANM', region: 'Rayalaseema' },
  { name: 'Tirupati', code: 'TPT', region: 'Rayalaseema' },
  { name: 'Chittoor', code: 'CTR', region: 'Rayalaseema' },
  { name: 'NTR (Vijayawada)', code: 'NTR', region: 'Coastal Andhra' },
  { name: 'Guntur', code: 'GNT', region: 'Coastal Andhra' },
  { name: 'Krishna', code: 'KRS', region: 'Coastal Andhra' },
  { name: 'Palnadu', code: 'PLD', region: 'Coastal Andhra' },
  { name: 'Bapatla', code: 'BPT', region: 'Coastal Andhra' },
  { name: 'Prakasam', code: 'PKM', region: 'Coastal Andhra' },
  { name: 'SPSR Nellore', code: 'NLR', region: 'Coastal Andhra' },
  { name: 'East Godavari', code: 'EGD', region: 'Coastal Andhra' },
  { name: 'West Godavari', code: 'WGD', region: 'Coastal Andhra' },
  { name: 'Kakinada', code: 'KKD', region: 'Coastal Andhra' },
  { name: 'Konaseema', code: 'KNS', region: 'Coastal Andhra' },
  { name: 'Eluru', code: 'ELR', region: 'Coastal Andhra' },
  { name: 'Visakhapatnam', code: 'VSP', region: 'North Andhra' },
  { name: 'Anakapalli', code: 'AKP', region: 'North Andhra' },
  { name: 'Vizianagaram', code: 'VZM', region: 'North Andhra' },
  { name: 'Srikakulam', code: 'SKL', region: 'North Andhra' },
  { name: 'Parvathipuram Manyam', code: 'PMN', region: 'North Andhra' },
  { name: 'Alluri Sitharama Raju', code: 'ASR', region: 'North Andhra' },
];

export const MEMBERSHIP_WINGS: MembershipWing[] = [
  'Primary Member',
  'Youth Wing (Yuva Sena)',
  "Women's Wing (Mahila Sena)",
  'Farmers Front (Rythu Sena)',
  'Volunteer Coordinator',
];

export function normalizeIndianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidIndianPhone(raw: string): boolean {
  const normalized = normalizeIndianPhone(raw);
  return /^[6-9]\d{9}$/.test(normalized);
}

export function maskPhoneNumber(raw: string): string {
  const normalized = normalizeIndianPhone(raw);
  if (normalized.length !== 10) return '******';
  return `${normalized.slice(0, 2)}••••${normalized.slice(6)}`;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateMembershipForm(input: MembershipFormInput): ValidationResult {
  const errors: Record<string, string> = {};

  const trimmedName = input.fullName.trim();
  if (trimmedName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (trimmedName.length > 80) {
    errors.fullName = 'Full name must be 80 characters or fewer.';
  }

  if (!isValidIndianPhone(input.phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number starting with 6–9.';
  }

  const trimmedEmail = input.email.trim();
  if (trimmedEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address or leave it blank.';
  }

  const validDistrict = AP_DISTRICTS.some((d) => d.name === input.district);
  if (!validDistrict) {
    errors.district = 'Please select your Andhra Pradesh district.';
  }

  if (input.constituency.trim().length < 2) {
    errors.constituency = 'Please enter your Assembly Constituency or Mandal.';
  }

  if (!MEMBERSHIP_WINGS.includes(input.wing)) {
    errors.wing = 'Please select a valid party wing.';
  }

  if (!input.acceptedPledge) {
    errors.acceptedPledge = 'Please confirm the Seema Sena Party civic pledge.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRsvpForm(input: RsvpFormInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  if (!isValidIndianPhone(input.phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }

  if (!Number.isInteger(input.seats) || input.seats < 1 || input.seats > 5) {
    errors.seats = 'Select between 1 and 5 seats per registration.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getDistrictCode(districtName: string): string {
  const found = AP_DISTRICTS.find((d) => d.name === districtName);
  return found ? found.code : 'AP';
}

export function generateMemberId(districtName: string, sequenceNumber: number): string {
  const code = getDistrictCode(districtName);
  const seq = String(Math.max(1, sequenceNumber)).padStart(4, '0');
  return `SSP-${code}-2026-${seq}`;
}

export function generateRsvpCode(eventId: string, sequenceNumber: number): string {
  const prefix = eventId.replace(/[^a-zA-Z0-9]/g, '').slice(-3).toUpperCase() || 'EVT';
  const seq = String(Math.max(1, sequenceNumber)).padStart(4, '0');
  return `SSP-${prefix}-${seq}`;
}

export function filterNewsItems(
  articles: NewsArticle[],
  category: NewsCategory,
  searchQuery: string
): NewsArticle[] {
  const query = searchQuery.trim().toLowerCase();
  return articles.filter((article) => {
    const matchesCategory = category === 'All' || article.category === category;
    if (!matchesCategory) return false;
    if (!query) return true;
    return (
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.location.toLowerCase().includes(query)
    );
  });
}

export function filterEvents(events: PartyEvent[], category: EventCategory): PartyEvent[] {
  if (category === 'All') return events;
  return events.filter((evt) => evt.category === category);
}

export function formatEventDateParts(dateIso: string): {
  day: string;
  month: string;
  year: string;
  weekday: string;
} {
  const parsed = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { day: '--', month: '---', year: '----', weekday: '---' };
  }
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = parsed.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = String(parsed.getFullYear());
  const weekday = parsed.toLocaleString('en-US', { weekday: 'short' });
  return { day, month, year, weekday };
}
