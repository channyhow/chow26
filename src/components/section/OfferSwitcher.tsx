import { useId, useState } from "react";

import { Actions } from "@/components/navigation/Actions";
import { TextBlock } from "@/components/content/TextBlock";
import { EditorialGrid, EditorialGridItem, type EditorialPlacement } from "@/components/layout/EditorialGrid";
import type { ContentItem } from "@/types/content";

export type OfferRegion = "navigation" | "heading" | "description" | "deliverables" | "price" | "action";
export type OfferComposition = Partial<Record<OfferRegion, EditorialPlacement>>;

const defaultComposition: OfferComposition = {
  navigation: { start: 1, span: 3 },
  heading: { start: 7, span: 6 },
  description: { start: 7, span: 6 },
  deliverables: { start: 1, span: 12 },
  price: { start: 1, span: 12 },
  action: { start: 7, span: 6 },
};

export interface OfferSwitcherProps {
  offers: ContentItem[];
  composition?: OfferComposition;
}

export function OfferSwitcher({ offers, composition = defaultComposition }: OfferSwitcherProps) {
  const [active, setActive] = useState(0);
  const panelId = useId();
  if (!offers.length) return null;

  const selected = offers[Math.min(active, offers.length - 1)];
  const deliverables = selected.meta?.filter((entry) => Array.isArray(entry.value)) ?? [];
  const price = selected.meta?.filter((entry) => !Array.isArray(entry.value)) ?? [];
  const place = (region: OfferRegion) => composition[region] ?? defaultComposition[region];

  return (
    <EditorialGrid className="offerComposition">
      <EditorialGridItem area="navigation" placement={place("navigation")}>
        <div className="section__offerSwitcherControls" role="group" aria-label="Choisir une formule">
          {offers.map((offer, index) => (
            <button
              key={offer.id ?? index}
              type="button"
              aria-pressed={index === active}
              aria-controls={panelId}
              onClick={() => setActive(index)}
            >
              <span className="section__offerSwitcherNumber">{String(index + 1).padStart(2, "0")}</span>
              <span className="section__offerSwitcherLabel">{typeof offer.eyebrow === "string" ? offer.eyebrow.replace(/^\d+\s*·\s*/, "") : offer.title}</span>
            </button>
          ))}
        </div>
      </EditorialGridItem>
      <EditorialGridItem area="heading" placement={place("heading")}>
        <div id={panelId} className="offerComposition__heading" aria-live="polite" aria-atomic="true">
          <TextBlock content={{ eyebrow: selected.eyebrow, title: selected.title }} titleAs="h3" motionEnabled={false} />
        </div>
      </EditorialGridItem>
      <EditorialGridItem area="description" placement={place("description")}>
        <TextBlock content={{ subtitle: selected.subtitle, text: selected.text }} motionEnabled={false} />
      </EditorialGridItem>
      <EditorialGridItem area="deliverables" placement={place("deliverables")}>
        {deliverables.map((entry, index) => (
          <div className="offerComposition__spec" key={`${entry.label}-${index}`}>
            <span className="offerComposition__specLabel">{entry.label}</span>
            <ul className="offerComposition__specList">
              {(entry.value as string[]).map((value) => <li key={value}>{value}</li>)}
            </ul>
          </div>
        ))}
      </EditorialGridItem>
      <EditorialGridItem area="price" placement={place("price")}>
        {price.map((entry, index) => (
          <div className="offerComposition__spec" key={`${entry.label}-${index}`}>
            <span className="offerComposition__specLabel">{entry.label}</span>
            <span className="offerComposition__specValue">{entry.value}</span>
          </div>
        ))}
      </EditorialGridItem>
      <EditorialGridItem area="action" placement={place("action")}>
        <Actions links={selected.links} />
      </EditorialGridItem>
    </EditorialGrid>
  );
}
