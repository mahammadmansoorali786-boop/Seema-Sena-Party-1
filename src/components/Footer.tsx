interface FooterProps {
  founderName: string;
  establishedDate: string;
  headquarters: string;
  teluguName: string;
}

export function Footer({
  founderName,
  establishedDate,
  headquarters,
  teluguName,
}: FooterProps) {
  return (
    <footer className="bg-[#181510] text-[#E7E2D8] py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#2E2920]">
          <div className="md:col-span-5 space-y-3">
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#FACC15]">
              Seema Sena Party
            </p>
            <p className="text-sm font-medium text-[#FEF08A]">{teluguName} · Andhra Pradesh</p>
            <p className="text-sm leading-relaxed text-[#A8A29E] max-w-md">
              Established {establishedDate} by Party Founder {founderName}. Dedicated to equitable irrigation, youth livelihoods, and clean civic governance across every district of Andhra Pradesh.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-semibold tracking-wide text-[#FACC15]">
              Portal Sections
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#founder" className="hover:text-[#FACC15] transition-colors">
                  Founder {founderName}
                </a>
              </li>
              <li>
                <a href="#vision" className="hover:text-[#FACC15] transition-colors">
                  Andhra Pradesh Charter
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-[#FACC15] transition-colors">
                  News &amp; Dispatches
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#FACC15] transition-colors">
                  Event Schedules
                </a>
              </li>
              <li>
                <a href="#membership" className="hover:text-[#FACC15] transition-colors">
                  Membership Registration
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <p className="text-xs font-semibold tracking-wide text-[#FACC15]">
              State Secretariat
            </p>
            <p className="text-sm leading-relaxed text-[#D6CEBE]">{headquarters}</p>
            <p className="text-sm text-[#A8A29E]">
              Founding Day: <span className="text-white tabular-nums">{establishedDate}</span>
            </p>
            <p className="text-sm text-[#A8A29E]">
              Party Colour: <span className="text-[#FACC15]">Golden Yellow</span>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A8A29E]">
          <p>© 2026 Seema Sena Party · Andhra Pradesh. All rights reserved.</p>
          <p>Founded by {founderName} · Established {establishedDate}</p>
        </div>
      </div>
    </footer>
  );
}
