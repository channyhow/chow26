import { TextBlock } from "@/components/content/TextBlock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/section/Section";
import { resolveBlock } from "@/data/resolve";
import type { PageBlock, PageData, SectionBlock } from "@/types/content";

type LinkPageProps = {
  page: PageData;
};

function resolveSection(block: PageBlock | undefined): SectionBlock | undefined {
  if (!block) return undefined;
  if ("ref" in block) return resolveBlock(block.ref);
  return block.type === "Section" ? block : undefined;
}

export function LinkPage({ page }: LinkPageProps) {
  const navigation = resolveBlock("linkpage-navigation");
  const founder = resolveBlock("studio-founders");
  const conditions = resolveBlock("opencall-conditions");
  const footer = resolveSection(page.blocks[1]);
  const navigationContent = navigation?.content?.header;

  if (!navigationContent || !founder || !conditions || !footer) return null;

  return (
    <div className="linkPageShell">
      <main className="linkPagePanels">
        <section className="linkPagePanel linkPagePanel--campaign" aria-label="Appel à projets">
          <div className="linkPagePanel__inner">
            <TextBlock
              content={navigationContent}
              titleAs="h1"
              className="linkPage__campaignText"
              actionsVariant="panel"
            />
          </div>
        </section>

        <div className="linkPagePanel linkPagePanel--founder">
          <Section block={founder} />
        </div>

        <div className="linkPagePanel linkPagePanel--conditions">
          <Section block={conditions} />
        </div>
      </main>

      <SiteFooter block={footer} />
    </div>
  );
}
