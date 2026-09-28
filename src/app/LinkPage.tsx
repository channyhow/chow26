import { Link } from "react-router-dom";

import { Seo } from "@/components/page/Seo";

const tallyUrl = "https://tally.so/r/7RpgvA";

export function LinkPage() {
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
        <header className="linkPage__header">
          <Link className="linkPage__brand" to="/" aria-label="Chow Studio, accueil">
            <span>CHOW</span>
            <span>STUDIO</span>
          </Link>
        </header>

        <main className="linkPage__main">
          <section className="linkPage__campaign" aria-labelledby="link-campaign-title">
            <h1 id="link-campaign-title">Je recherche<br />3 entreprises</h1>
            <p>
              Pour mes prochains projets, je recherche trois entreprises qui souhaitent <strong>créer,
              repenser ou faire évoluer leur identité ou leur site web.</strong>
            </p>
          </section>

          <nav className="linkPage__links" aria-label="Liens Chow Studio">
            <a className="linkPage__link linkPage__link--primary" href={tallyUrl} target="_blank" rel="noreferrer">
              <span>Votre entreprise pourrait en faire partie</span>
              <span aria-hidden="true">↗</span>
            </a>
            <Link className="linkPage__link" to="/a-propos">
              <span>À propos de Chow Studio</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="linkPage__link" to="/projets/mois-du-ker">
              <span>Case study · Mois du Kèr</span>
              <span aria-hidden="true">→</span>
            </Link>
            <a className="linkPage__link" href={tallyUrl} target="_blank" rel="noreferrer">
              <span>Contact</span>
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </main>

        <footer className="linkPage__footer">
          <div className="linkPage__socials">
            <a href="https://www.instagram.com/hellochowstudio/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="https://www.facebook.com/hellochowstudio" target="_blank" rel="noreferrer">Facebook ↗</a>
            <a href="https://www.linkedin.com/company/chow-studio/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <span className="linkPage__copyright">© Chow Studio 2026</span>
        </footer>
      </div>
    </>
  );
}
