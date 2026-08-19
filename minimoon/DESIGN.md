# Design System

## Theme

A private travel atelier used by a couple on a wide desktop in warm evening light. The interface is predominantly deep volcanic ink so resort photography glows, with region-specific colour entering through image-derived accents rather than decorative gradients.

## Color Strategy

Full palette, disciplined by role.

- Volcanic ink: `oklch(0.17 0.018 245)`
- Night water: `oklch(0.24 0.035 229)`
- Shell paper: `oklch(0.94 0.018 86)`
- Sun-warmed sand: `oklch(0.78 0.10 72)`
- Reef blue: `oklch(0.69 0.12 211)`
- Fern green: `oklch(0.58 0.10 151)`
- Weather coral: `oklch(0.68 0.15 29)`

Pure black and pure white are not used.

## Typography

- Display: Bricolage Grotesque, wide expressive weights for destination names and decisive recommendations.
- Body: Afacad Flux, relaxed humanist rhythm for readable travel judgment.
- Utility: Geist Mono only for dates, routes, rate confidence, and compact evidence labels.

## Layout

Desktop-first, image-led long scroll. A slim persistent journey rail keeps dates, route, filters, and shortlist state visible. Hotels appear as full-width destination chapters with alternating asymmetrical gallery compositions, not identical cards. A compact comparison table and shortlist drawer provide decision density after the immersive browse.

## Signature

Each hotel opens as a cinematic contact sheet: one dominant image and two supporting frames, with a translucent but legible route line tying Miami to the resort and onward to San Francisco. The chapter shifts subtly by destination climate through accent colour and ambient grain.

## Components

- Journey rail with Monday/Tuesday start selector
- Decisive top-three opening sequence
- Region and attribute filters
- Hotel chapter with three-image gallery
- Pricing block with confidence label and six-night total
- Honest catch and weather risk treatment
- Internet quote with source link
- Shortlist toggle and persistent compare tray
- Comparison matrix for selected hotels
- Source and imagery credits drawer

## Motion

One orchestrated first-load reveal, gentle image parallax, and restrained gallery transitions using transform and opacity only. Motion never blocks reading and is disabled under reduced-motion preference.
