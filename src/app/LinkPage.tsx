import { Link } from "react-router-dom";

import { Seo } from "@/components/page/Seo";

const tallyUrl = "https://tally.so/r/7RpgvA";

export function LinkPage() {
  return (
    <>
      <Seo
        seo={{
          title: "Liens | Chow Studio",
          description: "Chow Studio — design, identité visuelle et développement web. Découvrez les projets ou présentez le vôtre.",
        }}
        slug="/link"
      />
      <div className="linkPage">
        <header className="linkPage__header">
          <Link className="linkPage__brand" to="/" aria-label="Chow Studio, accueil">
            <span>CHOW</span>
            <span>STUDIO</span>
          </Link>
          <p>Design · Web · Identité visuelle</p>
          <p>Paris · La Réunion</p>
        </header>

        <section className="linkPage__campaign" aria-labelledby="link-campaign-title">
          <span className="linkPage__index" aria-hidden="true">(01)</span>
          <h1 id="link-campaign-title">Je recherche<br />3 entreprises</h1>
          <p>
            Pour mes prochains projets, je recherche trois entreprises qui souhaitent créer,
            repenser ou faire évoluer leur identité ou leur site web.
          </p>
          <a className="linkPage__primaryAction" href={tallyUrl} target="_blank" rel="noreferrer">
            Présenter mon projet <span aria-hidden="true">↗</span>
          </a>
        </section>

        <nav className="linkPage__links" aria-label="Liens Chow Studio">
          <Link className="linkPage__link" to="/projets">
            <span className="linkPage__index">(02)</span>
            <span>Découvrir les projets</span>
            <span aria-hidden="true">→</span>
          </Link>
          <a className="linkPage__link" href={tallyUrl} target="_blank" rel="noreferrer">
            <span className="linkPage__index">(03)</span>
            <span>Parler de votre projet</span>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <footer className="linkPage__footer">
          <div className="linkPage__socials">
            <a href="https://www.instagram.com/hellochowstudio/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="https://www.linkedin.com/company/chow-studio/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <span>© Chow Studio 2026</span>
        </footer>
      </div>
    </>
  );
}
