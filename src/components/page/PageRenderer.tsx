import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageMeta } from "@/components/page/PageMeta";
import { Section } from "@/components/section/Section";
import { SectionGroup } from "@/components/groups/SectionGroup";
import siteData from "@/data/site.json";
import { prepareSection } from "@/data/prepareSection";
import { resolveBlock } from "@/data/resolve";
import type { PageBlock, PageData, SectionBlock } from "@/types/content";

export type PageRendererProps = {
  page: PageData;
};

function renderEntry(entry: PageBlock) {
  if ("ref" in entry) {
    const block = resolveBlock(entry.ref);
    return block ? <Section key={entry.ref} block={prepareSection(block)} /> : null;
  }

  if (entry.type === "Section") {
    const block = prepareSection(entry as SectionBlock);
    return <Section key={entry.id} block={block} />;
  }

  if (entry.type === "Group") {
    return <SectionGroup key={entry.id} group={entry} />;
  }

  return null;
}

function renderFooter(entry: PageBlock) {
  if (!("ref" in entry)) return null;
  const block = resolveBlock(entry.ref);
  if (!block) return null;
  return <SiteFooter key={entry.ref} block={prepareSection(block)} />;
}

export function PageRenderer({ page }: PageRendererProps) {
  const isNotFoundPage = page.id === "not-found" || page.slug === "/404";
  const footerReveal = Boolean(siteData.ui.experience.footerReveal) && !isNotFoundPage;
  const footerEntries = page.blocks.filter(
    (entry) => "ref" in entry && entry.ref === "site-footer",
  );
  const contentEntries = page.blocks.filter(
    (entry) => !("ref" in entry && entry.ref === "site-footer"),
  );

  return (
    <>
      <PageMeta seo={page.seo} />
      <div
        className="page"
        data-page-id={page.id}
        data-variant={page.variant}
        data-footer-reveal={footerReveal && footerEntries.length ? "true" : "false"}
      >
        <div className="page__content">
          {contentEntries.map(renderEntry)}
        </div>
        {footerEntries.length ? (
          <footer className="page__footer">
            {footerEntries.map(renderFooter)}
          </footer>
        ) : null}
      </div>
    </>
  );
}
