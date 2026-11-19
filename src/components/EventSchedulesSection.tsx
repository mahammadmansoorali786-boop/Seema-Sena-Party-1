import { useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Users, X } from 'lucide-react';
import type { EventCategory, PartyEvent } from '../types/party';
import { submitEventRsvp } from '../utils/clientApi';
import { filterEvents, formatEventDateParts, validateRsvpForm } from '../utils/partyLogic';

interface EventSchedulesSectionProps {
  events: PartyEvent[];
  onEventUpdated: (updatedEvent: PartyEvent) => void;
}

const EVENT_CATEGORIES: EventCategory[] = [
  'All',
  'Founding Day',
  'Rallies',
  'Town Halls',
  'Youth Conventions',
];

interface RsvpConfirmation {
  confirmationCode: string;
  eventTitle: string;
  fullName: string;
  seats: number;
}

export function EventSchedulesSection({
  events,
  onEventUpdated,
}: EventSchedulesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<EventCategory>('All');
  const [selectedEvent, setSelectedEvent] = useState<PartyEvent | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<RsvpConfirmation | null>(null);

  const visibleEvents = filterEvents(events, activeCategory);

  const openRsvpModal = (evt: PartyEvent) => {
    setSelectedEvent(evt);
    setErrors({});
    setServerError('');
    setConfirmation(null);
  };

  const closeRsvpModal = () => {
    setSelectedEvent(null);
    setErrors({});
    setServerError('');
  };

  const handleRsvpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const validation = validateRsvpForm({ fullName, phone, seats });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setServerError('');
    setSubmitting(true);

    try {
      const result = await submitEventRsvp(selectedEvent.id, {
        fullName,
        phone,
        seats,
      });

      if (!result.ok || !result.event) {
        if (result.errors) setErrors(result.errors);
        setServerError(result.error ?? 'Could not complete RSVP. Please try again.');
        return;
      }

      onEventUpdated(result.event);
      setConfirmation({
        confirmationCode: result.confirmationCode ?? 'SSP-EVT-CONFIRMED',
        eventTitle: selectedEvent.title,
        fullName: result.fullName ?? fullName.trim(),
        seats: result.seats ?? seats,
      });
      setFullName('');
      setPhone('');
      setSeats(1);
    } catch {
      setServerError('Network error while saving your RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="events" className="py-16 lg:py-20 bg-[#FFFCF2] border-b border-[#E8DFC0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E8DFC0]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-[#854D0E]">
              Statewide Tour &amp; Conventions
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-[#181510]">
              Event Schedules Across Andhra Pradesh
            </h2>
            <p className="mt-2 text-base text-[#44403C]">
              Reserve your seat for the November 23, 2026 Founding Day Convention and district town halls led by V Nagaraj.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter events by type"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8F3DF] border border-[#E8DFC0] rounded-lg w-fit max-w-full"
          >
            {EVENT_CATEGORIES.map((category) => {
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
        </div>

        <div className="mt-8 space-y-4">
          {visibleEvents.map((evt) => {
            const dateParts = formatEventDateParts(evt.dateIso);
            return (
              <article
                key={evt.id}
                data-testid={`event-card-${evt.id}`}
                className={`rounded-xl border p-5 sm:p-7 transition-colors ${
                  evt.isFlagship
                    ? 'bg-[#FEF08A]/70 border-[#CA8A04]/60'
                    : 'bg-white border-[#E8DFC0]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    {/* Crisp tabular date block */}
                    <div
                      className={`w-20 shrink-0 rounded-lg p-3 text-center border ${
                        evt.isFlagship
                          ? 'bg-[#181510] text-[#FACC15] border-[#181510]'
                          : 'bg-[#FFFCF2] text-[#181510] border-[#D6CBA4]'
                      }`}
                    >
                      <div className="text-[11px] font-semibold tracking-widest uppercase opacity-80">
                        {dateParts.month}
                      </div>
                      <div className="font-[family-name:var(--font-display)] text-3xl font-bold leading-none my-1 tabular-nums">
                        {dateParts.day}
                      </div>
                      <div className="text-[11px] font-medium tabular-nums opacity-80">
                        {dateParts.year} · {dateParts.weekday}
                      </div>
                    </div>

                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#57534E]">
                        <span className="font-semibold text-[#854D0E]">{evt.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.district}, Andhra Pradesh</span>
                        {evt.isFlagship && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#181510]">
                              Official Founding Ceremony
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[#181510]">
                        {evt.title}
                      </h3>

                      <p className="text-sm sm:text-base leading-relaxed text-[#44403C]">
                        {evt.description}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#292524]">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#854D0E]" aria-hidden="true" />
                          <span>{evt.timeLabel}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#854D0E]" aria-hidden="true" />
                          <span>{evt.venue}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                          <Users className="w-4 h-4 text-[#854D0E]" aria-hidden="true" />
                          <span>
                            <strong data-testid={`event-rsvp-count-${evt.id}`}>
                              {evt.rsvpCount.toLocaleString('en-IN')}
                            </strong>{' '}
                            / {evt.capacity.toLocaleString('en-IN')} registered
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#181510]/10">
                    <span className="text-xs font-medium text-[#57534E] lg:text-right">
                      Speaker: <strong className="text-[#181510]">{evt.speaker.split('&')[0].trim()}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => openRsvpModal(evt)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        evt.isFlagship
                          ? 'bg-[#181510] text-[#FACC15] hover:bg-[#2E2920]'
                          : 'bg-[#FACC15] text-[#181510] hover:bg-[#EAB308]'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>RSVP Seat</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181510]/70 backdrop-blur-xs"
          onClick={closeRsvpModal}
        >
          <div
            className="w-full max-w-lg bg-[#FFFCF2] border border-[#E8DFC0] rounded-xl shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EFE7C8]">
              <div>
                <p className="text-xs font-semibold tracking-wide text-[#854D0E]">
                  Event Seat Reservation
                </p>
                <h3
                  id="rsvp-modal-title"
                  className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-[#181510]"
                >
                  {selectedEvent.title}
                </h3>
                <p className="mt-1 text-xs text-[#57534E]">
                  {selectedEvent.dateIso} · {selectedEvent.venue}, {selectedEvent.district}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close RSVP dialog"
                onClick={closeRsvpModal}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#E8DFC0] bg-white text-[#181510] hover:bg-[#FEF3C7] cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {confirmation ? (
              <div className="mt-6 space-y-5" data-testid="rsvp-confirmation">
                <div className="p-5 bg-[#FEF08A] border border-[#CA8A04]/40 rounded-lg text-[#181510]">
                  <div className="flex items-center gap-2 font-semibold text-base">
                    <CheckCircle2 className="w-5 h-5 text-[#181510]" />
                    <span>Seat Reservation Confirmed</span>
                  </div>
                  <p className="mt-2 text-sm">
                    Thank you, <strong>{confirmation.fullName}</strong>. Your reservation for{' '}
                    <strong>{confirmation.seats}</strong>{' '}
                    {confirmation.seats === 1 ? 'seat' : 'seats'} at{' '}
                    <strong>{confirmation.eventTitle}</strong> is confirmed.
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#181510]/15 flex items-center justify-between text-sm">
                    <span className="font-medium">Entry Pass Code</span>
                    <span className="font-[family-name:var(--font-mono)] font-semibold">
                      {confirmation.confirmationCode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeRsvpModal}
                  className="w-full py-3 px-4 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] rounded-md transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="mt-5 space-y-4" noValidate>
                {serverError && (
                  <p
                    role="alert"
                    className="p-3 text-sm text-[#991B1B] bg-[#FEE2E2] border border-[#FCA5A5] rounded-md"
                  >
                    {serverError}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="rsvp-full-name"
                    className="block text-sm font-semibold text-[#181510] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="rsvp-full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Subba Rao"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-[#991B1B]">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="rsvp-phone"
                      className="block text-sm font-semibold text-[#181510] mb-1.5"
                    >
                      Mobile Number (10 digits)
                    </label>
                    <input
                      id="rsvp-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9848012345"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-[#991B1B]">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="rsvp-seats"
                      className="block text-sm font-semibold text-[#181510] mb-1.5"
                    >
                      Number of Seats
                    </label>
                    <select
                      id="rsvp-seats"
                      value={seats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D6CBA4] rounded-md text-[#181510] focus:outline-none focus:border-[#181510]"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Seat' : 'Seats'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeRsvpModal}
                    className="px-4 py-2.5 text-sm font-medium text-[#44403C] hover:text-[#181510] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-sm font-semibold text-[#181510] bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                  >
                    {submitting ? 'Confirming...' : 'Confirm RSVP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
