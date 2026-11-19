import { useEffect, useState } from 'react';
import { EventSchedulesSection } from './components/EventSchedulesSection';
import { Footer } from './components/Footer';
import { FounderAndManifesto } from './components/FounderAndManifesto';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MembershipSection } from './components/MembershipSection';
import { NewsUpdatesSection } from './components/NewsUpdatesSection';
import {
  INITIAL_EVENTS,
  INITIAL_MEMBERS,
  INITIAL_NEWS,
  INITIAL_PILLARS,
  PARTY_META,
} from './data/serverSeed';
import type {
  PartyEvent,
  PartySummaryResponse,
  PublicMemberSummary,
} from './types/party';
import { fetchPartySummary } from './utils/clientApi';
import { maskPhoneNumber } from './utils/partyLogic';

const INITIAL_FALLBACK_SUMMARY: PartySummaryResponse = {
  party: PARTY_META,
  pillars: INITIAL_PILLARS,
  news: INITIAL_NEWS,
  events: INITIAL_EVENTS,
  totalMembers: INITIAL_MEMBERS.length,
  recentMembers: [...INITIAL_MEMBERS].reverse().map((m) => ({
    memberId: m.memberId,
    fullName: m.fullName,
    district: m.district,
    constituency: m.constituency,
    wing: m.wing,
    joinedAt: m.joinedAt,
    maskedPhone: maskPhoneNumber(m.phone),
  })),
  districtCounts: {},
};

export default function App() {
  const [summary, setSummary] = useState<PartySummaryResponse>(INITIAL_FALLBACK_SUMMARY);

  useEffect(() => {
    let active = true;
    fetchPartySummary().then((data) => {
      if (active) {
        setSummary(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const scrollToMembership = () => {
    const el = document.getElementById('membership');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMemberRegistered = (
    newMember: PublicMemberSummary,
    newTotal: number,
    districtCounts: Record<string, number>
  ) => {
    setSummary((prev) => ({
      ...prev,
      totalMembers: newTotal,
      districtCounts,
      recentMembers: [newMember, ...prev.recentMembers].slice(0, 8),
    }));
  };

  const handleEventUpdated = (updatedEvent: PartyEvent) => {
    setSummary((prev) => ({
      ...prev,
      events: prev.events.map((evt) =>
        evt.id === updatedEvent.id ? updatedEvent : evt
      ),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF2] text-[#181510]">
      <Header onNavigateToMembership={scrollToMembership} />

      <main className="flex-1">
        <HeroSection
          founderName={summary.party.founderName}
          establishedDate={summary.party.establishedDate}
          teluguName={summary.party.teluguName}
          totalMembers={summary.totalMembers}
          onJoinClick={scrollToMembership}
        />

        <FounderAndManifesto
          founderName={summary.party.founderName}
          establishedDate={summary.party.establishedDate}
          pillars={summary.pillars}
        />

        <NewsUpdatesSection news={summary.news} />

        <EventSchedulesSection
          events={summary.events}
          onEventUpdated={handleEventUpdated}
        />

        <MembershipSection
          founderName={summary.party.founderName}
          establishedDate={summary.party.establishedDate}
          totalMembers={summary.totalMembers}
          recentMembers={summary.recentMembers}
          onMemberRegistered={handleMemberRegistered}
        />
      </main>

      <Footer
        founderName={summary.party.founderName}
        establishedDate={summary.party.establishedDate}
        headquarters={summary.party.headquarters}
        teluguName={summary.party.teluguName}
      />
    </div>
  );
}
