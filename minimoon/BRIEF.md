# Minimoon Decision Site: Confirmed Shape Brief

## Feature Summary

A production-ready, desktop-first private decision website for Barron and Nina to choose a minimoon for October 5 or 6 through October 11, 2026. It combines an immersive hotel visit with candid comparison across roughly twenty-five researched options in Grand Cayman, Hawai‘i, Northern California, Big Sur, Wine Country, Mendocino, and Tofino.

## Primary User Action

Build a shortlist of two to four hotels, compare their practical tradeoffs, and identify the one worth pricing or holding.

## Design Direction

Full-palette dark theme. Scene: Barron and Nina sit together at a wide desktop in warm evening light, newly married, moving slowly through cinematic hotel imagery while practical travel facts remain close at hand. Anchors: a private travel advisor’s physical lookbook, a film contact sheet, and an airline route map stripped of airport-app sterility.

## Scope

High-fidelity, production-ready static website with rich client-side interaction. One complete long-scroll surface, optimized for desktop and still usable at narrow widths. Polish until deployed and verified.

## Layout Strategy

Open with a cinematic thesis and decisive top three. Move into a visual journey map and concise comparison strip. Each hotel receives an alternating full-width chapter with a mini gallery, destination atmosphere, rate and six-night estimate, attribute profile, route friction, weather truth, sourced quote, best room, and honest catch. Filters narrow the journey without destroying the long-form rhythm. A persistent compare tray culminates in a selected-hotel matrix.

## Key States

- Default: all ranked hotels, recommended order
- Filtered: region, vibe, budget and weather tolerance
- Shortlisted: two to four selected hotels
- Comparison: selected hotels normalized side by side
- Image loading: tasteful dominant-colour placeholder, then reveal
- Image failure: useful hotel label and alternate sourced image, never an empty grey box
- Empty filter result: reset path and nearest matching options
- Reduced motion: static compositions and immediate state changes

## Interaction Model

Scroll to visit. Hover to reveal image captions and source. Click gallery frames to promote them within the chapter. Toggle Monday or Tuesday start to update stay labels and any date-specific quote language. Add hotels to the persistent compare tray. Filter by destination, intimacy, activities, weather risk, and budget. Open source links in new tabs.

## Content Requirements

Real hotel imagery saved locally where practical, with source attribution. Every hotel gets region, rank, role, expected nightly and six-night total, quote confidence, weather, routing, intimacy, activities, service, food/spa, best room, one-line recommendation, one honest catch, and at least one sourced quote or review signal when credible. Prices are clearly marked exact-date, adjacent-date, generic rate signal, or estimate.

## Open Questions

None blocking. When exact October 5 to 11 pricing cannot be obtained, the interface must show a researched range rather than fabricate a quote. Tuesday-start comparison remains informational unless a separate live quote is verified.
