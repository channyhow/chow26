import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "motion/react";

import { Actions } from "@/components/navigation/Actions";
import { motionConfig, reducedRevealItem, reducedStaggerContainer, revealItem, revealContainer } from "@/motion/config";
import type { PanelBehavior, SectionBlock } from "@/types/content";

export type SiteFooterProps = { block: SectionBlock; panelBehavior?: PanelBehavior; };
const toArray = <T,>(value?: T | T[]): T[] => !value ? [] : Array.isArray(value) ? value : [value];
const SOCIAL_LABELS = new Set(["instagram", "linkedin", "facebook"]);
const LEGAL_HREFS = new Set(["/cgv", "/confidentialite", "/mentions-legales"]);

export function SiteFooter({ block, panelBehavior }: SiteFooterProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 94%", "end 24%"] });
  const y = useTransform(scrollYProgress, [0, 0.42, 1], reduceMotion ? ["0.5rem", "0rem", "-0.15rem"] : ["2rem", "0rem", "-0.65rem"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], reduceMotion ? [0.94, 1, 1] : [0.7, 1, 1]);
  const hasPanelMotion = panelBehavior === "cover" || panelBehavior === "stack";
  const motionStyle = hasPanelMotion ? ({ "--footer-motion-y": y, "--footer-motion-opacity": opacity } as unknown as MotionStyle) : undefined;
  const containerVariants = reduceMotion ? reducedStaggerContainer : revealContainer;
  const itemVariants = reduceMotion ? reducedRevealItem : revealItem;
  const header = block.content?.header;
  const eyebrows = toArray(header?.eyebrow).filter(Boolean);
  const links = header?.links ?? [];
  const meta = header?.meta ?? [];
  const usesGroups = links.some((link) => typeof link !== "string" && Boolean(link.group));
  const getGroup = (link: (typeof links)[number]) => typeof link === "string" ? undefined : link.group;
  const getLabel = (link: (typeof links)[number]) => typeof link === "string" ? "" : link.label;
  const getHref = (link: (typeof links)[number]) => typeof link === "string" ? "" : (link.href ?? "");

  const primaryLinks = usesGroups
    ? links.filter((link) => (getGroup(link) ?? "primary") === "primary")
    : links.filter((link) => !SOCIAL_LABELS.has(getLabel(link).trim().toLowerCase()) && !LEGAL_HREFS.has(getHref(link)));
  const socialLinks = usesGroups
    ? links.filter((link) => getGroup(link) === "social")
    : links.filter((link) => SOCIAL_LABELS.has(getLabel(link).trim().toLowerCase()));
  const legalLinks = usesGroups
    ? links.filter((link) => getGroup(link) === "legal")
    : links.filter((link) => LEGAL_HREFS.has(getHref(link)));

  return (
    <footer ref={ref} id={block.id} className="siteFooter" data-surface={block.surface} data-color={block.color} data-panel-motion={hasPanelMotion ? "true" : undefined} aria-label="Pied de page">
      <motion.div className="siteFooter__inner" style={motionStyle} variants={containerVariants} initial="hidden" whileInView="visible" viewport={motionConfig.viewport}>
        <motion.div className="siteFooter__main" variants={containerVariants}>
          <motion.div className="siteFooter__identity" variants={containerVariants}>
            {eyebrows[0] ? <motion.p className="siteFooter__name" variants={itemVariants}>{eyebrows[0]}</motion.p> : null}
            {eyebrows.length > 1 ? <motion.div className="siteFooter__baselines" variants={containerVariants}>{eyebrows.slice(1).map((eyebrow) => <motion.p key={eyebrow} className="siteFooter__baseline" variants={itemVariants}>{eyebrow}</motion.p>)}</motion.div> : null}
          </motion.div>

          {primaryLinks.length ? <motion.nav className="siteFooter__nav" aria-label="Navigation du pied de page" variants={containerVariants}><Actions links={primaryLinks} variant="nav" /></motion.nav> : null}
          {socialLinks.length ? <motion.nav className="siteFooter__social" aria-label="Réseaux sociaux" variants={itemVariants}><Actions links={socialLinks} variant="social" /></motion.nav> : null}
          {legalLinks.length ? <motion.nav className="siteFooter__legal" aria-label="Informations légales" variants={itemVariants}><Actions links={legalLinks} variant="nav" /></motion.nav> : null}
        </motion.div>

        {meta.length ? <motion.div className="siteFooter__meta" variants={containerVariants}>{meta.map((item) => <motion.span key={`${item.label}-${item.value ?? ""}`} variants={itemVariants}>{item.value ? `${item.label}: ${item.value}` : item.label}</motion.span>)}</motion.div> : null}
      </motion.div>
    </footer>
  );
}
