import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { TextBlock } from "@/components/content/TextBlock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/section/Section";
import { FractalNoiseCanvas } from "@/components/visual/FractalNoiseCanvas";
import linkPageData from "@/data/linkPage.json";
import { resolveBlock } from "@/data/resolve";
import type { ContentItem, PageBlock, PageData, SectionBlock } from "@/types/content";

type LinkPageProps = {
  page: PageData;
};

type LinkPageData = {
  navigation: ContentItem;
  founder: SectionBlock;
  conditions: SectionBlock;
};

function resolveSection(block: PageBlock | undefined): SectionBlock | undefined {
  if (!block) return undefined;
  if ("ref" in block) return resolveBlock(block.ref);
  return block.type === "Section" ? block : undefined;
}

export function LinkPage({ page }: LinkPageProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [hoverMode, setHoverMode] = useState<"idle" | "contrast" | "accent">("idle");
  const footer = resolveSection(page.blocks[1]);
  const { navigation, founder, conditions } = linkPageData as LinkPageData;

  if (!footer) return null;

  const updateHoverMode = (target: EventTarget | null) => {
    const link = target instanceof Element ? target.closest(".actions__link") : null;
    if (!link) {
      setHoverMode("idle");
      return;
    }

    const isPrimary = link.matches('.actions__link--primary, [data-priority="primary"]');
    setHoverMode(isPrimary ? "accent" : "contrast");
  };

  return (
    <div className="linkPageShell">
      <div className="linkPage">
        <FractalNoiseCanvas hoverMode={hoverMode} />
        <motion.main
          className="linkPage__main"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <section
            className="linkPage__campaign"
            aria-label="Recherche de projets"
            onPointerOver={(event) => updateHoverMode(event.target)}
            onPointerOut={(event) => {
              const next = event.relatedTarget;
              if (next instanceof Node && event.currentTarget.contains(next)) updateHoverMode(next);
              else setHoverMode("idle");
            }}
            onFocus={(event) => updateHoverMode(event.target)}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (next instanceof Node && event.currentTarget.contains(next)) updateHoverMode(next);
              else setHoverMode("idle");
            }}
          >
            <TextBlock
              content={navigation}
              titleAs="h1"
              className="linkPage__campaignText"
              actionsVariant="panel"
            />
          </section>
        </motion.main>
      </div>

      <div className="linkPage__continuation">
        <Section block={founder} />
        <Section block={conditions} />
      </div>

      <SiteFooter block={footer} />
    </div>
  );
}
