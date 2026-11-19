import { useState, type FormEvent } from 'react';
import { Check, CheckCircle2, Copy, CreditCard, Search, UserPlus } from 'lucide-react';
import type { MembershipWing, PublicMemberSummary } from '../types/party';
import { lookupPartyMember, registerPartyMember } from '../utils/clientApi';
import {
  AP_DISTRICTS,
  MEMBERSHIP_WINGS,
  getDistrictCode,
  validateMembershipForm,
} from '../utils/partyLogic';
import { ResilientImage } from './ResilientImage';

interface MembershipSectionProps {
  founderName: string;
  establishedDate: string;
  totalMembers: number;
  recentMembers: PublicMemberSummary[];
  onMemberRegistered: (
    member: PublicMemberSummary,
    newTotal: number,
    districtCounts: Record<string, number>
  ) => void;
}

export function MembershipSection({
  founderName,
  establishedDate,
  totalMembers,
  recentMembers,
  onMemberRegistered,
}: MembershipSectionProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'verify'>('register');

  // Registration form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Kurnool');
  const [constituency, setConstituency] = useState('');
  const [wing, setWing] = useState<MembershipWing>('Primary Member');
  const [acceptedPledge, setAcceptedPledge] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<PublicMemberSummary | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupResult, setLookupResult] = useState<PublicMemberSummary | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validateMembershipForm({
      fullName,
      phone,
      email,
      district,
      constituency,
      wing,
      acceptedPledge,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setServerError('');
    setSubmitting(true);

    try {
      const result = await registerPartyMember({
        fullName,
        phone,
        email,
        district,
        constituency,
        wing,
        acceptedPledge,
      });

      if (!result.ok || !result.member) {
        if (result.errors) setErrors(result.errors);
        setServerError(result.error ?? 'Unable to complete registration.');
        return;
      }

      setRegisteredMember(result.member);
      onMemberRegistered(
        result.member,
        result.totalMembers ?? totalMembers + 1,
        result.districtCounts ?? {}
      );

      setFullName('');
      setPhone('');
      setEmail('');
      setConstituency('');
      setAcceptedPledge(false);
    } catch {
      setServerError('Network error while submitting membership form. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);

    if (lookupQuery.trim().length < 4) {
      setLookupError('Enter your Membership ID (e.g. SSP-KNL-2026-0001) or 10-digit mobile number.');
      return;
    }

    setLookupLoading(true);
    try {
      const result = await lookupPartyMember(lookupQuery);
      if (!result.ok || !result.member) {
        setLookupError(result.error ?? 'Member record not found.');
        return;
      }
      setLookupResult(result.member);
    } catch {
      setLookupError('Unable to verify membership right now.');
    } finally {
      setLookupLoading(false);
    }
  };

  const cardPreview = registeredMember ?? {
    memberId: `SSP-${getDistrictCode(district)}-2026-NEW`,
    fullName: fullName.trim() || 'Your Name Here',
    district,
    constituency: constituency.trim() || 'Andhra Pradesh Constituency',
    wing,
    joinedAt: new Date().toISOString(),
    maskedPhone: phone ? `${phone.slice(0, 2)}••••${phone.slice(-4)}` : '98••••0000',
  };

  return (
    <section id="membership" className="py-16 lg:py-20 bg-[#FEF9C3]/65 border-b border-[#E8DFC0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E8DFC0]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-[#854D0E]">
              Official Enrollment · All 26 AP Districts
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-[#181510]">
              Seema Sena Party Membership Registration
            </h2>
            <p className="mt-2 text-base text-[#44403C]">
              Register in under a minute to receive your official Andhra Pradesh digital Membership ID ahead of our {establishedDate} launch.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Membership actions"
            className="flex items-center gap-1 p-1 bg-white border border-[#E8DFC0] rounded-lg w-fit"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'register'}
              onClick={() => setActiveTab('register')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#181510] text-[#FACC15]'
                  : 'text-[#44403C] hover:text-[#181510]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>New Registration</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'verify'}
              onClick={() => setActiveTab('verify')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'verify'
                  ? 'bg-[#181510] text-[#FACC15]'
                  : 'text-[#44403C] hover:text-[#181510]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Verify Member ID</span>
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form or Verify */}
          <div className="lg:col-span-7 bg-white border border-[#E8DFC0] rounded-xl p-6 sm:p-8">
            {activeTab === 'register' ? (
              <>
                {registeredMember && (
                  <div
                    data-testid="membership-success-banner"
                    className="mb-6 p-5 bg-[#FEF08A] border border-[#CA8A04]/50 rounded-lg text-[#181510]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-bold text-base">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>Welcome to Seema Sena Party, {registeredMember.fullName}!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(registeredMember.memberId);
                          setCopiedId(true);
                          setTimeout(() => setCopiedId(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#181510] text-[#FACC15] rounded-md hover:bg-[#2E2920] transition-colors cursor-pointer"
                      >
                        {copiedId ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied ID</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 text-sm">
                      Your official Andhra Pradesh Membership ID{' '}
                      <strong className="font-[family-name:var(--font-mono)]">
                        {registeredMember.memberId}
                      </strong>{' '}
                      has been issued and recorded for {registeredMember.district} district.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {serverError && (
                    <div
                      role="alert"
                      className="p-3.5 text-sm text-[#991B1B] bg-[#FEE2E2] border border-[#FCA5A5] rounded-md"
                    >
                      {serverError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="member-full-name"
                        className="block text-sm font-semibold text-[#181510] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="member-full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (registeredMember) setRegisteredMember(null);
                        }}
                        placeholder="e.g. Venkata Narayana"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-[#991B1B]">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="member-phone"
                        className="block text-sm font-semibold text-[#181510] mb-1.5"
                      >
                        Mobile Number (10 digits) *
                      </label>
                      <input
                        id="member-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9848012345"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-[#991B1B]">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="member-district"
                        className="block text-sm font-semibold text-[#181510] mb-1.5"
                      >
                        Andhra Pradesh District *
                      </label>
                      <select
                        id="member-district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                      >
                        {AP_DISTRICTS.map((d) => (
                          <option key={d.code} value={d.name}>
                            {d.name} ({d.region})
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="mt-1 text-xs text-[#991B1B]">{errors.district}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="member-constituency"
                        className="block text-sm font-semibold text-[#181510] mb-1.5"
                      >
                        Constituency / Mandal *
                      </label>
                      <input
                        id="member-constituency"
                        type="text"
                        value={constituency}
                        onChange={(e) => setConstituency(e.target.value)}
                        placeholder="e.g. Kurnool Urban / Adoni"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                      />
                      {errors.constituency && (
                        <p className="mt-1 text-xs text-[#991B1B]">{errors.constituency}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="member-wing"
                        className="block text-sm font-semibold text-[#181510] mb-1.5"
                      >
                        Party Wing / Role *
                      </label>
                      <select
                        id="member-wing"
                        value={wing}
                        onChange={(e) => setWing(e.target.value as MembershipWing)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                      >
                        {MEMBERSHIP_WINGS.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="member-email"
                        className="block text-sm font-semibold text-[#181510] mb-1.5"
                      >
                        Email Address (Optional)
                      </label>
                      <input
                        id="member-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-[#991B1B]">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="member-pledge"
                        type="checkbox"
                        checked={acceptedPledge}
                        onChange={(e) => setAcceptedPledge(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#181510] cursor-pointer"
                      />
                      <span className="text-sm leading-relaxed text-[#44403C]">
                        I affirm my support for the constitutional values of India and the Andhra Pradesh civic charter of <strong className="text-[#181510]">Seema Sena Party</strong> led by Founder {founderName}.
                      </span>
                    </label>
                    {errors.acceptedPledge && (
                      <p className="mt-1.5 text-xs text-[#991B1B]">{errors.acceptedPledge}</p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs text-[#57534E]">
                      Zero membership fee · Instant digital ID issued
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {submitting ? 'Generating Member ID...' : 'Complete Registration'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#181510]">
                  Verify Official Membership Record
                </h3>
                <p className="mt-1.5 text-sm text-[#44403C]">
                  Enter your Seema Sena Party Membership ID (for example <span className="font-[family-name:var(--font-mono)] text-xs">SSP-KNL-2026-0001</span>) or registered 10-digit mobile number.
                </p>

                <form onSubmit={handleLookup} className="mt-5 flex flex-col sm:flex-row gap-3">
                  <label htmlFor="lookup-query" className="sr-only">
                    Membership ID or Mobile Number
                  </label>
                  <input
                    id="lookup-query"
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="SSP-KNL-2026-0001 or 9848000001"
                    className="flex-1 px-3.5 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                  />
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="px-5 py-2.5 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {lookupLoading ? 'Checking...' : 'Verify Record'}
                  </button>
                </form>

                {lookupError && (
                  <p role="alert" className="mt-4 text-sm text-[#991B1B]">
                    {lookupError}
                  </p>
                )}

                {lookupResult && (
                  <div
                    data-testid="lookup-result-card"
                    className="mt-6 p-5 bg-[#FFFCF2] border border-[#CA8A04]/50 rounded-lg space-y-2"
                  >
                    <p className="text-xs font-semibold tracking-wide text-[#854D0E]">
                      Verified Active Member
                    </p>
                    <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[#181510]">
                      {lookupResult.fullName}
                    </p>
                    <dl className="grid grid-cols-2 gap-3 pt-2 text-sm">
                      <div>
                        <dt className="text-xs text-[#57534E]">Membership ID</dt>
                        <dd className="font-[family-name:var(--font-mono)] font-semibold text-[#181510]">
                          {lookupResult.memberId}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#57534E]">District &amp; Constituency</dt>
                        <dd className="font-medium text-[#181510]">
                          {lookupResult.district} · {lookupResult.constituency}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#57534E]">Party Wing</dt>
                        <dd className="font-medium text-[#181510]">{lookupResult.wing}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#57534E]">Registered Phone</dt>
                        <dd className="font-[family-name:var(--font-mono)] text-[#181510]">
                          {lookupResult.maskedPhone}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Digital Pass + Recent Enrollees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#181510] text-[#FFFCF2] rounded-xl p-6 border border-[#2E2920]">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#3B3429]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-md overflow-hidden border border-[#FACC15]/50 bg-[#FACC15] shrink-0">
                    <ResilientImage
                      src="/src/assets/images/party_emblem_flag_1795076814335.jpg"
                      alt="Seema Sena Party Seal"
                      fallbackTitle="Crest"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-base font-bold text-[#FACC15]">
                      Seema Sena Party
                    </p>
                    <p className="text-xs text-[#D6CEBE]">
                      Andhra Pradesh Official Member Card
                    </p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#FACC15]" aria-hidden="true" />
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs tracking-wide text-[#A8A29E]">
                    Member Name
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-white truncate">
                    {cardPreview.fullName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs tracking-wide text-[#A8A29E]">
                      Membership ID
                    </p>
                    <p
                      data-testid="digital-card-id"
                      className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[#FACC15]"
                    >
                      {cardPreview.memberId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-[#A8A29E]">
                      Wing
                    </p>
                    <p className="text-sm font-medium text-white truncate">
                      {cardPreview.wing}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-[#A8A29E]">
                      District
                    </p>
                    <p className="text-sm font-medium text-white">{cardPreview.district}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-[#A8A29E]">
                      Constituency
                    </p>
                    <p className="text-sm font-medium text-white truncate">
                      {cardPreview.constituency}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#3B3429] flex items-center justify-between text-xs text-[#D6CEBE]">
                  <span>Est. {establishedDate}</span>
                  <span>Founder: {founderName}</span>
                </div>
              </div>
            </div>

            {/* Recent Members Roster */}
            <div className="bg-white border border-[#E8DFC0] rounded-xl p-6">
              <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-[#EFE7C8]">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#181510]">
                  Recent Andhra Pradesh Enrollees
                </h3>
                <span className="text-xs font-semibold text-[#854D0E] tabular-nums">
                  {totalMembers.toLocaleString('en-IN')} Total
                </span>
              </div>
              <ul className="divide-y divide-[#EFE7C8] mt-2" data-testid="recent-members-list">
                {recentMembers.slice(0, 5).map((m) => (
                  <li key={m.memberId} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#181510] truncate">
                        {m.fullName}
                      </p>
                      <p className="text-xs text-[#57534E] truncate">
                        {m.district} · {m.wing}
                      </p>
                    </div>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-[#854D0E] shrink-0">
                      {m.memberId}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
