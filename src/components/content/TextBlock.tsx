import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";

import { Actions } from "@/components/navigation/Actions";
import { motionConfig, revealContainer, revealItem } from "@/motion/config";
import type { ContentItem } from "@/types/content";

export type TextBlockProps = {
  content: ContentItem;
  as?: "article" | "div";
  titleAs?: "h1" | "h2" | "h3" | "h4";
  className?: string;
};

const toArray = <T,>(value?: T | T[]): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

const motionRoots = {
  article: motion.article,
  div: motion.div,
};

const motionTitles = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
};

export function TextBlock({ content, as = "div", titleAs = "h2", className }: TextBlockProps) {
  const reduceMotion = useReducedMotion();
  const Root = motionRoots[as];
  const Title = motionTitles[titleAs];
  const subtitles = toArray(content.subtitle).filter(Boolean);
  const paragraphs = toArray(content.text).filter(Boolean);
  const eyebrows = toArray(content.eyebrow).filter(Boolean);
  const hasHeader = Boolean(content.eyebrow || content.title || subtitles.length);
  const hasContent = paragraphs.length > 0;
  const hasFooter = Boolean(content.links?.length);
  const hasMeta = Boolean(content.meta?.length);
  const initial = reduceMotion ? false : "hidden";

  if (!hasHeader && !hasContent && !hasFooter && !hasMeta) return null;

  return (
    <Root
      className={clsx("textBlock", className)}
      variants={revealContainer}
      initial={initial}
      whileInView="visible"
      viewport={motionConfig.viewport}
    >
      {hasHeader ? (
        <motion.header className="textBlock__header" variants={revealContainer}>
          {eyebrows.length ? (
            <motion.div className="textBlock__eyebrows" variants={revealItem}>
              {eyebrows.map((eyebrow) => (
                <p key={eyebrow} className="textBlock__eyebrow">{eyebrow}</p>
              ))}
            </motion.div>
          ) : null}

          {content.title ? (
            <Title className="textBlock__title" variants={revealItem}>
              {content.title}
            </Title>
          ) : null}

          {subtitles.length ? (
            <motion.div className="textBlock__subtitle" variants={revealItem}>
              {subtitles.map((subtitle) => <p key={subtitle}>{subtitle}</p>)}
            </motion.div>
          ) : null}
        </motion.header>
      ) : null}

      {hasContent ? (
        <motion.div className="textBlock__content" variants={revealItem}>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </motion.div>
      ) : null}

      {hasFooter ? (
        <motion.footer className="textBlock__footer" variants={revealItem}>
          <Actions links={content.links} />
        </motion.footer>
      ) : null}

      {hasMeta ? (
        <motion.div className="textBlock__meta" variants={revealItem}>
          {content.meta?.map((item) => {
            const text = item.value ? `${item.label}: ${item.value}` : item.label;

            if (item.href) {
              const external = isExternalHref(item.href);

              return (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {text}{external ? " ↗" : ""}
                </a>
              );
            }

            return (
              <span key={`${item.label}-${item.value ?? ""}`}>
                {text}
              </span>
            );
          })}
        </motion.div>
      ) : null}
    </Root>
  );
}
