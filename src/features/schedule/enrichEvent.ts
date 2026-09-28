import scheduleData from "@/data/schedule.json";
import { getActionHref } from "@/data/actionRegistry";
import type { CalendarEvent, ScheduleConfig, ScheduleEvent } from "@/types/schedule";

const schedule = scheduleData as ScheduleConfig;

function matches(title: string, terms: string[]) {
  const normalized = title.toLocaleLowerCase();
  return terms.some((term) => normalized.includes(term.toLocaleLowerCase()));
}

export function enrichScheduleEvent(event: CalendarEvent): ScheduleEvent {
  const eventType = Object.values(schedule.eventTypes)
    .find((config) => matches(event.title, config.match));

  const bookingLink = eventType?.bookingLink ?? schedule.defaults?.bookingLink;

  return {
    ...event,
    label: eventType?.label,
    media: eventType?.media,
    bookingUrl: getActionHref(bookingLink),
  };
}

export function enrichScheduleEvents(events: CalendarEvent[]) {
  return events.map(enrichScheduleEvent);
}
