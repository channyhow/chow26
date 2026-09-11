import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "motion/react";

import { Actions } from "@/components/navigation/Actions";
import type { PanelBehavior, SectionBlock } from "@/types/content";

export type SiteFooterProps = {
  block: SectionBlock;
  panelBehavior?: PanelBehavior;
};

const toArray = <T,>(value?: T | T[]): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export function SiteFooter({ block, panelBehavior }: SiteFooterProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 94%", "end 24%"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 0.42, 1],
    reduceMotion ? ["0.5rem", "0rem", "-0.15rem"] : ["2rem", "0rem", "-0.65rem"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    reduceMotion ? [0.94, 1, 1] : [0.7, 1, 1],
  );
  const hasPanelMotion = panelBehavior === "cover" || panelBehavior === "stack";
  const motionStyle = hasPanelMotion
    ? ({
        "--footer-motion-y": y,
        "--footer-motion-opacity": opacity,
      } as unknown as MotionStyle)
    : undefined;

  const header = block.content?.header;
  const eyebrows = toArray(header?.eyebrow).filter(Boolean);
  const links = header?.links ?? [];
  const meta = header?.meta ?? [];

  const primaryLinks = links.slice(0, 4);
  const secondaryLinks = links.slice(4);

  return (
    <footer
      ref={ref}
      id={block.id}
      className="siteFooter"
      data-surface={block.surface}
      data-color={block.color}
      data-panel-motion={hasPanelMotion ? "true" : undefined}
      aria-label="Pied de page"
    >
      <motion.div className="siteFooter__inner" style={motionStyle}>
        <div className="siteFooter__main">
          <div className="siteFooter__identity">
            {eyebrows[0] ? (
              <p className="siteFooter__name">{eyebrows[0]}</p>
            ) : null}

            {eyebrows.length > 1 ? (
              <div className="siteFooter__baselines">
                {eyebrows.slice(1).map((eyebrow) => (
                  <p key={eyebrow} className="siteFooter__baseline">
                    {eyebrow}
                  </p>
                ))}
              </div>
            ) : null}
          </div>

          <div className="siteFooter__links">
            {primaryLinks.length ? (
              <nav
                className="siteFooter__nav"
                aria-label="Navigation du pied de page"
              >
                <Actions links={primaryLinks} className="siteFooter__navGroup" />
              </nav>
            ) : null}

            {secondaryLinks.length ? (
              <nav
                className="siteFooter__support"
                aria-label="Réseaux et informations"
              >
                <Actions links={secondaryLinks} className="siteFooter__navGroup" />
              </nav>
            ) : null}
          </div>
        </div>

        {meta.length ? (
          <div className="siteFooter__meta">
            {meta.map((item) => (
              <span key={`${item.label}-${item.value ?? ""}`}>
                {item.value ? `${item.label}: ${item.value}` : item.label}
              </span>
            ))}
          </div>
        ) : null}
      </motion.div>
    </footer>
  );
}
