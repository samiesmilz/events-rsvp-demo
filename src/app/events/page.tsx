import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURED_EVENT_ID = "event001";

const mockEvents = [
  {
    id: FEATURED_EVENT_ID,
    name: "Elevation Church Ballantyne",
    city: "Charlotte",
    state: "NC",
    status: "open",
  },
  {
    id: "event002",
    name: "TBD Event 002",
    city: "Coming soon",
    state: "",
    status: "upcoming",
  },
  {
    id: "event003",
    name: "TBD Event 003",
    city: "Coming soon",
    state: "",
    status: "upcoming",
  },
];

export default function EventsLanding() {
  return (
    <main className="min-h-screen bg-white pt-16">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-gray-500 transition-colors hover:text-orange-500"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Upcoming Elevation Events
          </h1>
          <p className="mt-3 text-gray-600">
            Select an event card to learn more and reserve your spot. Events
            marked as upcoming will open soon.
          </p>
        </header>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => {
            const isActive = event.status === "open";

            if (isActive) {
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group relative block overflow-hidden rounded-2xl border-2 border-gray-900 bg-zinc-50 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-orange-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                >
                  <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 transition-all duration-300 group-hover:bg-black group-hover:text-white">
                    RSVP Open
                  </span>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                    {event.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                    {event.city}
                    {event.state ? `, ${event.state}` : ""}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-500">
                    View event
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            }

            return (
              <article
                key={event.id}
                className="flex min-h-[220px] flex-col justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center text-gray-400"
              >
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Upcoming
                </span>
                <h2 className="mt-3 text-lg font-medium">{event.name}</h2>
                <p className="mt-1 text-sm">{event.city}</p>
                <p className="mt-6 text-xs italic">
                  Registration opens soon. Check back later.
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
