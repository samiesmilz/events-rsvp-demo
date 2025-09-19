# Elevation | Events RSVP - Demo

## Overview

A demo of the RSVP signup component.

## Data Decisions

- Local storage first.
- I save RSVPs to `localStorage` as requested so the list survives refreshes.
- Timestamp everything. Each RSVP carries a timestamp so I we sort or audit later without changing the data shape.
- I used one event objectso that I can swap in API data or CMS content later easily.

## Running It Locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to start on the welcome screen.
Head to `/events` to interact with the RSVP experience.
I added "Reset (Dev Only)" link to clear stored submissions - for development use only.

## For production, l would...

- Swap the static event object for an api call to highlight how the component scales.
- Add form validation for additional guest details once the flow expands beyond a counter.
- Sync submissions to an API so multiple devices stay in step.

## At glance screenshots

![Welcome screen](public/assets/welcome-screen-demo.png)
Just an entry point to test the demo

![Event details](public/assets/events-details-demo.png)
Initial State of the Component and page before processing data.

![Stored RSVPs](public/assets/processed-rsvp-demo.png)
What proessed RSVPs look like as requested.

## Project Structure

```text
src/
  app/
    layout.tsx        # Root layout + metadata
    page.tsx          # Welcome screen
    events/
      page.tsx        # RSVP page; owns submission state
  components/
    EventSignup.tsx   # Form UI and submission handler
  hooks/
    localStorage.ts   # Shared persistence helper
public/
  assets/             # README screenshots + favicon
```
