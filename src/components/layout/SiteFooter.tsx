import { Actions } from "@/components/navigation/Actions";
import type { SectionBlock } from "@/types/content";

export type SiteFooterProps = {
  block: SectionBlock;
};

const toArray = <T,>(value?: T | T[]): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export function SiteFooter({ block }: SiteFooterProps) {
  const header = block.content?.header;
  const eyebrows = toArray(header?.eyebrow).filter(Boolean);
  const links = header?.links ?? [];
  const meta = header?.meta ?? [];

  const primaryLinks = links.slice(0, 4);
  const secondaryLinks = links.slice(4);

  return (
    <footer
      id={block.id}
      className="siteFooter"
      data-surface={block.surface}
      data-color={block.color}
      aria-label="Pied de page"
    >
      <div className="siteFooter__inner">
        <div className="siteFooter__main">
          <div className="siteFooter__identity">
            {eyebrows[0] ? (
              <p className="siteFooter__name">{eyebrows[0]}</p>
            ) : null}

            {eyebrows.length > 1 ? (
              <div className="siteFooter__baselines">
                {eyebrows.slice(1).map((eyebrow) => (
                  <p key={eyebrow} className="siteFooter__baseline">
                    {eyebrow}
                  </p>
                ))}
              </div>
            ) : null}
          </div>

          <div className="siteFooter__links">
            {primaryLinks.length ? (
              <nav
                className="siteFooter__nav"
                aria-label="Navigation du pied de page"
              >
                <Actions links={primaryLinks} className="siteFooter__navGroup" />
              </nav>
            ) : null}

            {secondaryLinks.length ? (
              <nav
                className="siteFooter__support"
                aria-label="Réseaux et informations"
              >
                <Actions links={secondaryLinks} className="siteFooter__navGroup" />
              </nav>
            ) : null}
          </div>
        </div>

        {meta.length ? (
          <div className="siteFooter__meta">
            {meta.map((item) => (
              <span key={`${item.label}-${item.value ?? ""}`}>
                {item.value ? `${item.label}: ${item.value}` : item.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
