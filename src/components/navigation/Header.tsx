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

const getSurface = (element?: HTMLElement) =>
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
    const surfaces = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".sectionGroup__panel[data-panel-color], .section[data-color]",
      ),
    );
    const visible = new Set<HTMLElement>();

    const updateSurface = () => {
      const candidates = Array.from(visible);
      const visiblePanels = candidates.filter((element) =>
        element.matches(".sectionGroup__panel[data-panel-color]"),
      );
      const pool = visiblePanels.length ? visiblePanels : candidates;

      const active = pool.sort((a, b) => {
        const aTop = Math.abs(a.getBoundingClientRect().top);
        const bTop = Math.abs(b.getBoundingClientRect().top);
        return aTop - bTop;
      })[0];
      const color = getSurface(active);

      if (isHeaderSurface(color)) {
        setSurface(color);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            visible.add(element);
          } else {
            visible.delete(element);
          }
        });

        updateSurface();
      },
      {
        rootMargin: "-1px 0px -95% 0px",
        threshold: 0,
      },
    );

    surfaces.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
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
