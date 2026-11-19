import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigateToMembership: () => void;
}

const NAV_LINKS = [
  { label: 'Vision', href: '#vision' },
  { label: 'Founder', href: '#founder' },
  { label: 'News', href: '#news' },
  { label: 'Events', href: '#events' },
  { label: 'Membership', href: '#membership' },
];

export function Header({ onNavigateToMembership }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleJoinClick = () => {
    setMobileOpen(false);
    onNavigateToMembership();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFCF2]/95 backdrop-blur-sm border-b border-[#E8DFC0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[#181510] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#181510]"
        >
          Seema Sena Party
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#44403C]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#181510] border-b-2 border-transparent hover:border-[#EAB308] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#181510]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleJoinClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181510]"
          >
            Join Party
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-[#E8DFC0] text-[#181510] hover:bg-[#FEF3C7] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8DFC0] bg-[#FFFCF2] px-4 py-4 space-y-2">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-base font-medium text-[#181510] rounded-md hover:bg-[#FEF3C7] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleJoinClick}
              className="w-full py-3 px-4 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors cursor-pointer"
            >
              Join Party
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
