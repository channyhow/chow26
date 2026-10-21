import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { motion, type MotionValue } from "motion/react";

import { CardItem } from "@/components/content/CardItem";
import { OfferSwitcher } from "@/components/section/OfferSwitcher";
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
import { EditorialGrid, EditorialGridItem } from "@/components/layout/EditorialGrid";
import { ScrollScene } from "@/components/layout/ScrollScene";
import { Split } from "@/components/layout/Split";
import { HomeOpeningScene } from "@/components/section/HomeOpeningScene";
import { HomeDigitalRotation } from "@/components/section/HomeDigitalRotation";
import { StudioIntroMedia } from "@/components/section/StudioIntroMedia";
import { LinkProjectRotation } from "@/components/section/LinkProjectRotation";
import { useMobileMediaRotation } from "@/hooks/useMobileMediaRotation";
import { forms } from "@/data";
import { getActionHref } from "@/data/actionRegistry";
import { resolveCollection } from "@/data/resolve";
import { resolveMedia, resolveMediaList } from "@/data/resolveMedia";
import { resolveSplitComposition } from "@/data/splitCompositions";
import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";
import type { MotionIntensity, ScrollMotionPreset, SectionBlock } from "@/types/content";
import type { FormSchema } from "@/types/forms";

export type SectionProps = { block: SectionBlock; suppressSceneMotion?: boolean; visualContext?: "own" | "inherit"; scrollProgress?: MotionValue<number>; parallaxEnabled?: boolean; };
const formRegistry = forms as Record<string, FormSchema>;
const mobileCarouselQuery = "(max-width: 29.999rem)";

export function Section({ block, suppressSceneMotion = false, visualContext = "own", scrollProgress, parallaxEnabled = false }: SectionProps) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const layout = block.layout ?? "text";
  const ownsVisualPlane = visualContext === "own";
  const header = block.content?.header;
  const items = [...(block.content?.items ?? []), ...resolveCollection(block.source)];
  const splitItem = layout === "split" && items.length === 1 ? items[0] : undefined;
  const serviceMediaCount = splitItem ? resolveMediaList(splitItem.media).length : 0;
  const serviceRotation = useMobileMediaRotation(serviceMediaCount);
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
  // Section scene motion and component-level reveals are independent.
  // A block with motion: "none" disables its outer scene, not TextBlock or media motion.
  const sectionMotionEnabled = motionEnabled && !suppressSceneMotion;
  const sceneMotionEnabled = sectionMotionEnabled && motionLevel !== "none";
  const isHorizontalTimeline = layout === "timeline" && block.timelineOrientation === "horizontal";
  const ownsScrollInteraction = layout === "horizontal-scroll" || layout === "content-switcher" || isHorizontalTimeline;
  const isLongFormList = layout === "list";
  const usesScrollMotion = motionLevel === "micro" || motionLevel === "scene";
  const shouldTrackScroll = sceneMotionEnabled && usesScrollMotion && !ownsScrollInteraction && !isLongFormList;
  const scenePreset: ScrollMotionPreset = block.motionPreset ?? (layout === "split" ? "recede" : motionLevel === "micro" ? "drift" : "parallax");
  const sceneRange = block.motionRange ?? "through";
  const sceneIntensity: MotionIntensity = block.motionIntensity ?? (layout === "split" ? "quiet" : motionLevel === "micro" ? "quiet" : "default");
  const isHomeOpening = block.id === "home-opening";
  const isServiceCollection = block.source?.collection === "services";
  const gridOwnsReveal = items.length > 0 && (layout === "grid" || layout === "text" || layout === "split" || layout === "list");
  const shouldReveal = sceneMotionEnabled && motionLevel === "reveal" && !shouldTrackScroll && !gridOwnsReveal && !isLongFormList;
  const isProjectHero = block.className?.split(/\s+/).includes("projectHero") ?? false;
  const isProjectStoryMedia = block.className?.split(/\s+/).includes("projectStoryMedia") ?? false;
  const isProjectStoryText = block.className?.split(/\s+/).includes("projectStoryText") ?? false;
  const isProjectStoryAlternate = block.className?.split(/\s+/).includes("projectDetail__story--alternate") ?? false;
  const isHomeFeaturedProject = block.className?.split(/\s+/).includes("homeFeaturedProject") ?? false;
  const isHomeOpenCall = block.className?.split(/\s+/).includes("home-preview--opencall") ?? false;
  const isHomeContact = block.className?.split(/\s+/).includes("home-preview--contact") ?? false;
  const isHomePreview = block.className?.split(/\s+/).includes("home-preview") ?? false;
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
  const cardsCollection = cards.length ? (useProjectCarouselOnMobile ? <Carousel>{cards}</Carousel> : <Grid progressive={Boolean(block.progressive)} motionPreset={block.motionPreset} placements={items.map((item) => item.grid)} motionEnabled={sceneMotionEnabled && !isLongFormList} scrollLinked={sceneMotionEnabled && !isLongFormList}>{cards}</Grid>) : null;
  const mediaCards = mediaItems.map((item) => block.id === "studio-services-intro"
    ? <ScrollScene key={item.id} preset="parallax" intensity="quiet" direction="reverse" className="studioIntro__mediaMotion" enabled={sectionMotionEnabled} progress={scrollProgress}><Media media={item} /></ScrollScene>
    : <Media key={item.id} media={item} />);
  const secondary = media ? <Media media={media} sizes="(min-width: 64rem) 50vw, 100vw" /> : form ? <Form schema={form} /> : cardsCollection;
  const switcherItems = items.flatMap((item, index) => {
    const id = item.id ?? `item-${index + 1}`;
    const label = item.title ?? (typeof item.eyebrow === "string" ? item.eyebrow : item.eyebrow?.[0]);
    if (!label) return [];
    return [{ id, label, content: renderCard(item, index) }];
  });
  const horizontalItems = cards.length ? cards : mediaCards;
  const horizontalItemsWithMotion = horizontalItems.map((item, index) => <ScrollScene key={`horizontal-motion-${index}`} preset="drift" intensity={sceneIntensity} direction={index % 2 === 0 ? "forward" : "reverse"} range="through" className="section__horizontalScrollLayer" decorative={false} enabled={sectionMotionEnabled}>{item}</ScrollScene>);
  // Explicit layer roles keep motion independent of CSS class naming.
  const motionLayer = (
    content: ReactNode,
    direction: "forward" | "reverse" = "forward",
    className = "section__scrollLayer",
    intensity: MotionIntensity = sceneIntensity,
    role: "content" | "media" | "editorial-text" = "content",
  ) => {
    if (!content || !shouldTrackScroll) return content ?? null;
    const isMedia = role === "media";
    const isEditorialText = role === "editorial-text";
    return (
      <ScrollScene
        preset={isMedia || isEditorialText ? "parallax" : scenePreset}
        intensity={isMedia ? "expressive" : isEditorialText ? "quiet" : intensity}
        direction={direction}
        range={sceneRange}
        className={className}
        decorative={false}
        progress={scrollProgress}
      >
        {content}
      </ScrollScene>
    );
  };
  const region = (content: ReactNode, className?: string) => content ? <div className={clsx("section__body", className)}>{content}</div> : null;
  let body: ReactNode;

  if (isHomeOpening) {
    body = <HomeOpeningScene header={header} media={mediaItems} parallaxEnabled={parallaxEnabled} />;
  } else if (block.id === "studio-services-intro") {
    const introItems = mediaCards.map((card, index) => {
      const ref = header?.links?.[index];
      const href = typeof ref === "string" ? getActionHref(ref) : ref?.href;
      const label = typeof ref === "string"
        ? ["Créer une identité visuelle", "Concevoir un site web", "Supports de communication"][index] ?? "Voir le service"
        : ref?.label ?? "Voir le service";
      return { content: card, href, label };
    });
    body = <div className="studioIntro__composition">
      <StudioIntroMedia items={introItems} />
      {header ? <div className="studioIntro__story"><TextBlock content={{ subtitle: header.subtitle, text: header.text, links: header.links }} subtitleVariant="editorial" className="studioIntro__details" motionEnabled={sectionMotionEnabled} /></div> : null}
    </div>;
  } else if (isProjectHero) {
    const projectStatement = header?.subtitle ? <TextBlock content={{ subtitle: header.subtitle }} subtitleVariant="hero" className="projectHero__statement" motionEnabled={sectionMotionEnabled} /> : null;
    const projectIdentity = header?.title ? <TextBlock content={{ title: header.title }} titleAs="h1" titleVariant="hero" className="projectHero__identity" motionEnabled={sectionMotionEnabled} /> : null;
    const projectMedia = media ? <Media media={media} className="projectHero__media" sizes="(min-width: 64rem) 100vw, 100vw" /> : null;
    const projectMeta = header?.meta ? <TextBlock content={{ meta: header.meta }} metaVariant="project" className="projectHero__meta" motionEnabled={sectionMotionEnabled} /> : null;
    body = <EditorialGrid className="projectHero__composition">
      {projectStatement ? <EditorialGridItem area="heading" className="projectHero__statement">{projectStatement}</EditorialGridItem> : null}
      {projectIdentity ? <EditorialGridItem area="title" className="projectHero__identity">{projectIdentity}</EditorialGridItem> : null}
      {projectMedia ? <EditorialGridItem area="media" className="projectHero__media"><ScrollScene preset="parallax" intensity="quiet" direction="reverse" enabled={sectionMotionEnabled} progress={scrollProgress}>{projectMedia}</ScrollScene></EditorialGridItem> : null}
      {projectMeta ? <EditorialGridItem area="description" className="projectHero__meta">{projectMeta}</EditorialGridItem> : null}
    </EditorialGrid>;
  } else if (block.id === "home-services" && header) {
    const paragraphs = Array.isArray(header.text) ? header.text : header.text ? [header.text] : [];
    const identity = { title: header.title, text: paragraphs.slice(0, 2) };
    const applications = { title: "Une identité qui vous accompagne.", text: paragraphs.slice(2, 3) };
    const web = {
      title: "Votre identité prend vie en ligne.",
      text: paragraphs.slice(3).map((paragraph) => paragraph.replace(/^Et sur le web\s*\?\s*/i, "")),
    };
    const identityMedia = resolveMedia("flo-wordmark");
    const applicationMedia = resolveMedia("flo-business-card");
    const storyMedia = (item: typeof identityMedia) => item
      ? <div className="homeServicesStory__media"><Media media={item} sizes="(min-width: 64rem) 36vw, 100vw" /></div>
      : null;
    body = <article className="homeServicesStory">
      <div className="homeServicesStory__row homeServicesStory__row--reverse">
        <div className="homeServicesStory__copy"><TextBlock content={identity} motionEnabled={sectionMotionEnabled} /></div>
        {storyMedia(identityMedia)}
      </div>
      <div className="homeServicesStory__row">
        {storyMedia(applicationMedia)}
        <div className="homeServicesStory__copy"><TextBlock content={applications} motionEnabled={sectionMotionEnabled} /></div>
      </div>
      <div className="homeServicesStory__row homeServicesStory__row--reverse">
        <div className="homeServicesStory__copy">
          <TextBlock content={web} motionEnabled={sectionMotionEnabled} />
          <Actions links={header.links} />
        </div>
        <HomeDigitalRotation />
      </div>
      {resolveMedia("flo-wall") && <div className="homeServicesStory__fullBleed"><Media media={resolveMedia("flo-wall")!} sizes="100vw" /></div>}
    </article>;
  } else if (isHomeContact && header) {
    const contactMedia = media ? motionLayer(<Media media={media} sizes="(min-width: 64rem) 42vw, 100vw" />, "reverse", "homeContact__media", "quiet", "media") : null;
    const contactStory = motionLayer(<TextBlock content={header} titleVariant="contact" motionEnabled={sectionMotionEnabled} />, "forward", "homeContact__story", "quiet", "editorial-text");
    body = <article className="homeEditorialComposition homeContact__composition"><div className="homeContact__index" aria-hidden="true">Contact</div>{contactStory}{contactMedia}</article>;
  } else if (isHomeOpenCall && header) {
    const openCallMedia = media ? <div className="homeOpenCall__media">{motionLayer(<Media media={media} sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 30vw, 100vw" />, "reverse", "homeOpenCall__mediaMotion", "default", "media")}</div> : null;
    const openCallIntro = {
      eyebrow: header.eyebrow,
      text: header.text,
    };
    const openCallStatement = <div className="homeOpenCall__statement"><TextBlock content={{ title: header.title }} titleVariant="display" motionEnabled={sectionMotionEnabled} /></div>;
    body = <article className="homeEditorialComposition homeOpenCall__composition">{openCallStatement}{openCallMedia}<div className="homeOpenCall__details"><TextBlock content={openCallIntro} className="homeOpenCall__context" copyVariant="prominent" motionEnabled={sectionMotionEnabled} /><Actions links={header.links} className="homeOpenCall__action" /></div></article>;
  } else if (isHomeFeaturedProject && splitItem) {
    const featuredMedia = splitItemMedia ? <div className="homeFeaturedProject__media">{<ScrollScene preset="parallax" intensity="quiet" direction="reverse" className="homeFeaturedProject__mediaMotion" enabled={sectionMotionEnabled} progress={scrollProgress}><Media media={splitItemMedia} priority sizes="(min-width: 64rem) 66vw, 100vw" /></ScrollScene>}</div> : null;
    const featuredStory = {
      eyebrow: header?.eyebrow,
      title: [splitItem.title, splitItem.subtitle].filter(Boolean).join(" > "),
      text: header?.text,
      meta: splitItem.meta,
      links: header?.projectLinks,
    };
    const featuredStoryLayer = <div className="homeFeaturedProject__story"><TextBlock content={featuredStory} titleVariant="feature" motionEnabled={sectionMotionEnabled} /></div>;
    body = <article className="homeEditorialComposition homeFeaturedProject__composition"><div className="homeFeaturedProject__index" aria-label="Projet à la une"><span>Ce mois-ci</span><Actions links={header?.links} className="homeFeaturedProject__archive" /></div>{featuredMedia}{featuredStoryLayer}</article>;
  } else if (layout === "split") {
    const primaryContent = splitItem ? { ...splitItem, media: undefined, offers: undefined } : header;
    const primary = primaryContent ? <TextBlock content={primaryContent} subtitleVariant={block.id === "home-services" ? "editorial" : "default"} metaVariant={isServiceCollection ? "rows" : "default"} copyVariant={isProjectStoryMedia ? "story" : "default"} motionEnabled={sectionMotionEnabled} /> : null;
    const isHomeServices = block.id === "home-services";
    const homeServiceMedia = isHomeServices && mediaItems.length > 1
      ? <div className="homeServices__mediaList">
          {mediaItems.map((item) => <Media key={item.id} media={item} sizes="(min-width: 64rem) 42vw, 100vw" />)}
        </div>
      : null;
    const splitSecondary = homeServiceMedia ?? (splitItemMedia ? <Media media={splitItemMedia} sizes="(min-width: 64rem) 50vw, 100vw" /> : secondary);
    // Multiple media share the same media region; a single image remains unchanged.
    const studioMediaItems = resolveMediaList(splitItem?.media);
    const studioMedia = studioMediaItems.length > 1
      ? <div className="studioServiceGrid__mediaList">
          {studioMediaItems.map((item, index) => (
            <Media key={index} media={item} sizes="(min-width: 64rem) 25vw, 100vw" />
          ))}
        </div>
      : splitSecondary;

    // Keep split media in normal flow so lazy-loaded assets have stable
    // viewport geometry. Text keeps its existing reveal through TextBlock.
    const isStudioService = isServiceCollection && block.className?.split(/\s+/).includes("section--collection-panel");
    const mediaLayer = isHomePreview
      ? motionLayer(splitSecondary, "reverse", "section__homePreviewMediaMotion", "quiet", "media")
      : isStudioService
        ? motionLayer(splitSecondary, "reverse", "section__studioServiceMediaMotion", "default", "media")
        : splitSecondary;
    const textLayer = isHomePreview ? motionLayer(primary, "forward", "section__homePreviewTextMotion", "quiet", "editorial-text") : primary;
    const mediaContent = mediaLayer ? <div className="section__splitMediaMotion">{mediaLayer}</div> : null;
    const textContent = textLayer ? <div className="section__splitTextMotion">{textLayer}</div> : null;
    const offers = splitItem?.offers ?? [];
    const offerGrid = isServiceCollection && offers.length > 1 ? <OfferSwitcher offers={offers} /> : offers.length > 0 ? <div className="section__offerGrid">{offers.map((offer, index) => <CardItem key={offer.id ?? `offer-${index + 1}`} item={offer} variant="service" metaVariant="specs" />)}</div> : null;
    // Parallax stays inside each grid cell; placement belongs to EditorialGrid.
    const studioServiceMedia = (item: NonNullable<typeof media>, direction: "forward" | "reverse" = "reverse") => (
      <ScrollScene
        preset="parallax"
        intensity="quiet"
        direction={direction}
        className="studioServiceGrid__mediaMotion"
        enabled={sectionMotionEnabled}
        progress={scrollProgress}
      >
        <Media media={item} priority sizes="(min-width: 64rem) 42vw, 100vw" />
      </ScrollScene>
    );
    if (isProjectStoryMedia) {
      // Editorial placement is independent of media motion and DOM reading order.
      const storyMedia = splitSecondary ? (
        <ScrollScene preset="parallax" intensity="quiet" direction={isProjectStoryAlternate ? "forward" : "reverse"} enabled={sectionMotionEnabled} className="projectStoryMedia__motion" progress={scrollProgress}>
          {splitSecondary}
        </ScrollScene>
      ) : null;
      body = <EditorialGrid className={clsx("projectStoryMedia__composition", isProjectStoryAlternate && "projectStoryMedia__composition--alternate")}>
        {primary ? <EditorialGridItem area="description" placement={{ start: isProjectStoryAlternate ? 2 : 8, span: 4 }}>{primary}</EditorialGridItem> : null}
        {storyMedia ? <EditorialGridItem area="media" preset={isProjectStoryAlternate ? "right" : undefined} placement={isProjectStoryAlternate ? undefined : { start: 2, span: 5 }}>{storyMedia}</EditorialGridItem> : null}
      </EditorialGrid>;
    } else if (block.id === "home-services" || block.id === "final-cta") {
      const isHomeServicesGrid = block.id === "home-services";
      body = <EditorialGrid className={clsx("sectionEditorialGrid", isHomeServicesGrid ? "sectionEditorialGrid--homeServices" : "sectionEditorialGrid--finalCta")}>
        {textContent ? <EditorialGridItem area="description" preset={isHomeServicesGrid ? "right" : undefined} placement={isHomeServicesGrid ? undefined : { start: 2, span: 4 }}>{textContent}</EditorialGridItem> : null}
        {mediaContent ? <EditorialGridItem area="media" preset={isHomeServicesGrid ? "left" : "right"}>{mediaContent}</EditorialGridItem> : null}
      </EditorialGrid>;
    } else if (block.className?.split(/\s+/).includes("section--founder") || block.id === "contact-default") {
      body = <EditorialGrid className={clsx("sectionEditorialGrid", block.id === "contact-default" ? "sectionEditorialGrid--contact" : "sectionEditorialGrid--founder")}>
        {primary ? <EditorialGridItem area="description" preset="left">{textContent}</EditorialGridItem> : null}
        {mediaContent ? <EditorialGridItem area="media" preset={block.id === "contact-default" ? "right" : undefined} placement={block.id === "contact-default" ? undefined : { start: 10, span: 3 }}>{mediaContent}</EditorialGridItem> : null}
      </EditorialGrid>;
    } else if (isStudioService && splitItem) {
      // Distinct semantic grid items keep text visible and independent of
      // split/motion wrappers. DOM order matches the mobile reading order.
      const title = <TextBlock content={{ eyebrow: splitItem.eyebrow, title: splitItem.title }} motionEnabled={sectionMotionEnabled} />;
      const description = <TextBlock content={{ subtitle: splitItem.subtitle, text: splitItem.text }} subtitleVariant="editorial-responsive" motionEnabled={sectionMotionEnabled} />;
      body = (
        <EditorialGrid className={clsx("studioServiceGrid", studioMediaItems.length > 1 && "studioServiceGrid--paired")}>
          <EditorialGridItem area="title">{title}</EditorialGridItem>
          {studioMediaItems.length > 1 ? <EditorialGridItem area="media" className="studioServiceGrid__rotatingMedia" preset="left"><div className="studioServiceGrid__rotatingFrame" data-active={serviceRotation.active === 0 ? "true" : "false"}>{studioServiceMedia(studioMediaItems[0])}</div></EditorialGridItem> : <EditorialGridItem area="media" preset="left">{studioMediaItems[0] ? studioServiceMedia(studioMediaItems[0]) : studioMedia}</EditorialGridItem>}
          <EditorialGridItem area="description" preset="right">{description}</EditorialGridItem>
          {studioMediaItems.length > 1 ? <EditorialGridItem area="media" className="studioServiceGrid__secondMedia studioServiceGrid__rotatingMedia" preset="left"><div className="studioServiceGrid__rotatingFrame" data-active={serviceRotation.active === 1 ? "true" : "false"}>{studioServiceMedia(studioMediaItems[1], "forward")}</div></EditorialGridItem> : null}
          {offerGrid ? <EditorialGridItem area="offers">{offerGrid}</EditorialGridItem> : null}
        </EditorialGrid>
      );
    } else {
      body = <><Split variant={block.splitVariant} {...splitCompositionProps} primary={textContent} secondary={mediaContent} primaryRole="content" secondaryRole="media" />{region(offerGrid, "section__offers")}</>;
    }
  } else if (isProfileGrid) {
    const profile = items[0];
    const profileMediaRef = Array.isArray(profile.media) ? profile.media[0] : profile.media;
    const profileMedia = resolveMedia(profileMediaRef);
    const primary = profileMedia ? <Media media={profileMedia} sizes="(min-width: 64rem) 50vw, 100vw" /> : null;
    const secondaryContent = { ...profile, media: undefined };
    const profileMediaLayer = motionLayer(primary, "reverse", "section__profileMediaMotion", "quiet", "media");
    const profileTextLayer = motionLayer(<TextBlock content={secondaryContent} className="split__content" motionEnabled={sectionMotionEnabled} />, "forward", "section__profileTextMotion", "quiet", "editorial-text");
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
    body = <>{motionLayer(header ? <TextBlock content={header} className="section__header" copyVariant={isProjectStoryText ? "story-lead" : "default"} betweenGroups={block.id === "linkpage-navigation" ? <LinkProjectRotation /> : undefined} motionEnabled={sectionMotionEnabled} /> : null, "forward")}{region(motionLayer(media || form || cardsCollection ? content : null, "reverse"))}</>;
  }

  const mediaOverlayScene = shouldTrackScroll && !isHomeOpening && layout === "media-overlay" ? <ScrollScene preset={scenePreset} intensity={sceneIntensity} range={sceneRange} className="section__scrollScene" decorative={false} progress={scrollProgress}><div className="section__inner">{body}</div></ScrollScene> : null;
  const renderedLayout = isHomeOpening ? "opening" : isProfileGrid ? "split" : layout;

  return <motion.section id={block.id} className={clsx("section", block.frame && "frame", block.className)} data-layout={renderedLayout} data-variant={block.variant} data-split-variant={block.splitVariant} data-tone={block.tone} data-visual-context={visualContext} data-surface={ownsVisualPlane ? block.surface : undefined} data-color={ownsVisualPlane ? block.color : undefined} data-source={block.source?.collection} data-featured={block.source?.query?.featured === true ? "true" : undefined} data-motion={motionLevel} data-motion-preset={scenePreset} data-motion-range={block.motionRange} data-motion-intensity={sceneIntensity}>
    {mediaOverlayScene ?? (shouldReveal ? <motion.div className="section__inner" initial={{ opacity: 0, y: motionConfig.distance.subtle }} whileInView={{ opacity: 1, y: 0 }} viewport={motionConfig.viewport} transition={{ duration: motionConfig.duration.slow, ease: motionConfig.easing.standard }}>{body}</motion.div> : <div className="section__inner">{body}</div>)}
  </motion.section>;
}
