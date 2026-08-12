# Conversion composition playbook

This starter does not create one component library per industry. The same small set of components is composed according to the visitor's decision journey.

## UX / UI principles

1. **Clarity before novelty.** The visitor should understand the offer, why it matters, and what to do next before decorative interaction asks for attention.
2. **One primary action per context.** Every section has one job. Secondary actions stay subordinate.
3. **Proof near the decision.** Reviews, work, credentials, process, or evidence belong close to the action they support.
4. **Progressive disclosure.** Keep the first read concise; use Accordion, ContentSwitcher, Carousel, or deeper routes for additional detail.
5. **Motion communicates.** Use motion for hierarchy, chronology, relationship, progress, or spatial storytelling|not because something can move.
6. **Trust is conversion.** Accessibility, honest wording, clear process/pricing, useful contact information, and performance are conversion features.
7. **Mobile is a first-class composition.** Preserve reading order, touch comfort, and short paths to action rather than shrinking desktop.
8. **Sustainable by default.** Prefer fewer stronger media assets, native browser behavior, lazy third-party embeds, and reusable components.

## Context hierarchies

### Restaurant / hospitality

**Goal:** create desire, remove practical uncertainty, and move quickly toward reservation.

`Hero + atmospheric Media → Gallery → ContentSwitcher (lunch/dinner/drinks) → Grid + Card (signatures/experiences) → Carousel (reviews/press) → Schedule or reservation Form → Map Embed → reservation CTA`

Prioritise `Media`, `Gallery`, `ContentSwitcher`, `Card`, `Carousel`, `Form`, `Schedule`, and `Embed`. Put availability, address, and booking close to moments of appetite; do not force a long brand story before the user can reserve.

### Architect / architecture studio

**Goal:** demonstrate taste and competence, then make project fit and enquiry credible.

`Hero + signature project → editorial Grid → flagship ScrollScene → ContentSwitcher (project types) → Timeline (process) → Carousel (testimonials/recognition) → studio approach → qualified project Form`

Portfolio proof comes before sales copy. The enquiry form can qualify project type, location, timing, and scope.

### Musician / performer

**Goal:** turn attention into listening, attendance, following, or professional booking.

`Hero (release/tour) → audio/video Embed → Schedule → Carousel (releases/press) → Gallery → ContentSwitcher (music/live/video) → newsletter/follow → booking Form`

Listening and upcoming dates should be immediately reachable. Keep fan actions distinct from professional booking.

### Artist / creative practice

**Goal:** let the work lead while making exhibitions, commissions, enquiries, or sales understandable.

`Hero work → Gallery → ContentSwitcher (series/medium/period) → ScrollScene (body of work/process) → Timeline or Schedule → Card/Grid (works/editions/commissions) → statement → enquiry Form`

Do not turn artwork into ecommerce cards unless purchasing is genuinely the primary task.

### Developer / designer / digital studio

**Goal:** prove capability and judgement, explain services, and generate qualified leads.

`Hero (positioning/outcome) → case-study Grid → flagship ScrollScene → ContentSwitcher (design/dev/strategy) → Timeline (process) → Carousel (testimonials/outcomes) → Accordion (scope/technical FAQ) → project Form`

Lead with outcomes and finished work rather than a long technology list. Technical detail becomes progressive proof.

### Association / nonprofit

**Goal:** make the mission tangible and convert attention into participation, donation, membership, volunteering, or contact.

`Hero (mission/impact) → TextBlock + Media → Grid/Card (programs/actions) → Timeline (progress/impact) → Carousel (voices/partners) → Schedule (events/volunteering) → Accordion (transparency/eligibility/FAQ) → donate/join/volunteer action`

Show concrete impact, governance, and where support goes. Avoid guilt-based pressure or vague impact claims.

### Green / ethical commerce

**Goal:** sell a useful product while substantiating environmental or social claims without greenwashing.

`Hero (product value) → Grid/Card (products/categories) → Media (materials/use/production) → ContentSwitcher (features/sourcing/care) → Timeline (supply chain/lifecycle when useful) → Accordion (shipping/repair/returns/certifications) → Carousel (reviews/use cases) → purchase CTA`

Specific evidence beats green language. State materials, origin, durability, repair, packaging, and verified certifications where relevant. Never imply benefits that cannot be substantiated.

## Component decision reminders

- **Grid:** scan several items at once; children can mix `Card`, `Media`, and `TextBlock`.
- **Card:** turn one item into a decision/proof unit; may contain media + text + actions.
- **Gallery:** visual composition and emotional proof; use when imagery itself is the content.
- **Carousel:** browse parallel/equal-weight items without making the page extremely long; do not hide critical information exclusively inside it.
- **ContentSwitcher:** compare categories or contexts in one stable area; use when the user deliberately chooses which content to inspect.
- **Accordion:** progressive detail, FAQ, policies, objections; keep essential information outside when everyone needs it.
- **Timeline:** chronology, checklist, process, impact, milestones, lifecycle.
- **Schedule:** time-sensitive events/classes/shows/appointments with semantic links to the correct next action.
- **ScrollScene:** memorable narrative when sequence or spatial relationship genuinely communicates something.
- **ScrollPanel:** longer sequential storytelling that benefits from panel pacing.
- **Form:** qualified intent capture; use the smallest number of fields required for the next business action.
- **Embed:** isolate optional third-party tools such as maps, Instagram, booking, video, or forms; lazy-load and review privacy impact.

The canonical structured version of this playbook lives in `src/data/businessContexts.json` and is rendered on `/system`.
