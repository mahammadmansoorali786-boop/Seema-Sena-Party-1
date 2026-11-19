import { ArrowRight, Calendar } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  founderName: string;
  establishedDate: string;
  teluguName: string;
  totalMembers: number;
  onJoinClick: () => void;
}

export function HeroSection({
  founderName,
  establishedDate,
  teluguName,
  totalMembers,
  onJoinClick,
}: HeroSectionProps) {
  return (
    <section id="top" className="bg-[#FEF9C3]/55 border-b border-[#E8DFC0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
        {/* Two-column editorial split with balanced stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#FFFCF2] border border-[#E8DFC0] rounded-xl p-6 sm:p-9">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#854D0E] mb-4">
                {teluguName} · Andhra Pradesh · Established {establishedDate}
              </p>

              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#181510] text-balance">
                A New Dawn of Dignity and Progress for Andhra Pradesh.
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#44403C] max-w-xl">
                Founded by <strong className="font-semibold text-[#181510]">{founderName}</strong>, Seema Sena Party is a grassroots Telugu political movement dedicated to Rayalaseema &amp; statewide irrigation equity, youth livelihoods, and transparent village governance.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#EFE7C8] flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onJoinClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181510]"
              >
                <span>Register as a Member</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#events"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#181510] bg-white hover:bg-[#FEF3C7] border border-[#D6CBA4] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181510]"
              >
                <Calendar className="w-4 h-4 text-[#854D0E]" />
                <span>View Event Schedule</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[280px] sm:min-h-[360px] rounded-xl overflow-hidden border border-[#E8DFC0] bg-[#181510]">
              <ResilientImage
                src="/src/assets/images/hero_andhra_rally_1795076805790.jpg"
                alt="Seema Sena Party public convention in Andhra Pradesh with golden yellow banners"
                fallbackTitle="Seema Sena Party Founding Convention"
                className="w-full h-full lg:h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#181510]/85 via-[#181510]/20 to-transparent"
              />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                <div className="text-white">
                  <p className="text-xs font-medium text-[#FDE047]">
                    Inaugural Sankalpa Sabha · Kurnool, Andhra Pradesh
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-lg sm:text-xl font-semibold">
                    Launching Statewide on {establishedDate}
                  </p>
                </div>
                <div className="hidden sm:block w-14 h-14 rounded-lg overflow-hidden border border-[#FACC15]/60 shrink-0 bg-[#FACC15]">
                  <ResilientImage
                    src="/src/assets/images/party_emblem_flag_1795076814335.jpg"
                    alt="Seema Sena Party Official Yellow Emblem"
                    fallbackTitle="Crest"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-column institutional proof strip */}
        <dl className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FACC15] border border-[#CA8A04]/40 rounded-xl p-5 sm:p-6 text-[#181510]">
          <div className="pr-4 lg:border-r lg:border-[#181510]/15">
            <dt className="text-xs font-semibold tracking-wide text-[#181510]/80">
              Party Established
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold tabular-nums">
              {establishedDate}
            </dd>
          </div>
          <div className="pr-4 lg:border-r lg:border-[#181510]/15">
            <dt className="text-xs font-semibold tracking-wide text-[#181510]/80">
              Party Founder
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold">
              {founderName}
            </dd>
          </div>
          <div className="pr-4 lg:border-r lg:border-[#181510]/15">
            <dt className="text-xs font-semibold tracking-wide text-[#181510]/80">
              State Footprint
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold tabular-nums">
              26 Districts, AP
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-[#181510]/80">
              Verified Members
            </dt>
            <dd
              data-testid="hero-member-count"
              className="mt-1 font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold tabular-nums"
            >
              {totalMembers.toLocaleString('en-IN')} Enrolled
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
