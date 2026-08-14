import brandingData from "@/data/branding.json";
import projectMoodsData from "@/data/projectMoods.json";
import { Media } from "@/components/content/Media";
import { PageMeta } from "@/components/page/PageMeta";
import { resolveMedia } from "@/data/resolveMedia";
import { deriveBrandProfile } from "@/utils/deriveBrandProfile";
import type { ProjectMood } from "@/types/branding";

const projectMoods = projectMoodsData as Record<string, ProjectMood>;
const projectNames: Record<string, string> = {
  atmosphere: "Atmosphere",
  kuro: "Kuro",
  sashayogaflow: "Sasha Yoga Flow",
  "mois-du-ker": "Mois du Kèr",
  maloya: "Maloya",
};

const sensoryFields = [
  ["film", "Film"],
  ["place", "Lieu"],
  ["music", "Musique"],
  ["sound", "Son"],
  ["food", "Food"],
  ["material", "Matière"],
  ["scent", "Odeur"],
] as const;

export function BrandingPage() {
  return (
    <>
      <PageMeta
        seo={{
          title: "Moodboards & direction de marque | Chow Studio",
          description: "Système de moodboards reliant références, typographie, couleur, image et direction d’interface des projets Chow Studio.",
          robots: { index: false, follow: false },
        }}
      />

      <main className="page brandingPage" data-variant="editorial">
        <section className="brandingPage__board" aria-labelledby="branding-moodboard-title">
          <header className="brandingPage__boardHeader">
            <div>
              <p className="brandingPage__eyebrow">Direction de marque</p>
              <h1 id="branding-moodboard-title">Moodboard → système.</h1>
            </div>
            <p>Chow Studio · 2026</p>
          </header>

          <div className="brandingPage__manifesto">
            <p>{brandingData.concept.title}</p>
            <p>Chaque projet part d’indices concrets. Le profil dérivé choisit ensuite parmi les variants, surfaces, mouvements et traitements déjà disponibles dans le design system.</p>
          </div>

          <div className="brandingPage__projects">
            {Object.entries(projectMoods).map(([projectId, mood], projectIndex) => {
              const profile = deriveBrandProfile(mood.axes);
              const media = (mood.media ?? []).slice(0, 3).flatMap((mediaId) => {
                const resolved = resolveMedia(mediaId);
                return resolved ? [resolved] : [];
              });

              return (
                <article key={projectId} className="brandingPage__project">
                  <header className="brandingPage__projectHeader">
                    <span>{String(projectIndex + 1).padStart(2, "0")}.</span>
                    <div>
                      <h2>{projectNames[projectId] ?? projectId}</h2>
                      <p>{profile.variant} · {profile.composition} · {profile.mediaTreatment} · {profile.spacing}</p>
                    </div>
                  </header>

                  <div className="brandingPage__projectGrid">
                    <section className="brandingPage__module brandingPage__module--media" aria-label="Médias du projet">
                      <div className="brandingPage__moduleLabel">Média · 2/3 éléments du projet</div>
                      <div className="brandingPage__mediaGrid">
                        {media.map((item) => <Media key={item.id} media={item} className="brandingPage__media" />)}
                      </div>
                    </section>

                    <section className="brandingPage__module" aria-label="Typographie">
                      <div className="brandingPage__moduleLabel">Typographie</div>
                      <div className="brandingPage__typeStack">
                        {(mood.typography ?? []).map((font, index) => (
                          <div key={font} className="brandingPage__typeLine">
                            <span>Aa</span>
                            <p>{font}</p>
                            <small>{index === 0 ? "Display / caractère" : "Support / lecture"}</small>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="brandingPage__module" aria-label="Palette et mots">
                      <div className="brandingPage__moduleLabel">Couleurs · mots · illustration</div>
                      <div className="brandingPage__chips">
                        {(mood.colors ?? []).map((color) => <span key={color}>{color}</span>)}
                      </div>
                      <p className="brandingPage__words">{(mood.words ?? []).join(" · ")}</p>
                      <p className="brandingPage__rule">{mood.illustration}</p>
                    </section>

                    <section className="brandingPage__module brandingPage__module--inspiration" aria-label="Inspiration">
                      <div className="brandingPage__moduleLabel">Inspiration · 2/3 références</div>
                      <div className="brandingPage__inspirationGrid">
                        {(mood.inspiration ?? []).slice(0, 3).map((reference) => {
                          const referenceMedia = reference.image ? resolveMedia(reference.image) : undefined;
                          return (
                            <div key={`${reference.label}-${reference.value}`} className="brandingPage__inspiration">
                              {referenceMedia ? <Media media={referenceMedia} className="brandingPage__inspirationMedia" /> : null}
                              <small>{reference.label}</small>
                              <p>{reference.value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <section className="brandingPage__module brandingPage__module--sensory" aria-label="Références sensorielles">
                      <div className="brandingPage__moduleLabel">Mise en humeur</div>
                      <dl className="brandingPage__sensoryGrid">
                        {sensoryFields.map(([key, label]) => mood[key] ? (
                          <div key={key}>
                            <dt>{label}</dt>
                            <dd>{mood[key]}</dd>
                          </div>
                        ) : null)}
                      </dl>
                    </section>

                    <section className="brandingPage__module brandingPage__module--profile" aria-label="Profil dérivé">
                      <div className="brandingPage__moduleLabel">Algorithme · sortie</div>
                      <dl className="brandingPage__profileGrid">
                        {Object.entries(profile).map(([key, value]) => (
                          <div key={key}>
                            <dt>{key}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  </div>
                </article>
              );
            })}
          </div>

          <footer className="brandingPage__boardFooter">
            <p>Références → axes → profil → composants existants.</p>
            <p>Pas de style aléatoire. Pas de nouveau composant sans besoin réel.</p>
          </footer>
        </section>
      </main>
    </>
  );
}
