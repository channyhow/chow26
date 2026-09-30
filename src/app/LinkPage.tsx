import { motion, useReducedMotion } from "motion/react";

import { TextBlock } from "@/components/content/TextBlock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FractalNoiseCanvas } from "@/components/visual/FractalNoiseCanvas";
import { resolveBlock } from "@/data/resolve";
import type { ContentItem, PageData, SectionBlock } from "@/types/content";

type LinkPageProps = {
  page: PageData;
};

export function LinkPage({ page }: LinkPageProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const campaign = resolveBlock(page.blocks[0]) as SectionBlock;
  const footer = resolveBlock(page.blocks[1]) as SectionBlock;
  const campaignContent = campaign.content?.header as ContentItem;

  return (
    <>
      <div className="linkPage">
        <FractalNoiseCanvas />
        <motion.main
          className="linkPage__main"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="linkPage__campaign" aria-label="Recherche de projets">
            <TextBlock
              content={campaignContent}
              titleAs="h1"
              className="linkPage__campaignText"
              actionsVariant="panel"
            />
          </section>
        </motion.main>
      </div>
      <SiteFooter block={footer} />
    </>
  );
}
