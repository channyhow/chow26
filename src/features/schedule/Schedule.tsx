import { Card } from "@/components/content/Card";
import { Media } from "@/components/content/Media";
import { Grid } from "@/components/layout/Grid";
import { resolveMedia } from "@/data/resolveMedia";
import siteData from "@/data/site.json";
import type { ScheduleEvent } from "@/types/schedule";
import { formatDate, formatTime, sortByStart } from "@/utils/dates";

export function Schedule({ events }: { events: ScheduleEvent[] }) {
  const locale = siteData.site.defaultLocale;
  const bookingLabel = siteData.ui.copy.schedule.bookingLabel;

  return (
    <Grid className="schedule">
      {sortByStart(events).map((event) => {
        const media = resolveMedia(event.media);
        const meta = [
          { label: formatDate(event.start, locale) },
          { label: formatTime(event.start, locale) },
          ...(event.location ? [{ label: event.location }] : []),
        ];

        return (
          <div className="schedule__item" key={event.id}>
            {media ? <Media media={media} /> : null}
            <Card
              item={{
                eyebrow: event.label,
                title: event.title,
                text: event.description,
                meta,
                links: event.bookingUrl
                  ? [{ label: bookingLabel, href: event.bookingUrl, intent: "book" }]
                  : undefined,
              }}
            />
          </div>
        );
      })}
    </Grid>
  );
}
