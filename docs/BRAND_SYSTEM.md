# CHOW STUDIO | Brand system

## Direction
Editorial, direct, warm, restrained. Client work supplies visual variety; the studio identity supplies structure.

## Palette
### Primary palette
| Role | HEX |
|---|---|
| Burnt orange / signature | #D85234 |
| Charcoal / typography and contrast | #222224 |
| Warm ivory / warm brand background | #EFE8D7 |

### Secondary palette
| Role | HEX |
|---|---|
| Chalk / digital background | #F6F5F3 |
| Sand / editorial surfaces | #E9D9CE |
| Stone / secondary information | #6E6E69 |
| Mist / borders and separators | #D7D7D2 |

Orange is an accent, not the default colour for small text. Check contrast on each surface; use charcoal for essential copy. Print colours require a physical proof and printer-specific conversion. Other existing functional tokens are not core brand colours.

## Typography
Oswald: uppercase headings 600–700, navigation and actions 400–500, metadata 400 where appropriate.
IBM Plex Sans: body 400, emphasis 600, captions and explanatory content 400.
Body and lead share one fluid scale: 18–22px at 16px root, line-height 1.5. Navigation base 20px; footer navigation 18–20px. Display line-height 1.15, tracking -0.01em. Project hero statement and project name share Heading XL, with charcoal and stone respectively. Avoid arbitrary component-specific font sizes and unsupported weights. Fonts currently load via Google Fonts in index.html.

## Rhythm
Base scale (at 16px root): 8, 16, 32, 64, 96, 128px.
Related details 8px; content 16px; distinct groups 32px; blocks 64px; section breathing room 64–128px where applicable.
Grid: 4 mobile, 8 tablet, 12 desktop. Gutter 16–64px. Prefer alignment and whitespace over decorative containers. Use thin rules to group related information, not to separate every sentence.

## Motion
Shared interface timings: 60ms stagger, 180ms feedback, 360ms interface transitions, 640ms editorial reveals. Loader cycles and scroll-driven effects are separate choreography. Preserve reduced-motion support.

## Graphic language
Strong uppercase wordmark, horizontal primary and rotated vertical secondary for suitable applications. Keep existing artwork until master vector assets are approved. Square-edged editorial images, subtle sand offset planes, simple arrows. Warm, tactile photography; avoid imposing the studio palette on client work.

## Social applications (proposed starting template)
1080 × 1350 feed, 1080 × 1920 stories. Use a 72px feed margin and 24px modular spacing; adjust story safe zones for platform overlays. Oswald 600–700 for headlines (roughly 72–112px), IBM Plex Sans 400 for copy (roughly 32–40px), Oswald 400–500 for labels (roughly 24–32px). Test at phone size. Alternate project-led imagery, typographic statements, and process/details. Keep one main message per slide.

## Print and other applications
Use horizontal or vertical wordmark with generous clear space. Business cards: charcoal on orange recto, charcoal on warm ivory verso. Use IBM Plex Sans for contact details; Oswald for names and labels. Test small text, ink and stock before production. Proposals and email signatures use the same family hierarchy, with practical fallback fonts for email.

## Verification
This is the initial consolidated reference, not a completed visual regression audit. Validate all routes, responsive sizes, hover/focus states, contrast, font loading, and build before merging. Social dimensions and print treatments are proposed application rules, not exported artwork.
