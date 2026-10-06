import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { MotionValue } from "motion/react";

import { Media } from "@/components/content/Media";
import { resolveMediaList } from "@/data/resolveMedia";
import type { ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaItem[];
  scrollProgress?: MotionValue<number>;
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

export function HomeOpeningScene({ header, media, scrollProgress }: HomeOpeningSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const statementRef = useRef<HTMLDivElement>(null);

  const fallbackMedia = resolveMediaList(openingProjects.map(({ mediaId }) => mediaId));
  const sceneMedia = media.length >= openingProjects.length ? media.slice(0, openingProjects.length) : fallbackMedia;
  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 63.999rem)");

    const updateDesktop = (progress: number) => {
      const rise = range(progress, 0.34, 0.58);
      const mediaEntrance = [0, 0.035, 0.07, 0.105] as const;
      const mediaInitialOpacity = [0.32, 0.4, 0.3, 0.28] as const;
      const mediaStartY = [22, 18, 24, 28] as const;
      const mediaExitY = [-150, -190, -168, -210] as const;
      const labelExitY = [-72, -88, -80] as const;

      labelRefs.current.forEach((element, index) => {
        if (!element) return;
        const exit = range(progress, 0.38 + index * 0.018, 0.56 + index * 0.018);
        element.style.opacity = String(1 - exit);
        element.style.transform = `translate3d(0, ${lerp(0, labelExitY[index] ?? -80, rise)}px, 0)`;
      });

      projectRefs.current.forEach((element, index) => {
        if (!element) return;
        const enterStart = mediaEntrance[index] ?? 0;
        const enter = range(progress, enterStart, enterStart + 0.12);
        const exit = range(progress, 0.35 + index * 0.018, 0.57 + index * 0.018);
        const opacity = lerp(mediaInitialOpacity[index] ?? 0.3, 1, enter);
        const y = lerp(lerp(mediaStartY[index] ?? 22, 0, enter), mediaExitY[index] ?? -170, rise);
        element.style.opacity = String(opacity * (1 - exit));
        element.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      if (statementRef.current) {
        const reveal = range(progress, 0.38, 0.58);
        const fade = range(progress, 0.88, 0.98);
        statementRef.current.style.opacity = String(reveal * (1 - fade));
        statementRef.current.style.transform = `translate3d(0, ${lerp(52, 0, reveal)}px, 0)`;
      }
    };

    const updateCompact = (progress: number) => {
      /*
       * One compact choreography for tablet + mobile.
       * Every project travels upward continuously with scroll.
       * Labels keep their layout position and only fade.
       * The statement enters only after the visual layer has cleared.
       */
      const travel = range(progress, 0, 0.78);
      const travelDistance = window.innerHeight * 1.15;
      const projectFadeTracks = [
        { start: 0.42, end: 0.54 },
        { start: 0.50, end: 0.62 },
        { start: 0.58, end: 0.70 },
        { start: 0.66, end: 0.78 },
      ] as const;

      projectRefs.current.forEach((element, index) => {
        if (!element) return;
        const fadeTrack = projectFadeTracks[index] ?? projectFadeTracks[0];
        const fade = range(progress, fadeTrack.start, fadeTrack.end);

        element.style.opacity = String(1 - fade);
        element.style.transform = `translate3d(0, ${-travelDistance * travel}px, 0)`;
      });

      // Keep service labels anchored: they fade as the third image passes.
      const labelFade = range(progress, 0.54, 0.70);
      labelRefs.current.forEach((element) => {
        if (!element) return;
        element.style.opacity = String(1 - labelFade);
        element.style.transform = "none";
      });

      if (statementRef.current) {
        const reveal = range(progress, 0.79, 0.87);
        // Fade during the final part of the sticky travel, which is when
        // the following scroll panel starts rising into the viewport.
        const panelRise = range(progress, 0.92, 1);

        statementRef.current.style.opacity = String(reveal * (1 - panelRise));
        statementRef.current.style.transform = "translate(-50%, -50%)";
      }
    };

    const getCompactProgress = () => {
      const scene = sceneRef.current;
      const section = scene?.closest("#home-opening");
      if (!(section instanceof HTMLElement)) return 0;

      const viewport = window.innerHeight;
      const travel = Math.max(section.offsetHeight - viewport, 1);
      return clamp01(-section.getBoundingClientRect().top / travel);
    };

    let frame = 0;
    const resolveOpeningState = () => {
      frame = 0;

      if (!compact.matches) {
        const desktopDistance = Math.max(window.innerHeight * 2, 1);
        updateDesktop(clamp01(window.scrollY / desktopDistance));
        return;
      }

      updateCompact(getCompactProgress());
    };

    const scheduleResolve = () => {
      if (!frame) frame = window.requestAnimationFrame(resolveOpeningState);
    };

    scheduleResolve();
    const unsubscribeProgress = scrollProgress?.on("change", scheduleResolve);
    window.addEventListener("scroll", scheduleResolve, { passive: true });
    window.addEventListener("resize", scheduleResolve);
    compact.addEventListener("change", scheduleResolve);

    return () => {
      unsubscribeProgress?.();
      window.removeEventListener("scroll", scheduleResolve);
      window.removeEventListener("resize", scheduleResolve);
      compact.removeEventListener("change", scheduleResolve);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollProgress]);

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
