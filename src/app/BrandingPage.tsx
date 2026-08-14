import brandingData from "@/data/branding.json";
import { Media } from "@/components/content/Media";
import { PageMeta } from "@/components/page/PageMeta";
import { resolveMedia } from "@/data/resolveMedia";

type MoodboardItem = {
  id: string;
  index: string;
  label: string;
  mediaId?: string;
  kind?: "image" | "type" | "palette" | "placeholder";
  position: string;
};

const moodboardItems: MoodboardItem[] = [
  {
    id: "ravine",
    index: "01",
    label: "Identité · Ravine",
    mediaId: "ravine-business-card",
    position: "a",
  },
  {
    id: "type",
    index: "02",
    label: "Typographie · contraste",
    kind: "type",
    position: "b",
  },
  {
    id: "ker",
    index: "03",
    label: "Campagne · Mois du Kèr",
    mediaId: "mois-du-ker-textile",
    position: "c",
  },
  {
    id: "palette",
    index: "04",
    label: "Palette · système",
    kind: "palette",
    position: "d",
  },
  {
    id: "randorun",
    index: "05",
    label: "Édition · RandoRun",
    mediaId: "randorun-poster",
    position: "e",
  },
  {
    id: "sasha",
    index: "06",
    label: "Digital · bien-être",
    mediaId: "sasha-mobile",
    position: "f",
  },
  {
    id: "future-photo",
    index: "07",
    label: "Photographie · matière",
    kind: "placeholder",
    position: "g",
  },
  {
    id: "atmosphere",
    index: "08",
    label: "Direction digitale · architecture",
    mediaId: "atmosphere-laptop",
    position: "h",
  },
];

export function BrandingPage() {
  return (
    <>
      <PageMeta
        seo={{
          title: "Moodboard & direction de marque | Chow Studio",
          description: "Moodboard de direction visuelle, identité, typographie, couleur et applications Chow Studio.",
          robots: { index: false, follow: false },
        }}
      />

      <main className="page brandingPage" data-variant="editorial">
        <section className="brandingPage__board" aria-labelledby="branding-moodboard-title">
          <header className="brandingPage__boardHeader">
            <h1 id="branding-moodboard-title">Moodboard</h1>
            <p>Chow Studio · direction visuelle</p>
          </header>

          <div className="brandingPage__introNote">
            <p>(2026)</p>
            <p>Identité visuelle<br />et direction digitale</p>
          </div>

          <div className="brandingPage__moodboard">
            {moodboardItems.map((item) => {
              const media = item.mediaId ? resolveMedia(item.mediaId) : undefined;
              const kind = item.kind ?? "image";

              return (
                <article
                  key={item.id}
                  className={`brandingPage__tile brandingPage__tile--${item.position} brandingPage__tile--${kind}`}
                >
                  <div className="brandingPage__tileMeta">
                    <span>{item.index}.</span>
                    <span>{item.label}</span>
                  </div>

                  {kind === "image" && media ? (
                    <Media media={media} className="brandingPage__media" />
                  ) : null}

                  {kind === "image" && !media ? (
                    <div className="brandingPage__placeholder" aria-label={`${item.label} · média à venir`}>
                      <img src="/media/placeholders/landscape.svg" alt="" />
                      <span>Média à venir</span>
                    </div>
                  ) : null}

                  {kind === "placeholder" ? (
                    <div className="brandingPage__placeholder" aria-label={`${item.label} · direction à compléter`}>
                      <img src="/media/placeholders/portrait.svg" alt="" />
                      <span>Direction à compléter</span>
                    </div>
                  ) : null}

                  {kind === "type" ? (
                    <div className="brandingPage__typeStudy">
                      <span className="brandingPage__typeDisplay">Aa</span>
                      <p>{brandingData.typography.heading.sample}</p>
                      <small>{brandingData.typography.body.sample}</small>
                    </div>
                  ) : null}

                  {kind === "palette" ? (
                    <div className="brandingPage__paletteStudy">
                      {brandingData.palette.slice(0, 4).map((color) => (
                        <div key={color.name} className="brandingPage__paletteColor">
                          <span style={{ background: color.value }} aria-hidden="true" />
                          <small>{color.name}</small>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <footer className="brandingPage__boardFooter">
            <p>Clarté · contraste · matière · rythme</p>
            <p>Images et applications évoluent avec les projets.</p>
          </footer>
        </section>
      </main>
    </>
  );
}
