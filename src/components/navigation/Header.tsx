import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BurgerButton } from "@/components/navigation/BurgerButton";
import navigationData from "@/data/navigation.json";
import siteData from "@/data/site.json";

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

const normalizePath = (path: string) =>
  path === "/" ? path : path.replace(/\/+$/, "");

const isHeaderSurface = (value?: string): value is HeaderSurface =>
  value === "primary" ||
  value === "secondary" ||
  value === "accent" ||
  value === "special";

const getSurface = (element?: HTMLElement | null) =>
  element?.dataset.panelColor ?? element?.dataset.color;

export function Header() {
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);
  const items = navigationData.primary as HeaderNavItem[];
  const home = items.find((item) => item.id === "home");
  const primaryItems = items.filter((item) => item.enabled && item.id !== "home");
  const navigationMode = (siteData.ui as typeof siteData.ui & NavigationUiConfig).navigation?.desktop ?? "drawer";
  const [surface, setSurface] = useState<HeaderSurface>("secondary");

  useEffect(() => {
    let frame = 0;

    const resolveSurface = () => {
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
          return;
        }
      }
    };

    const scheduleResolve = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(resolveSurface);
    };

    scheduleResolve();
    window.addEventListener("scroll", scheduleResolve, { passive: true });
    window.addEventListener("resize", scheduleResolve);

    return () => {
      window.removeEventListener("scroll", scheduleResolve);
      window.removeEventListener("resize", scheduleResolve);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header
      className="header"
      data-navigation={navigationMode}
      data-over-color={surface}
    >
      <Link
        className="header__logo"
        to={home?.href ?? "/"}
        aria-label={`${siteData.site.name} | ${home?.label ?? siteData.site.name}`}
        aria-current={currentPath === "/" ? "page" : undefined}
      >
        {siteData.site.name}
      </Link>

      <nav className="header__nav" aria-label={siteData.ui.copy.navigation.mainLabel}>
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
      </nav>

      <BurgerButton />
    </header>
  );
}
