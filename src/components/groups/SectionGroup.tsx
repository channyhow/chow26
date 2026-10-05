import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/section/Section";
import { resolveBlock, resolveCollection } from "@/data/resolve";
import type {
  PanelAlign,
  PanelBehavior,
  PanelBlock,
  PanelFrame,
  PanelLane,
  PanelSize,
  PanelSurface,
  SectionBlock,
  SectionColor,
  SectionGroup as SectionGroupData,
} from "@/types/content";

const glassBackdrop = "blur(1.1rem) saturate(1.05)";
const collectionPanelColors: SectionColor[] = ["secondary", "special", "accent"];

function renderBlocks(blocks: PanelBlock[], inPanel = false, scrollProgress?: MotionValue<number>) {
  return blocks.map((entry, index) => {
    if ("ref" in entry) {
      const block = resolveBlock(entry.ref);
      if (!block) return null;
      if (entry.ref === "site-footer") return <SiteFooter key={entry.ref} block={block} />;
      return <Section key={entry.ref} block={block} visualContext={inPanel ? "inherit" : "own"} scrollProgress={scrollProgress} />;
    }
    return <Section key={entry.id || `panel-section-${index + 1}`} block={entry} visualContext={inPanel ? "inherit" : "own"} scrollProgress={scrollProgress} />;
  });
}

function expandCollectionPanels(panels: PanelLane[] = []) {
  return panels.flatMap((panel) => {
    if (panel.blocks.length !== 1) return [panel];
    const block = panel.blocks[0];
    if ("ref" in block || block.layout !== "horizontal-scroll" || !block.source) return [panel];

    const source = block.source;
    const items = resolveCollection(source);
    if (items.length <= 1) return [panel];

    return items.map((item, index) => {
      const itemId = item.id ?? `${index + 1}`;
      const itemBlock: SectionBlock = {
        ...block,
        id: `${block.id}-${itemId}`,
        layout: "grid",
        className: [block.className, "section--collection-panel"].filter(Boolean).join(" "),
        content: undefined,
        source: { collection: source.collection, query: { ...source.query, prioritizeIds: [itemId], limit: 1 } },
      };

      return {
        ...panel,
        id: `${panel.id}-${itemId}`,
        behavior: "normal" as const,
        frame: "content" as const,
        surface: "solid" as const,
        color: collectionPanelColors[index % collectionPanelColors.length],
        blocks: [itemBlock],
      };
    });
  });
}

function resolvePanelLanes(group: SectionGroupData): PanelLane[] {
  return group.layout === "scroll-panel" ? expandCollectionPanels(group.panels) : [];
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function Panel({ id, behavior, frame, size, align, surface, color, blocks, index }: { id: string; behavior: PanelBehavior; frame: PanelFrame; size: PanelSize; align: PanelAlign; surface: PanelSurface; color?: SectionColor; blocks: PanelBlock[]; index: number; }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (behavior !== "sticky" || frame !== "content") return;
    const element = ref.current;
    if (!element) return;

    const updateStickyTop = () => {
      const panelHeight = element.getBoundingClientRect().height;
      element.style.setProperty("--panel-sticky-top", `${Math.min(0, getViewportHeight() - panelHeight)}px`);
    };

    updateStickyTop();
    const observer = new ResizeObserver(updateStickyTop);
    observer.observe(element);
    window.addEventListener("resize", updateStickyTop);
    window.visualViewport?.addEventListener("resize", updateStickyTop);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateStickyTop);
      window.visualViewport?.removeEventListener("resize", updateStickyTop);
      element.style.removeProperty("--panel-sticky-top");
    };
  }, [behavior, frame]);

  const scrollYProgress = useTransform(scrollY, (latest) => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return 0;

    const viewportHeight = Math.max(getViewportHeight(), 1);
    const rect = element.getBoundingClientRect();
    const offsetTop = rect.top + latest;
    const start = offsetTop - viewportHeight;
    const end = offsetTop + rect.height;

    return Math.min(1, Math.max(0, (latest - start) / Math.max(end - start, 1)));
  });

  const style = { "--panel-index": index } as CSSProperties;
  const surfaceStyle = surface === "glass" ? ({ backdropFilter: glassBackdrop, WebkitBackdropFilter: glassBackdrop } as CSSProperties) : undefined;

  return (
    <div id={id} ref={ref} className="sectionGroup__panel" data-panel-id={id} data-panel-behavior={behavior} data-panel-frame={frame} data-panel-size={size} data-panel-align={align} data-panel-surface={surface} data-panel-color={color} style={style}>
      <div className="sectionGroup__surface" style={surfaceStyle}>{renderBlocks(blocks, true, scrollYProgress)}</div>
    </div>
  );
}

export function SectionGroup({ group }: { group: SectionGroupData }) {
  const reduceMotion = useReducedMotion();
  const layout = group.layout ?? "flow";
  const isPanel = layout === "scroll-panel";
  const defaultFrame = group.panel?.frame ?? "content";
  const defaultSize = group.panel?.size ?? "md";
  const defaultAlign = group.panel?.align ?? "center";
  const defaultSurface = group.panel?.surface ?? "solid";
  const defaultColor = group.panel?.color ?? "secondary";
  const blocks = group.blocks ?? [];
  const panelLanes = resolvePanelLanes(group);

  return (
    <div className="sectionGroup" data-layout={layout} data-motion={reduceMotion ? "none" : group.motion?.level ?? "none"} data-preset={reduceMotion ? undefined : group.motion?.preset}>
      {isPanel
        ? panelLanes.map((panel, index) => <Panel key={panel.id} id={panel.id} behavior={panel.behavior ?? "normal"} frame={panel.frame ?? defaultFrame} size={panel.size ?? defaultSize} align={panel.align ?? defaultAlign} surface={panel.surface ?? defaultSurface} color={panel.color ?? defaultColor} blocks={panel.blocks} index={index} />)
        : renderBlocks(blocks)}
    </div>
  );
}
