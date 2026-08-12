# Data ownership and hardcoding audit

The starter follows one rule: React owns structure and behavior; editable content and business configuration live in semantic data.

## Ownership

- `site.json` | site identity, contact details, socials, credits, shared UI copy, theme and global experience settings.
- `navigation.json` | primary and temporary review navigation destinations and labels.
- `forms.json` | form-specific labels, fields, options and submit wording.
- `links.json` | reusable external/action destinations referenced semantically by key.
- `media.json` | normalized media metadata and asset references.
- `collections.json` | repeated business content such as services, reviews and links.
- `schedule.json` | schedule enrichment rules/configuration.
- `globalBlocks.json` | reusable page compositions.
- `pages.json` | route/page composition.
- `system.json` | design-system demo content.
- `branding.json` | client-facing moodboard/presentation content.

## What may remain in TS/TSX

Structural implementation is allowed in code: component names/classes, DOM roles, fixed internal IDs such as `site-drawer`, rendering logic, state transitions, route mechanics, numeric animation/math constants, and visual behavior that is not client-editable content.

User-facing copy, business facts, route labels, provider URLs, CTA wording, locale choices and other editable content should not be introduced directly inside visual components.

## Refactors completed in this audit

- Drawer navigation moved from hardcoded `<Link>` elements to `navigation.json`.
- Temporary `/system` and `/branding` links live in the `review` navigation group and can be disabled/removed from data.
- Drawer titles, main-nav label and close/open-menu accessibility copy moved to `site.json`.
- Header home label now derives from navigation data.
- Form select placeholder and fallback submit label moved to shared UI copy.
- Carousel fallback label, navigation label, previous/next labels and position separator moved to shared UI copy.
- ContentSwitcher tablist label moved to shared UI copy.
- Schedule booking CTA moved to shared UI copy.
- Date utils no longer default to a French locale; Schedule supplies the site locale explicitly.

## Remaining audit watchpoints

- `globalBlocks.json` contains legitimate editable content, but some values duplicate facts already present in `site.json` (for example social/credit/footer details). These should be reduced to semantic references when the rendering contract can do so without adding resolver complexity.
- `/system` and `/branding` already source their main content from JSON. Any remaining TSX literals on those development-only pages should be treated as presentation taxonomy/structure; editable demo or client-facing wording belongs in their JSON files.
- Provider-specific URLs belong in integration/config data, not visual components.
- Do not replace a hardcoded value with a new JSON key if the value is actually a stable implementation detail. Moving every string or number into JSON would make the system harder to understand.

## Review rule

Before writing a literal in a component, ask:

1. Would a client, editor or localization pass reasonably change this?
2. Is it a business fact, destination, CTA, label, message or provider configuration?
3. Does the same fact already exist in site data?

If yes, consume semantic data. If no, keep the implementation detail local.

> One fact, one owner. React renders it; JSON describes it.
