import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Actions, type ActionsProps } from "@/components/navigation/Actions";
import { motionConfig, reducedRevealItem, reducedStaggerContainer, revealContainer, revealItem } from "@/motion/config";
import type { ContentItem } from "@/types/content";

export type TextBlockProps = {
  content: ContentItem;
  as?: "article" | "div";
  titleAs?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  actionsVariant?: ActionsProps["variant"];
  metaVariant?: "default" | "rows";
  motionEnabled?: boolean;
};

const toArray = <T,>(value?: T | T[]): T[] => !value ? [] : Array.isArray(value) ? value : [value];
const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
const renderInlineStrong = (value: string): ReactNode[] => value.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
  const highlighted = part.startsWith("**") && part.endsWith("**");
  const text = highlighted ? part.slice(2, -2) : part;
  return highlighted ? <strong key={`${text}-${index}`}>{text}</strong> : <span className="textBlock__copy" key={`${text}-${index}`}>{text}</span>;
});
const motionRoots = { article: motion.article, div: motion.div };
const motionTitles = { h1: motion.h1, h2: motion.h2, h3: motion.h3, h4: motion.h4 };

export function TextBlock({ content, as = "div", titleAs = "h2", className, actionsVariant = "default", metaVariant = "default", motionEnabled = true }: TextBlockProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const Root = motionRoots[as];
  const Title = motionTitles[titleAs];
  const subtitles = toArray(content.subtitle).filter(Boolean);
  const paragraphs = toArray(content.text).filter(Boolean);
  const eyebrows = toArray(content.eyebrow).filter(Boolean);
  const hasHeader = Boolean(content.eyebrow || content.title || subtitles.length);
  const hasContent = paragraphs.length > 0;
  const hasFooter = Boolean(content.links?.length);
  const hasMeta = Boolean(content.meta?.length);
  const containerVariants = reduceMotion ? reducedStaggerContainer : revealContainer;
  const itemVariants = reduceMotion ? reducedRevealItem : revealItem;
  const motionProps = motionEnabled ? { variants: containerVariants, initial: "hidden" as const, whileInView: "visible" as const, viewport: motionConfig.viewport } : {};
  const containerMotionProps = motionEnabled ? { variants: containerVariants } : {};
  const itemMotionProps = motionEnabled ? { variants: itemVariants } : {};
  if (!hasHeader && !hasContent && !hasFooter && !hasMeta) return null;

  return (
    <Root className={clsx("textBlock", metaVariant !== "default" && `textBlock--meta-${metaVariant}`, className)} {...motionProps}>
      {hasHeader ? <motion.header className="textBlock__header" {...containerMotionProps}>
        {eyebrows.length ? <motion.div className="textBlock__eyebrows" {...containerMotionProps}>{eyebrows.map((eyebrow) => <motion.p key={eyebrow} className="textBlock__eyebrow" {...itemMotionProps}>{eyebrow}</motion.p>)}</motion.div> : null}
        {content.title ? <Title className="textBlock__title" {...itemMotionProps}>{content.title}</Title> : null}
        {subtitles.length ? <motion.div className="textBlock__subtitle" {...containerMotionProps}>{subtitles.map((subtitle) => <motion.p key={subtitle} {...itemMotionProps}>{renderInlineStrong(subtitle)}</motion.p>)}</motion.div> : null}
      </motion.header> : null}
      {hasContent ? <motion.div className="textBlock__content" {...containerMotionProps}>{paragraphs.map((paragraph) => <motion.p key={paragraph} {...itemMotionProps}>{renderInlineStrong(paragraph)}</motion.p>)}</motion.div> : null}
      {hasMeta ? <motion.div className="textBlock__meta" {...containerMotionProps}>{content.meta?.map((item) => {
        const metaContent = <><span className="textBlock__metaLabel">{item.label}</span>{item.value ? <span className="textBlock__metaValue">{item.value}</span> : null}</>;
        if (item.href) {
          const external = isExternalHref(item.href);
          return <motion.a key={`${item.label}-${item.href}`} href={item.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...itemMotionProps}>{metaContent}{external ? <span aria-hidden="true"> ↗</span> : null}</motion.a>;
        }
        return <motion.span key={`${item.label}-${item.value ?? ""}`} {...itemMotionProps}>{metaContent}</motion.span>;
      })}</motion.div> : null}
      {hasFooter ? <motion.footer className="textBlock__footer" {...itemMotionProps}><Actions links={content.links} variant={actionsVariant} /></motion.footer> : null}
    </Root>
  );
}
