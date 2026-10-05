import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { Media } from "@/components/content/Media";
import { resolveMediaList } from "@/data/resolveMedia";
import type { ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaItem[];
  scrollProgress?: unknown;
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

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smoothstep = (value: number) => value * value * (3 - 2 * value);
const range = (progress: number, start: number, end: number) => smoothstep(clamp01((progress - start) / Math.max(end - start, 0.001)));
const hold = (progress: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => {
  const enter = range(progress, enterStart, enterEnd);
  const exit = 1 - range(progress, exitStart, exitEnd);
  return Math.min(enter, exit);
};

const renderInlineStrong = (value: string): ReactNode[] => value
  .split(/(\*\*[^*]+\*\*)/g)
  .filter(Boolean)
  .map((part, index) => {
    const strong = part.startsWith("**") && part.endsWith("**");
    const text = strong ? part.slice(2, -2) : part;
    return strong ? <strong key={`${text}-${index}`}>{text}</strong> : <span key={`${text}-${index}`}>{text}</span>;
  });

export function HomeOpeningScene({ header, media }: HomeOpeningSceneProps) {
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const statementRef = useRef<HTMLDivElement>(null);

  const fallbackMedia = resolveMediaList(openingProjects.map(({ mediaId }) => mediaId));
  const sceneMedia = media.length >= openingProjects.length ? media.slice(0, openingProjects.length) : fallbackMedia;
  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  useEffect(() => {
    const labelTiming = [
      [0.04, 0.12, 0.66, 0.78, 12, -30],
      [0.1, 0.18, 0.7, 0.82, 12, -38],
      [0.16, 0.24, 0.62, 0.74, 12, -34],
    ] as const;
    const mediaTiming = [
      [0, 0.12, 0.64, 0.82, 0.12, 22, -118],
      [0.04, 0.16, 0.72, 0.94, 0.12, 18, -156],
      [0.08, 0.2, 0.68, 0.88, 0.08, 24, -136],
      [0.12, 0.24, 0.6, 0.78, 0.06, 28, -176],
    ] as const;

    const update = (rawProgress: number) => {
      const progress = clamp01(rawProgress);

      labelRefs.current.forEach((element, index) => {
        const timing = labelTiming[index];
        if (!element || !timing) return;
        const [enterStart, enterEnd, exitStart, exitEnd, startY, exitY] = timing;
        const enter = range(progress, enterStart, enterEnd);
        const exit = range(progress, exitStart, exitEnd);
        element.style.opacity = String(hold(progress, enterStart, enterEnd, exitStart, exitEnd));
        element.style.transform = `translate3d(0, ${lerp(lerp(startY, 0, enter), exitY, exit)}px, 0)`;
      });

      projectRefs.current.forEach((element, index) => {
        const timing = mediaTiming[index];
        if (!element || !timing) return;
        const [enterStart, enterEnd, exitStart, exitEnd, initialOpacity, startY, exitY] = timing;
        const enter = range(progress, enterStart, enterEnd);
        const exit = range(progress, exitStart, exitEnd);
        const visibleOpacity = lerp(initialOpacity, 1, enter);
        element.style.opacity = String(lerp(visibleOpacity, 0, exit));
        element.style.transform = `translate3d(0, ${lerp(lerp(startY, 0, enter), exitY, exit)}px, 0)`;
      });

      const statement = statementRef.current;
      if (statement) {
        const reveal = range(progress, 0.72, 0.86);
        statement.style.opacity = String(reveal);
        statement.style.transform = `translate3d(0, ${lerp(22, 0, reveal)}px, 0)`;
      }
    };

    let frame = 0;
    const resolveOpeningState = () => {
      frame = 0;
      const scrollDistance = Math.max(window.innerHeight * 1.6, 1);
      update(window.scrollY / scrollDistance);
    };
    const scheduleResolve = () => {
      if (!frame) frame = window.requestAnimationFrame(resolveOpeningState);
    };

    scheduleResolve();
    window.addEventListener("scroll", scheduleResolve, { passive: true });
    window.addEventListener("resize", scheduleResolve);

    return () => {
      window.removeEventListener("scroll", scheduleResolve);
      window.removeEventListener("resize", scheduleResolve);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="homeOpeningScene">
      <nav className="homeOpeningScene__labels" aria-label="Services Chow Studio">
        {openingServices.map((service, index) => (
          <div
            ref={(element) => { labelRefs.current[index] = element; }}
            key={service.className}
            className={`homeOpeningScene__label homeOpeningScene__label--${service.className}`}
          >
            <Link to={service.href} className="homeOpeningScene__labelLink">
              {service.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="homeOpeningScene__media" aria-label="Projets sélectionnés">
        {sceneMedia.map((item, index) => {
          const project = openingProjects[index];
          if (!project) return null;
          const projectName = item.alt?.split("|")[0].trim() ?? "sélectionné";

          return (
            <a
              ref={(element) => { projectRefs.current[index] = element; }}
              key={`${project.mediaId}-${index}`}
              className={`homeOpeningScene__project homeOpeningScene__project--${project.className}`}
              href={project.href}
              aria-label={`Voir le projet ${projectName}`}
            >
              <Media
                media={item}
                sizes={project.className === "web" ? "(min-width: 64rem) 28vw, 70vw" : "(min-width: 64rem) 12vw, 38vw"}
              />
            </a>
          );
        })}
      </div>

      <div ref={statementRef} className="homeOpeningScene__statement">
        {paragraphs.map((paragraph) => <p key={paragraph}>{renderInlineStrong(paragraph)}</p>)}
      </div>
    </div>
  );
}
