import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";

import { Media } from "@/components/content/Media";
import { resolveMediaList } from "@/data/resolveMedia";
import type { ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaItem[];
};

const openingProjects = [
  { mediaId: "mois-du-ker-textile", href: "/studio#studio-service-identity-panel", className: "identity" },
  { mediaId: "kuro-grey", href: "/studio#studio-service-website-panel", className: "web" },
  { mediaId: "atmosphere-laptop", href: "/studio#studio-service-website-panel", className: "web-secondary" },
  { mediaId: "ravine-flyer", href: "/studio#studio-service-identity-panel", className: "supports" },
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

export function HomeOpeningScene({ header, media }: HomeOpeningSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });

  const fallbackMedia = resolveMediaList(openingProjects.map(({ mediaId }) => mediaId));
  const sceneMedia = media.length >= openingProjects.length ? media.slice(0, openingProjects.length) : fallbackMedia;

  const webLabelOpacity = useTransform(p, [0.04, 0.12, 0.66, 0.78], [0, 1, 1, 0]);
  const identityLabelOpacity = useTransform(p, [0.1, 0.18, 0.7, 0.82], [0, 1, 1, 0]);
  const supportsLabelOpacity = useTransform(p, [0.16, 0.24, 0.62, 0.74], [0, 1, 1, 0]);
  const webLabelY = useTransform(p, [0.04, 0.12, 0.66, 0.8], [12, 0, 0, -30]);
  const identityLabelY = useTransform(p, [0.1, 0.18, 0.7, 0.84], [12, 0, 0, -38]);
  const supportsLabelY = useTransform(p, [0.16, 0.24, 0.62, 0.76], [12, 0, 0, -34]);
  const labelOpacities = [webLabelOpacity, identityLabelOpacity, supportsLabelOpacity];
  const labelYs = [webLabelY, identityLabelY, supportsLabelY];

  const statementOpacity = useTransform(p, [0.72, 0.84, 1], [0, 1, 1]);
  const statementY = useTransform(p, [0.72, 0.86], [22, 0]);

  const mediaOpacity1 = useTransform(p, [0, 0.12, 0.64, 0.82], [0.12, 1, 1, 0]);
  const mediaOpacity2 = useTransform(p, [0.04, 0.16, 0.72, 0.94], [0.12, 1, 1, 0]);
  const mediaOpacity3 = useTransform(p, [0.08, 0.2, 0.68, 0.88], [0.08, 1, 1, 0]);
  const mediaOpacity4 = useTransform(p, [0.12, 0.24, 0.6, 0.78], [0.06, 1, 1, 0]);
  const mediaOpacities = [mediaOpacity1, mediaOpacity2, mediaOpacity3, mediaOpacity4];

  const mediaY1 = useTransform(p, [0, 0.12, 0.64, 0.84], [22, 0, 0, -118]);
  const mediaY2 = useTransform(p, [0.04, 0.16, 0.72, 0.96], [18, 0, 0, -156]);
  const mediaY3 = useTransform(p, [0.08, 0.2, 0.68, 0.9], [24, 0, 0, -136]);
  const mediaY4 = useTransform(p, [0.12, 0.24, 0.6, 0.8], [28, 0, 0, -176]);
  const mediaYs = [mediaY1, mediaY2, mediaY3, mediaY4];

  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  return (
    <div ref={ref} className="homeOpeningScene">
      <nav className="homeOpeningScene__labels" aria-label="Services Chow Studio">
        {openingServices.map((service, index) => (
          <motion.div
            key={service.className}
            className={`homeOpeningScene__label homeOpeningScene__label--${service.className}`}
            style={{ opacity: labelOpacities[index], y: labelYs[index] }}
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
              style={{ opacity: mediaOpacities[index], y: mediaYs[index] }}
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
        style={{ opacity: statementOpacity, y: statementY }}
      >
        {paragraphs.map((paragraph) => <p key={paragraph}>{renderInlineStrong(paragraph)}</p>)}
      </motion.div>
    </div>
  );
}
