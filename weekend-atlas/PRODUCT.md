# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is Barron, deciding what to do with a free stretch of time in and around San Francisco. The public site may also be browsed by friends or other Northern California locals who want a strong recommendation rather than a directory.

The core job is: start with the time available, find an outing that fits, understand the intended shape of the experience, and leave with enough practical detail to actually do it.

## Product Purpose

Alfred’s Weekend Atlas is a curated collection of exceptional Northern California outings within roughly a five-hour drive of San Francisco. It turns vague free time into an opinionated plan.

Success means the visitor quickly finds an outing that fits their available window, feels excited rather than administratively burdened, and can follow a strong default itinerary without doing another hour of research.

## Positioning

The atlas begins with **time available**, not destination or category. Its atomic unit is a complete outing: a specific, authored shape of experience with a default itinerary and smart swaps—not a city guide, event feed, venue list, or generic collection of “things to do.”

The first edition is deliberately limited to 24 exceptional outings. Curation is the product; comprehensiveness would make it worse.

## Operating Context

- Northern California escapes within approximately five driving hours of San Francisco; no flights.
- Outings may occupy a few hours, a full day, one night, a full weekend, or two to three nights.
- The primary wayfinding dimension is time available. Energy level is secondary.
- Outings can be evergreen or season-tagged, but the atlas is not a live events calendar.
- Each outing has a compact preview and a fuller guide with a recommended sequence, useful facts, sources, and limited alternatives.
- Barron reports completed outings to Alfred; Alfred updates the code to add a permanent passport-style completion mark.

## Capabilities and Constraints

- Launch edition: exactly 24 outings.
- Read-only browsing; no accounts, booking, purchasing, user-side editing, or dynamic persistence.
- Completion state is hardcoded in the source and maintained by Alfred.
- Each outing is one completion unit. Repeats do not add multiple completion marks.
- A strong default itinerary must be visible; alternatives are subordinate “smart swaps.”
- Desktop is the showcase format; mobile must remain fully usable and responsive.
- The site is a static subdirectory of Alfred Hub, deployed on Vercel at `alfred.barronroth.com`.
- Sources must be real and linked. The site must not fabricate prices, schedules, access rules, or availability.

## Brand Commitments

- Product name: **Alfred’s Weekend Atlas**.
- Voice: “Sharp Alfred” — concise, opinionated, useful, and lightly funny; never corporate or breathless.
- Terminology: call entries **outings**.
- The experience should feel fun and collectible without becoming childish or gamified.

## Evidence on Hand

- Barron supplied Pebble Beach / 17-Mile Drive as a model outing and the official Pebble Beach resort map as a reference for rich, map-led content: `https://www.pebblebeach.com/content/uploads/ResortMapWebsite-F11-13-18-FOR-OUTPUT-compressed.pdf`.
- Existing Alfred Hub travel artifacts provide technical precedent for static HTML subprojects, but not binding visual authority for this atlas.
- Research for the first 24 outings will use official destinations, parks, operators, and reputable local editorial sources.
- No testimonials, usage analytics, customer claims, or commercial proof are available; none should be invented.

## Product Principles

1. **Time first.** Begin with the free window the visitor actually has.
2. **A plan, not a pile.** Every outing has an opinionated default sequence.
3. **Ruthless edition-making.** Twenty-four distinct outings beat a searchable landfill.
4. **Joy over logistics.** Surface the details that unlock the day; suppress routine administrative sludge.
5. **Specific enough to do.** Real places, real constraints, real sources, and no invented certainty.

## Accessibility & Inclusion

The surface must support keyboard navigation, visible focus, reduced-motion preferences, semantic landmarks, meaningful image alt text, and readable contrast. Outing guides should state material mobility or exertion demands when known rather than hiding them behind a vague “adventure” label.
