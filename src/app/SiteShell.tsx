import type { CSSProperties, ReactNode } from "react";

import { Drawer } from "@/components/navigation/Drawer";
import { Header } from "@/components/navigation/Header";
import { ScrollProgress, type ScrollProgressMode } from "@/components/navigation/ScrollProgress";
import siteData from "@/data/site.json";
import { selectDrawerView, selectOverlayOpen, useUIStore } from "@/state/uiStore";
import type { StyleVariant, Tone } from "@/types/content";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

const fontStack = (family: string, fallback: "serif" | "sans-serif") =>
  `"${family}", ${fallback === "serif" ? "Georgia, 'Times New Roman', serif" : "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}`;

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
    "--font-heading-classic": fontStack(fonts.classicHeading, "serif"),
    "--font-heading-editorial": fontStack(fonts.editorialHeading, "serif"),
    "--font-heading-organic": fontStack(fonts.organicHeading, "serif"),
    "--font-body-project": fontStack(fonts.body, "sans-serif"),
    "--font-heading": fontStack(headingFont, "serif"),
    "--font-body": fontStack(fonts.body, "sans-serif"),
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
