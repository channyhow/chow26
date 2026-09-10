import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";

import { Card } from "@/components/content/Card";
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
import { resolveMediaList } from "@/data/resolveMedia";
import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";
import type { MotionIntensity, ScrollMotionPreset, SectionBlock } from "@/types/content";
import type { FormSchema } from "@/types/forms";

export type SectionProps = {
  block: SectionBlock;
  suppressSceneMotion?: boolean;
  visualContext?: "own" | "inherit";
};

const formRegistry = forms as Record<string, FormSchema>;
const mobileCarouselQuery = "(max-width: 29.999rem)";

export function Section({ block, suppressSceneMotion = false, visualContext = "own" }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const layout = block.layout ?? "text";
  const ownsVisualPlane = visualContext === "own";
  const header = block.content?.header;
  const items = [...(block.content?.items ?? []), ...resolveCollection(block.source)];
  const formRef = block.content?.form;
  const form = typeof formRef === "string" ? formRegistry[formRef] : formRef;
  const mediaItems = resolveMediaList(block.content?.media);
  const media = mediaItems[0];
  const motionEnabled = siteData.ui.experience.sectionReveal && !reduceMotion;
  const motionLevel = block.motion ?? "micro";
  const isHorizontalTimeline = layout === "timeline" && block.timelineOrientation === "horizontal";
  const ownsScrollInteraction = layout === "horizontal-scroll" || layout === "content-switcher";
  const usesScrollMotion = motionLevel === "micro" || motionLevel === "scene";
  const shouldTrackScroll = motionEnabled && usesScrollMotion && !suppressSceneMotion && !isHorizontalTimeline && !ownsScrollInteraction;
  const scenePreset: ScrollMotionPreset = block.motionPreset ?? (motionLevel === "micro" ? "drift" : "parallax");
  const sceneRange = block.motionRange ?? "through";
  const sceneIntensity: MotionIntensity = block.motionIntensity ?? (motionLevel === "micro" ? "quiet" : "default");
  const gridOwnsReveal = items.length > 0 && (layout === "grid" || layout === "text" || layout === "split");
  const shouldReveal = motionEnabled && motionLevel === "reveal" && !shouldTrackScroll && !gridOwnsReveal && !ownsScrollInteraction;
  const useProjectCarouselOnMobile = isMobileViewport
    && layout === "grid"
    && block.source?.collection === "projects"
    && block.source.query?.featured === true;
  const projectGridLead = layout === "grid" && block.source?.collection === "projects" && header && !useProjectCarouselOnMobile
    ? <TextBlock content={{ title: header.title }} className="section__gridLead" />
    : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileCarouselQuery);
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const cards = items.map((item, index) => (
    <Card
      key={item.id ?? `${item.title ?? "item"}-${index}`}
      item={item}
      frame={block.itemAppearance?.frame}
      effect={block.itemAppearance?.effect}
    />
  ));
  const cardsCollection = cards.length ? (
    useProjectCarouselOnMobile ? (
      <Carousel>{cards}</Carousel>
    ) : (
      <Grid
        progressive={Boolean(block.progressive)}
        lead={projectGridLead}
        motionPreset={block.motionPreset}
        placements={items.map((item) => item.grid)}
        motionEnabled={motionEnabled && motionLevel !== "none"}
      >
        {cards}
      </Grid>
    )
  ) : null;
  const mediaCards = mediaItems.map((item) => <Media key={item.id} media={item} />);
  const secondary = media
    ? <Media media={media} sizes="(min-width: 64rem) 50vw, 100vw" />
    : form
      ? <Form schema={form} />
      : cardsCollection;
  const switcherItems = items.flatMap((item, index) => {
    const id = item.id ?? `item-${index + 1}`;
    const label = item.title ?? (typeof item.eyebrow === "string" ? item.eyebrow : item.eyebrow?.[0]);
    if (!label) return [];

    return [{
      id,
      label,
      content: <Card item={item} frame={block.itemAppearance?.frame} effect={block.itemAppearance?.effect} />,
    }];
  });
  const horizontalLabels = items.flatMap((item) => item.title ? [item.title] : []);
  const horizontalItems = cards.length ? cards : mediaCards;
  const horizontalMotionEnabled = motionEnabled && motionLevel !== "none" && !suppressSceneMotion;
  const horizontalMotionItems = horizontalItems.map((item, index) => (
    <ScrollScene
      key={`horizontal-motion-${index}`}
      preset="drift"
      intensity={sceneIntensity}
      direction={index % 2 === 0 ? "forward" : "reverse"}
      range="through"
      className="section__horizontalScrollLayer"
      decorative={false}
      enabled={horizontalMotionEnabled}
    >
      {item}
    </ScrollScene>
  ));

  const region = (content: ReactNode) => content ? <div className="section__body">{content}</div> : null;
  let body: ReactNode;

  if (layout === "split") {
    const primary = header ? <TextBlock content={header} /> : null;
    body = shouldTrackScroll ? (
      <Split
        primary={primary ? (
          <ScrollScene
            preset={scenePreset}
            intensity={sceneIntensity}
            direction="forward"
            range={sceneRange}
            className="section__scrollLayer"
            decorative={false}
          >
            {primary}
          </ScrollScene>
        ) : null}
        secondary={secondary ? (
          <ScrollScene
            preset={scenePreset}
            intensity={sceneIntensity}
            direction="reverse"
            range={sceneRange}
            className="section__scrollLayer"
            decorative={false}
          >
            {secondary}
          </ScrollScene>
        ) : null}
      />
    ) : <Split primary={primary} secondary={secondary} />;
  } else if (layout === "media-overlay") {
    body = (
      <div className="section__mediaOverlay">
        {media ? <Media media={media} className="section__media" sizes="100vw" /> : null}
        {header ? <div className="section__overlayContent"><TextBlock content={header} titleAs="h1" className="section__header" /></div> : null}
      </div>
    );
  } else if (layout === "gallery") {
    body = <>{header ? <TextBlock content={header} className="section__header" /> : null}{region(mediaItems.length ? <Gallery items={mediaItems} layout="editorial" /> : null)}</>;
  } else if (layout === "carousel") {
    body = <>{header ? <TextBlock content={header} className="section__header" /> : null}{region(cards.length || mediaCards.length ? <Carousel>{cards.length ? cards : mediaCards}</Carousel> : null)}</>;
  } else if (layout === "timeline") {
    body = <>{header ? <TextBlock content={header} className="section__header" /> : null}{region(items.length ? <Timeline items={items} orientation={block.timelineOrientation} /> : null)}</>;
  } else if (layout === "horizontal-scroll") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(horizontalMotionItems.length ? (
          <HorizontalScroll
            labels={horizontalLabels.length === cards.length ? horizontalLabels : undefined}
            preserveOnSmallScreens
          >
            {horizontalMotionItems}
          </HorizontalScroll>
        ) : null)}
      </>
    );
  } else if (layout === "content-switcher") {
    body = <>{header ? <TextBlock content={header} className="section__header" /> : null}{region(switcherItems.length ? <ContentSwitcher items={switcherItems} /> : null)}</>;
  } else if (layout === "media") {
    body = <>{header ? <TextBlock content={header} className="section__header" /> : null}{region(media ? <Media media={media} className="section__media" /> : null)}</>;
  } else {
    const content = <>{media ? <Media media={media} className="section__media" /> : null}{form ? <Form schema={form} /> : null}{cardsCollection}</>;
    body = <>{header && !projectGridLead ? <TextBlock content={header} className="section__header" /> : null}{region(media || form || cardsCollection ? content : null)}</>;
  }

  const sceneBody = shouldTrackScroll && layout !== "split" ? (
    <ScrollScene
      preset={scenePreset}
      intensity={sceneIntensity}
      range={sceneRange}
      className="section__scrollScene"
      decorative={false}
    >
      <div className="section__inner">{body}</div>
    </ScrollScene>
  ) : null;

  return (
    <motion.section
      id={block.id}
      className={clsx("section", block.frame && "frame", block.className)}
      data-layout={layout}
      data-variant={block.variant}
      data-tone={block.tone}
      data-visual-context={visualContext}
      data-surface={ownsVisualPlane ? block.surface : undefined}
      data-color={ownsVisualPlane ? block.color : undefined}
      data-source={block.source?.collection}
      data-featured={block.source?.query?.featured === true ? "true" : undefined}
      data-motion={motionLevel}
      data-motion-preset={block.motionPreset ?? (motionLevel === "micro" ? "drift" : undefined)}
      data-motion-range={block.motionRange}
      data-motion-intensity={sceneIntensity}
    >
      {shouldTrackScroll ? (
        layout === "split" ? <div className="section__inner">{body}</div> : sceneBody
      ) : (
        <motion.div
          className="section__inner"
          initial={shouldReveal ? { opacity: 0.92, y: motionConfig.distance.subtle } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={motionConfig.viewport}
          transition={{ duration: motionConfig.duration.slow, ease: motionConfig.easing.soft }}
        >
          {body}
        </motion.div>
      )}
    </motion.section>
  );
}
