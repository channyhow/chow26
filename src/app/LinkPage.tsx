import { motion, useReducedMotion } from "motion/react";

import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { Actions } from "@/components/navigation/Actions";
import { Seo } from "@/components/page/Seo";
import linkPageData from "@/data/linkPage.json";
import { resolveMedia } from "@/data/resolveMedia";
import type { ActionRef, ContentItem } from "@/types/content";

const campaignContent = linkPageData.campaign as ContentItem;
const socialLinks = linkPageData.socials as ActionRef[];
const backgroundMedia = resolveMedia(linkPageData.backgroundMedia);
const reveal = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

export function LinkPage() {
  const reduceMotion = Boolean(useReducedMotion());
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <>
      <Seo seo={{ title: "Liens | Chow Studio", description: "Chow Studio — design, identité visuelle et développement web. Découvrez le studio, un projet ou présentez le vôtre." }} slug="/link" />
      <div className="linkPage">
        {backgroundMedia ? (
          <div className="linkPage__background" aria-hidden="true">
            <Media media={backgroundMedia} priority sizes="100vw" className="linkPage__backgroundMedia" />
          </div>
        ) : null}
        <main className="linkPage__main">
          <section className="linkPage__campaign" aria-label="Recherche de projets">
            <TextBlock content={campaignContent} titleAs="h1" className="linkPage__campaignText" actionsVariant="panel" />
          </section>
        </main>
        <motion.footer className="linkPage__footer" variants={reveal} initial="hidden" animate="visible" transition={{ ...transition, delay: reduceMotion ? 0 : 0.3 }}>
          <Actions links={socialLinks} variant="social" className="linkPage__socials" />
          <span className="linkPage__copyright">© Chow Studio 2026</span>
        </motion.footer>
      </div>
    </>
  );
}
