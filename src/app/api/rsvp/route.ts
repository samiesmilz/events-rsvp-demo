import { NextResponse } from "next/server";
import { z } from "zod";

const MOCK_ID = "test-event-123";
const MIN_CHILDREN = 0;
const MAX_CHILDREN = 6;

let submissionCounter = 0;

// This Schema describes what a valid request looks like so the response can be consistent.
const BodySchema = z.object({
  eventId: z.string(),
  childrenCount: z
    .number()
    .int("childrenCount must be a number")
    .min(
      MIN_CHILDREN,
      `childrenCount must be between ${MIN_CHILDREN} and ${MAX_CHILDREN}`
    )
    .max(
      MAX_CHILDREN,
      `childrenCount must be between ${MIN_CHILDREN} and ${MAX_CHILDREN}`
    ),
  // The acknowledgement checkbox must be checked or we abort the save.
  acknowledgement: z.literal(true, {
    message: "You must accept the acknowledgement to RSVP",
  }),
});

// Increament ID with each submission
const nextSubmissionId = () => {
  submissionCounter += 1;
  return submissionCounter;
};

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Run all of the validation in one go.
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json({ ok: false, error: msg }, { status: 422 });
  }

  const { eventId, childrenCount } = parsed.data;

  // Only recognise the single mocked event ID and anything else as invalid.
  if (eventId !== MOCK_ID) {
    return NextResponse.json(
      { ok: false, error: "Unknown eventId" },
      { status: 404 }
    );
  }

  // Build the payload the UI expects so it can show the saved record.
  const saved = {
    id: nextSubmissionId(),
    children: childrenCount,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, saved }, { status: 201 });
}
