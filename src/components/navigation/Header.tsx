import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BurgerButton } from "@/components/navigation/BurgerButton";
import { resolveActions } from "@/data/actionRegistry";
import navigationData from "@/data/navigation.json";
import siteData from "@/data/site.json";
import type { ActionRef } from "@/types/content";

type HeaderNavigationMode = "drawer" | "inline";
type NavigationUiConfig = { navigation?: { desktop?: HeaderNavigationMode } };
type HeaderSurface = "primary" | "secondary" | "accent" | "special";

const normalizePath = (path: string) => path === "/" ? path : path.replace(/\/+$/, "");
const isHeaderSurface = (value?: string): value is HeaderSurface => value === "primary" || value === "secondary" || value === "accent" || value === "special";
const getSurface = (element?: HTMLElement | null) => element?.dataset.panelColor ?? element?.dataset.color;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smoothstep = (value: number) => value * value * (3 - 2 * value);

export function Header() {
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);
  const items = resolveActions(navigationData.primary as ActionRef[]);
  const home = items.find((item) => item.href === "/");
  const primaryItems = items.filter((item) => item.href !== "/" && item.href !== "/link");
  const navigationMode = (siteData.ui as typeof siteData.ui & NavigationUiConfig).navigation?.desktop ?? "drawer";
  const submenus: Record<string, { label: string; href: string }[]> = {
    "/studio": [
      { label: "Identité visuelle", href: "/studio#studio-service-identity" },
      { label: "Site web", href: "/studio#studio-service-website" },
      { label: "Supports de communication", href: "/studio#studio-service-integrations" },
    ],
    "/contact": [
      { label: "Parler d’un projet", href: "/contact" },
      { label: "À propos", href: "/contact#studio-founders" },
    ],
  };
  const [surface, setSurface] = useState<HeaderSurface>("secondary");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpenSubmenu(null); }, [pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenSubmenu(null);
        (document.activeElement as HTMLElement | null)?.blur();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    let frame = 0;
    const resolveHeaderState = () => {
      frame = 0;
      const header = headerRef.current;
      const logo = logoRef.current;
      const nav = navRef.current;
      const menuSlot = menuSlotRef.current;
      if (!header || !logo) return;

      const sampleX = Math.round(window.innerWidth / 2);
      const sampleY = 32;
      const layers = document.elementsFromPoint(sampleX, sampleY);
      let nextSurface: HeaderSurface = "secondary";
      for (const layer of layers) {
        const element = (layer as HTMLElement).closest<HTMLElement>(".sectionGroup__panel[data-panel-color], .section[data-color]");
        const color = getSurface(element);
        if (isHeaderSurface(color)) { nextSurface = color; break; }
      }
      setSurface((current) => current === nextSurface ? current : nextSurface);

      const splitDistance = Math.max(window.innerHeight * 0.8, 1);
      const rawProgress = clamp01(window.scrollY / splitDistance);
      const progress = smoothstep(rawProgress);
      const desktop = window.matchMedia("(min-width: 64rem)").matches;
      const viewportWidth = window.innerWidth;
      const gutter = Number.parseFloat(window.getComputedStyle(header).paddingLeft) || 0;
      const logoWidth = logo.getBoundingClientRect().width;
      if (desktop && nav) {
        const navWidth = nav.getBoundingClientRect().width;
        const groupGap = 24;
        const groupWidth = logoWidth + groupGap + navWidth;
        const logoStart = -(groupWidth / 2) + (logoWidth / 2);
        const navStart = (groupWidth / 2) - (navWidth / 2);
        const logoEnd = -(viewportWidth / 2) + gutter + (logoWidth / 2);
        const navEnd = (viewportWidth / 2) - gutter - (navWidth / 2);
        header.style.setProperty("--header-logo-x", `${lerp(logoStart, logoEnd, progress)}px`);
        header.style.setProperty("--header-nav-x", `${lerp(navStart, navEnd, progress)}px`);
        header.style.setProperty("--header-menu-x", "0px");
        header.style.setProperty("--header-menu-opacity", "0");
      } else if (menuSlot) {
        const menuWidth = menuSlot.getBoundingClientRect().width;
        const logoEnd = -(viewportWidth / 2) + gutter + (logoWidth / 2);
        const menuEnd = (viewportWidth / 2) - gutter - (menuWidth / 2);
        const menuOpacity = clamp01((rawProgress - 0.08) / 0.32);
        header.style.setProperty("--header-logo-x", `${lerp(0, logoEnd, progress)}px`);
        header.style.setProperty("--header-nav-x", "0px");
        header.style.setProperty("--header-menu-x", `${lerp(0, menuEnd, progress)}px`);
        header.style.setProperty("--header-menu-opacity", String(menuOpacity));
        menuSlot.inert = menuOpacity < 0.6;
      }
    };
    const scheduleResolve = () => { if (!frame) frame = window.requestAnimationFrame(resolveHeaderState); };
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
    <header ref={headerRef} className="header" data-navigation={navigationMode} data-over-color={surface}>
      <Link ref={logoRef} className="header__logo" to={home?.href ?? "/"} viewTransition aria-label={`${siteData.site.name} | ${home?.label ?? siteData.site.name}`} aria-current={currentPath === "/" ? "page" : undefined}>{siteData.site.name}</Link>
      <nav ref={navRef} className="header__nav" aria-label={siteData.ui.copy.navigation.mainLabel}>
        {primaryItems.map((item) => {
          if (!item.href) return null;
          const submenu = submenus[item.href];
          return (
            <div key={`${item.label}-${item.href}`} className="header__navItem" data-open={openSubmenu === item.href}>
              <Link to={item.href} viewTransition data-nav-variant={item.variant} aria-current={currentPath === normalizePath(item.href) ? "page" : undefined} onClick={() => setOpenSubmenu(null)}>
                <span>{item.href === "/contact" ? "Contact" : item.label}</span>
              </Link>
              {submenu ? (
                <>
                  <button type="button" className="header__submenuToggle" aria-label={`Afficher les liens ${item.href === "/studio" ? "Studio" : "Contact"}`} aria-expanded={openSubmenu === item.href} aria-controls={`header-submenu-${item.href.slice(1)}`} onClick={() => setOpenSubmenu(current => current === item.href ? null : item.href)}>
                    <span aria-hidden="true">⌄</span>
                  </button>
                  <div id={`header-submenu-${item.href.slice(1)}`} className="header__submenu">
                    {submenu.map(link => <Link key={link.href} to={link.href} onClick={() => setOpenSubmenu(null)}>{link.label}</Link>)}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </nav>
      <div ref={menuSlotRef} className="header__menuSlot"><BurgerButton /></div>
    </header>
  );
}
