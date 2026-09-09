import type { ReactNode } from "react";
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
import type { SectionBlock, SectionColor } from "@/types/content";
import type { FormSchema } from "@/types/forms";

export type SectionProps = {
  block: SectionBlock;
  suppressSceneMotion?: boolean;
  inheritedColor?: SectionColor;
};

const formRegistry = forms as Record<string, FormSchema>;

export function Section({ block, suppressSceneMotion = false, inheritedColor }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const layout = block.layout ?? "text";
  const effectiveColor = block.color ?? inheritedColor;
  const header = block.content?.header;
  const items = [...(block.content?.items ?? []), ...resolveCollection(block.source)];
  const formRef = block.content?.form;
  const form = typeof formRef === "string" ? formRegistry[formRef] : formRef;
  const mediaItems = resolveMediaList(block.content?.media);
  const media = mediaItems[0];
  const motionEnabled = siteData.ui.experience.sectionReveal && !reduceMotion;
  const isHorizontalTimeline = layout === "timeline" && block.timelineOrientation === "horizontal";
  const shouldTrackScroll = motionEnabled && block.motion === "scene" && !suppressSceneMotion && !isHorizontalTimeline;
  const scenePreset = block.motionPreset ?? "parallax";
  const gridOwnsReveal = items.length > 0 && (layout === "grid" || layout === "text" || layout === "split");
  const shouldReveal = motionEnabled && block.motion !== "none" && !shouldTrackScroll && !gridOwnsReveal;

  const cards = items.map((item, index) => (
    <Card
      key={item.id ?? `${item.title ?? "item"}-${index}`}
      item={item}
      frame={block.itemAppearance?.frame}
      effect={block.itemAppearance?.effect}
    />
  ));
  const cardsGrid = cards.length ? (
    <Grid progressive={Boolean(block.progressive)}>
      {cards}
    </Grid>
  ) : null;
  const mediaCards = mediaItems.map((item) => <Media key={item.id} media={item} />);
  const secondary = media
    ? <Media media={media} sizes="(min-width: 64rem) 50vw, 100vw" />
    : form
      ? <Form schema={form} />
      : cardsGrid;
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

  const region = (content: ReactNode) => content ? <div className="section__body">{content}</div> : null;
  let body: ReactNode;

  if (layout === "split") {
    const primary = header ? <TextBlock content={header} /> : null;
    body = shouldTrackScroll ? (
      <Split
        primary={primary ? (
          <ScrollScene
            preset={scenePreset}
            direction="forward"
            className="section__scrollLayer"
            decorative={false}
          >
            {primary}
          </ScrollScene>
        ) : null}
        secondary={secondary ? (
          <ScrollScene
            preset={scenePreset}
            direction="reverse"
            className="section__scrollLayer"
            decorative={false}
          >
            {secondary}
          </ScrollScene>
        ) : null}
      />
    ) : (
      <Split primary={primary} secondary={secondary} />
    );
  } else if (layout === "media-overlay") {
    body = (
      <div className="section__mediaOverlay">
        {media ? <Media media={media} className="section__media" sizes="100vw" /> : null}
        {header ? (
          <div className="section__overlayContent">
            <TextBlock content={header} titleAs="h1" className="section__header" />
          </div>
        ) : null}
      </div>
    );
  } else if (layout === "gallery") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(mediaItems.length ? <Gallery items={mediaItems} layout="editorial" /> : null)}
      </>
    );
  } else if (layout === "carousel") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(cards.length || mediaCards.length ? <Carousel>{cards.length ? cards : mediaCards}</Carousel> : null)}
      </>
    );
  } else if (layout === "timeline") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(items.length ? <Timeline items={items} orientation={block.timelineOrientation} /> : null)}
      </>
    );
  } else if (layout === "horizontal-scroll") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(cards.length || mediaCards.length ? <HorizontalScroll>{cards.length ? cards : mediaCards}</HorizontalScroll> : null)}
      </>
    );
  } else if (layout === "content-switcher") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(switcherItems.length ? <ContentSwitcher items={switcherItems} /> : null)}
      </>
    );
  } else if (layout === "media") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(media ? <Media media={media} className="section__media" /> : null)}
      </>
    );
  } else {
    const content = (
      <>
        {media ? <Media media={media} className="section__media" /> : null}
        {form ? <Form schema={form} /> : null}
        {cardsGrid}
      </>
    );

    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {region(media || form || cardsGrid ? content : null)}
      </>
    );
  }

  const sceneBody = shouldTrackScroll && layout !== "split" ? (
    <ScrollScene
      preset={scenePreset}
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
      data-surface={block.surface}
      data-color={effectiveColor}
      data-motion={block.motion ?? "reveal"}
      data-motion-preset={block.motionPreset}
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
