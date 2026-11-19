import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { NewsArticle } from '../types/party';
import { ResilientImage } from './ResilientImage';

interface NewsReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export function NewsReaderModal({ article, onClose }: NewsReaderModalProps) {
  useEffect(() => {
    if (!article) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#181510]/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FFFCF2] border border-[#E8DFC0] rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#FFFCF2]/95 border-b border-[#EFE7C8]">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#78716C]">
            <span className="font-semibold text-[#854D0E]">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{article.location}</span>
          </div>
          <button
            type="button"
            aria-label="Close press dispatch"
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[#E8DFC0] bg-white text-[#181510] hover:bg-[#FEF3C7] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <h2
            id="news-modal-title"
            className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold leading-tight text-[#181510] text-balance"
          >
            {article.title}
          </h2>

          <p className="mt-3 text-sm text-[#57534E]">
            By <span className="font-semibold text-[#181510]">{article.author}</span>
            <span aria-hidden="true"> · </span>
            <span>{article.readTime}</span>
          </p>

          <div className="mt-6 rounded-lg overflow-hidden border border-[#E8DFC0] aspect-[16/9] bg-[#F5F0DC]">
            <ResilientImage
              src={article.imageUrl}
              alt={article.imageAlt}
              fallbackTitle={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-[#292524] max-w-prose">
            {article.body.map((paragraph, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? 'first-letter:font-[family-name:var(--font-display)] first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-[#854D0E]'
                    : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <blockquote className="mt-8 py-5 border-y border-[#E8DFC0]">
            <p className="font-[family-name:var(--font-display)] italic text-lg text-[#181510]">
              &ldquo;{article.quote.text}&rdquo;
            </p>
            <footer className="mt-2 text-xs font-semibold tracking-wide text-[#854D0E]">
              — {article.quote.attribution}
            </footer>
          </blockquote>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors cursor-pointer"
            >
              Close Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
