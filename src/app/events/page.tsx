"use client";

import EventSignup, {
  EventData,
  ELEVATION_EVENTS_KEY,
} from "@/components/EventSignup";
import { useLocalStorage } from "@/hooks/localStorage";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

type Submission = { id: number; children: number; timestamp: string };

export default function Page() {
  // Using the shared localStorage hook so the RSVP list survives reloads
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>(
    ELEVATION_EVENTS_KEY,
    []
  );
  // This could be replaced with the API source
  const event: EventData = {
    venue: "Elevation Church Ballantyne",
    address: "11701 Elevation Pt Dr",
    city: "Charlotte",
    state: "NC",
    zip: "28277",
  };

  const resetRsvp = () => setSubmissions([]);
  const handleSubmit = (children: number) => {
    const next: Submission = {
      id: submissions.length + 1,
      children,
      timestamp: new Date().toISOString(),
    };
    setSubmissions([...submissions, next]);
  };

  return (
    <main className="min-h-dvh bg-white pt-15 border-t-orange-500 border-t-2">
      <div className="min-h-dvh flex flex-col">
        <div className="flex-1 lg:max-w-5xl lg:mx-auto lg:px-6 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Details / summary content */}
          <section
            className="max-w-3xl mx-auto w-full px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+8rem)] lg:col-span-7 lg:max-w-none lg:px-0 lg:pt-0 lg:pb-0"
            aria-live="polite"
          >
            <Link href={"/"}>
              <MoveLeft className="text-orange-300 hover:text-orange-500" />
            </Link>
            <h1 className="font-bold text-gray-900 mb-3">
              Total RSVPs: {submissions.length}
            </h1>
            {submissions.length > 0 && (
              <ul className="space-y-2">
                {submissions.map((s) => (
                  <li key={s.id} className="text-sm text-gray-600">
                    RSVP {s.id} - Children: {s.children}
                  </li>
                ))}
              </ul>
            )}
            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={resetRsvp}
                className="mt-2 text-xs text-gray-400 underline decoration-dotted hover:text-gray-600"
              >
                Reset (Dev Only)
              </button>
            )}
          </section>

          {/* Signup card will be sticky on desktop, bottom sheet on mobile */}
          <aside className="lg:col-span-5">
            <div className="fixed bottom-0 left-0 right-0 lg:static">
              <div className="lg:sticky lg:top-6">
                <EventSignup
                  event={event}
                  onSubmit={handleSubmit}
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
