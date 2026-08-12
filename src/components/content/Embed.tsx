export type EmbedProvider = "generic" | "instagram" | "maps" | "calendar" | "tally";

type EmbedProps = {
  src: string;
  title: string;
  provider?: EmbedProvider;
};

export function Embed({ src, title, provider = "generic" }: EmbedProps) {
  return (
    <div className="embed" data-provider={provider}>
      <iframe
        className="embed__frame"
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="fullscreen"
      />
    </div>
  );
}
