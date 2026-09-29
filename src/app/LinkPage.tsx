import { motion, useReducedMotion } from "motion/react";

import { TextBlock } from "@/components/content/TextBlock";
import { Actions } from "@/components/navigation/Actions";
import { Seo } from "@/components/page/Seo";
import linkPageData from "@/data/linkPage.json";
import siteData from "@/data/site.json";
import type { ActionRef, ContentItem } from "@/types/content";

const campaignContent = linkPageData.campaign as ContentItem;
const socialLinks = linkPageData.socials as ActionRef[];
const currentYear = new Date().getFullYear();

export function LinkPage() {
  const reduceMotion = Boolean(useReducedMotion());
  const site = siteData.site;

  return (
    <>
      <Seo
        seo={{
          title: `Appel à projets | ${site.name}`,
          description: "3 projets à sélectionner jusqu’au 18 octobre. Design web et identité visuelle à Paris, à La Réunion ou ailleurs.",
          image: "kuro-grey",
          imageAlt: "Appel à projets de Chow Studio pour des projets de design web et d’identité visuelle.",
          canonical: `${site.url.replace(/\/$/, "")}/link`,
          robots: { index: false, follow: true },
        }}
        slug="/link"
      />
      <div className="linkPage">
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
