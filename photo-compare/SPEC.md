# Photo Comparison App — Blind A/B Test

Build a single-page web app (vanilla HTML/CSS/JS, no framework) for a blind pairwise photo comparison.

## How It Works
1. Two photographers' photos are compared blind (no names shown)
2. Each round shows one photo from Photographer A and one from Photographer B, side by side
3. Left/right placement is randomized each round
4. User clicks the photo they prefer
5. After all rounds, show results with photographer names revealed

## Data
- `aileen_urls.txt` — URLs for Photographer A (Aileen Ayala)
- `gillian_all_urls.txt` — URLs for Photographer B (Gillian Verni)
- Pick 30 random images from each file (or all if fewer than 30)
- Create 30 pairwise matchups (one from each photographer per round)

## UI Requirements
- Clean, minimal, dark background (#1a1a1a) so photos pop
- Show round counter "Round X of 30" at top
- Two photos side by side (responsive — stack on mobile)
- Photos should be similar size, object-fit: cover, max-height ~70vh
- Click a photo to choose it. Brief highlight animation on selection.
- Progress bar at top
- NO photographer names or watermarks visible during the test
- At the end, show:
  - "Photographer A: X votes (Y%)" and "Photographer B: Z votes (W%)"
  - Then reveal: "Photographer A = Aileen Ayala" / "Photographer B = Gillian Verni"
  - If either hits 75%+, show a message like "Clear winner!"
  - Show a grid of all the photos you picked, labeled with which photographer
- Support multiple participants: after results, show "Play Again" button
- Store results in localStorage with timestamp so we can compare Barron vs Nina's results

## Photo Loading
- Hotlink directly to the image URLs (no need to download/host them)
- Use ?format=1000w suffix for Squarespace images (Gillian) for consistent sizing
- Showit images (Aileen) already have size in URL path (/1200/)
- Lazy load with loading="lazy"
- Show a spinner/skeleton while images load each round
- Pre-load next round's images while current round is shown

## File Structure
- `index.html` — everything in one file (inline CSS + JS)
- Keep it under 500 lines if possible

## Important
- The test must be BLIND — no photographer identity leaks in the DOM, image filenames, or console
- Randomize which side each photographer appears on per round
- Shuffle the matchup order
