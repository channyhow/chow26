import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

import { TextBlock } from "@/components/content/TextBlock";
import { Seo } from "@/components/page/Seo";

const tallyUrl = "https://tally.so/r/7RpgvA";

const campaignContent = {
  title: "Je recherche 3 entreprises",
  text: "**Pour mes prochains projets, je recherche trois entreprises qui souhaitent créer, repenser ou faire évoluer leur identité ou leur site web.**",
};

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function LinkPage() {
  const reduceMotion = Boolean(useReducedMotion());
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <>
      <Seo
        seo={{
          title: "Liens | Chow Studio",
          description: "Chow Studio — design, identité visuelle et développement web. Découvrez le studio, un projet ou présentez le vôtre.",
        }}
        slug="/link"
      />
      <div className="linkPage">
        <motion.header
          className="linkPage__header"
          variants={reveal}
          initial="hidden"
          animate="visible"
          transition={transition}
        >
          <Link className="linkPage__brand" to="/" aria-label="Chow Studio, accueil">
            <span>CHOW</span>
            <span>STUDIO</span>
          </Link>
        </motion.header>

        <main className="linkPage__main">
          <section className="linkPage__campaign" aria-label="Recherche de projets">
            <TextBlock content={campaignContent} titleAs="h1" className="linkPage__campaignText" />
          </section>

          <motion.nav
            className="linkPage__links"
            aria-label="Liens Chow Studio"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.055, delayChildren: reduceMotion ? 0 : 0.12 } },
            }}
          >
            <motion.a variants={reveal} transition={transition} className="linkPage__link linkPage__link--primary" href={tallyUrl} target="_blank" rel="noreferrer">
              <span>Répondre à l’appel à projets</span>
              <span className="linkPage__arrow" aria-hidden="true">↗</span>
            </motion.a>
            <motion.div variants={reveal} transition={transition}>
              <Link className="linkPage__link" to="/a-propos">
                <span>À propos de Chow Studio</span>
                <span className="linkPage__arrow" aria-hidden="true">→</span>
              </Link>
            </motion.div>
            <motion.div variants={reveal} transition={transition}>
              <Link className="linkPage__link" to="/projets/mois-du-ker">
                <span>Case study · Mois du Kèr</span>
                <span className="linkPage__arrow" aria-hidden="true">→</span>
              </Link>
            </motion.div>
            <motion.a variants={reveal} transition={transition} className="linkPage__link" href={tallyUrl} target="_blank" rel="noreferrer">
              <span>Contact</span>
              <span className="linkPage__arrow" aria-hidden="true">↗</span>
            </motion.a>
          </motion.nav>
        </main>

        <motion.footer
          className="linkPage__footer"
          variants={reveal}
          initial="hidden"
          animate="visible"
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.3 }}
        >
          <div className="linkPage__socials">
            <a href="https://www.instagram.com/hellochowstudio/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="https://www.facebook.com/hellochowstudio" target="_blank" rel="noreferrer">Facebook ↗</a>
            <a href="https://www.linkedin.com/company/chow-studio/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <span className="linkPage__copyright">© Chow Studio 2026</span>
        </motion.footer>
      </div>
    </>
  );
}
