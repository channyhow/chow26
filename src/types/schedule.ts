export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
};

export type ScheduleEvent = CalendarEvent & {
  label?: string;
  media?: string;
  bookingUrl?: string;
};

export type ScheduleEventType = {
  match: string[];
  label?: string;
  media?: string;
  bookingLink?: string;
};

export type ScheduleConfig = {
  defaults?: {
    bookingLink?: string;
  };
  eventTypes: Record<string, ScheduleEventType>;
};
