import { NextResponse } from "next/server";

const MOCK_ID = "event001";
const MIN_CHILDREN = 0;
const MAX_CHILDREN = 6;

type Body = {
  eventId?: string;
  childrenCount?: number;
  acknowledgement?: boolean;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { eventId, childrenCount, acknowledgement } = body;

  if (eventId !== MOCK_ID) {
    return NextResponse.json(
      { ok: false, error: "Unknown eventId" },
      { status: 404 }
    );
  }
  if (typeof childrenCount !== "number" || !Number.isFinite(childrenCount)) {
    return NextResponse.json(
      { ok: false, error: "childrenCount must be a number" },
      { status: 422 }
    );
  }
  if (childrenCount < MIN_CHILDREN || childrenCount > MAX_CHILDREN) {
    return NextResponse.json(
      {
        ok: false,
        error: `childrenCount must be between ${MIN_CHILDREN} and ${MAX_CHILDREN}`,
      },
      { status: 422 }
    );
  }
  if (acknowledgement !== true) {
    return NextResponse.json(
      { ok: false, error: "You must accept the acknowledgement to RSVP" },
      { status: 422 }
    );
  }

  // Simulate a saved record
  const saved = {
    id: Math.floor(Math.random() * 1_000_000),
    children: childrenCount,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, saved }, { status: 201 });
}
