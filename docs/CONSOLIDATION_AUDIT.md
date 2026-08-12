# Consolidation & performance audit

This audit is intentionally conservative. The goal is not to abstract every repeated declaration; it is to remove conflicting sources of truth, repeated semantic behaviour, and unnecessary runtime work while keeping the starter easy to read.

## Current conclusion

The architecture is in a healthy place. No large rewrite is justified. The highest-value work is now consolidation, measurement, responsive/art-direction QA, and finishing only capabilities that clearly multiply the existing primitives.

## Refactors completed in this pass

### Shared control sizing

Repeated control dimensions were promoted to semantic Sass tokens:

- `$control-min-height`
- `$control-field-height`
- `$control-icon-size`

The recurring standard button anatomy is now expressed through `@include standard-control`, which composes the existing `interactive-control` mixin with shared size/padding rules.

Used by the form submit control, ContentSwitcher controls, and `/system` controls. Action links and carousel controls reuse the same sizing tokens without being forced into the same visual anatomy.

### Internal routes are code-split

`/system` and `/branding` are development/client-review tools and are now lazy-loaded. Normal client routes no longer eagerly import the design-system gallery, conversion reference, or branding moodboard.

Confirmed baseline build chunks:

- `SystemReference`: 2.09 kB raw / 0.65 kB gzip
- `businessContexts`: 6.46 kB raw / 2.64 kB gzip
- `BrandingPage`: 7.61 kB raw / 2.63 kB gzip
- `SystemPage`: 21.19 kB raw / 6.42 kB gzip

### Scroll observation only where needed

Previously every `Section` created `useScroll` and `useTransform`, even when its motion was only a normal reveal. Scroll tracking now lives in a small scene-only inner component and is mounted only for `motion: "scene"` sections.

Normal sections therefore avoid unnecessary scroll observers/transforms.

### Static data validation moved out of the browser

The first measured bundle audit found that Zod entered the client graph only because `resolve.ts` parsed static `collections.json` and `globalBlocks.json` at module load.

The validation is useful, but the browser is the wrong boundary for it. Those schemas are now validated when Vite starts for development or production build. The client resolver consumes the already-validated static data as typed records and no longer imports `schemas.ts` or Zod.

This preserves early schema failures during `vite`/`vite build` while allowing Zod to disappear from the production browser graph.

## Baseline bundle before the Zod boundary refactor

Recorded from a passing `npm run check` on 2026-08-07:

```text
dist/index.html                             0.52 kB │ gzip:   0.31 kB
dist/assets/index-9K8ydzMI.css             27.72 kB │ gzip:   6.00 kB
dist/assets/SystemReference-Btk91osk.js     2.09 kB │ gzip:   0.65 kB
dist/assets/businessContexts-Bu8Su0k0.js    6.46 kB │ gzip:   2.64 kB
dist/assets/BrandingPage-BM_ZTKnf.js        7.61 kB │ gzip:   2.63 kB
dist/assets/SystemPage-C1RXRfPj.js         21.19 kB │ gzip:   6.42 kB
dist/assets/index-DKIAdhm2.js             456.22 kB │ gzip: 142.91 kB
```

The post-refactor build should be compared directly against **456.22 kB raw / 142.91 kB gzip**. If Zod is fully removed from the client graph, a meaningful decrease should be visible without any application-level behavior change.

## Keep as tokens

Use tokens for values that express a stable system role rather than merely appearing more than once.

Good token candidates already present:

- spacing scale
- padding roles
- radius roles
- control dimensions
- text measures/container widths
- typography scale
- durations/easings/transitions
- opacity states
- breakpoints
- semantic status colours

Do not create tokens for every literal `1px`, `100%`, `0`, or one-off composition dimension. A token should reduce decisions or communicate a semantic role.

## Keep as mixins

Use mixins for repeated behaviour rather than repeated values.

Current useful mixins:

- responsive breakpoints
- hover-capability query
- reduced-motion query
- focus ring
- interactive control
- standard control
- glass effect
- grain effect
- arch/blob shape treatments

Potential future mixins should only be introduced after the behaviour appears in at least three meaningful places. Good candidates to watch:

- disclosure/reveal behaviour if reused outside Accordion
- shared sticky-story fallback behaviour
- shared media-overlay surface behaviour

Avoid mixins that simply alias one declaration.

## Deliberately not abstracted

These repetitions are currently clearer locally:

- component-specific grid templates
- unique min-heights used only for presentation/moodboard composition
- carousel arrow typography
- form focus treatment
- diagnostic `/system` borders
- branding-page composition rules
- one-off `color-mix()` strengths used to establish different hierarchy levels

If these converge across three or more production components later, reassess them.

## React/component audit

### Healthy patterns

- one `Section` primitive
- layout primitives remain separate from content primitives
- `Card` accepts text/media rather than spawning industry-specific card components
- `Form` is schema-driven
- `Embed` is provider-aware without provider-specific visual components
- Schedule normalizes provider data at the integration boundary
- global blocks compose reusable content
- links and media use semantic registries
- `/system` and `/branding` are data-driven review tools rather than production component forks

### Watch list

- keep `SystemPage` as a preview renderer only; do not turn it into a second production page-builder
- avoid adding one resolver per JSON file; normalize only at real boundaries
- avoid new component variants when global style variants/tokens can express the difference
- avoid adding numeric motion props; prefer named presets
- do not make every optional integration part of the base runtime bundle

## Runtime performance audit

### Already strong

- native scroll-snap carousel rather than a slider dependency
- intrinsic image dimensions
- lazy loading for non-priority images
- `srcset`/`sizes` support
- high fetch priority only when explicitly requested
- reduced-motion support
- provider-independent media registry
- optional external embeds rather than core media primitives
- design-system and branding routes lazy-loaded
- section scroll tracking scene-only
- static Zod schema validation moved to Vite/build boundary

### Dependency findings

- **Zod:** avoidable browser cost; moved to build/dev boundary.
- **Motion:** expected remaining heavyweight. It powers production section reveals and page progress, so do not refactor it blindly. Reassess `LazyMotion` only after the post-Zod build shows the remaining client size.
- **React Router:** core route infrastructure; no low-risk removal justified.
- **Zustand:** small and useful for UI overlay state; keep.
- **clsx:** negligible and improves class composition; keep.

### Measure next

Run:

```bash
npm run check
```

Compare the new main `index-*.js` result with the recorded **142.91 kB gzip** baseline. The immediate question is whether moving Zod out of the client graph produces a meaningful drop.

If the main gzip size remains unexpectedly high after this change, investigate Motion with bundle-analysis tooling in the next performance pass. Do not introduce `LazyMotion` merely to chase an arbitrary target.

Then run Lighthouse against a deployed representative page using real media. Measure at minimum:

- LCP
- CLS
- INP
- total transferred bytes
- JS execution time
- unused JS/CSS
- image payload
- third-party payload

### Potential optimisation only if measurements justify it

- evaluate Motion `LazyMotion`/feature loading if Motion remains a dominant initial bundle cost
- pause/defer decorative video aggressively
- lazy-mount expensive third-party embeds
- code-split optional integrations that acquire real SDKs
- use `content-visibility: auto` only after checking layout/accessibility effects on very long pages

Do not add optimisation abstractions before measuring a real page.

## Motion performance rules

- reveal motion should use transform/opacity only
- continuous scroll motion should be limited to intentionally marked scenes
- decorative parallax/drift should remain sparse
- never animate layout properties continuously when a transform can communicate the same thing
- reduced-motion must preserve content and reading order
- avoid multiple competing scroll effects in the same viewport
- background video + parallax + glass + multiple filters should be treated as a high-cost combination and used deliberately

## CSS rendering-cost watch list

The following are valuable but potentially expensive when used broadly:

- `backdrop-filter`
- large blurred shadows
- fixed full-screen layers
- many simultaneous transforms
- blend modes
- large autoplay video

They remain optional art-direction tools. Avoid applying them globally or repeatedly to long lists.

## Data/bundle rules

- client-facing pages should not import `/system` or `/branding` data
- provider SDKs should be imported only by the integration that needs them
- large client collections should eventually support route/source-level loading if they become materially large
- do not preload hidden carousel/gallery media
- do not ship unused placeholder media in a finished client build
- runtime consumers should not validate static bundled JSON repeatedly when validation can happen at build/dev startup

## Accessibility/performance interaction

Performance refactors must not remove semantic HTML, focus states, useful labels, real buttons/links, reduced-motion fallbacks, or readable non-animated content. A faster inaccessible pattern is not an optimisation.

## Before foundation merge

- [x] `npm run check` passed before the final bundle-boundary refactor
- [x] Vite production output reviewed for unexpected large initial chunks
- [x] `/system` and `/branding` confirmed as lazy chunks
- [ ] rerun `npm run check` after the Zod boundary refactor
- [ ] record post-refactor main JS raw/gzip size
- [ ] no console warnings/errors on core routes
- [ ] keyboard/focus audit complete
- [ ] reduced-motion audit complete
- [ ] real mobile viewport audit complete
- [ ] representative real-media Lighthouse run completed (can move to real-client validation if placeholder media is still in use)
- [ ] no unused client integrations enabled
- [x] no obvious repeated semantic style pattern remains unreviewed
- [x] no abstraction exists only to save one declaration

## Rule going forward

> Reuse semantic decisions, not accidental repetition. Measure before optimising. Prefer deleting a choice over creating a new abstraction.
