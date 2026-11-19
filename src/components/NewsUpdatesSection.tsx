import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import type { NewsArticle, NewsCategory } from '../types/party';
import { filterNewsItems } from '../utils/partyLogic';
import { NewsReaderModal } from './NewsReaderModal';
import { ResilientImage } from './ResilientImage';

interface NewsUpdatesSectionProps {
  news: NewsArticle[];
}

const NEWS_CATEGORIES: NewsCategory[] = [
  'All',
  'Press Releases',
  'Policy & Manifesto',
  'District Tours',
];

export function NewsUpdatesSection({ news }: NewsUpdatesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const filtered = filterNewsItems(news, activeCategory, searchQuery);
  const leadStory = filtered[0] ?? null;
  const secondaryStories = filtered.slice(1);

  return (
    <section id="news" className="py-16 lg:py-20 bg-white border-b border-[#E8DFC0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#EFE7C8]">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-wide text-[#854D0E]">
              Official Media Desk
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-[#181510]">
              News Updates &amp; Dispatches
            </h2>
            <p className="mt-2 text-base text-[#44403C]">
              Verified announcements, policy papers, and district tour briefings from Andhra Pradesh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <label htmlFor="news-search-input" className="sr-only">
                Search news dispatches
              </label>
              <Search
                aria-hidden="true"
                className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                id="news-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by district or topic..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm bg-[#FFFCF2] border border-[#D6CBA4] rounded-md text-[#181510] placeholder:text-[#78716C] focus:outline-none focus:border-[#181510]"
              />
            </div>
          </div>
        </div>

        {/* Interactive filter bar */}
        <div
          role="group"
          aria-label="Filter news by category"
          className="mt-6 flex flex-wrap items-center gap-1.5 p-1 bg-[#F8F3DF] border border-[#E8DFC0] rounded-lg w-fit max-w-full"
        >
          {NEWS_CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#181510] text-[#FACC15]'
                    : 'text-[#44403C] hover:text-[#181510] hover:bg-white/70'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 p-10 bg-[#FFFCF2] border border-[#E8DFC0] rounded-xl text-center">
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#181510]">
              No matching dispatches found
            </p>
            <p className="mt-2 text-sm text-[#57534E]">
              Try clearing your search query or switching to All news updates.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors cursor-pointer"
            >
              Reset News Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Tier 1: Lead Story */}
            {leadStory && (
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 bg-[#FFFCF2] border border-[#E8DFC0] rounded-xl overflow-hidden items-stretch">
                <div className="lg:col-span-6 aspect-[4/3] lg:aspect-auto min-h-[240px] bg-[#F5F0DC]">
                  <ResilientImage
                    src={leadStory.imageUrl}
                    alt={leadStory.imageAlt}
                    fallbackTitle={leadStory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                      <span className="font-semibold text-[#854D0E]">{leadStory.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{leadStory.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{leadStory.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{leadStory.readTime}</span>
                    </div>

                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold leading-snug text-[#181510] text-balance">
                      {leadStory.title}
                    </h3>

                    <p className="mt-4 text-base leading-relaxed text-[#44403C]">
                      {leadStory.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#EFE7C8] flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-[#57534E]">
                      By {leadStory.author}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedArticle(leadStory)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Read Full Dispatch</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Tier 2: Secondary Stories */}
            {secondaryStories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryStories.map((article) => (
                  <article
                    key={article.id}
                    className="bg-[#FFFCF2] border border-[#E8DFC0] rounded-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] bg-[#F5F0DC] border-b border-[#EFE7C8]">
                        <ResilientImage
                          src={article.imageUrl}
                          alt={article.imageAlt}
                          fallbackTitle={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#57534E]">
                          <span className="font-semibold text-[#854D0E]">{article.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{article.publishedAt}</span>
                        </div>
                        <h3 className="mt-2.5 font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-[#181510]">
                          {article.title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-[#44403C]">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#EFE7C8] flex items-center justify-between gap-3">
                      <span className="text-xs text-[#57534E]">{article.readTime}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(article)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#854D0E] hover:text-[#181510] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Read Dispatch</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <NewsReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
}
