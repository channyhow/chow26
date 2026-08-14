import { useEffect } from "react";

type TallyFormEmbedProps = {
  formId?: string;
  embedUrl?: string;
  title: string;
  fallbackHeight?: number;
};

const TALLY_SCRIPT = "https://tally.so/widgets/embed.js";

declare global {
  interface Window {
    Tally?: {
      loadEmbeds?: () => void;
    };
  }
}

const buildTallyUrl = ({
  formId,
  embedUrl,
}: Pick<TallyFormEmbedProps, "formId" | "embedUrl">) => {
  const source = embedUrl ?? (formId ? `https://tally.so/embed/${formId}` : undefined);

  if (!source) return undefined;

  try {
    const url = new URL(source);
    url.searchParams.set("alignLeft", "1");
    url.searchParams.set("hideTitle", "1");
    url.searchParams.set("transparentBackground", "1");
    url.searchParams.set("dynamicHeight", "1");
    return url.toString();
  } catch {
    return undefined;
  }
};

const hydrateTallyEmbeds = () => {
  if (window.Tally?.loadEmbeds) {
    window.Tally.loadEmbeds();
    return;
  }

  document
    .querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])")
    .forEach((iframe) => {
      const source = iframe.dataset.tallySrc;
      if (source) iframe.src = source;
    });
};

export function TallyFormEmbed({
  formId,
  embedUrl,
  title,
  fallbackHeight = 720,
}: TallyFormEmbedProps) {
  const src = buildTallyUrl({ formId, embedUrl });

  useEffect(() => {
    if (!src || typeof document === "undefined") return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TALLY_SCRIPT}"]`,
    );

    if (existingScript) {
      if (window.Tally) {
        hydrateTallyEmbeds();
        return;
      }

      existingScript.addEventListener("load", hydrateTallyEmbeds, { once: true });
      existingScript.addEventListener("error", hydrateTallyEmbeds, { once: true });

      return () => {
        existingScript.removeEventListener("load", hydrateTallyEmbeds);
        existingScript.removeEventListener("error", hydrateTallyEmbeds);
      };
    }

    const script = document.createElement("script");
    script.src = TALLY_SCRIPT;
    script.async = true;
    script.addEventListener("load", hydrateTallyEmbeds, { once: true });
    script.addEventListener("error", hydrateTallyEmbeds, { once: true });
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", hydrateTallyEmbeds);
      script.removeEventListener("error", hydrateTallyEmbeds);
    };
  }, [src]);

  if (!src) return null;

  return (
    <div className="form__embed">
      <iframe
        key={src}
        data-tally-src={src}
        loading="lazy"
        width="100%"
        height={fallbackHeight}
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title={title}
      />
    </div>
  );
}
