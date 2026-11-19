import type { ManifestoPillar } from '../types/party';
import { ResilientImage } from './ResilientImage';

interface FounderAndManifestoProps {
  founderName: string;
  establishedDate: string;
  pillars: ManifestoPillar[];
}

export function FounderAndManifesto({
  founderName,
  establishedDate,
  pillars,
}: FounderAndManifestoProps) {
  return (
    <>
      {/* Founder Section */}
      <section id="founder" className="bg-[#181510] text-[#FFFCF2] py-16 lg:py-20 border-b border-[#2E2920]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-[#FACC15]/30 bg-[#262119] aspect-[3/4] max-w-md mx-auto lg:mx-0">
                <ResilientImage
                  src="/src/assets/images/founder_nagaraj_portrait_1795076805475.jpg"
                  alt={`Portrait of ${founderName}, Founder of Seema Sena Party`}
                  fallbackTitle={founderName}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-[#D6CEBE] text-center lg:text-left">
                Fig. 1 — {founderName}, Founder &amp; President, Seema Sena Party
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-wide text-[#FACC15]">
                  Founder&apos;s Message · Andhra Pradesh
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
                  &ldquo;Power Must Serve the Farmer, the Student, and Every Household.&rdquo;
                </h2>
              </div>

              <div className="py-5 border-y border-[#3B3429]">
                <p className="font-[family-name:var(--font-display)] italic text-lg sm:text-xl leading-relaxed text-[#FEF08A]">
                  On {establishedDate}, we are launching Seema Sena Party not as another political slogan, but as a disciplined people&apos;s compact across Rayalaseema, Coastal Andhra, and North Andhra.
                </p>
              </div>

              <div className="space-y-4 text-base leading-relaxed text-[#E7E2D8] max-w-2xl">
                <p>
                  Born from years of grassroots dialogue with farmers, handloom artisans, and young graduates across Andhra Pradesh, <strong className="text-white font-semibold">{founderName}</strong> established Seema Sena Party with a single guiding commitment: every public rupee and every drop of river water must be accounted for openly.
                </p>
                <p>
                  The golden yellow of our banner represents the sunlit harvest of Telugu soil and the clarity of transparent public life—standing firm against neglect, regional disparity, and broken promises.
                </p>
              </div>

              <dl className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#3B3429]">
                <div>
                  <dt className="text-xs tracking-wide text-[#A8A29E]">Founder</dt>
                  <dd className="mt-1 text-base font-semibold text-[#FACC15]">{founderName}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wide text-[#A8A29E]">
                    Establishment Date
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-white tabular-nums">
                    {establishedDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wide text-[#A8A29E]">
                    Party Colour
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-white">
                    Saffron Gold Yellow
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Core Manifesto / Vision Pillars */}
      <section id="vision" className="py-16 lg:py-20 bg-[#FFFCF2] border-b border-[#E8DFC0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wide text-[#854D0E]">
              Andhra Pradesh Charter
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-[#181510] text-balance">
              Four Founding Commitments for a Self-Reliant State
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#44403C]">
              Every district committee of Seema Sena Party is mandated to track and audit these four core priorities across Andhra Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {pillars.map((pillar) => (
              <article
                key={pillar.index}
                className="bg-white border border-[#E8DFC0] rounded-xl p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-[#EFE7C8]">
                    <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[#181510]">
                      {pillar.index}. {pillar.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#854D0E]">
                    {pillar.subtitle}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-[#44403C]">
                    {pillar.summary}
                  </p>
                </div>

                <ul className="mt-6 pt-4 border-t border-[#EFE7C8] space-y-2 text-sm text-[#292524]">
                  {pillar.keyCommitments.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-sm bg-[#EAB308] shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
