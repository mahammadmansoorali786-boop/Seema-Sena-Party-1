import {
  INITIAL_EVENTS,
  INITIAL_MEMBERS,
  INITIAL_NEWS,
  INITIAL_PILLARS,
  PARTY_META,
} from '../data/serverSeed';
import type {
  MembershipFormInput,
  PartyEvent,
  PartyMember,
  PartySummaryResponse,
  PublicMemberSummary,
  RsvpFormInput,
} from '../types/party';
import {
  generateMemberId,
  maskPhoneNumber,
  normalizeIndianPhone,
  validateMembershipForm,
  validateRsvpForm,
} from './partyLogic';

const STORAGE_KEY = 'seema_sena_party_portal_v1';

interface LocalPortalStore {
  members: PartyMember[];
  eventRsvpCounts: Record<string, number>;
}

function readLocalStore(): LocalPortalStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalPortalStore>;
      if (Array.isArray(parsed.members) && parsed.eventRsvpCounts) {
        return {
          members: parsed.members,
          eventRsvpCounts: parsed.eventRsvpCounts,
        };
      }
    }
  } catch {
    // Fall back to deterministic seed
  }
  const counts: Record<string, number> = {};
  for (const evt of INITIAL_EVENTS) {
    counts[evt.id] = evt.rsvpCount;
  }
  return {
    members: [...INITIAL_MEMBERS],
    eventRsvpCounts: counts,
  };
}

function writeLocalStore(store: LocalPortalStore): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors
  }
}

function toPublicSummary(member: PartyMember): PublicMemberSummary {
  return {
    memberId: member.memberId,
    fullName: member.fullName,
    district: member.district,
    constituency: member.constituency,
    wing: member.wing,
    joinedAt: member.joinedAt,
    maskedPhone: maskPhoneNumber(member.phone),
  };
}

function buildDistrictCounts(members: PartyMember[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of members) {
    counts[m.district] = (counts[m.district] ?? 0) + 1;
  }
  return counts;
}

async function parseJsonSafe(res: Response): Promise<Record<string, unknown> | null> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function fetchPartySummary(): Promise<PartySummaryResponse> {
  try {
    const res = await fetch('/api/party-summary');
    const json = await parseJsonSafe(res);
    if (res.ok && json) {
      return json as unknown as PartySummaryResponse;
    }
  } catch {
    // Static host fallback
  }

  const store = readLocalStore();
  return {
    party: PARTY_META,
    pillars: INITIAL_PILLARS,
    news: INITIAL_NEWS,
    events: INITIAL_EVENTS.map((evt) => ({
      ...evt,
      rsvpCount: store.eventRsvpCounts[evt.id] ?? evt.rsvpCount,
    })),
    totalMembers: store.members.length,
    recentMembers: [...store.members].reverse().slice(0, 8).map(toPublicSummary),
    districtCounts: buildDistrictCounts(store.members),
  };
}

export interface RegisterMemberResult {
  ok: boolean;
  status: number;
  member?: PublicMemberSummary;
  totalMembers?: number;
  districtCounts?: Record<string, number>;
  error?: string;
  errors?: Record<string, string>;
}

export async function registerPartyMember(
  input: MembershipFormInput
): Promise<RegisterMemberResult> {
  try {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await parseJsonSafe(res);
    if (json) {
      if (res.ok) {
        return {
          ok: true,
          status: res.status,
          member: json.member as PublicMemberSummary,
          totalMembers: json.totalMembers as number,
          districtCounts: json.districtCounts as Record<string, number>,
        };
      }
      return {
        ok: false,
        status: res.status,
        error: json.error as string | undefined,
        errors: json.errors as Record<string, string> | undefined,
      };
    }
  } catch {
    // Static host fallback below
  }

  const validation = validateMembershipForm(input);
  if (!validation.valid) {
    return {
      ok: false,
      status: 400,
      error: 'Please check the highlighted fields.',
      errors: validation.errors,
    };
  }

  const store = readLocalStore();
  const normalizedPhone = normalizeIndianPhone(input.phone);
  const existing = store.members.find(
    (m) => normalizeIndianPhone(m.phone) === normalizedPhone
  );
  if (existing) {
    return {
      ok: false,
      status: 409,
      error: `This mobile number is already registered under Membership ID ${existing.memberId}.`,
    };
  }

  const newMember: PartyMember = {
    memberId: generateMemberId(input.district, store.members.length + 1),
    fullName: input.fullName.trim(),
    phone: normalizedPhone,
    email: input.email.trim(),
    district: input.district,
    constituency: input.constituency.trim(),
    wing: input.wing,
    joinedAt: new Date().toISOString(),
  };

  store.members.push(newMember);
  writeLocalStore(store);

  return {
    ok: true,
    status: 201,
    member: toPublicSummary(newMember),
    totalMembers: store.members.length,
    districtCounts: buildDistrictCounts(store.members),
  };
}

export async function lookupPartyMember(
  query: string
): Promise<{ ok: boolean; member?: PublicMemberSummary; error?: string }> {
  try {
    const res = await fetch(
      `/api/members/lookup?query=${encodeURIComponent(query.trim())}`
    );
    const json = await parseJsonSafe(res);
    if (json) {
      if (res.ok) {
        return { ok: true, member: json.member as PublicMemberSummary };
      }
      return { ok: false, error: json.error as string | undefined };
    }
  } catch {
    // Static host fallback below
  }

  const store = readLocalStore();
  const upper = query.trim().toUpperCase();
  const digits = normalizeIndianPhone(query);
  const found = store.members.find(
    (m) =>
      m.memberId.toUpperCase() === upper ||
      (digits.length === 10 && normalizeIndianPhone(m.phone) === digits)
  );
  if (!found) {
    return {
      ok: false,
      error: 'No member record found matching that Membership ID or mobile number.',
    };
  }
  return { ok: true, member: toPublicSummary(found) };
}

export interface SubmitRsvpResult {
  ok: boolean;
  confirmationCode?: string;
  event?: PartyEvent;
  seats?: number;
  fullName?: string;
  error?: string;
  errors?: Record<string, string>;
}

export async function submitEventRsvp(
  eventId: string,
  input: RsvpFormInput
): Promise<SubmitRsvpResult> {
  try {
    const res = await fetch(`/api/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await parseJsonSafe(res);
    if (json) {
      if (res.ok) {
        return {
          ok: true,
          confirmationCode: json.confirmationCode as string,
          event: json.event as PartyEvent,
          seats: json.seats as number,
          fullName: json.fullName as string,
        };
      }
      return {
        ok: false,
        error: json.error as string | undefined,
        errors: json.errors as Record<string, string> | undefined,
      };
    }
  } catch {
    // Static host fallback below
  }

  const validation = validateRsvpForm(input);
  if (!validation.valid) {
    return {
      ok: false,
      error: 'Please enter a valid name, mobile number, and seat count.',
      errors: validation.errors,
    };
  }

  const template = INITIAL_EVENTS.find((e) => e.id === eventId);
  if (!template) {
    return { ok: false, error: 'Event not found.' };
  }

  const store = readLocalStore();
  const current = store.eventRsvpCounts[eventId] ?? template.rsvpCount;
  const updatedCount = current + input.seats;
  store.eventRsvpCounts[eventId] = updatedCount;
  writeLocalStore(store);

  const suffix = String(updatedCount).slice(-4).padStart(4, '0');
  return {
    ok: true,
    confirmationCode: `SSP-EVT-${suffix}`,
    event: { ...template, rsvpCount: updatedCount },
    seats: input.seats,
    fullName: input.fullName.trim(),
  };
}
