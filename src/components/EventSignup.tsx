"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Map, Calendar, Clock, Copy, Check } from "lucide-react";

/**
 * I chose one event object so that this component works for any event
 * source whether details are coming from (API, CMS, or file.)
 */
export interface EventData {
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  date?: Date; // if the date is not given, we'll show "now"
}

/**
 *  Anticipating that the event may have growing or shrinking fields,
 *  a single prop object could help scale props better.
 */
export interface EventSignupProps {
  event: EventData;
  onSubmit?: (
    children: number,
    acknowledgement: boolean
  ) => Promise<boolean> | boolean;
  pending?: boolean;
  className?: string;
}

/**
 * Saved RSVP that we display in the summary
 */
export interface Submission {
  id: number;
  children: number;
  timestamp: string; // could be helpful if we need to sort events later.
}

/** Our storage key */
export const ELEVATION_EVENTS_KEY = "elevation:rsvps";

/** Setting boundaries for the children counter */
const MIN_CHILDREN = 0;
const MAX_CHILDREN = 6;

// helper function to manage updating the time.
function useSystemTime(interval = 60000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

const EventSignup = ({
  event,
  onSubmit,
  pending = false,
  className,
}: EventSignupProps) => {
  // NOTE: do NOT default date here (e.g., "= new Date()") because that would "freeze" render time.
  const { venue, address, city, state, zip, date } = event;

  // What we want the component to remember across reloads
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  // Separated date and time for cleaner display formatting
  const [displayDate, setDisplayDate] = useState<string>("");
  const [displayTime, setDisplayTime] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitted"
  >("idle");
  const submittedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const systemTime = useSystemTime(); // updates every minute

  /**
   * After mount...
   * We'll render date and time on the client to avoid hydration warnings
   */
  useEffect(() => {
    // Only creating new Date() if date is provided; otherwise use the ticking systemTime.
    const eventDate = date ? new Date(date) : systemTime;

    setDisplayDate(
      eventDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    setDisplayTime(
      eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    );
  }, [date, systemTime]); // depend on date (static) or systemTime (live "now")

  // To make sure we keep the number at zero or above but not more than 6
  // Example: keepBetween(0, 7, 6) -> 6
  const keepBetween = (min: number, value: number, max: number) => {
    return Math.min(max, Math.max(min, value));
  };

  // Button actions that will change the children count
  const increase = () =>
    setChildrenCount((prev) =>
      keepBetween(MIN_CHILDREN, prev + 1, MAX_CHILDREN)
    );
  const decrease = () =>
    setChildrenCount((prev) =>
      keepBetween(MIN_CHILDREN, prev - 1, MAX_CHILDREN)
    );

  /**
   * On submit...
   * - We'll check to see if the required box has been checked
   * - Then we'll append the RSVP submission and reset the form
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acknowledged || pending) return;

    let submitSucceeded = true;

    if (onSubmit) {
      try {
        const result = await onSubmit(childrenCount, acknowledged);
        submitSucceeded = result !== false;
      } catch {
        submitSucceeded = false;
      }
    }

    if (!submitSucceeded) return;

    // Reset form after successful submission
    setChildrenCount(0);
    setSubmissionStatus("submitted");

    if (submittedTimeoutRef.current) {
      clearTimeout(submittedTimeoutRef.current);
    }
    submittedTimeoutRef.current = setTimeout(() => {
      setSubmissionStatus("idle");
      setAcknowledged(false);
      submittedTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (submittedTimeoutRef.current) {
        clearTimeout(submittedTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!acknowledged) {
      setSubmissionStatus("idle");
    }
  }, [acknowledged]);

  // Helper functions for address interaction
  const copyAddress = () => {
    const fullAddress = `${address}, ${city}, ${state} ${zip}`;
    navigator.clipboard.writeText(fullAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openDirections = () => {
    // Google Maps handles the display
    const fullAddress = `${address}, ${city}, ${state} ${zip}`;
    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`
    );
  };

  const isSubmitted = submissionStatus === "submitted";
  const isBusy = pending === true;
  const isInteractive = acknowledged && !isSubmitted && !isBusy;
  const isDisabled = !isInteractive;

  return (
    <section
      className={`w-full max-w-lg mx-0 bg-zinc-100 rounded-2xl p-6 ${
        className ?? ""
      }`}
    >
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Event Details
      </h1>

      {/* Event information */}
      <div className="space-y-4 mb-6">
        {/* Location */}
        <div className="flex items-start gap-3">
          <Map className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-md font-medium text-gray-900">Location</div>
            <div className="text-sm text-gray-600">{venue}</div>
            <div className="text-sm text-gray-500">
              {city}, {state} {zip}
            </div>
          </div>
          {/* Action buttons for address interaction */}
          <div className="flex gap-4">
            <div className="group w-10 flex flex-col items-center">
              <button
                onClick={openDirections}
                className="p-1.5 text-black hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                title="Get directions"
              >
                <MapPin className="w-4 h-4" />
              </button>
              <span className="mt-1 text-[11px] font-medium text-black group-hover:text-black">
                Directions
              </span>
            </div>
            <div className="group w-10 flex flex-col items-center">
              <button
                onClick={copyAddress}
                className="relative p-1.5 text-black hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
                {copied && (
                  <span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="absolute w-7 h-7 rounded-full bg-orange-500/30 animate-ping" />
                    <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white shadow-md">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                  </span>
                )}
              </button>
              <span className="mt-1 text-[11px] font-medium text-black group-hover:text-black">
                {copied ? "Copied" : "Copy"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-md text-black">{displayDate}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-md text-black">{displayTime}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset>
          <legend className="sr-only">Additional Children</legend>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-900">
              Additional Children ({MIN_CHILDREN} - {MAX_CHILDREN} Yrs)
            </span>
            <div className="inline-flex items-stretch rounded-full overflow-hidden">
              <button
                type="button"
                onClick={decrease}
                disabled={childrenCount === MIN_CHILDREN}
                className="h-10 w-10 flex items-center justify-center text-black hover:bg-gray-50 border border-black border-r-0 rounded-l-full disabled:text-gray-300 disabled:border-gray-400 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                aria-label="Decrease number of children"
              >
                −
              </button>
              {/* for screen readers announce updates without controlling the focus */}
              <output
                aria-live="polite"
                role="status"
                className="h-10 px-4 min-w-[2.5rem] flex items-center justify-center text-black font-bold select-none border-y border-x border-black"
              >
                {childrenCount}
              </output>
              <button
                type="button"
                onClick={increase}
                disabled={childrenCount === MAX_CHILDREN}
                className="h-10 w-10 flex items-center justify-center text-black hover:bg-gray-50 border border-black border-l-0 rounded-r-full disabled:text-gray-300 disabled:border-gray-400 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                aria-label="Increase number of children"
              >
                +
              </button>
            </div>
          </div>
        </fieldset>

        {/* Making sure the user acknowledges policy before submitting */}
        <label className="group relative z-10 flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1 transition-colors hover:bg-orange-50/40">
          <input
            id="acknowledgment"
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="w-7 h-7 accent-black border border-gray-400 rounded bg-white focus:outline-none focus:ring-0 hover:border-black group-hover:border-orange-400 transition-colors"
          />
          <span className="text-gray-600 leading-5 text-xs">
            <span className="text-orange-500 mr-1">*</span>
            By checking this box, you agree to the terms outlined in this{" "}
            <a
              href="https://www.elevationchurch.org/acknowledgements-and-release"
              target="_blank"
              rel="noreferrer"
              className="text-black underline"
            >
              Acknowledgement &amp; Release
            </a>{" "}
            form.
          </span>
        </label>

        {/* Activating submit when everything else is set */}
        <button
          type="submit"
          disabled={isDisabled}
          title={
            !acknowledged
              ? "Please accept policies to submit"
              : isBusy
              ? "Submitting..."
              : undefined
          }
          className={`relative w-full py-3 rounded-full font-semibold overflow-hidden transition-colors duration-300 focus:outline-none ${
            isSubmitted
              ? "bg-black text-white cursor-default"
              : !acknowledged || isBusy
              ? "bg-zinc-200 text-gray-500 cursor-default"
              : "group bg-black text-white"
          }`}
        >
          {isInteractive && (
            <span className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitted ? "Submitted" : isBusy ? "Submitting..." : "RSVP"}
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                !acknowledged ? "bg-white/80" : "bg-white"
              }`}
            >
              <Check
                className={`w-3 h-3 ${
                  !acknowledged ? "text-gray-500" : "text-black"
                }`}
              />
            </span>
          </span>
        </button>
      </form>
    </section>
  );
};

export default EventSignup;
