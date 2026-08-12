# Experience system

The experience layer adds depth and storytelling without changing the underlying page content model. Behaviours stay named, limited, optional, and reduced-motion safe.

## Existing / planned vocabulary

### Reveal
Use for normal entrance hierarchy. Content becomes visible as it enters the viewport. This is the quiet default.

### Scene
Continuous scroll-linked movement on a section. Use when scroll progression communicates relationship or depth.

### ScrollScene presets

- `parallax` | content/media moves subtly against scroll to create depth.
- `drift` | decorative shapes move at different speeds while content stays stable.
- `draw` | line/rule/progress treatment reveals with scroll.

Do not expose arbitrary speed/rotation values to normal content data. Add a new named preset only when a recurring art-direction need justifies it.

### Timeline
A chronology or checklist whose rail progresses as the visitor scrolls. Useful for project phases, history, impact, production, supply chain, editorial chronology, or methodology.

### ScrollPanel
Optional panel storytelling. The same semantic sections remain usable when the behaviour is disabled. Use for deliberate scene-by-scene narratives, not ordinary pages.

### ScrollProgress
Global orientation aid.

- `false`
- `top`
- `rail`

### Footer reveal
A shell-level effect inspired by a fixed footer sitting behind the final page canvas and being uncovered at the end of the page. It reuses the normal footer content and must fall back to normal flow for reduced motion/small screens where appropriate.

### Background media
Sections and pages may use the normalized Media system as decorative background media.

Recommended semantic contract:

```json
{
  "background": {
    "media": "studio-01",
    "overlay": "soft",
    "position": "center",
    "behavior": "static"
  }
}
```

Keep options intentionally small:

- `media`: media registry ID; may resolve to image or video.
- `overlay`: `none | soft | strong`.
- `position`: semantic/focal positioning.
- `behavior`: `static | fixed | parallax`.

Background media is decorative by default. Meaningful images should remain semantic `Media` content with proper alternative text/captioning.

Background video must be muted, inline, non-essential, conservative in preload, supplied with a poster, and replaced by the poster/static frame in reduced-motion mode.

## High-value capabilities to add or complete

### Sticky storytelling
Keep one semantic zone stable while related content progresses alongside it. Strong for architecture, case studies, ingredients/process, editorial stories, products, and artwork details.

Prefer composing existing `Split`, `Media`, `TextBlock`, `ScrollScene`, and section-group behaviour rather than creating a giant feature component.

### Media/text sequence
A fixed or sticky media area changes as corresponding text chapters become active. Treat this as a composition of sticky layout + scroll scene + controlled content switching.

### Lightbox
A Gallery capability, not a separate gallery architecture. Use for work that genuinely needs close inspection. Preserve keyboard operation, focus management, captions and media metadata.

### Chapter / anchor navigation
Useful for long case studies, architecture projects, reports, exhibitions and editorial pages. Keep native anchors and semantic headings as the source of truth.

### Marquee / ticker
For collaborators, press names, dates, announcements, partners or cultural programming. Use sparingly; pause/disable motion when needed and never hide essential content exclusively inside movement.

### Before / after
A dedicated interaction may be justified because comparison has specific input and accessibility needs. Useful for renovation, restoration, environmental work, design systems, beauty and product evolution.

### Sticky CTA
Optional conversion behaviour for booking, tickets, purchase or project enquiry|especially mobile. It must not obscure content or compete with critical controls.

### Media reveal presets
Possible ScrollScene presets such as curtain/clip/scale reveals. Keep them named and art-directed rather than configurable through arbitrary numeric props.

## Combinations

Behaviours are composable, not templates. Examples:

- `ScrollPanel off + Parallax on + Footer reveal on`
- `ScrollPanel on + Parallax off + Footer reveal off`
- `Rail progress + Timeline + normal footer`
- `Sticky media + draw preset + final footer reveal`

Do not enable every effect simultaneously. One primary motion idea per composition is usually enough.

## Variant character

- **Classic** | restrained reveal, minimal parallax, calm transitions.
- **Editorial** | directional reveal, rules/draw, occasional parallax, strong cropping.
- **Organic** | softer drift, organic masks, rounded geometry, fluid parallax.

Variants change the expression of the same behaviour; they do not fork markup.

## Accessibility and performance

- `prefers-reduced-motion` preserves all content and functionality in static form.
- No scroll-jacking.
- Native scrolling remains the source of truth.
- Mobile may simplify or disable expensive scenes.
- Avoid layout-affecting animation where transform/opacity can communicate the same thing.
- Decorative autoplay video never carries required information.
- Test scroll experiences with keyboard, zoom, touch, slow devices and reduced motion.
