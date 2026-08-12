import type { CSSProperties } from "react";

import brandingData from "@/data/branding.json";
import { Card } from "@/components/content/Card";
import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { Grid } from "@/components/layout/Grid";
import { PageMeta } from "@/components/page/PageMeta";
import { resolveMedia } from "@/data/resolveMedia";
import type { ContentItem } from "@/types/content";

export function BrandingPage() {
  const imagery = brandingData.imagery.media.map((id) => resolveMedia(id)).filter(Boolean);
  return <><PageMeta seo={{ title: "Direction de marque | Chow Studio", description: "Direction de marque, récit, UX et système visuel.", robots: { index: false, follow: false } }} /><div className="page brandingPage" data-variant="editorial">
    <section className="section brandingPage__intro"><div className="section__inner stack"><TextBlock content={brandingData.intro as ContentItem} titleAs="h1" /></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={brandingData.concept as ContentItem} /><div className="brandingPage__keywords" aria-label="Mots-clés de direction">{brandingData.concept.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: brandingData.storytelling.eyebrow, title: brandingData.storytelling.title }} /><Grid>{brandingData.storytelling.chapters.map((chapter) => <Card key={chapter.step} item={{ eyebrow: chapter.step, title: chapter.title, text: [chapter.text] }} />)}</Grid></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: brandingData.voice.eyebrow, title: brandingData.voice.title, text: brandingData.voice.text }} /><Grid>{brandingData.voice.rules.map((rule) => <Card key={rule.title} item={rule as ContentItem} />)}</Grid></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Couleurs", title: "Une palette courte, des rôles clairs." }} /><div className="brandingPage__palette">{brandingData.palette.map((color) => <article className="brandingPage__swatch" key={color.name} style={{ "--swatch": color.value } as CSSProperties}><div className="brandingPage__swatchColor" aria-hidden="true" /><div className="brandingPage__swatchMeta"><strong>{color.name}</strong><span>{color.value}</span><p>{color.role}</p></div></article>)}</div></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Typographie", title: "Hiérarchie, contraste, lisibilité." }} /><div className="brandingPage__typePairing"><article className="brandingPage__typeSample brandingPage__typeSample--heading"><span>{brandingData.typography.heading.label}</span><p>{brandingData.typography.heading.sample}</p><small>{brandingData.typography.heading.family}</small></article><article className="brandingPage__typeSample brandingPage__typeSample--body"><span>{brandingData.typography.body.label}</span><p>{brandingData.typography.body.sample}</p><small>{brandingData.typography.body.family}</small></article></div><p className="brandingPage__note">{brandingData.typography.note}</p></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={brandingData.imagery as ContentItem} /><div className="brandingPage__imagery">{imagery.map((media) => media ? <Media key={media.id} media={media} /> : null)}</div></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={brandingData.geometry as ContentItem} /><div className="brandingPage__surfaces"><div className="frame brandingPage__surface">Frame</div><div className="frame effectGlass brandingPage__surface">Glass</div><div className="brandingPage__surface brandingPage__surface--organic">Organic</div></div></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={brandingData.motion as ContentItem} /><div className="brandingPage__keywords" aria-label="Comportements de mouvement">{brandingData.motion.behaviors.map((behavior) => <span key={behavior}>{behavior}</span>)}</div></div></section>
    <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: brandingData.application.eyebrow, title: brandingData.application.title }} /><Grid>{brandingData.application.items.map((item) => <Card key={item.title} item={item as ContentItem} />)}</Grid></div></section>
    <section className="section brandingPage__status"><div className="section__inner stack"><TextBlock content={brandingData.status as ContentItem} /></div></section>
  </div></>;
}
