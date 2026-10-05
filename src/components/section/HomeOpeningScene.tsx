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

 
  const labelsOpacity = useTransform(p, [0.1, 0.24, 0.56, 0.7], [0, 1, 1, reduceMotion ? 1 : 0]);
  const statementOpacity = useTransform(p, [0.58, 0.76, 1], [0, 1, 1]);
  const statementY = useTransform(p, [0.58, 0.8], [reduceMotion ? 0 : 24, 0]);

  // Each image has its own entrance, hold and exit. Kuro establishes the scene
  // first; the smaller applications resolve around it and leave asynchronously.
  const mediaOpacity1 = useTransform(p, [0, 0.18, 0.56, 0.86], [0.18, 1, 1, reduceMotion ? 1 : 0]);
  const mediaOpacity2 = useTransform(p, [0, 0.13, 0.62, 0.94], [0.38, 1, 1, reduceMotion ? 1 : 0]);
  const mediaOpacity3 = useTransform(p, [0.05, 0.23, 0.54, 0.84], [0.12, 1, 1, reduceMotion ? 1 : 0]);
  const mediaOpacity4 = useTransform(p, [0.08, 0.27, 0.5, 0.8], [0.1, 1, 1, reduceMotion ? 1 : 0]);
  const mediaOpacities = [mediaOpacity1, mediaOpacity2, mediaOpacity3, mediaOpacity4];

  const mediaY1 = useTransform(p, [0.48, 0.9], [0, reduceMotion ? 0 : -130]);
  const mediaY2 = useTransform(p, [0.54, 1], [0, reduceMotion ? 0 : -175]);
  const mediaY3 = useTransform(p, [0.44, 0.86], [0, reduceMotion ? 0 : -155]);
  const mediaY4 = useTransform(p, [0.4, 0.82], [0, reduceMotion ? 0 : -210]);
  const mediaYs = [mediaY1, mediaY2, mediaY3, mediaY4];

  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  return (
    <div ref={ref} className="homeOpeningScene">
    

      <motion.div className="homeOpeningScene__labels" style={{ opacity: labelsOpacity }} aria-hidden="true">
        <span className="homeOpeningScene__label homeOpeningScene__label--web">Sites internet</span>
        <span className="homeOpeningScene__label homeOpeningScene__label--identity">Identités visuelles</span>
        <span className="homeOpeningScene__label homeOpeningScene__label--supports">Supports de communication</span>
      </motion.div>

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
              style={{ opacity: mediaOpacities[index], y: mediaYs[index] }}
              aria-label={`Voir le projet ${projectName}`}
            >
              <Media media={item} sizes={project.className === "web" ? "(min-width: 64rem) 28vw, 70vw" : "(min-width: 64rem) 12vw, 38vw"} />
            </motion.a>
          );
        })}
      </div>

      <motion.div className="homeOpeningScene__statement" style={{ opacity: statementOpacity, y: statementY }}>
        {paragraphs.map((paragraph) => <p key={paragraph}>{renderInlineStrong(paragraph)}</p>)}
      </motion.div>
    </div>
  );
}
