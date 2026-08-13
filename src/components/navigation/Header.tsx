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

export function Header() {
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);
  const items = navigationData.primary as HeaderNavItem[];
  const home = items.find((item) => item.id === "home");
  const primaryItems = items.filter((item) => item.enabled && item.id !== "home");
  const navigationMode = (siteData.ui as typeof siteData.ui & NavigationUiConfig).navigation?.desktop ?? "drawer";
  const [surface, setSurface] = useState<HeaderSurface>("secondary");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".section[data-color]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.isIntersecting);
        const color = (active?.target as HTMLElement | undefined)?.dataset.color;

        if (
          color === "primary" ||
          color === "secondary" ||
          color === "accent" ||
          color === "special"
        ) {
          setSurface(color);
        }
      },
      {
        rootMargin: "-1px 0px -95% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
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
