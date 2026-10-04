import { useMemo, useState } from "react";

import { Accordion } from "@/components/content/Accordion";
import { Card } from "@/components/content/Card";
import { Carousel } from "@/components/content/Carousel";
import { ContentSwitcher } from "@/components/content/ContentSwitcher";
import { Embed, type EmbedProvider } from "@/components/content/Embed";
import { Gallery, type GalleryLayout } from "@/components/content/Gallery";
import { HorizontalScroll } from "@/components/content/HorizontalScroll";
import { Loader } from "@/components/content/Loader";
import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { Timeline } from "@/components/content/Timeline";
import { Form } from "@/components/forms/Form";
import { Grid } from "@/components/layout/Grid";
import { ScrollPanel } from "@/components/layout/ScrollPanel";
import { ScrollScene } from "@/components/layout/ScrollScene";
import { Split } from "@/components/layout/Split";
import { Actions } from "@/components/navigation/Actions";
import businessContextsData from "@/data/businessContexts.json";
import formsData from "@/data/forms.json";
import siteData from "@/data/site.json";
import systemData from "@/data/system.json";
import { resolveMedia } from "@/data/resolveMedia";
import { enrichScheduleEvents } from "@/features/schedule/enrichEvent";
import { Schedule } from "@/features/schedule/Schedule";
import { useUIStore } from "@/state/uiStore";
import type { CardAppearance, ContentItem, StyleVariant, Tone } from "@/types/content";
import type { FormSchema } from "@/types/forms";
import type { MediaItem } from "@/types/media";
import type { CalendarEvent } from "@/types/schedule";
import type { SystemComponentName } from "@/types/system";

const variants = systemData.variants as StyleVariant[];
const tones = systemData.tones as Tone[];
const forms = formsData as Record<string, FormSchema>;
const previews = systemData.previews;
const businessContexts = businessContextsData.contexts;

const componentGroups: Array<{ title: string; purpose: string; components: SystemComponentName[] }> = [
  {
    title: "Content",
    purpose: "Reusable content and media primitives.",
    components: ["TextBlock", "Media", "Card", "Gallery", "Carousel", "ContentSwitcher", "Accordion", "HorizontalScroll", "Timeline", "Embed", "Loader"],
  },
  {
    title: "Layout & composition",
    purpose: "Components that arrange content without owning business meaning.",
    components: ["Grid", "Split", "ScrollScene", "ScrollPanel", "Section", "SectionGroup", "SiteFooter"],
  },
  {
    title: "Navigation & interaction",
    purpose: "Shared navigation, actions and persistent interface controls.",
    components: ["Actions", "Header", "BurgerButton", "Drawer", "FloatingAction", "ScrollProgress"],
  },
  {
    title: "Forms & features",
    purpose: "Intent capture and optional domain features.",
    components: ["Form", "Schedule"],
  },
  {
    title: "Page infrastructure",
    purpose: "Rendering, routing and metadata infrastructure; documented here but not nested as visual demos.",
    components: ["PageMeta", "PageRenderer", "RouteLoader", "Seo"],
  },
];

function Purpose({ children }: { children: string }) {
  return <p className="systemPage__purpose">{children}</p>;
}

export function SystemPage() {
  const [variant, setVariant] = useState<StyleVariant>("editorial");
  const [tone, setTone] = useState<Tone>("default");
  const [galleryLayout, setGalleryLayout] = useState<GalleryLayout>("editorial");
  const [scrollPanel, setScrollPanel] = useState(true);
  const openDrawer = useUIStore((state) => state.openDrawer);

  const galleryItems = useMemo<MediaItem[]>(() => previews.gallery.media.flatMap((id, index) => {
    const item = resolveMedia(id);
    return item ? [{ ...item, id: `${item.id}-${index}` }] : [];
  }), []);

  const scheduleEvents = useMemo(() => enrichScheduleEvents(previews.schedule.events as CalendarEvent[]), []);
  const splitMedia = resolveMedia(previews.split.secondaryMedia);
  const horizontalItems = previews.carousel.items.slice(0, 3) as ContentItem[];

  return (
    <div className="page systemPage" data-variant={variant} data-tone={tone}>
      <section className="section borderBottom">
        <div className="section__inner stack">
          <TextBlock content={systemData.intro as ContentItem} titleAs="h1" />
          <div className="cluster" aria-label="Style variant preview">
            {variants.map((item) => <button key={item} type="button" onClick={() => setVariant(item)} aria-pressed={variant === item}>{item}</button>)}
          </div>
          <div className="cluster" aria-label="Tone preview">
            {tones.map((item) => <button key={item} type="button" onClick={() => setTone(item)} aria-pressed={tone === item}>{item}</button>)}
          </div>
          <div className="cluster">
            <button type="button" onClick={() => openDrawer("menu")}>Navigation drawer</button>
            <button type="button" onClick={() => openDrawer("contact")}>Contact drawer</button>
            <button type="button" onClick={() => openDrawer("reservation")}>Reservation drawer</button>
          </div>
        </div>
      </section>

      <section className="section borderBottom">
        <div className="section__inner stack">
          <TextBlock content={{ eyebrow: "Inventory", title: "Every shared component, in one place.", text: ["The inventory mirrors the shared component folders. Visual primitives are previewed below; shell and page infrastructure are documented without duplicating the live application shell."] }} />
          {componentGroups.map((group) => (
            <div className="stack" key={group.title}>
              <TextBlock content={{ title: group.title, text: [group.purpose] }} titleAs="h2" />
              <Grid>
                {group.components.map((component) => <Card key={component} item={{ title: component }} frame />)}
              </Grid>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__inner stack">
          <TextBlock content={{ eyebrow: "Palette", title: "Brand roles, shared semantic states." }} />
          <div className="systemPage__palette" aria-label="Current palette">
            <div className="systemPage__swatch" data-color="primary"><span>Primary</span></div>
            <div className="systemPage__swatch" data-color="secondary"><span>Secondary</span></div>
            <div className="systemPage__swatch" data-color="special"><span>Special</span></div>
            <div className="systemPage__swatch" data-color="accent"><span>Accent</span></div>
          </div>
        </div>
      </section>

      <section className="section"><div className="section__inner stack"><TextBlock content={previews.textBlock.content as ContentItem} /><Purpose>{previews.textBlock.purpose}</Purpose></div></section>

      <section className="section">
        <div className="section__inner stack">
          <TextBlock content={{ eyebrow: "Actions", title: "Navigation and conversion share one action language." }} />
          <Purpose>Use intent, priority and variant rather than creating button components per project.</Purpose>
          <Actions links={[{ label: "Primary action", href: "#forms", intent: "navigate", priority: "primary" }, { label: "Secondary action", href: "#forms", intent: "navigate", priority: "secondary" }]} />
        </div>
      </section>

      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Card", title: "Text, media or both." }} /><Purpose>{previews.cards.purpose}</Purpose><Grid>{previews.cards.items.map((item) => <Card key={item.id} item={item as ContentItem} {...(item.appearance as CardAppearance)} />)}</Grid></div></section>
      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Grid", title: "Layout accepts heterogeneous content." }} /><Purpose>{previews.grid.purpose}</Purpose><Grid>{previews.grid.items.map((item) => <Card key={item.id} item={item as ContentItem} />)}</Grid></div></section>
      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Split", title: "Two related content zones." }} /><Purpose>{previews.split.purpose}</Purpose><Split primary={<TextBlock content={previews.split.primary as ContentItem} />} secondary={splitMedia ? <Media media={splitMedia} /> : null} /></div></section>

      <section className="section">
        <div className="section__inner stack">
          <TextBlock content={{ eyebrow: "Gallery", title: "Visual composition stays one component." }} />
          <Purpose>{previews.gallery.purpose}</Purpose>
          <div className="cluster" aria-label="Gallery layout preview">{(previews.gallery.layouts as GalleryLayout[]).map((layout) => <button key={layout} type="button" onClick={() => setGalleryLayout(layout)} aria-pressed={galleryLayout === layout}>{layout}</button>)}</div>
          <Gallery items={galleryItems} layout={galleryLayout} />
        </div>
      </section>

      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Carousel", title: "Sequential browsing, native scrolling first." }} /><Purpose>{previews.carousel.purpose}</Purpose><Carousel label={previews.carousel.label}>{previews.carousel.items.map((item) => <Card key={item.id} item={item as ContentItem} {...(item.appearance as CardAppearance)} />)}</Carousel></div></section>

      <section className="section">
        <div className="section__inner stack">
          <TextBlock content={{ eyebrow: "HorizontalScroll", title: "Pinned horizontal storytelling with arbitrary children." }} />
          <Purpose>Use for spatial or editorial progression. It is not chronology and owns no content semantics.</Purpose>
        </div>
        <HorizontalScroll>{horizontalItems.map((item, index) => <Card key={item.id ?? index} item={item} frame />)}</HorizontalScroll>
      </section>

      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "ContentSwitcher", title: "One selection, one changing content area." }} /><Purpose>{previews.switcher.purpose}</Purpose><ContentSwitcher items={previews.switcher.items.map((item) => ({ id: item.id, label: item.label, content: <Card item={item.content as ContentItem} frame /> }))} /></div></section>
      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Disclosure", title: "FAQ and progressive detail." }} /><Purpose>{previews.accordion.purpose}</Purpose><Accordion items={previews.accordion.items} /></div></section>

      <section className="section">
        <div className="section__inner stack">
          <TextBlock content={{ eyebrow: "Timeline", title: "Chronology has dates, nodes and a continuous axis." }} />
          <Purpose>Use only when order in time or process is meaningful. For generic horizontal progression, use HorizontalScroll.</Purpose>
          <Timeline items={previews.timeline.items as ContentItem[]} mode="chronology" />
        </div>
      </section>

      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "ScrollScene", title: "Motion explains relationship and progression." }} /><Purpose>{previews.scrollScene.purpose}</Purpose><ScrollScene preset="drift"><div className="frame padding"><TextBlock content={previews.scrollScene.content as ContentItem} /></div></ScrollScene></div></section>

      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "ScrollPanel", title: "Panel storytelling remains optional." }} /><Purpose>{previews.scrollPanel.purpose}</Purpose><button type="button" onClick={() => setScrollPanel((value) => !value)} aria-pressed={scrollPanel}>Scroll panel {scrollPanel ? "on" : "off"}</button><ScrollPanel enabled={scrollPanel}>{previews.scrollPanel.panels.map((panel) => <div className="frame padding" key={panel.id}><TextBlock content={panel as ContentItem} /></div>)}</ScrollPanel></div></section>

      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Loader", title: "Loader copy comes from site JSON." }} /><Loader messages={siteData.ui.loader.messages} /></div></section>
      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Schedule", title: "Calendar data becomes brand-aware content." }} /><Purpose>{previews.schedule.purpose}</Purpose><Schedule events={scheduleEvents} /></div></section>
      <section className="section"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Embed", title: "Providers share one primitive." }} /><Purpose>{previews.embeds.purpose}</Purpose><Grid>{previews.embeds.items.map((item) => <Embed key={item.title} provider={item.provider as EmbedProvider} src={item.src} title={item.title} />)}</Grid></div></section>

      <section className="section" id="forms"><div className="section__inner stack"><TextBlock content={{ eyebrow: "Form", title: "Contact and booking share one renderer." }} /><Purpose>{previews.forms.purpose}</Purpose><ContentSwitcher items={previews.forms.keys.map((key) => ({ id: key, label: key === "reservation" ? "Réservation" : "Contact", content: <Form schema={forms[key]} /> }))} /></div></section>

      <section className="section borderTop">
        <div className="section__inner stack">
          <TextBlock content={{ eyebrow: "Conversion playbook", title: "Choose a business context, then compose from the same primitives.", text: ["These are starting hierarchies, not fixed templates. The business goal decides the sequence."] }} />
          <ContentSwitcher items={businessContexts.map((context) => ({ id: context.id, label: context.label, content: <article className="systemPage__businessContext frame"><TextBlock content={{ eyebrow: "Goal", title: context.goal, text: [context.conversionNote] }} titleAs="h3" /><div className="systemPage__businessColumns"><div><p className="systemPage__businessLabel">Conversion hierarchy</p><ol className="systemPage__businessHierarchy">{context.hierarchy.map((step) => <li key={step}>{step}</li>)}</ol></div><div><p className="systemPage__businessLabel">Priority components</p><ul className="systemPage__businessComponents">{context.priorityComponents.map((component) => <li key={component}>{component}</li>)}</ul></div></div></article> }))} />
        </div>
      </section>
    </div>
  );
}
