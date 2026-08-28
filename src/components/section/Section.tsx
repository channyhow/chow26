import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

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

function SceneInner({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["1.5rem", "-1.5rem"]);

  return <motion.div ref={ref} className="section__inner" style={{ y }}>{children}</motion.div>;
}

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
  const shouldTrackScroll = motionEnabled && block.motion === "scene" && !suppressSceneMotion;
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
  const cardsGrid = cards.length ? <Grid className="section__body">{cards}</Grid> : null;
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

  let body: ReactNode;

  if (layout === "split") {
    body = <Split primary={header ? <TextBlock content={header} /> : null} secondary={secondary} />;
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
        {mediaItems.length ? <Gallery items={mediaItems} layout="editorial" /> : null}
      </>
    );
  } else if (layout === "carousel") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {cards.length || mediaCards.length ? <Carousel>{cards.length ? cards : mediaCards}</Carousel> : null}
      </>
    );
  } else if (layout === "timeline") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {items.length ? <Timeline items={items} orientation={block.timelineOrientation} /> : null}
      </>
    );
  } else if (layout === "horizontal-scroll") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {cards.length || mediaCards.length ? <HorizontalScroll>{cards.length ? cards : mediaCards}</HorizontalScroll> : null}
      </>
    );
  } else if (layout === "content-switcher") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {switcherItems.length ? <ContentSwitcher items={switcherItems} /> : null}
      </>
    );
  } else if (layout === "media") {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {media ? <Media media={media} className="section__media" /> : null}
      </>
    );
  } else {
    body = (
      <>
        {header ? <TextBlock content={header} className="section__header" /> : null}
        {media ? <Media media={media} className="section__media" /> : null}
        {form ? <Form schema={form} /> : null}
        {cardsGrid}
      </>
    );
  }

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
    >
      {shouldTrackScroll ? (
        <SceneInner>{body}</SceneInner>
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
