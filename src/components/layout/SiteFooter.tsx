import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { Link } from "react-router-dom";

import { Actions } from "@/components/navigation/Actions";
import {
  motionConfig,
  reducedRevealItem,
  reducedStaggerContainer,
  revealItem,
  revealContainer,
} from "@/motion/config";
import type { LinkItem, PanelBehavior, SectionBlock } from "@/types/content";

export type SiteFooterProps = {
  block: SectionBlock;
  panelBehavior?: PanelBehavior;
};

const toArray = <T,>(value?: T | T[]): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

function FooterLink({ link }: { link: LinkItem }) {
  const href = link.href ?? "#";
  const external = /^https?:\/\//.test(href);
  const content = (
    <>
      {link.label}
      {link.icon ? <span aria-hidden="true">{link.icon}</span> : null}
    </>
  );

  if (external) {
    return (
      <a
        className="actions__link"
        href={href}
        target={link.target ?? "_blank"}
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className="actions__link" to={href} viewTransition>
      {content}
    </Link>
  );
}

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
  const containerVariants = reduceMotion ? reducedStaggerContainer : revealContainer;
  const itemVariants = reduceMotion ? reducedRevealItem : revealItem;

  const header = block.content?.header;
  const eyebrows = toArray(header?.eyebrow).filter(Boolean);
  const links = header?.links ?? [];
  const meta = header?.meta ?? [];

  const primaryLinks = links.slice(0, 4);
  const secondaryLinks = links.slice(4);
  const socialLinks = secondaryLinks.slice(0, 2);
  const legalLinks = secondaryLinks.slice(2);

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
      <motion.div
        className="siteFooter__inner"
        style={motionStyle}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={motionConfig.viewport}
      >
        <motion.div className="siteFooter__main" variants={containerVariants}>
          <motion.div className="siteFooter__identity" variants={containerVariants}>
            {eyebrows[0] ? (
              <motion.p className="siteFooter__name" variants={itemVariants}>
                {eyebrows[0]}
              </motion.p>
            ) : null}

            {eyebrows.length > 1 ? (
              <motion.div className="siteFooter__baselines" variants={containerVariants}>
                {eyebrows.slice(1).map((eyebrow) => (
                  <motion.p
                    key={eyebrow}
                    className="siteFooter__baseline"
                    variants={itemVariants}
                  >
                    {eyebrow}
                  </motion.p>
                ))}
              </motion.div>
            ) : null}
          </motion.div>

          <motion.div className="siteFooter__links" variants={containerVariants}>
            {primaryLinks.length ? (
              <motion.nav
                className="siteFooter__nav"
                aria-label="Navigation du pied de page"
                variants={containerVariants}
              >
                <div className="siteFooter__navGroup actions">
                  {primaryLinks.map((link) => (
                    <motion.div key={`${link.label}-${link.href}`} variants={itemVariants}>
                      <FooterLink link={link} />
                    </motion.div>
                  ))}
                </div>
              </motion.nav>
            ) : null}

            {secondaryLinks.length ? (
              <motion.nav
                className="siteFooter__support"
                aria-label="Réseaux et informations"
                variants={containerVariants}
              >
                {socialLinks.length ? (
                  <motion.div className="siteFooter__social" variants={itemVariants}>
                    <Actions links={socialLinks} className="siteFooter__navGroup" />
                  </motion.div>
                ) : null}
                {legalLinks.length ? (
                  <motion.div className="siteFooter__legal" variants={itemVariants}>
                    <Actions links={legalLinks} className="siteFooter__navGroup" />
                  </motion.div>
                ) : null}
              </motion.nav>
            ) : null}
          </motion.div>
        </motion.div>

        {meta.length ? (
          <motion.div className="siteFooter__meta" variants={containerVariants}>
            {meta.map((item) => (
              <motion.span
                key={`${item.label}-${item.value ?? ""}`}
                variants={itemVariants}
              >
                {item.value ? `${item.label}: ${item.value}` : item.label}
              </motion.span>
            ))}
          </motion.div>
        ) : null}
      </motion.div>
    </footer>
  );
}
