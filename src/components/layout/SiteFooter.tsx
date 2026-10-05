import { motion } from "motion/react";

import { Actions } from "@/components/navigation/Actions";
import { resolveActions } from "@/data/actionRegistry";
import { motionConfig, revealItem, revealContainer } from "@/motion/config";
import type { SectionBlock } from "@/types/content";

export type SiteFooterProps = { block: SectionBlock };
const toArray = <T,>(value?: T | T[]): T[] => !value ? [] : Array.isArray(value) ? value : [value];
const SOCIAL_LABELS = new Set(["instagram", "linkedin", "facebook"]);
const LEGAL_HREFS = new Set(["/cgv", "/confidentialite", "/mentions-legales"]);

export function SiteFooter({ block }: SiteFooterProps) {
  const header = block.content?.header;
  const eyebrows = toArray(header?.eyebrow).filter(Boolean);
  const links = resolveActions(header?.links ?? []);
  const meta = header?.meta ?? [];
  const usesGroups = links.some((link) => Boolean(link.group));
  const primaryLinks = usesGroups ? links.filter((link) => (link.group ?? "primary") === "primary") : links.filter((link) => !SOCIAL_LABELS.has(link.label.trim().toLowerCase()) && !LEGAL_HREFS.has(link.href ?? ""));
  const socialLinks = usesGroups ? links.filter((link) => link.group === "social") : links.filter((link) => SOCIAL_LABELS.has(link.label.trim().toLowerCase()));
  const legalLinks = usesGroups ? links.filter((link) => link.group === "legal") : links.filter((link) => LEGAL_HREFS.has(link.href ?? ""));

  return <footer id={block.id} className="siteFooter" data-surface={block.surface} data-color={block.color} aria-label="Pied de page">
    <motion.div className="siteFooter__inner" variants={revealContainer} initial="hidden" whileInView="visible" viewport={motionConfig.viewport}>
      <motion.div className="siteFooter__main" variants={revealContainer}>
        <motion.div className="siteFooter__identity" variants={revealContainer}>
          {eyebrows[0] ? <motion.p className="siteFooter__name" variants={revealItem}>{eyebrows[0]}</motion.p> : null}
          {eyebrows.length > 1 ? <motion.div className="siteFooter__baselines" variants={revealContainer}>{eyebrows.slice(1).map((eyebrow) => <motion.p key={eyebrow} className="siteFooter__baseline" variants={revealItem}>{eyebrow}</motion.p>)}</motion.div> : null}
        </motion.div>
        {primaryLinks.length ? <motion.nav className="siteFooter__nav" aria-label="Navigation du pied de page" variants={revealContainer}><Actions links={primaryLinks} variant="nav" /></motion.nav> : null}
        {socialLinks.length ? <motion.nav className="siteFooter__social" aria-label="Réseaux sociaux" variants={revealItem}><Actions links={socialLinks} variant="social" /></motion.nav> : null}
        {legalLinks.length ? <motion.nav className="siteFooter__legal" aria-label="Informations légales" variants={revealItem}><Actions links={legalLinks} variant="nav" /></motion.nav> : null}
      </motion.div>
      {meta.length ? <motion.div className="siteFooter__meta" variants={revealContainer}>{meta.map((item) => <motion.span key={`${item.label}-${item.value ?? ""}`} variants={revealItem}>{item.value ? `${item.label}: ${item.value}` : item.label}</motion.span>)}</motion.div> : null}
    </motion.div>
  </footer>;
}
