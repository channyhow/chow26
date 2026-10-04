import { motion, useReducedMotion } from "motion/react";

import { Actions } from "@/components/navigation/Actions";
import { resolveActions } from "@/data/actionRegistry";
import { motionConfig, reducedRevealItem, reducedStaggerContainer, revealItem, revealContainer } from "@/motion/config";
import type { SectionBlock } from "@/types/content";

export type SiteFooterProps = { block: SectionBlock };
const toArray = <T,>(value?: T | T[]): T[] => !value ? [] : Array.isArray(value) ? value : [value];
const SOCIAL_LABELS = new Set(["instagram", "linkedin", "facebook"]);
const LEGAL_HREFS = new Set(["/cgv", "/confidentialite", "/mentions-legales"]);

export function SiteFooter({ block }: SiteFooterProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const containerVariants = reduceMotion ? reducedStaggerContainer : revealContainer;
  const itemVariants = reduceMotion ? reducedRevealItem : revealItem;
  const header = block.content?.header;
  const eyebrows = toArray(header?.eyebrow).filter(Boolean);
  const links = resolveActions(header?.links ?? []);
  const meta = header?.meta ?? [];
  const usesGroups = links.some((link) => Boolean(link.group));

  const primaryLinks = usesGroups
    ? links.filter((link) => (link.group ?? "primary") === "primary")
    : links.filter((link) => !SOCIAL_LABELS.has(link.label.trim().toLowerCase()) && !LEGAL_HREFS.has(link.href ?? ""));
  const socialLinks = usesGroups
    ? links.filter((link) => link.group === "social")
    : links.filter((link) => SOCIAL_LABELS.has(link.label.trim().toLowerCase()));
  const legalLinks = usesGroups
    ? links.filter((link) => link.group === "legal")
    : links.filter((link) => LEGAL_HREFS.has(link.href ?? ""));

  return (
    <footer id={block.id} className="siteFooter" data-surface={block.surface} data-color={block.color} aria-label="Pied de page">
      <motion.div className="siteFooter__inner" variants={containerVariants} initial="hidden" whileInView="visible" viewport={motionConfig.viewport}>
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
