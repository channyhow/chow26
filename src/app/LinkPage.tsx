import { motion, useReducedMotion } from "motion/react";

import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { Actions } from "@/components/navigation/Actions";
import { Seo } from "@/components/page/Seo";
import linkPageData from "@/data/linkPage.json";
import { resolveMedia } from "@/data/resolveMedia";
import siteData from "@/data/site.json";
import type { ActionRef, ContentItem } from "@/types/content";

const campaignContent = linkPageData.campaign as ContentItem;
const socialLinks = linkPageData.socials as ActionRef[];
const backgroundMedia = resolveMedia(linkPageData.backgroundMedia);
const currentYear = new Date().getFullYear();

export function LinkPage() {
  const reduceMotion = Boolean(useReducedMotion());
  const site = siteData.site;

  return (
    <>
      <Seo
        seo={{
          title: `Liens | ${site.name}`,
          description: site.seo.defaultDescription,
          robots: { index: false, follow: true },
        }}
        slug="/link"
      />
      <div className="linkPage">
        {backgroundMedia ? (
          <motion.div
            className="linkPage__background"
            aria-hidden="true"
            initial={reduceMotion ? false : { scale: 1.035, x: "-0.6%", y: "0.4%" }}
            animate={reduceMotion ? undefined : { scale: [1.035, 1.065, 1.035], x: ["-0.6%", "0.7%", "-0.6%"], y: ["0.4%", "-0.5%", "0.4%"] }}
            transition={reduceMotion ? undefined : { duration: 22, ease: "easeInOut", repeat: Infinity }}
          >
            <Media media={backgroundMedia} priority sizes="100vw" className="linkPage__backgroundMedia" />
          </motion.div>
        ) : null}
        <motion.main
          className="linkPage__main"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="linkPage__campaign" aria-label="Recherche de projets">
            <TextBlock content={campaignContent} titleAs="h1" className="linkPage__campaignText" actionsVariant="panel" />
          </section>
        </motion.main>
        <motion.footer
          className="linkPage__footer"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Actions links={socialLinks} variant="social" className="linkPage__socials" />
          <a className="linkPage__copyright" href={site.url} aria-label={`Accueil ${site.name}`}>© {site.name} {currentYear}</a>
        </motion.footer>
      </div>
    </>
  );
}
