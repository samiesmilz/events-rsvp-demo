"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import EventSignup from "@/components/EventSignup";
import type { EventData, Submission } from "@/types/events";
import { useLocalStorage } from "@/hooks/localStorage";

const STORAGE_KEY_BASE = "elevation:rsvps";

// This panel wraps the signup card with the event summary and error handling.
export default function RsvpPanel({ event }: { event: EventData }) {
  const storageKey = `${STORAGE_KEY_BASE}:${event.id}`;
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>(
    storageKey,
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Clearing storage or errors should feel instant, so keeping it simple.
  const resetRsvp = () => {
    setSubmissions([]);
    setError(null);
  };

  const handleSubmit = useCallback(
    async (
      childrenCount: number,
      acknowledgement: boolean
    ): Promise<boolean> => {
      setError(null);
      setPending(true);
      try {
        const res = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event.id,
            childrenCount,
            acknowledgement,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.ok) {
          setError(data?.error ?? "Failed to submit RSVP");
          return false;
        }

        // Successful POST returns the saved record, so we append it locally.
        const next: Submission = data.saved;
        setSubmissions((prev) => [...prev, next]);
        return true;
      } catch {
        setError("Network error. Please try again.");
        return false;
      } finally {
        setPending(false);
      }
    },
    [event.id, setSubmissions]
  );

  return (
    <main className="min-h-dvh bg-white pt-15 border-t-orange-500 border-t-2">
      <div className="min-h-dvh flex flex-col">
        {/* Below lg we stack, at lg+ we split into 7 / 5 columns so the card floats */}
        <div className="flex-1 lg:max-w-5xl lg:mx-auto lg:px-6 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Details / summary content */}
          <section
            className="max-w-3xl mx-auto w-full px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+8rem)] lg:col-span-7 lg:max-w-none lg:px-0 lg:pt-0 lg:pb-0"
            aria-live="polite"
          >
            <Link href={"/events"} aria-label="Back to events">
              <MoveLeft className="text-orange-300 hover:text-orange-500" />
            </Link>

            <h1 className="mt-4 font-bold text-gray-900">
              Total RSVPs: {submissions.length}
            </h1>

            {submissions.length > 0 && (
              <ul className="mt-2 space-y-2">
                {submissions.map((s, idx) => (
                  <li key={`${s.timestamp}-${idx}`} className="text-sm text-gray-700">
                    RSVP {idx + 1} — Children: {s.children}
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(s.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={resetRsvp}
                className="mt-3 text-xs text-gray-400 underline decoration-dotted hover:text-gray-600"
              >
                Reset (Dev Only)
              </button>
            )}

            {/* Error region */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </div>
            )}
          </section>

          {/* Signup card: mobile keeps it fixed near the bottom; lg+ makes it sticky */}
          <aside className="lg:col-span-5" aria-busy={pending}>
            <div className="fixed bottom-0 left-0 right-0 lg:static">
              <div className="lg:sticky lg:top-6">
                <EventSignup
                  event={event}
                  onSubmit={handleSubmit}
                  pending={pending}
                  className="rounded-t-2xl rounded-b-none max-w-none pb-[calc(env(safe-area-inset-bottom)+1.5rem)] lg:rounded-2xl lg:pb-6"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
