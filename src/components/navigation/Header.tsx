import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { BurgerButton } from "@/components/navigation/BurgerButton";
import navigationData from "@/data/navigation.json";
import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";

type HeaderNavigationMode = "drawer" | "inline";
type NavigationUiConfig = { navigation?: { desktop?: HeaderNavigationMode } };
type HeaderNavItem = {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  variant?: "cta";
};

type HeaderSurface = "primary" | "secondary" | "accent" | "special";
type HeaderNavPlacement = "center" | "end";
type OpeningState = "intro" | "settled";

const normalizePath = (path: string) =>
  path === "/" ? path : path.replace(/\/+$/, "");

const isHeaderSurface = (value?: string): value is HeaderSurface =>
  value === "primary" ||
  value === "secondary" ||
  value === "accent" ||
  value === "special";

const getSurface = (element?: HTMLElement | null) =>
  element?.dataset.panelColor ?? element?.dataset.color;

const getDocumentOffsetTop = (element: HTMLElement) => {
  let top = 0;
  let current: HTMLElement | null = element;

  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return top;
};

export function Header() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const currentPath = normalizePath(pathname);
  const items = navigationData.primary as HeaderNavItem[];
  const home = items.find((item) => item.id === "home");
  const primaryItems = items.filter((item) => item.enabled && item.id !== "home");
  const navigationMode = (siteData.ui as typeof siteData.ui & NavigationUiConfig).navigation?.desktop ?? "drawer";
  const [surface, setSurface] = useState<HeaderSurface>("secondary");
  const [navPlacement, setNavPlacement] = useState<HeaderNavPlacement>(currentPath === "/" ? "center" : "end");
  const [openingState, setOpeningState] = useState<OpeningState>(currentPath === "/" ? "intro" : "settled");

  useEffect(() => {
    let frame = 0;

    const resolveHeaderState = () => {
      frame = 0;

      const sampleX = Math.round(window.innerWidth / 2);
      const sampleY = 32;
      const layers = document.elementsFromPoint(sampleX, sampleY);

      for (const layer of layers) {
        const element = (layer as HTMLElement).closest<HTMLElement>(
          ".sectionGroup__panel[data-panel-color], .section[data-color]",
        );
        const color = getSurface(element);

        if (isHeaderSurface(color)) {
          setSurface((current) => (current === color ? current : color));
          break;
        }
      }

      if (!layers.some((layer) => {
        const element = (layer as HTMLElement).closest<HTMLElement>(
          ".sectionGroup__panel[data-panel-color], .section[data-color]",
        );
        return isHeaderSurface(getSurface(element));
      })) {
        setSurface((current) => (current === "secondary" ? current : "secondary"));
      }

      if (currentPath !== "/") {
        setNavPlacement((current) => (current === "end" ? current : "end"));
        setOpeningState((current) => (current === "settled" ? current : "settled"));
        return;
      }

      const openingPanel = document.querySelector<HTMLElement>(
        '.sectionGroup[data-layout="scroll-panel"] > .sectionGroup__panel:first-child',
      );
      const openingHeight = Math.max(openingPanel?.offsetHeight ?? window.innerHeight, 1);
      const openingTop = openingPanel ? getDocumentOffsetTop(openingPanel) : 0;
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - openingTop) / openingHeight),
      );
      const introActive = progress < 0.8;
      const nextPlacement: HeaderNavPlacement = introActive ? "center" : "end";
      const nextOpeningState: OpeningState = introActive ? "intro" : "settled";

      setNavPlacement((current) => (current === nextPlacement ? current : nextPlacement));
      setOpeningState((current) => (current === nextOpeningState ? current : nextOpeningState));
    };

    const scheduleResolve = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(resolveHeaderState);
    };

    scheduleResolve();
    window.addEventListener("scroll", scheduleResolve, { passive: true });
    window.addEventListener("resize", scheduleResolve);

    return () => {
      window.removeEventListener("scroll", scheduleResolve);
      window.removeEventListener("resize", scheduleResolve);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [currentPath]);

  return (
    <header
      className="header"
      data-navigation={navigationMode}
      data-over-color={surface}
      data-opening-state={openingState}
    >
      <Link
        className="header__logo"
        to={home?.href ?? "/"}
        aria-label={`${siteData.site.name} | ${home?.label ?? siteData.site.name}`}
        aria-current={currentPath === "/" ? "page" : undefined}
      >
        {siteData.site.name}
      </Link>

      <motion.nav
        className="header__nav"
        aria-label={siteData.ui.copy.navigation.mainLabel}
        data-placement={navPlacement}
        layout="position"
        transition={{
          layout: {
            duration: reduceMotion ? motionConfig.reduced.duration : 0.55,
            ease: motionConfig.easing.soft,
          },
        }}
      >
        {primaryItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            data-nav-variant={item.variant}
            aria-current={currentPath === normalizePath(item.href) ? "page" : undefined}
          >
            <span>{item.label}</span>
            {item.variant === "cta" ? <span aria-hidden="true">→</span> : null}
          </Link>
        ))}
      </motion.nav>

      <BurgerButton />
    </header>
  );
}
