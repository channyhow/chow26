import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/section/Section";
import { prepareSection } from "@/data/prepareSection";
import { resolveBlock } from "@/data/resolve";
import type {
  PanelAlign,
  PanelBehavior,
  PanelBlock,
  PanelSize,
  PanelSurface,
  SectionColor,
  SectionGroup as SectionGroupData,
} from "@/types/content";

function renderBlocks(
  blocks: PanelBlock[],
  suppressSceneMotion = false,
  inheritedColor?: SectionColor,
) {
  return blocks.map((entry, index) => {
    if ("ref" in entry) {
      const resolved = resolveBlock(entry.ref);
      if (!resolved) return null;
      const block = prepareSection(resolved);

      if (entry.ref === "site-footer") {
        return <SiteFooter key={entry.ref} block={block} />;
      }

      return (
        <Section
          key={entry.ref}
          block={block}
          suppressSceneMotion={suppressSceneMotion}
          inheritedColor={inheritedColor}
        />
      );
    }

    const block = prepareSection(entry);

    return (
      <Section
        key={entry.id || `panel-section-${index + 1}`}
        block={block}
        suppressSceneMotion={suppressSceneMotion}
        inheritedColor={inheritedColor}
      />
    );
  });
}

function panelKey(block: PanelBlock, index: number) {
  return "ref" in block ? block.ref : block.id || `panel-${index + 1}`;
}

function Panel({
  id,
  behavior,
  size,
  align,
  surface,
  color,
  blocks,
  index,
}: {
  id: string;
  behavior: PanelBehavior;
  size: PanelSize;
  align: PanelAlign;
  surface: PanelSurface;
  color?: SectionColor;
  blocks: PanelBlock[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const needsStickyOffset = behavior === "stack" || behavior === "cover";
  const [stickyTop, setStickyTop] = useState<number | null>(needsStickyOffset ? 0 : null);

  useEffect(() => {
    if (!needsStickyOffset) return;

    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const overflow = Math.max(0, element.scrollHeight - window.innerHeight);
      const nextTop = -overflow;
      setStickyTop((current) => (current === nextTop ? current : nextTop));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [needsStickyOffset]);

  const style = {
    "--panel-index": index,
    ...(needsStickyOffset && stickyTop !== null
      ? { "--panel-stack-top": `${stickyTop}px` }
      : {}),
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className="sectionGroup__panel"
      data-panel-id={id}
      data-panel-behavior={behavior}
      data-panel-size={size}
      data-panel-align={align}
      data-panel-surface={surface}
      data-panel-color={color}
      style={style}
    >
      {renderBlocks(blocks, true, color)}
    </div>
  );
}

export function SectionGroup({ group }: { group: SectionGroupData }) {
  const reduceMotion = useReducedMotion();
  const layout = group.layout ?? "flow";
  const isPanel = layout === "scroll-panel";
  const mode = group.panel?.mode ?? "scene";
  const defaultSize = group.panel?.size ?? "md";
  const defaultAlign = group.panel?.align ?? "center";
  const defaultSurface = group.panel?.surface ?? "solid";
  const defaultColor = group.panel?.color ?? "secondary";
  const blocks = group.blocks ?? [];
  const flattenedPanelBlocks = group.panels?.flatMap((panel) => panel.blocks) ?? [];
  const flowBlocks = blocks.length ? blocks : flattenedPanelBlocks;

  return (
    <div
      className="sectionGroup"
      data-layout={layout}
      data-panel-mode={isPanel ? mode : undefined}
      data-motion={reduceMotion ? "none" : group.motion?.level ?? "none"}
      data-preset={reduceMotion ? undefined : group.motion?.preset}
    >
      {isPanel && group.panels?.length
        ? group.panels.map((panel, index) => (
            <Panel
              key={panel.id}
              id={panel.id}
              behavior={panel.behavior ?? "moving"}
              size={panel.size ?? defaultSize}
              align={panel.align ?? defaultAlign}
              surface={panel.surface ?? defaultSurface}
              color={panel.color ?? defaultColor}
              blocks={panel.blocks}
              index={index}
            />
          ))
        : isPanel && mode === "stack"
          ? blocks.map((block, index) => (
              <Panel
                key={panelKey(block, index)}
                id={`${group.id}-${index + 1}`}
                behavior="stack"
                size={defaultSize}
                align={defaultAlign}
                surface={defaultSurface}
                color={defaultColor}
                blocks={[block]}
                index={index}
              />
            ))
          : isPanel && mode === "scene" && blocks.length
            ? (
                <>
                  <Panel
                    id={`${group.id}-scene`}
                    behavior="fixed"
                    size="full"
                    align="center"
                    surface="transparent"
                    color={undefined}
                    blocks={[blocks[0]]}
                    index={0}
                  />
                  {blocks.slice(1).map((block, index) => (
                    <Panel
                      key={panelKey(block, index + 1)}
                      id={`${group.id}-panel-${index + 1}`}
                      behavior="moving"
                      size={defaultSize}
                      align={defaultAlign}
                      surface={defaultSurface}
                      color={defaultColor}
                      blocks={[block]}
                      index={index + 1}
                    />
                  ))}
                </>
              )
            : renderBlocks(flowBlocks)}
    </div>
  );
}
