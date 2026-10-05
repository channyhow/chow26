import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Link } from "react-router-dom";

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

const openingServices = [
  { label: "Sites internet", href: "/studio#studio-service-website-panel", className: "web" },
  { label: "Identités visuelles", href: "/studio#studio-service-identity-panel", className: "identity" },
  { label: "Supports de communication", href: "/studio#studio-service-integrations-panel", className: "supports" },
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
  const sourceProgress = progress ?? localProgress;

  // SectionGroup progress begins while a panel is still entering the viewport,
  // so a full-height panel is already around 0.5 when it reaches its composed
  // resting state. Remap that visible half to a scene-local 0 → 1 range.
  const p = useTransform(sourceProgress, [progress ? 0.5 : 0, 1], [0, 1], { clamp: true });

  const fallbackMedia = resolveMediaList(openingProjects.map(({ mediaId }) => mediaId));
  const sceneMedia = media.length >= openingProjects.length ? media.slice(0, openingProjects.length) : fallbackMedia;

  // Build the scene in small staggered beats, hold it fully composed, then let
  // labels and media disperse independently. This avoids a long washed-out state.
  const webLabelOpacity = useTransform(p, [0.04, 0.12, 0.68, 0.82], [0, 1, 1, 0]);
  const identityLabelOpacity = useTransform(p, [0.1, 0.18, 0.72, 0.86], [0, 1, 1, 0]);
  const supportsLabelOpacity = useTransform(p, [0.16, 0.24, 0.64, 0.78], [0, 1, 1, 0]);
  const webLabelY = useTransform(p, [0.04, 0.12, 0.68, 0.84], [12, 0, 0, -30]);
  const identityLabelY = useTransform(p, [0.1, 0.18, 0.72, 0.88], [12, 0, 0, -38]);
  const supportsLabelY = useTransform(p, [0.16, 0.24, 0.64, 0.8], [12, 0, 0, -34]);
  const labelOpacities = [webLabelOpacity, identityLabelOpacity, supportsLabelOpacity];
  const labelYs = [webLabelY, identityLabelY, supportsLabelY];

  const statementOpacity = useTransform(p, [0.74, 0.86, 1], [0, 1, 1]);
  const statementY = useTransform(p, [0.74, 0.88], [22, 0]);

  const mediaOpacity1 = useTransform(p, [0, 0.12, 0.66, 0.84], [0.12, 1, 1, 0]);
  const mediaOpacity2 = useTransform(p, [0.04, 0.16, 0.74, 0.96], [0.12, 1, 1, 0]);
  const mediaOpacity3 = useTransform(p, [0.08, 0.2, 0.7, 0.9], [0.08, 1, 1, 0]);
  const mediaOpacity4 = useTransform(p, [0.12, 0.24, 0.62, 0.8], [0.06, 1, 1, 0]);
  const mediaOpacities = [mediaOpacity1, mediaOpacity2, mediaOpacity3, mediaOpacity4];

  const mediaY1 = useTransform(p, [0, 0.12, 0.66, 0.86], [22, 0, 0, -118]);
  const mediaY2 = useTransform(p, [0.04, 0.16, 0.74, 0.98], [18, 0, 0, -156]);
  const mediaY3 = useTransform(p, [0.08, 0.2, 0.7, 0.92], [24, 0, 0, -136]);
  const mediaY4 = useTransform(p, [0.12, 0.24, 0.62, 0.82], [28, 0, 0, -176]);
  const mediaYs = [mediaY1, mediaY2, mediaY3, mediaY4];

  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  return (
    <div ref={ref} className="homeOpeningScene">
      <nav className="homeOpeningScene__labels" aria-label="Services Chow Studio">
        {openingServices.map((service, index) => (
          <motion.div
            key={service.className}
            className={`homeOpeningScene__label homeOpeningScene__label--${service.className}`}
            style={{
              opacity: reduceMotion ? 1 : labelOpacities[index],
              y: reduceMotion ? 0 : labelYs[index],
            }}
          >
            <Link to={service.href} className="homeOpeningScene__labelLink">
              {service.label}
            </Link>
          </motion.div>
        ))}
      </nav>

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
