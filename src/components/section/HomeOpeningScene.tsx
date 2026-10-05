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

const renderInlineStrong = (value: string): ReactNode[] => value
  .split(/(\*\*[^*]+\*\*)/g)
  .filter(Boolean)
  .map((part, index) => {
    const strong = part.startsWith("**") && part.endsWith("**");
    const text = strong ? part.slice(2, -2) : part;
    return strong ? <strong key={`${text}-${index}`}>{text}</strong> : <span key={`${text}-${index}`}>{text}</span>;
  });

export function HomeOpeningScene({ header, media }: HomeOpeningSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const statementRef = useRef<HTMLDivElement>(null);

  const fallbackMedia = resolveMediaList(openingProjects.map(({ mediaId }) => mediaId));
  const sceneMedia = media.length >= openingProjects.length ? media.slice(0, openingProjects.length) : fallbackMedia;
  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  useEffect(() => {
    const mediaExitY = [-150, -190, -168, -210] as const;
    const labelExitY = [-72, -88, -80] as const;

    const update = (rawProgress: number) => {
      const progress = clamp01(rawProgress);
      const isMobile = window.matchMedia("(max-width: 48rem)").matches;
      const rise = range(progress, 0.34, 0.58);

      labelRefs.current.forEach((element, index) => {
        if (!element) return;
        const exit = range(progress, 0.38 + index * 0.018, 0.56 + index * 0.018);
        element.style.opacity = String(1 - exit);
        element.style.transform = `translate3d(0, ${lerp(0, labelExitY[index] ?? -80, rise)}px, 0)`;
      });

      projectRefs.current.forEach((element, index) => {
        if (!element) return;

        // Mobile opens exactly like the artboard: Kuro + Mois du Kèr are already
        // present around the fixed service labels. The lower pair enters only as
        // the first pair starts travelling through the viewport.
        const enterStart = isMobile
          ? ([0, 0, 0.14, 0.2] as const)[index] ?? 0
          : ([0, 0.035, 0.07, 0.105] as const)[index] ?? 0;
        const initialOpacity = isMobile
          ? (index < 2 ? 1 : 0)
          : ([0.32, 0.4, 0.3, 0.28] as const)[index] ?? 0.3;
        const startY = isMobile
          ? ([0, 0, 34, 42] as const)[index] ?? 0
          : ([22, 18, 24, 28] as const)[index] ?? 22;
        const enter = range(progress, enterStart, enterStart + (isMobile ? 0.1 : 0.12));
        const exit = range(progress, 0.35 + index * 0.018, 0.57 + index * 0.018);
        const targetOpacity = index < 2 || !isMobile ? 1 : 1;
        const visibleOpacity = lerp(initialOpacity, targetOpacity, enter);
        const y = lerp(lerp(startY, 0, enter), mediaExitY[index] ?? -170, rise);

        element.style.opacity = String(visibleOpacity * (1 - exit));
        element.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      const statement = statementRef.current;
      if (statement) {
        const reveal = range(progress, 0.38, 0.58);
        const fade = range(progress, 0.88, 0.98);
        statement.style.opacity = String(reveal * (1 - fade));
        statement.style.transform = `translate3d(0, ${lerp(52, 0, reveal)}px, 0)`;
      }
    };

    let frame = 0;
    const resolveOpeningState = () => {
      frame = 0;
      const scene = sceneRef.current;
      const panel = scene?.closest<HTMLElement>("[data-panel-behavior]") ?? scene?.parentElement;
      if (!panel) {
        update(0);
        return;
      }

      const rect = panel.getBoundingClientRect();
      const travel = Math.max(panel.scrollHeight - window.innerHeight, window.innerHeight * 2, 1);
      update(-rect.top / travel);
    };
    const scheduleResolve = () => {
      if (!frame) frame = window.requestAnimationFrame(resolveOpeningState);
    };

    // Establish the visible opening immediately rather than waiting for the
    // first scroll event. This also prevents a blank first paint after reload.
    update(0);
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
    <div ref={sceneRef} className="homeOpeningScene">
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
