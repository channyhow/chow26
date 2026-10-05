import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { TextBlock } from "@/components/content/TextBlock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/section/Section";
import { FractalNoiseCanvas } from "@/components/visual/FractalNoiseCanvas";
import { resolveBlock } from "@/data/resolve";
import type { PageBlock, PageData, SectionBlock } from "@/types/content";

type LinkPageProps = {
  page: PageData;
};

function resolveSection(block: PageBlock | undefined): SectionBlock | undefined {
  if (!block) return undefined;
  if ("ref" in block) return resolveBlock(block.ref);
  return block.type === "Section" ? block : undefined;
}

export function LinkPage({ page }: LinkPageProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [hoverMode, setHoverMode] = useState<"idle" | "contrast" | "accent">("idle");

  const navigation = resolveBlock("linkpage-navigation");
  const founder = resolveBlock("studio-founders");
  const conditions = resolveBlock("opencall-conditions");
  const footer = resolveSection(page.blocks[1]);

  const navigationContent = navigation?.content?.header;

  if (!navigationContent || !founder || !conditions || !footer) return null;

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
      <section className="linkPagePanel linkPagePanel--campaign">
        <FractalNoiseCanvas hoverMode={hoverMode} />
        <motion.div
          className="linkPage__main"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="linkPage__campaign"
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
              content={navigationContent}
              titleAs="h1"
              className="linkPage__campaignText"
              actionsVariant="panel"
            />
          </div>
        </motion.div>
      </section>

      <div className="linkPagePanel linkPagePanel--founder">
        <Section block={founder} />
      </div>

      <div className="linkPagePanel linkPagePanel--conditions">
        <Section block={conditions} />
      </div>

      <SiteFooter block={footer} />
    </div>
  );
}
