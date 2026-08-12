import { PageMeta } from "@/components/page/PageMeta";
import { Section } from "@/components/section/Section";
import { SectionGroup } from "@/components/groups/SectionGroup";
import siteData from "@/data/site.json";
import { resolveBlock } from "@/data/resolve";
import type { PageBlock, PageData, SectionBlock } from "@/types/content";

export type PageRendererProps = {
  page: PageData;
};

function renderEntry(entry: PageBlock) {
  if ("ref" in entry) {
    const block = resolveBlock(entry.ref);
    return block ? <Section key={entry.ref} block={block} /> : null;
  }

  if (entry.type === "Section") {
    return <Section key={entry.id} block={entry as SectionBlock} />;
  }

  if (entry.type === "Group") {
    return <SectionGroup key={entry.id} group={entry} />;
  }

  return null;
}

export function PageRenderer({ page }: PageRendererProps) {
  const footerReveal = Boolean(siteData.ui.experience.footerReveal);
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
        data-variant={page.variant}
        data-footer-reveal={footerReveal && footerEntries.length ? "true" : "false"}
      >
        <div className="page__content">
          {contentEntries.map(renderEntry)}
        </div>
        {footerEntries.length ? (
          <footer className="page__footer">
            {footerEntries.map(renderEntry)}
          </footer>
        ) : null}
      </div>
    </>
  );
}
