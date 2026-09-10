import { z } from "zod";

const actionSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1).optional(),
  linkKey: z.string().min(1).optional(),
  intent: z.enum(["navigate", "contact", "call", "directions", "book", "buy", "subscribe", "download", "share", "submit"]).optional(),
  priority: z.enum(["primary", "secondary"]).optional(),
  variant: z.enum(["primary", "outline", "arrow", "cta"]).optional(),
}).refine((action) => Boolean(action.href || action.linkKey), {
  message: "Action requires href or linkKey",
});

const formFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "email", "tel", "textarea", "select", "checkbox", "date", "time", "number"]),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  min: z.union([z.number(), z.string()]).optional(),
  max: z.union([z.number(), z.string()]).optional(),
  step: z.union([z.number(), z.string()]).optional(),
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().positive().optional(),
  autoComplete: z.string().optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

const formSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  provider: z.enum(["netlify", "tally"]).optional(),
  tallyKey: z.enum(["contact", "reservation"]).optional(),
  formId: z.string().min(1).optional(),
  embedUrl: z.string().url().optional(),
  title: z.string().optional(),
  fallbackHeight: z.number().positive().optional(),
  submitLabel: z.string().optional(),
  fields: z.array(formFieldSchema),
  links: z.array(actionSchema).optional(),
});

const stringOrStringArraySchema = z.union([z.string(), z.array(z.string())]);

const metaItemSchema = z.object({
  label: z.string(),
  value: z.string().optional(),
  href: z.string().min(1).optional(),
});

const gridTrackPlacementSchema = z.object({
  start: z.number().int().positive().optional(),
  span: z.number().int().positive().optional(),
  row: z.number().int().positive().optional(),
  rowSpan: z.number().int().positive().optional(),
  align: z.enum(["start", "center", "end", "stretch"]).optional(),
  justify: z.enum(["start", "center", "end", "stretch"]).optional(),
});

const gridPlacementSchema = z.object({
  mobile: gridTrackPlacementSchema.optional(),
  tablet: gridTrackPlacementSchema.optional(),
  desktop: gridTrackPlacementSchema.optional(),
});

const pageSeoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  canonical: z.string().optional(),
  robots: z.object({
    index: z.boolean().optional(),
    follow: z.boolean().optional(),
  }).optional(),
});

const contentItemSchema: z.ZodTypeAny = z.object({
  id: z.string().optional(),
  eyebrow: stringOrStringArraySchema.optional(),
  title: z.string().optional(),
  subtitle: stringOrStringArraySchema.optional(),
  text: stringOrStringArraySchema.optional(),
  media: z.union([z.string(), z.array(z.string())]).optional(),
  links: z.array(actionSchema).optional(),
  meta: z.array(metaItemSchema).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  group: z.string().optional(),
  featured: z.boolean().optional(),
  enabled: z.boolean().optional(),
  order: z.number().optional(),
  href: z.string().min(1).optional(),
  slug: z.string().optional(),
  projectLayout: z.enum(["a", "b"]).optional(),
  grid: gridPlacementSchema.optional(),
  summary: z.string().optional(),
  description: z.array(z.string()).optional(),
  facts: z.array(metaItemSchema).optional(),
  gallery: z.array(z.string()).optional(),
  seo: pageSeoSchema.optional(),
});

const sourceSchema = z.object({
  collection: z.string().min(1),
  query: z.object({
    featured: z.boolean().optional(),
    category: z.string().optional(),
    group: z.string().optional(),
    enabled: z.boolean().optional(),
    limit: z.number().int().positive().optional(),
    excludeIds: z.array(z.string().min(1)).optional(),
    prioritizeIds: z.array(z.string().min(1)).optional(),
  }).optional(),
});

export const sectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("Section"),
  variant: z.enum(["classic", "editorial", "organic"]).optional(),
  tone: z.enum(["default", "inverse", "accent"]).optional(),
  surface: z.enum(["solid", "glass", "transparent"]).optional(),
  color: z.enum(["primary", "secondary", "special", "accent"]).optional(),
  layout: z.enum(["text", "statement", "split", "grid", "list", "gallery", "carousel", "media", "media-overlay", "timeline", "horizontal-scroll", "content-switcher"]).optional(),
  timelineOrientation: z.enum(["vertical", "horizontal"]).optional(),
  source: sourceSchema.optional(),
  content: z.object({
    header: contentItemSchema.optional(),
    items: z.array(contentItemSchema).optional(),
    media: z.union([z.string(), z.array(z.string())]).optional(),
    links: z.array(actionSchema).optional(),
    form: z.union([z.string().min(1), formSchema]).optional(),
  }).optional(),
  frame: z.boolean().optional(),
  progressive: z.boolean().optional(),
  itemAppearance: z.object({
    frame: z.boolean().optional(),
    effect: z.enum(["none", "glass", "grain"]).optional(),
  }).optional(),
  motion: z.enum(["none", "micro", "reveal", "scene"]).optional(),
  motionPreset: z.enum(["drift", "parallax", "ambient", "draw", "recede"]).optional(),
  motionRange: z.enum(["through", "exit"]).optional(),
  motionIntensity: z.enum(["quiet", "default", "expressive"]).optional(),
  className: z.string().optional(),
});

export const blockRegistrySchema = z.record(z.string(), sectionSchema);
export const collectionsSchema = z.record(z.string(), z.array(contentItemSchema));
