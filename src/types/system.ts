import type { EmbedProvider } from "@/components/content/Embed";
import type { GalleryLayout } from "@/components/content/Gallery";
import type { TimelineMode } from "@/components/content/Timeline";
import type { Action, ContentItem, SectionBlock, SectionGroup, StyleVariant, Tone } from "@/types/content";
import type { CalendarEvent } from "@/types/schedule";

export type SystemComponentName =
  | "TextBlock"
  | "Actions"
  | "Media"
  | "Card"
  | "Grid"
  | "Split"
  | "Gallery"
  | "Carousel"
  | "ContentSwitcher"
  | "Accordion"
  | "Timeline"
  | "ScrollScene"
  | "ScrollPanel"
  | "Loader"
  | "Schedule"
  | "Embed"
  | "Form"
  | "Section"
  | "SectionGroup";

export type SystemPreview = {
  id: string;
  component: SystemComponentName;
  title: string;
  content?: ContentItem;
  links?: Action[];
  media?: string | string[];
  items?: Array<ContentItem & {
    className?: string;
    label?: string;
    content?: ContentItem | string;
    provider?: EmbedProvider;
    src?: string;
  }>;
  primary?: ContentItem;
  secondaryMedia?: string;
  layouts?: GalleryLayout[];
  label?: string;
  modes?: TimelineMode[];
  preset?: "drift" | "orbit" | "parallax";
  enabled?: boolean;
  panels?: ContentItem[];
  messagesSource?: "site";
  events?: CalendarEvent[];
  forms?: string[];
  block?: SectionBlock;
  group?: SectionGroup;
};

export type SystemData = {
  intro: ContentItem;
  variants: StyleVariant[];
  tones: Tone[];
  shell: {
    title: string;
    description: string;
    drawerTriggers: Array<{
      label: string;
      view: "menu" | "contact" | "reservation";
    }>;
  };
  previews: SystemPreview[];
};
