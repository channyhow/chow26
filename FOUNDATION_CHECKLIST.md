# Chow Template | Complete Foundation Checklist

> **Consistency first. Tokenize values. Mixin repeated behavior. Components compose. Layout positions. Data supplies content. Normalize only at boundaries.**

This checklist is the release source of truth for the reusable starter. A checked foundation item means the architecture exists; visual QA and real-provider tests remain separate gates.

## 1. Architecture / engineering rules

- [x] Stable, reusable component naming.
- [x] BEM component styling.
- [x] `@/` import aliases.
- [x] Layout concerns separated from content components.
- [x] Visual variants do not change component markup.
- [x] Shared overlay/UI state centralized.
- [x] Content and business configuration data-driven where useful.
- [x] Prefer semantic registries/direct lookup over resolver chains.
- [x] Keep resolvers for source/query/media normalization where they earn their place.
- [x] Provider integrations isolated from UI.
- [x] Provider data normalized before entering features/components.
- [x] Production build and Netlify config defined in repo.
- [ ] Audit duplicate component responsibilities.
- [ ] Audit duplicate prop names / synonymous APIs.
- [ ] Audit circular imports and feature-to-feature coupling.
- [ ] Audit component files for business-specific assumptions.
- [ ] Review all abstractions: remove anything that saves lines but increases cognitive load.
- [ ] Review repeated SCSS: meaningful pattern repeated 3+ times should be considered for a mixin.

## 2. Source structure

- [x] `components/` for reusable UI and composition primitives.
- [x] `features/` for meaningful domain behavior such as Schedule.
- [x] `integrations/` for external provider boundaries.
- [x] `data/` for semantic site content/configuration.
- [x] `types/` for stable app-facing shapes.
- [x] `motion/` for shared motion configuration.
- [x] `state/` for shared interaction state.
- [x] `styles/` split into foundation / variants / utilities / layout / components.
- [x] `utils/` reserved for pure generic helpers.
- [ ] No `helpers.ts`, `misc.ts`, or generic junk-drawer modules.
- [ ] Document allowed folder responsibilities in README.

## 3. Tokens / SCSS foundation

- [x] Restrained color roles.
- [x] Gray scale.
- [x] Restrained spacing scale.
- [x] Restrained radius scale.
- [x] Semantic radius roles: control / surface / media.
- [x] Shared typography scale.
- [x] Shared measures / text widths.
- [x] Shared breakpoint tokens.
- [x] Shared motion durations/easing.
- [x] Shared opacity values.
- [x] Hover-capability mixin.
- [x] Focus-ring mixin.
- [x] Reduced-motion mixin.
- [x] Interactive-control mixin.
- [x] Glass mixin.
- [x] Grain mixin.
- [x] Organic shape mixins.
- [ ] Audit hard-coded spacing values.
- [ ] Audit hard-coded radii.
- [ ] Audit repeated transitions.
- [ ] Audit repeated border treatments.
- [ ] Audit repeated surface treatments.
- [ ] Remove token aliases that have no semantic purpose.
- [ ] Ensure no component creates a private spacing/radius system.

## 4. Style variants

### Classic
- [x] Classic font role.
- [x] Neutral geometry baseline.
- [ ] Art-direct until it feels intentional rather than browser/default.
- [ ] Verify cards, controls, media, gallery, drawer, forms.

### Editorial
- [x] Editorial heading role.
- [x] Sharper geometry.
- [x] Stronger rules / asymmetric capability.
- [ ] Refine editorial composition against premium magazine/hospitality references.
- [ ] Verify media cropping and gallery asymmetry.
- [ ] Verify navigation and forms remain elegant rather than harsh.

### Organic
- [x] Organic heading role.
- [x] Softer semantic radii.
- [x] Organic media/gallery shapes.
- [x] ScrollScene inherits organic shape language.
- [ ] Refine shape frequency: organic, not gimmicky.
- [ ] Refine softer motion character.
- [ ] Verify form/control softness remains practical.

### Variant system QA
- [ ] Every core component responds to Classic / Editorial / Organic.
- [ ] Every core component responds to default / inverse / accent tone.
- [ ] Variant switch never changes semantic markup.
- [ ] Variant switch never requires duplicate component data.
- [ ] Contrast passes in every variant/tone combination.

## 5. Typography

- [x] Heading/body roles tokenized.
- [x] Local-font strategy documented.
- [x] Classic / Editorial / Organic heading placeholders.
- [x] Shared body family role.
- [ ] Verify local font files and licensing before release.
- [ ] Font-display strategy.
- [ ] Remove unnecessary font weights/files.
- [ ] Mobile title line-break QA.
- [ ] Paragraph width QA.
- [ ] Body line-height QA.
- [ ] UI/caption sizing QA.
- [ ] Legal/long-form typography QA.

## 6. Core content components

- [x] TextBlock.
- [x] Media.
- [x] Card.
- [x] Gallery.
- [x] Carousel.
- [x] ContentSwitcher.
- [x] Accordion.
- [x] Timeline.
- [x] Loader.
- [x] Embed.
- [ ] Optional Gallery lightbox: add only after genuine client need is confirmed.
- [ ] Card media composition review.
- [ ] Empty-state behavior where applicable.
- [ ] Long-content stress tests.

## 7. Gallery

- [x] Grid layout.
- [x] Masonry layout.
- [x] Editorial/asymmetric layout.
- [x] Variant-aware geometry.
- [ ] Mobile stacking/cropping QA.
- [ ] Mixed portrait/landscape stress test.
- [ ] Caption behavior.
- [ ] Optional lightbox decision.
- [ ] Keyboard/lightbox accessibility if lightbox is added.

## 8. Carousel

- [x] Native-scroll-first implementation.
- [x] Scroll snapping.
- [x] Controls.
- [x] Generic children/content support.
- [ ] Partial-next-item composition QA.
- [ ] Mobile drag/swipe QA.
- [ ] Keyboard control QA.
- [ ] Focus management.
- [ ] Control disabled-state logic.
- [ ] Screen-reader labeling/announcements.
- [ ] Reduced-motion behavior.
- [ ] Nested interactive content QA.

## 9. ContentSwitcher

- [x] Shared reusable switcher.
- [x] Distinct concept from Carousel.
- [ ] Stable-height / layout-shift QA.
- [ ] Keyboard tab semantics review.
- [ ] ARIA selected/control relationships.
- [ ] Content transition choreography.
- [ ] Mobile label overflow behavior.

## 10. Accordion / disclosure

- [x] Native disclosure semantics.
- [x] Shared SCSS visual system.
- [ ] Open/close motion polish.
- [ ] Reduced-motion fallback.
- [ ] Long FAQ stress test.
- [ ] Focus styling QA.

## 11. Forms / business input

- [x] Single Form renderer.
- [x] Form content located in `forms.json`.
- [x] Contact schema.
- [x] Reservation/booking schema.
- [x] Text / email / tel / textarea / select / checkbox / date / time / number support.
- [x] Min / max / step support.
- [x] Contact and booking drawers use same renderer.
- [x] Shared radius/focus/surface rules.
- [x] Netlify-ready default.
- [ ] Newsletter schema/example.
- [ ] Quote-request schema/example.
- [ ] Validation state styling.
- [ ] Error state styling.
- [ ] Success state styling.
- [ ] Required-field messaging.
- [ ] Server/provider error behavior.
- [ ] Submission loading behavior.
- [ ] Spam/honeypot review.
- [ ] Privacy/consent field pattern.
- [ ] Mobile input density QA.
- [ ] Native date/time picker QA on iOS/Android.
- [ ] Netlify production submission test.
- [ ] Submission adapter boundary if non-Netlify providers are added.

## 12. Global semantic data

- [x] `site.json` owns identity/contact/theme/integration/experience settings.
- [x] `forms.json` owns reusable form schemas.
- [x] `links.json` centralizes semantic URLs.
- [x] `globalBlocks.json` owns reusable compositions.
- [x] `collections.json` owns repeatable content collections.
- [x] `media.json` owns media metadata.
- [x] `pages.json` owns page composition.
- [x] `schedule.json` owns Schedule enrichment mapping.
- [x] `data/index.ts` exposes semantic registries.
- [ ] Remove remaining repeated literal URLs.
- [ ] Remove remaining repeated literal contact/business facts.
- [ ] Footer/legal/location/contact resolve shared business data wherever practical.
- [ ] Validate all JSON at application boundary without resolver proliferation.

## 13. Global blocks

- [x] Opening/hero example.
- [x] Services example.
- [x] Contact.
- [x] Reservation.
- [x] Reviews.
- [x] Social.
- [x] Location.
- [x] CTA.
- [x] Footer.
- [x] Legal.
- [x] Link-profile / Linktree-style content.
- [ ] Newsletter global block.
- [ ] Schedule global block.
- [ ] FAQ global block.
- [ ] Generic business-information block.
- [ ] Ensure block references stay lightweight and do not duplicate source content.

## 14. Links / actions

- [x] Central semantic link registry.
- [x] `linkKey` support in shared action renderer.
- [x] Booking links can be reused by Schedule and normal CTAs.
- [x] Social links centralized.
- [ ] External/internal link behavior QA.
- [ ] Target/rel policy.
- [ ] Mail/tel/directions actions.
- [ ] Disabled/unconfigured semantic link behavior.
- [ ] CMS-editable link registry strategy.

## 15. Schedule / Calendar feature

- [x] Provider-neutral CalendarEvent type.
- [x] Provider-neutral ScheduleEvent type.
- [x] Google Calendar integration boundary.
- [x] Google Calendar normalization.
- [x] Event enrichment by semantic configuration.
- [x] Event can receive image/label/booking link.
- [x] Central booking link registry reused.
- [x] Date formatting/sorting utilities separated from provider code.
- [x] Schedule composition reuses Media + Card + Grid.
- [x] Schedule preview on `/system`.
- [ ] Real Google Calendar endpoint/auth example.
- [ ] Timezone normalization audit.
- [ ] Recurring-event behavior.
- [ ] Cancelled-event behavior.
- [ ] Past-event filtering.
- [ ] Empty state.
- [ ] Loading state.
- [ ] Error state.
- [ ] Capacity/availability only when a client needs it.
- [ ] Provider caching strategy.

## 16. Generic utils

- [x] Date formatting/sorting foundation.
- [ ] URL helpers only when repeated.
- [ ] String/slug helpers only when repeated.
- [ ] Number/currency formatting when commerce requires it.
- [ ] Generic type guards only when reused.
- [ ] No business/provider logic in utils.
- [ ] No premature `arrays.ts` / `strings.ts` collections without actual reuse.

## 17. External integrations / embeds

- [x] Generic Embed primitive.
- [x] Provider-aware styling without provider-specific layout components.
- [x] Instagram provider.
- [x] Maps provider.
- [x] Calendar provider.
- [x] Tally provider.
- [ ] Instagram real embed test + fallback.
- [ ] Instagram privacy/loading behavior.
- [ ] Google Maps example.
- [ ] OpenStreetMap example.
- [ ] Calendly example.
- [ ] Tally example.
- [ ] Notion adapter.
- [ ] Firebase adapter.
- [ ] Newsletter provider adapter.
- [ ] Stripe/commerce adapter.
- [ ] Analytics adapter.
- [ ] Integration failure states.
- [ ] Third-party cookie/privacy review.

## 18. Motion system | core rules

- [x] Shared duration/easing config.
- [x] Reduced-motion detection.
- [x] Normal section reveal without Reveal wrappers.
- [x] Continuous section `scene` motion.
- [x] ScrollPanel storytelling mode.
- [x] Global ScrollProgress.
- [x] ScrollProgress supports top bar.
- [x] ScrollProgress supports vertical page rail.
- [x] Timeline scroll-drawn line.
- [x] Timeline item activation.
- [x] Timeline supports chronology mode.
- [x] Timeline supports checklist mode.
- [x] ScrollScene primitive.
- [x] ScrollScene supports scroll-linked shape drift/parallax.
- [x] ScrollScene shape language responds to site variant.
- [x] ScrollScene reduced-motion static fallback.
- [ ] Motion must never be required to understand content.
- [ ] Motion presets remain a restrained vocabulary.
- [ ] No per-component arbitrary duration/distance props.

## 19. Motion system | advanced composition

- [x] Reveal: one-time viewport entrance.
- [x] Scene: continuous local scroll-linked transform.
- [x] Draw: line progress through Timeline/ScrollScene.
- [x] Drift: decorative shapes move at different scroll speeds.
- [x] Parallax-ready ScrollScene.
- [x] Page rail can reveal continuously along the whole page.
- [ ] Sticky storytelling preset QA.
- [ ] Horizontal rail preset: implement only if it remains usable on mobile and keyboard.
- [ ] Media mask/reveal preset review.
- [ ] SVG path-drawing preset review.
- [ ] Number/stat count-up preset review only if useful.
- [ ] Scroll-linked color/surface transition review.
- [ ] Section-to-section shared element choreography review.
- [ ] Ensure scroll-driven motion does not fight native scrolling.
- [ ] Avoid scroll-jacking.
- [ ] Verify motion performance on mid-range mobile.

## 20. ScrollPanel

- [x] On/off mode.
- [x] Same underlying section content.
- [x] Reduced-motion fallback.
- [ ] Mobile degradation to normal flow.
- [ ] Keyboard/focus behavior.
- [ ] Sticky offsets with header/safe area.
- [ ] Nested interactive content QA.

## 21. Navigation / Header / Drawer

- [x] Header foundation.
- [x] BurgerButton.
- [x] Burger-to-close morph.
- [x] Drawer.
- [x] Drawer backdrop transition.
- [x] Drawer content reveal.
- [x] Canvas response to drawer state.
- [x] Central overlay state.
- [x] Contact drawer.
- [x] Reservation drawer.
- [ ] Final drawer choreography inspired by best Sasha qualities, without old architecture.
- [ ] Logo state across open/closed overlays.
- [ ] Header tone across backgrounds/media.
- [ ] Focus trap/dialog QA.
- [ ] Escape/backdrop close QA.
- [ ] Scroll lock QA.
- [ ] iOS safe-area QA.

## 22. Loader

- [x] Loader component.
- [x] Loader messages in JSON.
- [x] Reduced-motion behavior.
- [ ] Loader replay control in `/system`.
- [ ] First-load-only strategy.
- [ ] Do not artificially delay application readiness.
- [ ] Transition from loader to site.
- [ ] Loader accessibility / aria-hidden/live-region decision.

## 23. Reusable business compositions

- [x] Reviews = Card + Carousel.
- [x] Services = Card + Grid.
- [x] Products/menu = Card + Grid or Carousel.
- [x] FAQ = Accordion.
- [x] Booking request = Form + reservation schema.
- [x] Live/external booking = Embed.
- [x] Schedule = normalized events + shared content primitives.
- [x] Newsletter = Form architecture.
- [x] Social/Linktree page = normal content primitives.
- [x] Location = shared business data + Embed.
- [ ] Team/staff composition.
- [ ] Opening-hours composition.
- [ ] Menu/category ContentSwitcher example.
- [ ] Review carousel example on `/system`.
- [ ] Product/menu example on `/system`.
- [ ] Social-links example on `/system`.

## 24. `/system` design-system test bench

- [x] Variant switcher.
- [x] Tone switcher.
- [x] Palette preview.
- [x] Card/frame/effect preview.
- [x] Media preview.
- [x] Gallery layout switcher.
- [x] Carousel preview.
- [x] ContentSwitcher preview.
- [x] Accordion preview.
- [x] Timeline preview.
- [x] ScrollScene preview.
- [x] ScrollPanel toggle.
- [x] Global scroll rail visible from site experience config.
- [x] Loader preview.
- [x] Schedule preview.
- [x] Map embed preview.
- [x] Instagram embed preview.
- [x] Contact form preview.
- [x] Reservation form preview.
- [x] Contact/reservation drawer triggers.
- [ ] Loader replay control.
- [ ] Motion preset controls.
- [ ] ScrollProgress top/rail/off preview control.
- [ ] Timeline chronology/checklist switch.
- [ ] Responsive stress-test area.
- [ ] Long-copy stress-test area.
- [ ] Realistic editorial placeholder photography.
- [ ] Component states: hover/focus/disabled/error/loading.

## 25. Responsive system

- [x] Mobile-first base approach.
- [x] Restrained breakpoint set.
- [x] Section/layout primitives responsive by CSS rather than prop variants.
- [ ] 320px minimum stress test.
- [ ] 375/390/430 mobile QA.
- [ ] Tablet portrait QA.
- [ ] Tablet landscape QA.
- [ ] Small laptop QA.
- [ ] Desktop QA.
- [ ] Wide desktop/max-width QA.
- [ ] Orientation-change QA.
- [ ] Dynamic viewport units QA.
- [ ] Safe-area inset handling.
- [ ] Header/content offset QA.
- [ ] No horizontal overflow.
- [ ] Touch targets remain >= practical minimum.
- [ ] Scroll motion simplified where mobile performance/composition requires it.

## 26. Accessibility

- [x] Semantic HTML preferred.
- [x] Native controls preferred.
- [x] Focus-visible foundation.
- [x] Reduced-motion foundation.
- [x] Native Accordion disclosure.
- [x] Lazy iframe loading.
- [ ] Full keyboard-only pass.
- [ ] Focus order pass.
- [ ] Drawer/dialog focus management.
- [ ] Screen-reader naming pass.
- [ ] Heading hierarchy pass.
- [ ] Landmarks/navigation naming.
- [ ] Form labels/errors/descriptions.
- [ ] Carousel semantics.
- [ ] ContentSwitcher semantics.
- [ ] Timeline semantics remain understandable without motion.
- [ ] Color contrast across all variants/tones.
- [ ] Touch-target pass.
- [ ] Zoom 200% / reflow QA.
- [ ] High-contrast/forced-colors review.

## 27. Media system

- [x] Central media registry.
- [x] Width/height metadata.
- [x] Focal-point metadata.
- [x] Responsive media strategy documented.
- [x] Placeholder media structure.
- [ ] `srcset`/sizes production QA.
- [ ] AVIF/WebP strategy.
- [ ] LCP image priority handling.
- [ ] Lazy loading below fold.
- [ ] Avoid layout shift.
- [ ] Video poster/loading strategy.
- [ ] Reduced-motion autoplay policy.
- [ ] Decorative vs meaningful alt-text policy.
- [ ] CMS image normalization.

## 28. Performance / sustainability

- [x] Native scroll preferred over heavy slider library.
- [x] Existing motion dependency reused for scroll effects.
- [x] Lazy embeds.
- [x] No provider-specific embed UI packages.
- [x] Locally hosted font strategy.
- [ ] Bundle size baseline/budget.
- [ ] Route-level code splitting review.
- [ ] Component-level lazy loading only where meaningful.
- [ ] Font subset/weight audit.
- [ ] Image transfer-size audit.
- [ ] Third-party script budget.
- [ ] Lighthouse mobile baseline.
- [ ] Core Web Vitals baseline.
- [ ] CPU/scroll performance profile.
- [ ] Mid-range mobile motion profile.
- [ ] Carbon/transfer-size review before release.
- [ ] Remove dead CSS/dependencies.

## 29. SEO / discoverability / agent readability

- [x] Reusable site identity data.
- [x] Legal route / hosting defaults.
- [ ] Per-route title/description finalization.
- [ ] Canonical URLs.
- [ ] Open Graph/Twitter metadata.
- [ ] Default social image.
- [ ] Sitemap.
- [ ] robots.txt.
- [ ] LocalBusiness structured data.
- [ ] Restaurant structured data where applicable.
- [ ] ProfessionalService structured data where applicable.
- [ ] Event structured data for Schedule where applicable.
- [ ] Breadcrumb structured data where useful.
- [ ] Contact/address/service facts machine-readable and consistent.
- [ ] Semantic link labels meaningful to humans and agents.
- [ ] No critical business content hidden only behind JS interaction.

## 30. i18n / localization

- [x] Default locale in site data.
- [x] Supported locale list foundation.
- [x] Copy separated from component structure.
- [ ] Translation dictionary/source boundary.
- [ ] Locale-aware routes.
- [ ] Locale-aware metadata.
- [ ] `hreflang`/alternate URLs.
- [ ] Locale-aware date/time formatting.
- [ ] Locale-aware numbers/currency.
- [ ] Language switcher pattern.
- [ ] CMS locale strategy.
- [ ] Long translated text stress test.

## 31. CMS / editable data / admin readiness

- [x] JSON architecture can act as the canonical normalized shape.
- [x] External providers kept behind boundaries.
- [ ] Notion adapter proof of concept.
- [ ] Firebase adapter proof of concept.
- [ ] CMS-normalized media mapping.
- [ ] CMS-normalized forms/config mapping if needed.
- [ ] Editing permissions/security model.
- [ ] Preview/draft strategy.
- [ ] Cache/revalidation strategy.
- [ ] External branding/settings panel remains optional and separate from public UI.

## 32. Privacy / security / resilience

- [ ] No secrets committed to frontend repo.
- [ ] Environment-variable documentation.
- [ ] External API keys restricted by origin/service where possible.
- [ ] Form spam protection.
- [ ] User-provided HTML not rendered unsafely.
- [ ] External URLs validated when CMS-driven.
- [ ] iframe sandbox/allow policy reviewed per provider.
- [ ] Privacy-policy requirement assessed per integration.
- [ ] Analytics consent strategy where legally required.
- [ ] Integration outages degrade gracefully.

## 33. Analytics / conversion

- [ ] Analytics integration optional/off by default.
- [ ] CTA naming convention.
- [ ] Booking/contact conversion event naming.
- [ ] Form-success conversion events.
- [ ] External booking click events.
- [ ] Telephone/email/directions click events where useful.
- [ ] Respect consent/privacy constraints.
- [ ] No analytics dependency required for core UI.

## 34. Branding / project replacement

- [x] Placeholder content by default.
- [x] Creator credit defaults to Channy How-Choong / Chow Studio.
- [x] Netlify default hosting references where relevant.
- [x] Favicon.io replacement guidance documented.
- [ ] Favicon implementation QA.
- [ ] Logo replacement checklist.
- [ ] Font replacement checklist.
- [ ] Palette replacement checklist.
- [ ] Social image replacement checklist.
- [ ] Placeholder search before launch.
- [ ] Legal/contact/business detail replacement checklist.
- [ ] External provider URL replacement checklist.

## 35. Deployment / CI

- [x] Node version pinned.
- [x] Netlify build command.
- [x] Netlify publish directory.
- [x] SPA redirect.
- [x] Branch deploy workflow.
- [ ] `npm run check` in CI.
- [ ] TypeScript build gate.
- [ ] Lint gate.
- [ ] Optional test gate once tests exist.
- [ ] Production environment variables documented.
- [ ] Preview vs production environment separation.
- [ ] 404/direct-route test.
- [ ] Cache header review for media/assets.

## 36. README / documentation

- [x] Setup/install guidance.
- [x] Media guidance.
- [x] Favicon replacement guidance.
- [x] Local font strategy.
- [ ] Architecture map.
- [ ] Folder responsibility table.
- [ ] Data-file responsibility table.
- [ ] Variant system documentation.
- [ ] Motion vocabulary documentation.
- [ ] Global block documentation.
- [ ] Forms schema documentation.
- [ ] Schedule/Calendar integration guide.
- [ ] Embed/provider guide.
- [ ] Netlify deployment guide.
- [ ] New-client replacement checklist.
- [ ] CMS adapter guide.
- [ ] i18n guide.

## 37. Client handoff / maintainability

- [ ] Content replacement guide.
- [ ] Media naming/size guide.
- [ ] Brand token guide.
- [ ] Form editing guide.
- [ ] Global block editing guide.
- [ ] Booking/calendar editing guide.
- [ ] Social/link editing guide.
- [ ] Deployment guide.
- [ ] CMS guide when applicable.
- [ ] “Do not edit” engineering boundaries documented.
- [ ] Maintenance/update notes.

## 38. Final visual QA

- [ ] Header/navigation feels intentional in all variants.
- [ ] Footer rhythm approved.
- [ ] Form styling approved.
- [ ] Drawer styling/motion approved.
- [ ] Gallery composition approved.
- [ ] Carousel composition approved.
- [ ] ContentSwitcher approved.
- [ ] Timeline approved.
- [ ] ScrollScene approved.
- [ ] ScrollPanel approved.
- [ ] Loader approved.
- [ ] Schedule approved.
- [ ] Embeds approved.
- [ ] Legal/long-form pages approved.
- [ ] Mobile, tablet, desktop all feel art-directed rather than merely responsive.

## 39. Final engineering QA

- [ ] `npm run check` passes cleanly.
- [ ] Production build passes cleanly.
- [ ] Netlify branch deploy passes.
- [ ] Console has no errors/warnings that indicate real issues.
- [ ] No broken links.
- [ ] No missing assets.
- [ ] No horizontal overflow.
- [ ] No hydration/runtime warnings.
- [ ] No duplicated source of truth discovered in final audit.
- [ ] No unnecessary dependency discovered in final audit.

## 40. Release gate

Do **not** merge `foundation/chow-starter` into `main` until all of the following are true:

- [ ] `npm run check` passes.
- [ ] Netlify branch deploy passes.
- [ ] `/system` reviewed on mobile, tablet, laptop and desktop.
- [ ] Classic, Editorial and Organic each feel intentional.
- [ ] Core forms and booking flow visually approved.
- [ ] Drawer/Header/Footer visually approved.
- [ ] Gallery/Carousel/ContentSwitcher visually approved.
- [ ] Timeline/ScrollScene/ScrollPanel/ScrollProgress visually approved.
- [ ] Loader/Schedule/Embeds visually approved.
- [ ] Accessibility pass complete.
- [ ] Performance baseline recorded.
- [ ] SEO/discovery baseline complete.
- [ ] README/handoff documentation complete enough to start a client project safely.
- [ ] No duplicate styling system, resolver chain, or unnecessary component abstraction remains.
