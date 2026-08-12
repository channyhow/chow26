import type { CSSProperties, ReactNode } from "react";

import { Drawer } from "@/components/navigation/Drawer";
import { Header } from "@/components/navigation/Header";
import { ScrollProgress, type ScrollProgressMode } from "@/components/navigation/ScrollProgress";
import siteData from "@/data/site.json";
import { selectDrawerView, selectOverlayOpen, useUIStore } from "@/state/uiStore";
import type { StyleVariant, Tone } from "@/types/content";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

export function SiteShell({ children }: { children: ReactNode }) {
  const drawer = useUIStore(selectDrawerView);
  const overlayOpen = useUIStore(selectOverlayOpen);
  const scrollProgress = siteData.ui.experience.scrollProgress as ScrollProgressMode | false;
  const { colors, fonts } = siteData.theme;
  const headingFont =
    siteData.theme.variant === "editorial"
      ? fonts.editorialHeading
      : siteData.theme.variant === "organic"
        ? fonts.organicHeading
        : fonts.classicHeading;
  const tone = siteData.theme.tone as Tone;
  const foreground = tone === "inverse" ? colors.secondary : colors.primary;
  const background =
    tone === "inverse" ? colors.primary : tone === "accent" ? colors.accent : colors.secondary;

  const themeStyle: ThemeStyle = {
    "--theme-primary": colors.primary,
    "--theme-secondary": colors.secondary,
    "--theme-special": colors.special,
    "--theme-accent": colors.accent,
    "--primary": foreground,
    "--secondary": background,
    "--accent": colors.accent,
    "--font-heading-classic": `"${fonts.classicHeading}"`,
    "--font-heading-editorial": `"${fonts.editorialHeading}"`,
    "--font-heading-organic": `"${fonts.organicHeading}"`,
    "--font-body-project": `"${fonts.body}"`,
    "--font-heading": `"${headingFont}"`,
    "--font-body": `"${fonts.body}"`,
  };

  return (
    <div
      className="site"
      data-variant={siteData.theme.variant as StyleVariant}
      data-tone={tone}
      data-drawer={drawer ?? "closed"}
      data-overlay={overlayOpen ? "open" : "closed"}
      style={themeStyle}
    >
      <a className="skipLink" href="#main-content">
        Aller au contenu principal
      </a>
      <ScrollProgress mode={scrollProgress} />
      <Header />
      <main id="main-content" className="site__canvas" tabIndex={-1}>
        {children}
      </main>
      <Drawer />
    </div>
  );
}
