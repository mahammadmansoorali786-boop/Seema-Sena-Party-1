import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterEvents,
  filterNewsItems,
  generateMemberId,
  isValidIndianPhone,
  maskPhoneNumber,
  normalizeIndianPhone,
  validateMembershipForm,
  validateRsvpForm,
} from './partyLogic';
import type { NewsArticle, PartyEvent } from '../types/party';

test('normalizes and validates Indian mobile numbers', () => {
  assert.equal(normalizeIndianPhone('+91 98480-12345'), '9848012345');
  assert.equal(normalizeIndianPhone('09848012345'), '9848012345');
  assert.equal(isValidIndianPhone('9848012345'), true);
  assert.equal(isValidIndianPhone('5848012345'), false);
  assert.equal(isValidIndianPhone('12345'), false);
  assert.equal(maskPhoneNumber('9848012345'), '98••••2345');
});

test('generates deterministic Andhra Pradesh district Member IDs', () => {
  assert.equal(generateMemberId('Kurnool', 1), 'SSP-KNL-2026-0001');
  assert.equal(generateMemberId('Tirupati', 42), 'SSP-TPT-2026-0042');
  assert.equal(generateMemberId('Unknown District', 7), 'SSP-AP-2026-0007');
});

test('rejects incomplete or invalid membership registration forms', () => {
  const invalid = validateMembershipForm({
    fullName: 'A',
    phone: '123',
    email: 'bad-email',
    district: '',
    constituency: '',
    wing: 'Primary Member',
    acceptedPledge: false,
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.district);
  assert.ok(invalid.errors.constituency);
  assert.ok(invalid.errors.acceptedPledge);
});

test('accepts valid Andhra Pradesh membership registration', () => {
  const valid = validateMembershipForm({
    fullName: 'Ramesh Babu',
    phone: '9848012345',
    email: 'ramesh@example.com',
    district: 'Kurnool',
    constituency: 'Kurnool Urban',
    wing: 'Youth Wing (Yuva Sena)',
    acceptedPledge: true,
  });

  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('validates event RSVP forms cleanly', () => {
  const invalid = validateRsvpForm({ fullName: '', phone: '123', seats: 9 });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.seats);

  const valid = validateRsvpForm({ fullName: 'Lakshmi Devi', phone: '9123456789', seats: 2 });
  assert.equal(valid.valid, true);
});

test('filters news updates by category and search query', () => {
  const sampleNews: NewsArticle[] = [
    {
      id: 'n1',
      title: 'Founding Rally in Kurnool',
      category: 'Press Releases',
      publishedAt: '2026-11-18',
      readTime: '3 min read',
      author: 'Press Desk',
      location: 'Kurnool, AP',
      summary: 'V Nagaraj announces November 23 founding rally.',
      body: ['Body'],
      quote: { text: 'Quote', attribution: 'V Nagaraj' },
      imageUrl: '/a.jpg',
      imageAlt: 'Rally',
    },
    {
      id: 'n2',
      title: 'Rayalaseema Canal Plan',
      category: 'Policy & Manifesto',
      publishedAt: '2026-11-15',
      readTime: '4 min read',
      author: 'Policy Cell',
      location: 'Anantapur, AP',
      summary: 'Water equity blueprint for drought-prone mandals.',
      body: ['Body'],
      quote: { text: 'Quote', attribution: 'V Nagaraj' },
      imageUrl: '/b.jpg',
      imageAlt: 'Canal',
    },
  ];

  assert.equal(filterNewsItems(sampleNews, 'All', '').length, 2);
  assert.equal(filterNewsItems(sampleNews, 'Policy & Manifesto', '').length, 1);
  assert.equal(filterNewsItems(sampleNews, 'All', 'Kurnool').length, 1);
  assert.equal(filterNewsItems(sampleNews, 'District Tours', '').length, 0);
});

test('filters event schedules by category', () => {
  const sampleEvents: PartyEvent[] = [
    {
      id: 'e1',
      title: 'Founding Day Convention',
      category: 'Founding Day',
      dateIso: '2026-11-23',
      timeLabel: '10:00 AM',
      venue: 'St. Joseph Grounds',
      district: 'Kurnool',
      speaker: 'V Nagaraj',
      description: 'Official launch.',
      capacity: 15000,
      rsvpCount: 4200,
    },
    {
      id: 'e2',
      title: 'Tirupati Youth Forum',
      category: 'Youth Conventions',
      dateIso: '2026-12-06',
      timeLabel: '04:00 PM',
      venue: 'Mahathi Auditorium',
      district: 'Tirupati',
      speaker: 'V Nagaraj',
      description: 'Youth jobs forum.',
      capacity: 2500,
      rsvpCount: 840,
    },
  ];

  assert.equal(filterEvents(sampleEvents, 'All').length, 2);
  assert.equal(filterEvents(sampleEvents, 'Founding Day').length, 1);
  assert.equal(filterEvents(sampleEvents, 'Town Halls').length, 0);
});
