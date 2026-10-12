import { useEffect, useRef, type CSSProperties } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from "motion/react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/section/Section";
import { resolveBlock, resolveCollection } from "@/data/resolve";
import type { PanelAlign, PanelBehavior, PanelBlock, PanelFrame, PanelLane, PanelSize, PanelSurface, SectionBlock, SectionColor, SectionGroup as SectionGroupData } from "@/types/content";

const glassBackdrop = "blur(1.1rem) saturate(1.05)";
const collectionPanelColors: SectionColor[] = ["secondary", "special", "accent"];

function renderBlocks(blocks: PanelBlock[], inPanel = false, scrollProgress?: MotionValue<number>, parallaxEnabled = false) {
  return blocks.map((entry, index) => {
    if ("ref" in entry) {
      const block = resolveBlock(entry.ref);
      if (!block) return null;
      if (entry.ref === "site-footer") return <SiteFooter key={entry.ref} block={block} />;
      return <Section key={entry.ref} block={block} visualContext={inPanel ? "inherit" : "own"} scrollProgress={scrollProgress} parallaxEnabled={parallaxEnabled} />;
    }
    return <Section key={entry.id || `panel-section-${index + 1}`} block={entry} visualContext={inPanel ? "inherit" : "own"} scrollProgress={scrollProgress} parallaxEnabled={parallaxEnabled} />;
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
      const itemBlock: SectionBlock = { ...block, id: `${block.id}-${itemId}`, layout: "grid", className: [block.className, "section--collection-panel"].filter(Boolean).join(" "), content: undefined, source: { collection: source.collection, query: { ...source.query, prioritizeIds: [itemId], limit: 1 } } };
      return { ...panel, id: `${panel.id}-${itemId}`, behavior: "normal" as const, frame: "content" as const, surface: "solid" as const, color: collectionPanelColors[index % collectionPanelColors.length], blocks: [itemBlock] };
    });
  });
}

function resolvePanelLanes(group: SectionGroupData): PanelLane[] { return group.layout === "scroll-panel" ? expandCollectionPanels(group.panels) : []; }
function getViewportHeight() { return window.visualViewport?.height ?? window.innerHeight; }

// Track document scroll over the panel's normal-flow interval. A sticky
// element's viewport position stops changing while pinned, so targeting the
// sticky element with useScroll cannot drive continuous panel motion.
function usePanelProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);
  const bounds = useRef({ start: 0, distance: 1 });

  const syncProgress = (position: number) => {
    const { start, distance } = bounds.current;
    progress.set(Math.max(0, Math.min(1, (position - start) / distance)));
  };

  useMotionValueEvent(scrollY, "change", syncProgress);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const next = element.nextElementSibling;
    const measure = () => {
      const viewport = getViewportHeight();
      const top = element.getBoundingClientRect().top + window.scrollY;
      const bottom = next
        ? next.getBoundingClientRect().top + window.scrollY
        : top + Math.max(element.offsetHeight, viewport);
      const start = top - viewport * 0.8;
      const end = Math.max(start + 1, bottom - viewport * 0.2);
      bounds.current = { start, distance: end - start };
      syncProgress(window.scrollY);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (next) observer.observe(next);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [ref, progress]);

  return progress;
}

function Panel({ id, behavior, frame, size, align, surface, color, parallax, blocks, index }: { id: string; behavior: PanelBehavior; frame: PanelFrame; size: PanelSize; align: PanelAlign; surface: PanelSurface; color?: SectionColor; parallax?: boolean; blocks: PanelBlock[]; index: number; }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollProgress = usePanelProgress(ref);

  useEffect(() => {
    if (behavior !== "sticky" || frame !== "content") return;
    const element = ref.current;
    if (!element) return;
    const updateStickyTop = () => { const panelHeight = element.getBoundingClientRect().height; element.style.setProperty("--panel-sticky-top", `${Math.min(0, getViewportHeight() - panelHeight)}px`); };
    updateStickyTop();
    const observer = new ResizeObserver(updateStickyTop);
    observer.observe(element);
    window.addEventListener("resize", updateStickyTop);
    window.visualViewport?.addEventListener("resize", updateStickyTop);
    return () => { observer.disconnect(); window.removeEventListener("resize", updateStickyTop); window.visualViewport?.removeEventListener("resize", updateStickyTop); element.style.removeProperty("--panel-sticky-top"); };
  }, [behavior, frame]);

  const style = { "--panel-index": index } as CSSProperties;
  const surfaceStyle = surface === "glass" ? ({ backdropFilter: glassBackdrop, WebkitBackdropFilter: glassBackdrop } as CSSProperties) : undefined;
  return <div id={id} ref={ref} className="sectionGroup__panel" data-panel-id={id} data-panel-behavior={behavior} data-panel-frame={frame} data-panel-size={size} data-panel-align={align} data-panel-surface={surface} data-panel-color={color} style={style}>
    <div className="sectionGroup__surface" style={surfaceStyle}>{renderBlocks(blocks, true, scrollProgress, parallax)}</div>
  </div>;
}

export function SectionGroup({ group }: { group: SectionGroupData }) {
  const layout = group.layout ?? "flow";
  const isPanel = layout === "scroll-panel";
  const defaultFrame = group.panel?.frame ?? "content";
  const defaultSize = group.panel?.size ?? "md";
  const defaultAlign = group.panel?.align ?? "center";
  const defaultSurface = group.panel?.surface ?? "solid";
  const defaultColor = group.panel?.color ?? "secondary";
  const blocks = group.blocks ?? [];
  const panelLanes = resolvePanelLanes(group);
  return <div className="sectionGroup" data-layout={layout} data-motion={group.motion?.level ?? "none"} data-preset={group.motion?.preset}>
    {isPanel ? panelLanes.map((panel, index) => <Panel key={panel.id} id={panel.id} behavior={panel.behavior ?? "normal"} frame={panel.frame ?? defaultFrame} size={panel.size ?? defaultSize} align={panel.align ?? defaultAlign} surface={panel.surface ?? defaultSurface} color={panel.color ?? defaultColor} parallax={panel.parallax} blocks={panel.blocks} index={index} />) : renderBlocks(blocks)}
  </div>;
}
