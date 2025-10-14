import { NextResponse } from "next/server";
import type { EventData } from "@/types/events";

const MOCK_ID = "test-event-123";

const MOCK_EVENT: EventData = {
  id: MOCK_ID,
  venue: "Elevation Church Ballantyne",
  address: "11701 Elevation Pt Dr",
  city: "Charlotte",
  state: "NC",
  zip: "28277",
  date: "2025-11-02T14:00:00.000Z",
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Only the mock event is recognized; everything else will return 404 text.
  if (id !== MOCK_ID) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json(MOCK_EVENT);
}
