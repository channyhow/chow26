import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { resolveBlock } from "@/data/resolve";
import { Section } from "@/components/section/Section";
import type { BlockRef, PanelAlign, PanelBehavior, PanelSize, PanelSurface, SectionGroup as SectionGroupData, SectionColor } from "@/types/content";

function renderBlocks(blocks: BlockRef[], suppressSceneMotion = false) {
  return blocks.map(({ ref }) => {
    const block = resolveBlock(ref);
    return block ? <Section key={ref} block={block} suppressSceneMotion={suppressSceneMotion} /> : null;
  });
}

function Panel({ id, behavior, size, align, surface, color, blocks }: { id: string; behavior: PanelBehavior; size: PanelSize; align: PanelAlign; surface: PanelSurface; color?: SectionColor; blocks: BlockRef[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stackTop, setStackTop] = useState<number | null>(behavior === "stack" ? -1 : null);

  useEffect(() => {
    if (behavior !== "stack") return;
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const overflow = Math.max(0, element.scrollHeight - window.innerHeight);
      const nextTop = -overflow;
      setStackTop((current) => current === nextTop ? current : nextTop);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [behavior]);

  const style = behavior === "stack" && stackTop !== null
    ? ({ "--panel-stack-top": `${stackTop}px` } as CSSProperties)
    : undefined;

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
      {renderBlocks(blocks, true)}
    </div>
  );
}

export function SectionGroup({ group }: { group: SectionGroupData }) {
  const reduceMotion = useReducedMotion();
  const requestedLayout = group.layout ?? "flow";
  const layout = requestedLayout;
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
    <div className="sectionGroup" data-layout={layout} data-panel-mode={isPanel ? mode : undefined} data-motion={reduceMotion ? "none" : group.motion?.level ?? "none"} data-preset={reduceMotion ? undefined : group.motion?.preset}>
      {isPanel && group.panels?.length
        ? group.panels.map((panel) => <Panel key={panel.id} id={panel.id} behavior={panel.behavior ?? "moving"} size={panel.size ?? defaultSize} align={panel.align ?? defaultAlign} surface={panel.surface ?? defaultSurface} color={panel.color ?? defaultColor} blocks={panel.blocks} />)
        : isPanel && mode === "stack"
          ? blocks.map((block, index) => <Panel key={block.ref} id={`${group.id}-${index + 1}`} behavior="stack" size={defaultSize} align={defaultAlign} surface={defaultSurface} color={defaultColor} blocks={[block]} />)
          : isPanel && mode === "scene" && blocks.length
            ? <><Panel id={`${group.id}-scene`} behavior="fixed" size="full" align="center" surface="transparent" color={undefined} blocks={[blocks[0]]} />{blocks.slice(1).map((block, index) => <Panel key={block.ref} id={`${group.id}-panel-${index + 1}`} behavior="moving" size={defaultSize} align={defaultAlign} surface={defaultSurface} color={defaultColor} blocks={[block]} />)}</>
            : renderBlocks(flowBlocks)}
    </div>
  );
}
