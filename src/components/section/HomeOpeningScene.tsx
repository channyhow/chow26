import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Media } from "@/components/content/Media";
import type { ContentItem } from "@/types/content";
import type { MediaAsset } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaAsset[];
  progress?: MotionValue<number>;
};

const renderInlineStrong = (value: string): ReactNode[] => value
  .split(/(\*\*[^*]+\*\*)/g)
  .filter(Boolean)
  .map((part, index) => {
    const strong = part.startsWith("**") && part.endsWith("**");
    const text = strong ? part.slice(2, -2) : part;
    return strong ? <strong key={`${text}-${index}`}>{text}</strong> : <span key={`${text}-${index}`}>{text}</span>;
  });

const projectLinks = [
  "/projets/mois-du-ker",
  "/projets/kuro",
  "/projets/atmosphere",
  "/projets/mois-du-ker",
];

export function HomeOpeningScene({ header, media, progress }: HomeOpeningSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress: localProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = progress ?? localProgress;

  const titleOpacity = useTransform(p, [0, 0.18, 0.34], [1, 1, reduceMotion ? 1 : 0]);
  const titleY = useTransform(p, [0, 0.34], [0, reduceMotion ? 0 : -48]);
  const labelsOpacity = useTransform(p, [0.08, 0.22, 0.58, 0.72], [0, 1, 1, 0]);
  const mediaOpacity = useTransform(p, [0, 0.2, 0.62, 0.92], [0.62, 1, 1, reduceMotion ? 0.72 : 0.08]);
  const statementOpacity = useTransform(p, [0.52, 0.74, 1], [0, 1, 1]);
  const statementY = useTransform(p, [0.52, 0.78], [reduceMotion ? 0 : 28, 0]);

  const mediaY1 = useTransform(p, [0.46, 1], [0, reduceMotion ? 0 : -120]);
  const mediaY2 = useTransform(p, [0.42, 1], [0, reduceMotion ? 0 : -190]);
  const mediaY3 = useTransform(p, [0.5, 1], [0, reduceMotion ? 0 : -150]);
  const mediaY4 = useTransform(p, [0.38, 1], [0, reduceMotion ? 0 : -230]);
  const mediaYs = [mediaY1, mediaY2, mediaY3, mediaY4];

  const paragraphs = header?.text ? (Array.isArray(header.text) ? header.text : [header.text]) : [];

  return (
    <div ref={ref} className="homeOpeningScene">
      <motion.h1 className="homeOpeningScene__title" style={{ opacity: titleOpacity, y: titleY }}>
        <span>Sites internet,</span>
        <span>identités visuelles</span>
        <span>et supports de communication,</span>
        <span>pensés avec clarté.</span>
      </motion.h1>

      <motion.div className="homeOpeningScene__labels" style={{ opacity: labelsOpacity }} aria-hidden="true">
        <span className="homeOpeningScene__label homeOpeningScene__label--web">Sites internet</span>
        <span className="homeOpeningScene__label homeOpeningScene__label--identity">Identités visuelles</span>
        <span className="homeOpeningScene__label homeOpeningScene__label--supports">Supports de communication</span>
      </motion.div>

      <div className="homeOpeningScene__media" aria-label="Projets sélectionnés">
        {media.slice(0, 4).map((item, index) => (
          <motion.a
            key={item.id}
            className={`homeOpeningScene__project homeOpeningScene__project--${index + 1}`}
            href={projectLinks[index]}
            style={{ opacity: mediaOpacity, y: mediaYs[index] }}
            aria-label={`Voir le projet ${item.alt.split("|")[0].trim()}`}
          >
            <Media media={item} sizes={index === 1 ? "(min-width: 64rem) 28vw, 70vw" : "(min-width: 64rem) 12vw, 38vw"} />
          </motion.a>
        ))}
      </div>

      <motion.div className="homeOpeningScene__statement" style={{ opacity: statementOpacity, y: statementY }}>
        {paragraphs.map((paragraph) => <p key={paragraph}>{renderInlineStrong(paragraph)}</p>)}
      </motion.div>
    </div>
  );
}
