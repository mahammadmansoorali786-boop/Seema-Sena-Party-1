export type NewsCategory =
  | 'All'
  | 'Press Releases'
  | 'Policy & Manifesto'
  | 'District Tours';

export type EventCategory =
  | 'All'
  | 'Founding Day'
  | 'Rallies'
  | 'Town Halls'
  | 'Youth Conventions';

export type MembershipWing =
  | 'Primary Member'
  | 'Youth Wing (Yuva Sena)'
  | "Women's Wing (Mahila Sena)"
  | 'Farmers Front (Rythu Sena)'
  | 'Volunteer Coordinator';

export interface DistrictOption {
  name: string;
  code: string;
  region: 'Rayalaseema' | 'Coastal Andhra' | 'North Andhra';
}

export interface PartyMember {
  memberId: string;
  fullName: string;
  phone: string;
  email: string;
  district: string;
  constituency: string;
  wing: MembershipWing;
  joinedAt: string;
}

export interface PublicMemberSummary {
  memberId: string;
  fullName: string;
  district: string;
  constituency: string;
  wing: MembershipWing;
  joinedAt: string;
  maskedPhone: string;
}

export interface MembershipFormInput {
  fullName: string;
  phone: string;
  email: string;
  district: string;
  constituency: string;
  wing: MembershipWing;
  acceptedPledge: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: Exclude<NewsCategory, 'All'>;
  publishedAt: string;
  readTime: string;
  author: string;
  location: string;
  summary: string;
  body: string[];
  quote: {
    text: string;
    attribution: string;
  };
  imageUrl: string;
  imageAlt: string;
  featured?: boolean;
}

export interface PartyEvent {
  id: string;
  title: string;
  category: Exclude<EventCategory, 'All'>;
  dateIso: string;
  timeLabel: string;
  venue: string;
  district: string;
  speaker: string;
  description: string;
  capacity: number;
  rsvpCount: number;
  isFlagship?: boolean;
}

export interface RsvpFormInput {
  fullName: string;
  phone: string;
  seats: number;
}

export interface EventRsvpRecord {
  confirmationCode: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  phone: string;
  seats: number;
  createdAt: string;
}

export interface ManifestoPillar {
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  keyCommitments: string[];
}

export interface PartySummaryResponse {
  party: {
    name: string;
    teluguName: string;
    tagline: string;
    establishedDate: string;
    founderName: string;
    state: string;
    headquarters: string;
  };
  pillars: ManifestoPillar[];
  news: NewsArticle[];
  events: PartyEvent[];
  totalMembers: number;
  recentMembers: PublicMemberSummary[];
  districtCounts: Record<string, number>;
}
