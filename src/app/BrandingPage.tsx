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
            <p>Neuf indices maximum définissent l’atmosphère. Les médias du projet restent séparés : le moodboard explique le langage, la galerie montre ce qu’il devient.</p>
          </div>

          <div className="brandingPage__projects">
            {Object.entries(projectMoods).map(([projectId, mood]) => {
              const profile = deriveBrandProfile(mood.axes);
              const media = (mood.media ?? []).flatMap((mediaId) => {
                const resolved = resolveMedia(mediaId);
                return resolved ? [resolved] : [];
              });
              const typography = (mood.typography ?? []).join(" · ");
              const inspiration = mood.inspiration ?? [];

              const moodItems = [
                { label: "Typographies", value: typography || "À définir", kind: "type" },
                { label: "Palette", value: mood.colors ?? [], kind: "palette" },
                { label: "Mots", value: (mood.words ?? []).join(" · "), kind: "words" },
                { label: "Lieu", value: mood.place ?? inspiration[0]?.value ?? "À définir", kind: "text" },
                { label: "Film", value: mood.film ?? "À définir", kind: "text" },
                { label: "Musique / son", value: [mood.music, mood.sound].filter(Boolean).join(" · "), kind: "text" },
                { label: "Matière / odeur", value: [mood.material, mood.scent].filter(Boolean).join(" · "), kind: "text" },
                { label: "Food", value: mood.food ?? "À définir", kind: "text" },
                { label: "Geste graphique", value: mood.illustration ?? inspiration[2]?.value ?? "À définir", kind: "text" },
              ] as const;

              return (
                <article key={projectId} className="brandingPage__project">
                  <header className="brandingPage__projectHeader">
                    <div>
                      <h2>{projectNames[projectId] ?? projectId}</h2>
                      <p>{profile.variant} · {profile.composition} · {profile.mediaTreatment} · {profile.spacing}</p>
                    </div>
                  </header>

                  <div className="brandingPage__moodGrid">
                    {moodItems.map((item) => (
                      <article key={item.label} className={`brandingPage__moodItem brandingPage__moodItem--${item.kind}`}>
                        <small>{item.label}</small>
                        <div className="brandingPage__moodSquare">
                          {item.kind === "palette" && Array.isArray(item.value) ? (
                            <div className="brandingPage__swatches">
                              {item.value.map((color) => <span key={color} style={{ background: color }} title={color} />)}
                            </div>
                          ) : item.kind === "type" ? (
                            <div className="brandingPage__typeSample"><strong>Aa</strong><p>{item.value}</p></div>
                          ) : (
                            <p>{item.value}</p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {media.length ? (
                    <section className="brandingPage__mediaSection" aria-label={`Médias du projet ${projectNames[projectId] ?? projectId}`}>
                      <header><small>Médias du projet</small></header>
                      <div className="brandingPage__mediaGrid">
                        {media.map((item) => (
                          <article key={item.id} className="brandingPage__mediaTile">
                            <Media media={item} />
                            <div className="brandingPage__overlay"><span>{item.caption ?? item.alt ?? "Média du projet"}</span></div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </article>
              );
            })}
          </div>

          <footer className="brandingPage__boardFooter">
            <p>9 indices → profil → composants existants.</p>
            <p>Les médias restent une preuve séparée du moodboard.</p>
          </footer>
        </section>
      </main>
    </>
  );
}
