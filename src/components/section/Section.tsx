import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, type MotionValue } from "motion/react";

import { CardItem } from "@/components/content/CardItem";
import { Carousel } from "@/components/content/Carousel";
import { ContentSwitcher } from "@/components/content/ContentSwitcher";
import { Gallery } from "@/components/content/Gallery";
import { HorizontalScroll } from "@/components/content/HorizontalScroll";
import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { Timeline } from "@/components/content/Timeline";
import { Form } from "@/components/forms/Form";
import { Grid } from "@/components/layout/Grid";
import { ScrollScene } from "@/components/layout/ScrollScene";
import { Split } from "@/components/layout/Split";
import { forms } from "@/data";
import { resolveCollection } from "@/data/resolve";
import { resolveMedia, resolveMediaList } from "@/data/resolveMedia";
import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";
import type { CardVariant, MotionIntensity, ScrollMotionPreset, SectionBlock } from "@/types/content";
import type { FormSchema } from "@/types/forms";

export type SectionProps = { block: SectionBlock; suppressSceneMotion?: boolean; visualContext?: "own" | "inherit"; scrollProgress?: MotionValue<number>; };
const formRegistry = forms as Record<string, FormSchema>;
const mobileCarouselQuery = "(max-width: 29.999rem)";

export function Section({ block, suppressSceneMotion = false, visualContext = "own", scrollProgress }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const layout = block.layout ?? "text";
  const ownsVisualPlane = visualContext === "own";
  const header = block.content?.header;
  const items = [...(block.content?.items ?? []), ...resolveCollection(block.source)];
  const splitItem = layout === "split" && items.length === 1 ? items[0] : undefined;
  const formRef = block.content?.form;
  const form = typeof formRef === "string" ? formRegistry[formRef] : formRef;
  const mediaItems = resolveMediaList(block.content?.media);
  const media = mediaItems[0];
  const splitItemMediaRef = splitItem ? (Array.isArray(splitItem.media) ? splitItem.media[0] : splitItem.media) : undefined;
  const splitItemMedia = resolveMedia(splitItemMediaRef);
  const motionEnabled = siteData.ui.experience.sectionReveal;
  const motionLevel = block.motion ?? (layout === "split" ? "scene" : "micro");
  const isHorizontalTimeline = layout === "timeline" && block.timelineOrientation === "horizontal";
  const ownsScrollInteraction = layout === "horizontal-scroll" || layout === "content-switcher" || isHorizontalTimeline;
  const isLongFormList = layout === "list";
  const usesScrollMotion = motionLevel === "micro" || motionLevel === "scene";
  const shouldTrackScroll = motionEnabled && usesScrollMotion && !suppressSceneMotion && !ownsScrollInteraction && !isLongFormList;
  const scenePreset: ScrollMotionPreset = block.motionPreset ?? (layout === "split" ? "recede" : motionLevel === "micro" ? "drift" : "parallax");
  const sceneRange = block.motionRange ?? "through";
  const sceneIntensity: MotionIntensity = block.motionIntensity ?? (layout === "split" ? "quiet" : motionLevel === "micro" ? "quiet" : "default");
  const isHomeOpening = block.id === "home-opening";
  const gridOwnsReveal = items.length > 0 && (layout === "grid" || layout === "text" || layout === "split" || layout === "list");
  const shouldReveal = motionEnabled && motionLevel === "reveal" && !shouldTrackScroll && !gridOwnsReveal && !ownsScrollInteraction;
  const isFeaturedProjectGrid = layout === "grid" && block.source?.collection === "projects" && block.source.query?.featured === true;
  const isStructuredEditorialList = layout === "list" && items.some((item) => Boolean(item.grid));
  const isProfileGrid = layout === "grid" && items.length === 1 && Boolean(items[0]?.media) && Boolean(items[0]?.subtitle) && !items[0]?.title;
  const isServiceCollection = block.source?.collection === "services";
  const cardVariant = block.itemAppearance?.variant ?? (isServiceCollection ? "service" : isStructuredEditorialList ? "editorial" : "default");
  const useProjectCarouselOnMobile = isMobileViewport && isFeaturedProjectGrid;
  const projectGridLead = header && !useProjectCarouselOnMobile && isFeaturedProjectGrid
    ? <TextBlock content={{ title: header.title }} className="section__gridLead" />
    : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileCarouselQuery);
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const renderCard = (item: (typeof items)[number], index?: number) => <CardItem key={item.id ?? `${item.title ?? "item"}-${index ?? 0}`} item={item} frame={block.itemAppearance?.frame} effect={block.itemAppearance?.effect} variant={cardVariant} />;
  const cards = items.map(renderCard);
  const cardsCollection = cards.length ? (useProjectCarouselOnMobile ? <Carousel>{cards}</Carousel> : <Grid progressive={Boolean(block.progressive)} lead={projectGridLead} motionPreset={block.motionPreset} placements={items.map((item) => item.grid)} motionEnabled={motionEnabled && motionLevel !== "none" && !isLongFormList} scrollLinked={motionEnabled && motionLevel !== "none" && !isLongFormList}>{cards}</Grid>) : null;
  const mediaCards = mediaItems.map((item) => <Media key={item.id} media={item} />);
  const secondary = media ? <Media media={media} sizes="(min-width: 64rem) 50vw, 100vw" /> : form ? <Form schema={form} /> : cardsCollection;
  const switcherItems = items.flatMap((item, index) => {
    const id = item.id ?? `item-${index + 1}`;
    const label = item.title ?? (typeof item.eyebrow === "string" ? item.eyebrow : item.eyebrow?.[0]);
    if (!label) return [];
    return [{ id, label, content: renderCard(item, index) }];
  });
  const horizontalItems = cards.length ? cards : mediaCards;
  const horizontalMotionEnabled = motionEnabled && motionLevel !== "none" && !suppressSceneMotion;
  const horizontalMotionItems = horizontalItems.map((item, index) => <ScrollScene key={`horizontal-motion-${index}`} preset="drift" intensity={sceneIntensity} direction={index % 2 === 0 ? "forward" : "reverse"} range="through" className="section__horizontalScrollLayer" decorative={false} enabled={horizontalMotionEnabled}>{item}</ScrollScene>);
  const motionLayer = (content: ReactNode, direction: "forward" | "reverse" = "forward", className = "section__scrollLayer") => content ? (shouldTrackScroll ? <ScrollScene preset={scenePreset} intensity={sceneIntensity} direction={direction} range={sceneRange} className={className} decorative={false} progress={scrollProgress}>{content}</ScrollScene> : content) : null;
  const region = (content: ReactNode, className?: string) => content ? <div className={clsx("section__body", className)}>{content}</div> : null;
  let body: ReactNode;

  if (layout === "split") {
    const primaryContent = splitItem ? { ...splitItem, media: undefined, offers: undefined } : header;
    const primary = primaryContent ? <TextBlock content={primaryContent} metaVariant={isServiceCollection ? "rows" : "default"} /> : null;
    const splitSecondary = splitItemMedia ? <Media media={splitItemMedia} sizes="(min-width: 64rem) 50vw, 100vw" /> : secondary;
    const splitMotionEnabled = motionEnabled && motionLevel !== "none" && !suppressSceneMotion;
    const mediaLayer = splitSecondary ? <motion.div className="section__splitMediaMotion" initial={splitMotionEnabled ? { opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.996 } : false} whileInView={splitMotionEnabled ? { opacity: 1, y: 0, scale: 1 } : undefined} viewport={motionConfig.viewport} transition={{ duration: reduceMotion ? motionConfig.reduced.duration : 0.82, ease: motionConfig.easing.soft }}>{splitSecondary}</motion.div> : null;
    const textLayer = primary ? <motion.div className="section__splitTextMotion" initial={splitMotionEnabled ? { opacity: 0, y: reduceMotion ? 0 : 10 } : false} whileInView={splitMotionEnabled ? { opacity: 1, y: 0 } : undefined} viewport={motionConfig.viewport} transition={{ duration: reduceMotion ? motionConfig.reduced.duration : 0.78, delay: reduceMotion ? motionConfig.reduced.stagger : 0.11, ease: motionConfig.easing.soft }}>{primary}</motion.div> : null;
    const splitComposition = <Split variant={block.splitVariant} primary={textLayer} secondary={mediaLayer} primaryRole="content" secondaryRole="media" />;
    const offers = splitItem?.offers ?? [];
    const offerCarousel = offers.length > 0
      ? <Carousel label={`${splitItem?.title ?? "Service"} — offres`}>{offers.map((offer, index) => <CardItem key={offer.id ?? `offer-${index + 1}`} item={offer} variant="editorial" />)}</Carousel>
      : null;
    body = <>{motionLayer(splitComposition, "forward", "section__splitScrollLayer")}{region(offerCarousel, "section__offers")}</>;
  } else if (isProfileGrid) {
    const profile = items[0];
    const profileMediaRef = Array.isArray(profile.media) ? profile.media[0] : profile.media;
    const profileMedia = resolveMedia(profileMediaRef);
    const primary = profileMedia ? <Media media={profileMedia} sizes="(min-width: 64rem) 50vw, 100vw" /> : null;
    const secondaryContent = { ...profile, media: undefined };
    body = <Split variant={block.splitVariant ?? "media-lead"} className="split--profile" primary={primary} secondary={<TextBlock content={secondaryContent} className="split__content" />} primaryRole="media" secondaryRole="content" />;
  } else if (layout === "media-overlay") {
    body = <div className="section__mediaOverlay">{media ? <Media media={media} className="section__media" sizes="100vw" /> : null}{header ? <div className="section__overlayContent"><TextBlock content={header} titleAs="h1" className="section__header" /></div> : null}</div>;
  } else if (layout === "gallery") {
    const gallery = mediaItems.length ? <Gallery items={mediaItems} layout="editorial" /> : null;
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" /> : null, "forward")}{region(motionLayer(gallery, "reverse"))}</>;
  } else if (layout === "carousel") {
    const carousel = cards.length || mediaCards.length ? <Carousel>{cards.length ? cards : mediaCards}</Carousel> : null;
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" /> : null, "forward")}{region(motionLayer(carousel, "reverse"))}</>;
  } else if (layout === "timeline") {
    const timeline = items.length ? <Timeline items={items} orientation={block.timelineOrientation} /> : null;
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" /> : null, "forward")}{region(motionLayer(timeline, "reverse"))}</>;
  } else if (layout === "horizontal-scroll") {
    body = <>{header ? <TextBlock content={header} className="section__header" /> : null}{region(horizontalMotionItems.length ? <HorizontalScroll>{horizontalMotionItems}</HorizontalScroll> : null)}</>;
  } else if (layout === "content-switcher") {
    body = <>{header ? <TextBlock content={header} className="section__header" /> : null}{region(switcherItems.length ? <ContentSwitcher items={switcherItems} /> : null)}</>;
  } else if (layout === "media") {
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" /> : null, "forward")}{region(motionLayer(media ? <Media media={media} className="section__media" /> : null, "reverse"))}</>;
  } else {
    const content = <>{media ? <Media media={media} className="section__media" /> : null}{form ? <Form schema={form} /> : null}{cardsCollection}</>;
    body = <>{motionLayer(header && !projectGridLead ? <TextBlock content={header} className="section__header" /> : null, "forward")}{region(motionLayer(media || form || cardsCollection ? content : null, "reverse"))}</>;
  }

  const mediaOverlayScene = shouldTrackScroll && layout === "media-overlay" ? <ScrollScene preset={scenePreset} intensity={sceneIntensity} range={sceneRange} choreography={isHomeOpening ? "home-opening" : undefined} className="section__scrollScene" decorative={false} progress={scrollProgress}><div className="section__inner">{body}</div></ScrollScene> : null;
  const revealDistance = reduceMotion ? motionConfig.reduced.revealDistance : motionConfig.distance.subtle;
  const revealDuration = reduceMotion ? motionConfig.reduced.duration : motionConfig.duration.slow;

  return <motion.section id={block.id} className={clsx("section", block.frame && "frame", block.className)} data-layout={isProfileGrid ? "split" : layout} data-variant={block.variant} data-split-variant={block.splitVariant} data-tone={block.tone} data-visual-context={visualContext} data-surface={ownsVisualPlane ? block.surface : undefined} data-color={ownsVisualPlane ? block.color : undefined} data-source={block.source?.collection} data-featured={block.source?.query?.featured === true ? "true" : undefined} data-motion={motionLevel} data-motion-preset={scenePreset} data-motion-range={block.motionRange} data-motion-intensity={sceneIntensity}>
    {shouldTrackScroll && layout === "media-overlay" ? mediaOverlayScene : shouldTrackScroll ? <div className="section__inner">{body}</div> : shouldReveal ? <motion.div className="section__inner" initial={{ opacity: 0, y: revealDistance }} whileInView={{ opacity: 1, y: 0 }} viewport={motionConfig.viewport} transition={{ duration: revealDuration, ease: motionConfig.easing.standard }}>{body}</motion.div> : <div className="section__inner">{body}</div>}
  </motion.section>;
}