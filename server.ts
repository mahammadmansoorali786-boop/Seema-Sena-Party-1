import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_EVENTS,
  INITIAL_MEMBERS,
  INITIAL_NEWS,
  INITIAL_PILLARS,
  PARTY_META,
} from './src/data/serverSeed.ts';
import type {
  EventRsvpRecord,
  MembershipFormInput,
  PartyEvent,
  PartyMember,
  PublicMemberSummary,
  RsvpFormInput,
} from './src/types/party.ts';
import {
  generateMemberId,
  generateRsvpCode,
  maskPhoneNumber,
  normalizeIndianPhone,
  validateMembershipForm,
  validateRsvpForm,
} from './src/utils/partyLogic.ts';

interface PersistedStore {
  members: PartyMember[];
  rsvps: EventRsvpRecord[];
  eventRsvpCounts: Record<string, number>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'party-store.json');

function createInitialStore(): PersistedStore {
  const counts: Record<string, number> = {};
  for (const evt of INITIAL_EVENTS) {
    counts[evt.id] = evt.rsvpCount;
  }
  return {
    members: [...INITIAL_MEMBERS],
    rsvps: [],
    eventRsvpCounts: counts,
  };
}

function readStore(): PersistedStore {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const initial = createInitialStore();
      writeStore(initial);
      return initial;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PersistedStore>;
    const fallback = createInitialStore();
    return {
      members: Array.isArray(parsed.members) ? parsed.members : fallback.members,
      rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : fallback.rsvps,
      eventRsvpCounts:
        parsed.eventRsvpCounts && typeof parsed.eventRsvpCounts === 'object'
          ? { ...fallback.eventRsvpCounts, ...parsed.eventRsvpCounts }
          : fallback.eventRsvpCounts,
    };
  } catch {
    return createInitialStore();
  }
}

function writeStore(store: PersistedStore): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
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

function buildEventsWithCounts(store: PersistedStore): PartyEvent[] {
  return INITIAL_EVENTS.map((evt) => ({
    ...evt,
    rsvpCount: store.eventRsvpCounts[evt.id] ?? evt.rsvpCount,
  }));
}

function buildDistrictCounts(members: PartyMember[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of members) {
    counts[m.district] = (counts[m.district] ?? 0) + 1;
  }
  return counts;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/party-summary', (_req, res) => {
    const store = readStore();
    const recentMembers = [...store.members]
      .reverse()
      .slice(0, 8)
      .map(toPublicSummary);

    res.json({
      party: PARTY_META,
      pillars: INITIAL_PILLARS,
      news: INITIAL_NEWS,
      events: buildEventsWithCounts(store),
      totalMembers: store.members.length,
      recentMembers,
      districtCounts: buildDistrictCounts(store.members),
    });
  });

  app.post('/api/members', (req, res) => {
    const body = req.body as MembershipFormInput;
    const validation = validateMembershipForm({
      fullName: String(body?.fullName ?? ''),
      phone: String(body?.phone ?? ''),
      email: String(body?.email ?? ''),
      district: String(body?.district ?? ''),
      constituency: String(body?.constituency ?? ''),
      wing: body?.wing,
      acceptedPledge: Boolean(body?.acceptedPledge),
    });

    if (!validation.valid) {
      res.status(400).json({
        error: 'Please check the highlighted fields.',
        errors: validation.errors,
      });
      return;
    }

    const store = readStore();
    const normalizedPhone = normalizeIndianPhone(body.phone);
    const existing = store.members.find(
      (m) => normalizeIndianPhone(m.phone) === normalizedPhone
    );

    if (existing) {
      res.status(409).json({
        error: `This mobile number is already registered under Membership ID ${existing.memberId}.`,
        existingMember: toPublicSummary(existing),
      });
      return;
    }

    const nextSequence = store.members.length + 1;
    const newMember: PartyMember = {
      memberId: generateMemberId(body.district, nextSequence),
      fullName: body.fullName.trim(),
      phone: normalizedPhone,
      email: body.email.trim(),
      district: body.district,
      constituency: body.constituency.trim(),
      wing: body.wing,
      joinedAt: new Date().toISOString(),
    };

    store.members.push(newMember);
    writeStore(store);

    res.status(201).json({
      member: toPublicSummary(newMember),
      totalMembers: store.members.length,
      districtCounts: buildDistrictCounts(store.members),
    });
  });

  app.get('/api/members/lookup', (req, res) => {
    const rawQuery = String(req.query.query ?? '').trim();
    if (rawQuery.length < 4) {
      res.status(400).json({
        error: 'Enter a Membership ID (e.g. SSP-KNL-2026-0001) or your 10-digit mobile number.',
      });
      return;
    }

    const store = readStore();
    const upper = rawQuery.toUpperCase();
    const digits = normalizeIndianPhone(rawQuery);

    const found = store.members.find(
      (m) =>
        m.memberId.toUpperCase() === upper ||
        (digits.length === 10 && normalizeIndianPhone(m.phone) === digits)
    );

    if (!found) {
      res.status(404).json({
        error: 'No member record found matching that Membership ID or mobile number.',
      });
      return;
    }

    res.json({ member: toPublicSummary(found) });
  });

  app.post('/api/events/:id/rsvp', (req, res) => {
    const eventId = req.params.id;
    const eventTemplate = INITIAL_EVENTS.find((e) => e.id === eventId);
    if (!eventTemplate) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }

    const body = req.body as RsvpFormInput;
    const seats = Number(body?.seats ?? 1);
    const validation = validateRsvpForm({
      fullName: String(body?.fullName ?? ''),
      phone: String(body?.phone ?? ''),
      seats,
    });

    if (!validation.valid) {
      res.status(400).json({
        error: 'Please enter a valid name, mobile number, and seat count.',
        errors: validation.errors,
      });
      return;
    }

    const store = readStore();
    const currentCount = store.eventRsvpCounts[eventId] ?? eventTemplate.rsvpCount;
    const updatedCount = currentCount + seats;
    store.eventRsvpCounts[eventId] = updatedCount;

    const confirmationCode = generateRsvpCode(eventId, store.rsvps.length + 1);
    const record: EventRsvpRecord = {
      confirmationCode,
      eventId,
      eventTitle: eventTemplate.title,
      fullName: body.fullName.trim(),
      phone: normalizeIndianPhone(body.phone),
      seats,
      createdAt: new Date().toISOString(),
    };
    store.rsvps.push(record);
    writeStore(store);

    res.status(201).json({
      confirmationCode,
      event: {
        ...eventTemplate,
        rsvpCount: updatedCount,
      },
      seats,
      fullName: record.fullName,
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Seema Sena Party portal listening on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
