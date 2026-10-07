import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { motion, type MotionValue } from "motion/react";

import { CardItem } from "@/components/content/CardItem";
import { Carousel } from "@/components/content/Carousel";
import { ContentSwitcher } from "@/components/content/ContentSwitcher";
import { Gallery } from "@/components/content/Gallery";
import { HorizontalScroll } from "@/components/content/HorizontalScroll";
import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { Actions } from "@/components/navigation/Actions";
import { Timeline } from "@/components/content/Timeline";
import { Form } from "@/components/forms/Form";
import { Grid } from "@/components/layout/Grid";
import { ScrollScene } from "@/components/layout/ScrollScene";
import { Split } from "@/components/layout/Split";
import { HomeOpeningScene } from "@/components/section/HomeOpeningScene";
import { forms } from "@/data";
import { resolveCollection } from "@/data/resolve";
import { resolveMedia, resolveMediaList } from "@/data/resolveMedia";
import { resolveSplitComposition } from "@/data/splitCompositions";
import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";
import type { MotionIntensity, ScrollMotionPreset, SectionBlock } from "@/types/content";
import type { FormSchema } from "@/types/forms";

export type SectionProps = { block: SectionBlock; suppressSceneMotion?: boolean; visualContext?: "own" | "inherit"; scrollProgress?: MotionValue<number>; };
const formRegistry = forms as Record<string, FormSchema>;
const mobileCarouselQuery = "(max-width: 29.999rem)";

export function Section({ block, suppressSceneMotion = false, visualContext = "own", scrollProgress }: SectionProps) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const layout = block.layout ?? "text";
  const ownsVisualPlane = visualContext === "own";
  const header = block.content?.header;
  const items = [...(block.content?.items ?? []), ...resolveCollection(block.source)];
  const splitItem = layout === "split" && items.length === 1 ? items[0] : undefined;
  const formRef = block.content?.form;
  const form = typeof formRef === "string" ? formRegistry[formRef] : formRef;
  const mediaItems = resolveMediaList(block.content?.media);
  const headerMediaItems = resolveMediaList(header?.media);
  const media = mediaItems[0] ?? headerMediaItems[0];
  const splitItemMediaRef = splitItem ? (Array.isArray(splitItem.media) ? splitItem.media[0] : splitItem.media) : undefined;
  const splitItemMedia = resolveMedia(splitItemMediaRef);
  const splitCompositionProps = resolveSplitComposition(block.id, block.splitComposition);
  const motionEnabled = siteData.ui.experience.sectionReveal;
  const motionLevel = block.motion ?? (layout === "split" ? "scene" : "micro");
  const sectionMotionEnabled = motionEnabled && motionLevel !== "none" && !suppressSceneMotion;
  const isHorizontalTimeline = layout === "timeline" && block.timelineOrientation === "horizontal";
  const ownsScrollInteraction = layout === "horizontal-scroll" || layout === "content-switcher" || isHorizontalTimeline;
  const isLongFormList = layout === "list";
  const usesScrollMotion = motionLevel === "micro" || motionLevel === "scene";
  const shouldTrackScroll = sectionMotionEnabled && usesScrollMotion && !ownsScrollInteraction && !isLongFormList;
  const scenePreset: ScrollMotionPreset = block.motionPreset ?? (layout === "split" ? "recede" : motionLevel === "micro" ? "drift" : "parallax");
  const sceneRange = block.motionRange ?? "through";
  const sceneIntensity: MotionIntensity = block.motionIntensity ?? (layout === "split" ? "quiet" : motionLevel === "micro" ? "quiet" : "default");
  const isHomeOpening = block.id === "home-opening";
  const isServiceCollection = block.source?.collection === "services";
  const gridOwnsReveal = items.length > 0 && (layout === "grid" || layout === "text" || layout === "split" || layout === "list");
  const shouldReveal = sectionMotionEnabled && motionLevel === "reveal" && !shouldTrackScroll && !gridOwnsReveal && !isLongFormList;
  const isProjectHero = block.className?.split(/\s+/).includes("projectHero") ?? false;
  const isHomeFeaturedProject = block.className?.split(/\s+/).includes("homeFeaturedProject") ?? false;
  const isHomeOpenCall = block.className?.split(/\s+/).includes("home-preview--opencall") ?? false;
  const isProjectGrid = layout === "grid" && block.source?.collection === "projects";
  const isFeaturedProjectGrid = isProjectGrid && block.source?.query?.featured === true;
  const isStructuredEditorialList = layout === "list" && items.some((item) => Boolean(item.grid));
  const isProfileGrid = layout === "grid" && items.length === 1 && Boolean(items[0]?.media) && Boolean(items[0]?.subtitle) && !items[0]?.title;
  const cardVariant = block.itemAppearance?.variant ?? (isServiceCollection ? "service" : isStructuredEditorialList ? "editorial" : "default");
  const useProjectCarouselOnMobile = isMobileViewport && isFeaturedProjectGrid;

  useEffect(() => {
    const carouselMedia = window.matchMedia(mobileCarouselQuery);
    const updateViewport = () => setIsMobileViewport(carouselMedia.matches);
    updateViewport();
    carouselMedia.addEventListener("change", updateViewport);
    return () => carouselMedia.removeEventListener("change", updateViewport);
  }, []);

  const renderCard = (item: (typeof items)[number], index?: number) => <CardItem key={item.id ?? `${item.title ?? "item"}-${index ?? 0}`} item={item} frame={block.itemAppearance?.frame} effect={block.itemAppearance?.effect} variant={cardVariant} />;
  const cards = items.map(renderCard);
  const cardsCollection = cards.length ? (useProjectCarouselOnMobile ? <Carousel>{cards}</Carousel> : <Grid progressive={Boolean(block.progressive)} motionPreset={block.motionPreset} placements={items.map((item) => item.grid)} motionEnabled={sectionMotionEnabled && !isLongFormList} scrollLinked={sectionMotionEnabled && !isLongFormList}>{cards}</Grid>) : null;
  const mediaCards = mediaItems.map((item) => <Media key={item.id} media={item} />);
  const secondary = media ? <Media media={media} sizes="(min-width: 64rem) 50vw, 100vw" /> : form ? <Form schema={form} /> : cardsCollection;
  const switcherItems = items.flatMap((item, index) => {
    const id = item.id ?? `item-${index + 1}`;
    const label = item.title ?? (typeof item.eyebrow === "string" ? item.eyebrow : item.eyebrow?.[0]);
    if (!label) return [];
    return [{ id, label, content: renderCard(item, index) }];
  });
  const horizontalItems = cards.length ? cards : mediaCards;
  const horizontalItemsWithMotion = horizontalItems.map((item, index) => <ScrollScene key={`horizontal-motion-${index}`} preset="drift" intensity={sceneIntensity} direction={index % 2 === 0 ? "forward" : "reverse"} range="through" className="section__horizontalScrollLayer" decorative={false} enabled={sectionMotionEnabled}>{item}</ScrollScene>);
  const motionLayer = (content: ReactNode, direction: "forward" | "reverse" = "forward", className = "section__scrollLayer", intensity: MotionIntensity = sceneIntensity) => content ? (shouldTrackScroll ? <ScrollScene preset={scenePreset} intensity={intensity} direction={direction} range={sceneRange} className={className} decorative={false} progress={scrollProgress}>{content}</ScrollScene> : content) : null;
  const region = (content: ReactNode, className?: string) => content ? <div className={clsx("section__body", className)}>{content}</div> : null;
  let body: ReactNode;

  if (isHomeOpening) {
    body = <HomeOpeningScene header={header} media={mediaItems} scrollProgress={scrollProgress} />;
  } else if (isProjectHero) {
    const projectStatement = header?.subtitle ? <TextBlock content={{ subtitle: header.subtitle }} className="projectHero__statement" motionEnabled={sectionMotionEnabled} /> : null;
    const projectIdentity = header?.title ? <TextBlock content={{ title: header.title }} titleAs="h1" className="projectHero__identity" motionEnabled={sectionMotionEnabled} /> : null;
    const projectMedia = media ? <Media media={media} className="projectHero__media" sizes="(min-width: 64rem) 100vw, 100vw" /> : null;
    const projectMeta = header?.meta ? <TextBlock content={{ meta: header.meta }} className="projectHero__meta" motionEnabled={sectionMotionEnabled} /> : null;
    body = <div className="projectHero__composition">{projectStatement}{projectIdentity}{projectMedia}{projectMeta}</div>;
  } else if (isHomeOpenCall && header) {
    const openCallMedia = media ? <Media media={media} className="homeOpenCall__media" sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 30vw, 100vw" /> : null;
    const openCallIntro = {
      eyebrow: header.eyebrow,
      text: header.text,
    };
    body = <article className="homeOpenCall__composition"><TextBlock content={{ title: header.title }} className="homeOpenCall__statement" motionEnabled={sectionMotionEnabled} />{openCallMedia}<TextBlock content={openCallIntro} className="homeOpenCall__context" motionEnabled={sectionMotionEnabled} /><Actions links={header.links} className="homeOpenCall__action" /></article>;
  } else if (isHomeFeaturedProject && splitItem) {
    const featuredMedia = splitItemMedia ? <Media media={splitItemMedia} className="homeFeaturedProject__media" sizes="(min-width: 64rem) 66vw, 100vw" /> : null;
    const featuredStory = {
      eyebrow: header?.eyebrow,
      title: [splitItem.title, splitItem.subtitle].filter(Boolean).join(" — "),
      text: header?.text,
      meta: splitItem.meta,
      links: header?.projectLinks,
    };
    body = <article className="homeFeaturedProject__composition"><div className="homeFeaturedProject__index" aria-label="Projet à la une"><span>Ce mois-ci</span><Actions links={header?.links} className="homeFeaturedProject__archive" /></div>{featuredMedia}<TextBlock content={featuredStory} className="homeFeaturedProject__story" motionEnabled={sectionMotionEnabled} /></article>;
  } else if (layout === "split") {
    const primaryContent = splitItem ? { ...splitItem, media: undefined, offers: undefined } : header;
    const primary = primaryContent ? <TextBlock content={primaryContent} metaVariant={isServiceCollection ? "rows" : "default"} motionEnabled={sectionMotionEnabled && visualContext !== "own"} /> : null;
    const splitSecondary = splitItemMedia ? <Media media={splitItemMedia} sizes="(min-width: 64rem) 50vw, 100vw" /> : secondary;

    // Keep split media in normal flow so lazy-loaded assets have stable
    // viewport geometry. Text keeps its existing reveal through TextBlock.
    const mediaContent = splitSecondary ? <div className="section__splitMediaMotion">{splitSecondary}</div> : null;
    const textContent = primary ? <div className="section__splitTextMotion">{primary}</div> : null;
    const splitComposition = <Split variant={block.splitVariant} {...splitCompositionProps} primary={textContent} secondary={mediaContent} primaryRole="content" secondaryRole="media" />;
    const offers = splitItem?.offers ?? [];
    const offerCarousel = offers.length > 0 ? <Carousel label={`${splitItem?.title ?? "Service"} — offres`}>{offers.map((offer, index) => <CardItem key={offer.id ?? `offer-${index + 1}`} item={offer} variant="service" />)}</Carousel> : null;
    body = <>{splitComposition}{region(offerCarousel, "section__offers")}</>;
  } else if (isProfileGrid) {
    const profile = items[0];
    const profileMediaRef = Array.isArray(profile.media) ? profile.media[0] : profile.media;
    const profileMedia = resolveMedia(profileMediaRef);
    const primary = profileMedia ? <Media media={profileMedia} sizes="(min-width: 64rem) 50vw, 100vw" /> : null;
    const secondaryContent = { ...profile, media: undefined };
    const profileMediaLayer = motionLayer(primary, "reverse", "section__profileMediaMotion", "quiet");
    const profileTextLayer = motionLayer(<TextBlock content={secondaryContent} className="split__content" motionEnabled={sectionMotionEnabled} />, "forward", "section__profileTextMotion", "quiet");
    body = <Split variant={block.splitVariant ?? "media-lead"} {...splitCompositionProps} className="split--profile" primary={profileMediaLayer} secondary={profileTextLayer} primaryRole="media" secondaryRole="content" />;
  } else if (layout === "media-overlay") {
    body = <div className="section__mediaOverlay">{media ? <Media media={media} className="section__media" sizes="100vw" /> : null}{header ? <div className="section__overlayContent"><TextBlock content={header} titleAs="h1" className="section__header" motionEnabled={sectionMotionEnabled} /></div> : null}</div>;
  } else if (layout === "gallery") {
    const gallery = mediaItems.length ? <Gallery items={mediaItems} layout="editorial" /> : null;
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" motionEnabled={sectionMotionEnabled} /> : null, "forward")}{region(motionLayer(gallery, "reverse"))}</>;
  } else if (layout === "carousel") {
    const carousel = cards.length || mediaCards.length ? <Carousel>{cards.length ? cards : mediaCards}</Carousel> : null;
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" motionEnabled={sectionMotionEnabled} /> : null, "forward")}{region(motionLayer(carousel, "reverse"))}</>;
  } else if (layout === "timeline") {
    const timeline = items.length ? <Timeline items={items} orientation={block.timelineOrientation} /> : null;
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" motionEnabled={sectionMotionEnabled} /> : null, "forward")}{region(motionLayer(timeline, "reverse"))}</>;
  } else if (layout === "horizontal-scroll") {
    body = <>{header ? <TextBlock content={header} className="section__header" motionEnabled={sectionMotionEnabled} /> : null}{region(horizontalItemsWithMotion.length ? <HorizontalScroll>{horizontalItemsWithMotion}</HorizontalScroll> : null)}</>;
  } else if (layout === "content-switcher") {
    body = <>{header ? <TextBlock content={header} className="section__header" motionEnabled={sectionMotionEnabled} /> : null}{region(switcherItems.length ? <ContentSwitcher items={switcherItems} /> : null)}</>;
  } else if (layout === "media") {
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" motionEnabled={sectionMotionEnabled} /> : null, "forward")}{region(motionLayer(media ? <Media media={media} className="section__media" /> : null, "reverse"))}</>;
  } else {
    const content = <>{media ? <Media media={media} className="section__media" /> : null}{form ? <Form schema={form} /> : null}{cardsCollection}</>;
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" motionEnabled={sectionMotionEnabled} /> : null, "forward")}{region(motionLayer(media || form || cardsCollection ? content : null, "reverse"))}</>;
  }

  const mediaOverlayScene = shouldTrackScroll && !isHomeOpening && layout === "media-overlay" ? <ScrollScene preset={scenePreset} intensity={sceneIntensity} range={sceneRange} className="section__scrollScene" decorative={false} progress={scrollProgress}><div className="section__inner">{body}</div></ScrollScene> : null;
  const renderedLayout = isHomeOpening ? "opening" : isProfileGrid ? "split" : layout;

  return <motion.section id={block.id} className={clsx("section", block.frame && "frame", block.className)} data-layout={renderedLayout} data-variant={block.variant} data-split-variant={block.splitVariant} data-tone={block.tone} data-visual-context={visualContext} data-surface={ownsVisualPlane ? block.surface : undefined} data-color={ownsVisualPlane ? block.color : undefined} data-source={block.source?.collection} data-featured={block.source?.query?.featured === true ? "true" : undefined} data-motion={motionLevel} data-motion-preset={scenePreset} data-motion-range={block.motionRange} data-motion-intensity={sceneIntensity}>
    {mediaOverlayScene ?? (shouldReveal ? <motion.div className="section__inner" initial={{ opacity: 0, y: motionConfig.distance.subtle }} whileInView={{ opacity: 1, y: 0 }} viewport={motionConfig.viewport} transition={{ duration: motionConfig.duration.slow, ease: motionConfig.easing.standard }}>{body}</motion.div> : <div className="section__inner">{body}</div>)}
  </motion.section>;
}
