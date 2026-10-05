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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 47.999rem)");

    const resetInlineStyles = () => {
      [...labelRefs.current, ...projectRefs.current, statementRef.current].forEach((element) => {
        if (!element) return;
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });
    };

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

    const updateMobile = (progress: number) => {
      const viewport = window.innerHeight;
      const toPx = (svh: number) => svh * viewport / 100;

      /* One shared scroll field, four authored trajectories. The media keeps
         travelling through the composition rather than starting/stopping as
         separate parallax objects. Small x drift and restrained scale changes
         create depth while the labels remain the visual anchor. */
      const tracks = [
        { start: 0.06, end: 0.88, y: -190, x: 5, scaleFrom: 0.99, scaleTo: 1.015, fadeStart: 0.82, fadeEnd: 0.96 },
        { start: 0.00, end: 0.82, y: -174, x: -7, scaleFrom: 1.00, scaleTo: 0.975, fadeStart: 0.78, fadeEnd: 0.94 },
        { start: 0.10, end: 0.90, y: -208, x: 8, scaleFrom: 0.985, scaleTo: 1.01, fadeStart: 0.84, fadeEnd: 0.97 },
        { start: 0.08, end: 0.92, y: -194, x: -5, scaleFrom: 0.995, scaleTo: 1.02, fadeStart: 0.86, fadeEnd: 0.98 },
      ] as const;

      projectRefs.current.forEach((element, index) => {
        if (!element) return;
        const track = tracks[index] ?? tracks[0];
        const travel = range(progress, track.start, track.end);
        const disperse = range(progress, 0.72, 0.94);
        const fade = range(progress, track.fadeStart, track.fadeEnd);
        const x = lerp(0, toPx(track.x), travel) + lerp(0, toPx(track.x * 0.35), disperse);
        const y = lerp(0, toPx(track.y), travel) + lerp(0, toPx(-8 - index * 2), disperse);
        const scale = lerp(track.scaleFrom, track.scaleTo, travel);

        element.style.opacity = String(1 - fade);
        element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      });

      const release = range(progress, 0.70, 0.86);
      const labelFade = range(progress, 0.84, 0.92);
      labelRefs.current.forEach((element) => {
        if (!element) return;
        element.style.opacity = String(1 - labelFade);
        element.style.transform = `translate3d(0, ${lerp(0, -30, release)}svh, 0)`;
      });

      if (statementRef.current) {
        const reveal = range(progress, 0.72, 0.86);
        const pull = range(progress, 0.72, 0.94);
        statementRef.current.style.opacity = String(reveal);
        statementRef.current.style.transform = `translate3d(0, ${lerp(36, -8, pull)}svh, 0)`;
      }
    };

    /* SectionGroup's MotionValue is measured from `start end` to `end start`.
       The opening panel is taller than the viewport, so its visual frame-zero
       is NOT MotionValue zero. Normalise the interval where the panel itself
       occupies the viewport: top/top => 0, bottom/bottom => 1. This avoids the
       old global-scroll calculation being corrupted by the sticky panel. */
    const getMobileProgress = () => {
      if (!scrollProgress) return 0;
      const scene = sceneRef.current;
      const section = scene?.closest("#home-opening");
      const panel = scene?.closest(".sectionGroup__panel");
      const contentHeight = Math.max(
        section instanceof HTMLElement ? section.offsetHeight : 0,
        panel instanceof HTMLElement ? panel.offsetHeight : 0,
        window.innerHeight,
      );
      const viewport = window.innerHeight;
      const total = contentHeight + viewport;
      const start = viewport / total;
      const end = contentHeight / total;
      return clamp01((scrollProgress.get() - start) / Math.max(end - start, 0.001));
    };

    let frame = 0;
    const resolveOpeningState = () => {
      frame = 0;
      if (reducedMotion.matches) {
        resetInlineStyles();
        return;
      }

      if (!mobile.matches) {
        const desktopDistance = Math.max(window.innerHeight * 2, 1);
        updateDesktop(clamp01(window.scrollY / desktopDistance));
        return;
      }

      updateMobile(getMobileProgress());
    };

    const scheduleResolve = () => {
      if (!frame) frame = window.requestAnimationFrame(resolveOpeningState);
    };

    scheduleResolve();
    const unsubscribeProgress = scrollProgress?.on("change", scheduleResolve);
    window.addEventListener("scroll", scheduleResolve, { passive: true });
    window.addEventListener("resize", scheduleResolve);
    mobile.addEventListener("change", scheduleResolve);
    reducedMotion.addEventListener("change", scheduleResolve);

    return () => {
      unsubscribeProgress?.();
      window.removeEventListener("scroll", scheduleResolve);
      window.removeEventListener("resize", scheduleResolve);
      mobile.removeEventListener("change", scheduleResolve);
      reducedMotion.removeEventListener("change", scheduleResolve);
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
