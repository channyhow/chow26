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
                    {media.map((item, index) => (
                      <article key={item.id} className="brandingPage__tile brandingPage__tile--media">
                        <Media media={item} className="brandingPage__media" />
                        <div className="brandingPage__overlay">
                          <small>Média {String(index + 1).padStart(2, "0")}</small>
                          <span>{item.caption ?? item.alt ?? "Référence du projet"}</span>
                        </div>
                      </article>
                    ))}

                    {(mood.typography ?? []).map((font, index) => (
                      <article key={font} className="brandingPage__tile brandingPage__tile--type">
                        <small>{index === 0 ? "Display / caractère" : "Support / lecture"}</small>
                        <strong>Aa</strong>
                        <p>{font}</p>
                      </article>
                    ))}

                    <article className="brandingPage__tile brandingPage__tile--palette">
                      <small>Couleurs</small>
                      <div className="brandingPage__swatches">
                        {(mood.colors ?? []).map((color) => (
                          <span key={color} style={{ background: color }} title={color} />
                        ))}
                      </div>
                    </article>

                    <article className="brandingPage__tile brandingPage__tile--words">
                      <small>Mots</small>
                      <p>{(mood.words ?? []).join(" · ")}</p>
                    </article>

                    <article className="brandingPage__tile brandingPage__tile--illustration">
                      <small>Illustration</small>
                      <p>{mood.illustration}</p>
                    </article>

                    {(mood.inspiration ?? []).slice(0, 3).map((reference, index) => {
                      const referenceMedia = reference.image ? resolveMedia(reference.image) : undefined;

                      return referenceMedia ? (
                        <article key={`${reference.label}-${reference.value}`} className="brandingPage__tile brandingPage__tile--media">
                          <Media media={referenceMedia} className="brandingPage__media" />
                          <div className="brandingPage__overlay">
                            <small>Inspiration {String(index + 1).padStart(2, "0")} · {reference.label}</small>
                            <span>{reference.value}</span>
                          </div>
                        </article>
                      ) : (
                        <article key={`${reference.label}-${reference.value}`} className="brandingPage__tile brandingPage__tile--reference">
                          <small>{reference.label}</small>
                          <p>{reference.value}</p>
                        </article>
                      );
                    })}

                    {sensoryFields.map(([key, label]) => mood[key] ? (
                      <article key={key} className="brandingPage__tile brandingPage__tile--sensory">
                        <small>{label}</small>
                        <p>{mood[key]}</p>
                      </article>
                    ) : null)}

                    {Object.entries(profile).map(([key, value]) => (
                      <article key={key} className="brandingPage__tile brandingPage__tile--profile">
                        <small>Algorithme · {key}</small>
                        <p>{value}</p>
                      </article>
                    ))}
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
