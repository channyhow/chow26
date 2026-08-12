import type { CalendarEvent } from "@/types/schedule";

type GoogleDate = { dateTime?: string; date?: string };

type GoogleCalendarEvent = {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: GoogleDate;
  end?: GoogleDate;
};

type GoogleCalendarResponse = {
  items?: GoogleCalendarEvent[];
};

function readDate(value?: GoogleDate) {
  return value?.dateTime ?? value?.date ?? "";
}

export function normalizeGoogleCalendarEvent(event: GoogleCalendarEvent): CalendarEvent | null {
  const start = readDate(event.start);
  const end = readDate(event.end);
  if (!event.id || !start || !end) return null;

  return {
    id: event.id,
    title: event.summary?.trim() || "Événement",
    start,
    end,
    location: event.location?.trim() || undefined,
    description: event.description?.trim() || undefined,
  };
}

export async function fetchGoogleCalendarEvents(endpoint: string, signal?: AbortSignal) {
  const response = await fetch(endpoint, { signal });
  if (!response.ok) throw new Error(`Calendar request failed: ${response.status}`);

  const payload = await response.json() as GoogleCalendarResponse;
  return (payload.items ?? [])
    .map(normalizeGoogleCalendarEvent)
    .filter((event): event is CalendarEvent => Boolean(event));
}
