import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Media } from "@/components/content/Media";
import { resolveMediaList } from "@/data/resolveMedia";
import type { ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaItem[];
  progress?: MotionValue<number>;
};

const openingProjects = [
  { mediaId: "mois-du-ker-textile", href: "/projets/mois-du-ker", className: "identity" },
  { mediaId: "kuro-grey", href: "/projets/kuro", className: "web" },
  { mediaId: "atmosphere-laptop", href: "/projets/atmosphere", className: "web-secondary" },
  { mediaId: "mdk-poster", href: "/projets/mois-du-ker", className: "supports" },
] as const;

const renderInlineStrong = (value: string): ReactNode[] => value
  .split(/(\*\*[^*]+\*\*)/g)
  .filter(Boolean)
  .map((part, index) => {
    const strong = part.startsWith("**") && part.endsWith("**");
    const text = strong ? part.slice(2, -2) : part;
    return strong ? <strong key={`${text}-${index}`}>{text}</strong> : <span key={`${text}-${index}`}>{text}</span>;
  });

export function HomeOpeningScene({ header, media, progress }: HomeOpeningSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress: localProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = progress ?? localProgress;
  const fallbackMedia = resolveMediaList(openingProjects.map(({ mediaId }) => mediaId));
  const sceneMedia = media.length >= openingProjects.length ? media.slice(0, openingProjects.length) : fallbackMedia;

  // Labels follow the same asynchronous rhythm as the media constellation:
  // each one enters, holds, then rises and clears independently.
  const webLabelOpacity = useTransform(p, [0.07, 0.17, 0.5, 0.66], [0, 1, 1, 0]);
  const identityLabelOpacity = useTransform(p, [0.13, 0.23, 0.55, 0.72], [0, 1, 1, 0]);
  const supportsLabelOpacity = useTransform(p, [0.19, 0.29, 0.46, 0.62], [0, 1, 1, 0]);
  const webLabelY = useTransform(p, [0.07, 0.17, 0.5, 0.68], [10, 0, 0, -34]);
  const identityLabelY = useTransform(p, [0.13, 0.23, 0.55, 0.74], [10, 0, 0, -42]);
  const supportsLabelY = useTransform(p, [0.19, 0.29, 0.46, 0.64], [10, 0, 0, -38]);

  // The statement waits until the constellation has visibly started to clear.
  const statementOpacity = useTransform(p, [0.66, 0.8, 1], [0, 1, 1]);
  const statementY = useTransform(p, [0.66, 0.82], [24, 0]);

  // Each project has its own entrance, hold and exit. Opacity loss starts with
  // the upward movement rather than behaving as one grouped gallery fade.
  const mediaOpacity1 = useTransform(p, [0, 0.18, 0.47, 0.7], [0.16, 1, 1, 0]);
  const mediaOpacity2 = useTransform(p, [0, 0.12, 0.57, 0.9], [0.34, 1, 1, 0]);
  const mediaOpacity3 = useTransform(p, [0.05, 0.24, 0.51, 0.77], [0.1, 1, 1, 0]);
  const mediaOpacity4 = useTransform(p, [0.09, 0.29, 0.42, 0.64], [0.08, 1, 1, 0]);
  const mediaOpacities = [mediaOpacity1, mediaOpacity2, mediaOpacity3, mediaOpacity4];

  const mediaY1 = useTransform(p, [0, 0.18, 0.47, 0.72], [18, 0, 0, -120]);
  const mediaY2 = useTransform(p, [0, 0.12, 0.57, 0.92], [12, 0, 0, -160]);
  const mediaY3 = useTransform(p, [0.05, 0.24, 0.51, 0.79], [20, 0, 0, -140]);
  const mediaY4 = useTransform(p, [0.09, 0.29, 0.42, 0.66], [24, 0, 0, -180]);
  const mediaYs = [mediaY1, mediaY2, mediaY3, mediaY4];

  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  return (
    <div ref={ref} className="homeOpeningScene">
      <div className="homeOpeningScene__labels" aria-hidden="true">
        <motion.span
          className="homeOpeningScene__label homeOpeningScene__label--web"
          style={{ opacity: reduceMotion ? 1 : webLabelOpacity, y: reduceMotion ? 0 : webLabelY }}
        >
          Sites internet
        </motion.span>
        <motion.span
          className="homeOpeningScene__label homeOpeningScene__label--identity"
          style={{ opacity: reduceMotion ? 1 : identityLabelOpacity, y: reduceMotion ? 0 : identityLabelY }}
        >
          Identités visuelles
        </motion.span>
        <motion.span
          className="homeOpeningScene__label homeOpeningScene__label--supports"
          style={{ opacity: reduceMotion ? 1 : supportsLabelOpacity, y: reduceMotion ? 0 : supportsLabelY }}
        >
          Supports de communication
        </motion.span>
      </div>

      <div className="homeOpeningScene__media" aria-label="Projets sélectionnés">
        {sceneMedia.map((item, index) => {
          const project = openingProjects[index];
          if (!project) return null;
          const projectName = item.alt?.split("|")[0].trim() ?? "sélectionné";

          return (
            <motion.a
              key={`${project.mediaId}-${index}`}
              className={`homeOpeningScene__project homeOpeningScene__project--${project.className}`}
              href={project.href}
              style={{
                opacity: reduceMotion ? 1 : mediaOpacities[index],
                y: reduceMotion ? 0 : mediaYs[index],
              }}
              aria-label={`Voir le projet ${projectName}`}
            >
              <Media
                media={item}
                sizes={project.className === "web" ? "(min-width: 64rem) 28vw, 70vw" : "(min-width: 64rem) 12vw, 38vw"}
              />
            </motion.a>
          );
        })}
      </div>

      <motion.div
        className="homeOpeningScene__statement"
        style={{
          opacity: reduceMotion ? 1 : statementOpacity,
          y: reduceMotion ? 0 : statementY,
        }}
      >
        {paragraphs.map((paragraph) => <p key={paragraph}>{renderInlineStrong(paragraph)}</p>)}
      </motion.div>
    </div>
  );
}
