import RsvpPanel from "@/components/RsvpPanel";
import type { EventData } from "@/types/events";
import { headers } from "next/headers";

async function fetchEvent(id: string): Promise<EventData | null> {
  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto") ?? "http";
  const forwardedHost =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  const baseOrigin =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    (forwardedHost ? `${forwardedProto}://${forwardedHost}` : "") ||
    "http://localhost:3000";

  const apiUrl = `${baseOrigin}/api/events/${id}`;

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as EventData;
  } catch {
    return null;
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await fetchEvent(id);

  if (!event) {
    return (
      <main className="min-h-dvh bg-white pt-15">
        <div className="mx-auto max-w-2xl p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Event not found
          </h1>
          <p className="mt-2 text-gray-600">
            Please check the link or contact support.
          </p>
        </div>
      </main>
    );
  }

  return <RsvpPanel event={event} />;
}
