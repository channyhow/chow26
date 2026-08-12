# Atmosphere Studio — architecture template

Chow Studio architecture/interior case study built on the common React system but art-directed as a spatial editorial experience rather than a card-based portfolio.

> **Project-first, spacious, asymmetrical. The work carries the argument.**

## Project signature

- **Business goal:** establish taste and credibility through projects, explain the approach, then qualify new-project enquiries.
- **Story:** project → detail → intention → method → project conversation.
- **Visual density:** low-medium. Large architectural whitespace, but more grid-driven and less soft/centered than Yoga.
- **Composition:** strong 12-column logic, off-axis images, 7–9 column media paired with 2–3 column captions, full-bleed moments and horizontal galleries.
- **Typography:** Noto Serif Display + Poppins. Editorial headings, smaller functional body and a strong metadata/caption layer.
- **Palette:** Ink `#222224`, Warm Cream `#F6F5F3`, Soft Rose `#dea3ae`; green/blue/terracotta remain rare contextual accents.
- **Image direction:** spatial relationships, passages, light, material, joinery, furniture in use. Preserve architectural lines and varied image ratios.
- **Geometry:** the grid is the frame. Very few boxed surfaces or decorative radii.
- **Motion:** slow reveal, light parallax where crops permit, horizontal gallery movement, occasional sticky media.
- **Mobile UX:** preserve project narrative instead of collapsing every project into identical cards.

## Conversion rules

1. Projects are the primary proof and appear before service marketing.
2. Each project has context, constraint, intention, intervention and result — not only a title and thumbnail.
3. Details and captions demonstrate attention without slowing the page with long prose.
4. Approach/services explain the thinking only after the visual proof exists.
5. Contact is a qualified project brief: place, typology, calendar and need.

## Editorial voice

Precise and restrained. Describe spatial decisions, constraints, circulation, light, materials and use.

Avoid generic architecture/luxury language such as “soulful spaces”, “timeless interiors”, “spaces that tell your story”, “elevated living” or “unique experience” unless a concrete fact follows it. A project does not need to sound poetic to be interesting.

Primary reference principle: WAM for project-first storytelling, scale, whitespace and architectural asymmetry — not for copying its interface or identity.

See [`docs/CONTENT_STYLE.md`](docs/CONTENT_STYLE.md).

## Shared-system rules

Reuse `Section`, `TextBlock`, `Media`, `Card`, `Grid`, `Split`, `Gallery`, `Carousel`, `Form` and `Actions`. Create difference through column spans, whitespace, media ratios, sequencing and caption placement before adding components.

`src/data/branding.json` defines the story, editorial voice and art-direction contract shown at `/branding`. `/system` remains the shared component test lab.

## Source assets

Curated Paris/Lisbon/Bali photography comes from the sibling `case-study-atmosphere` repository:

```bash
npm run assets:import
```

Then validate:

```bash
npm run check
npm run dev
```

## Quality bar

- feels like architecture/editorial design, not a generic portfolio grid;
- photography and whitespace do most of the art direction;
- project metadata remains readable and consistent;
- mobile maintains hierarchy and image integrity;
- motion never distorts important architectural lines;
- accessible focus, contrast and reduced-motion behaviour;
- CMS can add projects without bespoke React pages.

**Conception, direction artistique et développement : Channy How-Choong · Chow Studio.**
