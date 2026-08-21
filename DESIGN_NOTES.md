# Auction page — design notes

A running reference for what's built on the Car & Classic **auction detail page**
and the decisions behind it. Source of truth is the code + git history; this is
the at-a-glance map. Figma: [Auction page → Mobile app](https://www.figma.com/design/F8MOAGWXseU0ZudUHndgdR/Auction-page?node-id=2-5207)
(file key `F8MOAGWXseU0ZudUHndgdR`, main frame `2:5207` / "Mobile app - current" `2:8366`).

Run: `npm run dev` → http://localhost:8090 (all scripts are pinned to port 8090).

## Screen structure

`screens/AuctionScreen.js` is the whole page — a single 393pt scroll column with
two pieces of pinned chrome. Top → bottom:

| Section | Component | Notes |
|---|---|---|
| Hero carousel | `components/auction/Hero.js` | Video first (shared `PlayButton`) then photos. **No page-dot indicator** (removed). |
| Countdown strip | `components/auction/TimeBar.js` | Below the hero. Live **HH : MM : SS**, red pulsing dot. |
| Title / current bid / stats | `components/auction/BidSummary.js` | Bids / Comments / Watching row — gavel/comment/eye glyphs, 2px icon→text gap, `#5D605D` Footnote/Regular. |
| **Live auction activities widget** | `components/auction/ActivityCard.js` | See below. Sits directly above "Place a bid". |
| Place a bid | `components/ui.js` `Button` | Large in-page CTA (16px radius). |
| Spec grid | `components/auction/SpecGrid.js` | |
| Highlights (+ Read more) | `components/auction/Highlights.js` | |
| Interest card | `components/auction/InterestCard.js` | Location "Boroughbridge, United Kingdom" → `#333` Subheadline/Regular. Request a viewing uses the attached `Eye` glyph. |
| AA report / Insurance ad | `ReportCard.js` / `InsuranceAd.js` | |
| Gallery | `components/auction/Gallery.js` + `GallerySheet.js` | Thumbnails open the sheet on a category. |
| Buyer guide | `components/auction/BuyerGuide.js` | Mapped to the "FAQ" tab. |
| Sticky header | `components/auction/StickyHeader.js` | Overview / Highlights / Gallery / FAQ tab overview. |
| Sticky action bar | `components/auction/StickyBar.js` | Countdown + reserve chip + two CTAs. |

## Key behaviors

- **Live auction activities widget** (`ActivityCard.js`): three states — Recent /
  Bid history / Comments. **Swipe** left/right (touch on mobile, two-finger
  trackpad `wheel` on web) swaps **only the content** with a fade; the segmented
  indicator stays fixed and never reveals neighbouring pages (it's a
  gesture + fade-swap, not a scroll carousel). **Tapping** the card opens the
  activity sheet **on the current page's tab** (`AuctionActivitySheet.js`,
  Recent / Bid history / Comment). Text selection is disabled so drags read as
  swipes.
- **Countdown** (`useCountdown.js`): parses `data/auction.js` `countdown`, ticks
  down every second, formats `HH : MM : SS`. Not tied to a real date. Shared by
  `TimeBar` (below hero) and `StickyBar`, so both stay identical — change the one
  value in the data and every place updates.
- **Pulsing dot** (`StickyBar.js` `PulsingDot`): the GSAP `.ring` tween ported to
  RN Animated — 4 rings, 2s each, 0.5s stagger, pre-warmed. Colour is red
  (`color.systemRed`).
- **Tab overview** (`StickyHeader.js`): all tabs Callout/Emphasized; inactive
  `#A4A9A4`, active dark; the underline **slides** to the active tab (timing
  easing, no bounce). Tapping a tab scrolls to that section.
- **Gallery sheet** (`GallerySheet.js`): Photos tab fills + scrolls; the Video
  tab **hugs** its height (no empty gap). Video uses the shared `PlayButton`.

## Conventions / decisions

- **Radii**: large in-page buttons = 16px (`radius.xl`); sticky-bar CTAs = 12px
  (`radius.lg`). Set in `components/ui.js` and `StickyBar.js`.
- **Sticky bar**: 32px bottom breathing room.
- **Icons**: all from `components/Icon.js` (generated from `assets/figma/icon-*.svg`)
  and the shared `PlayButton` (Icons/Play Button.svg) — the artwork the designer
  attached. Swapped former FontAwesome substitutes to the attached `Eye`,
  `ChevronLeft`, and `Comments` glyphs.
- **New gallery type "Machine"** added to `data/auction.js` (`gallery.thumbnails`
  and `gallerySheet.categories`).
- All copy/figures live in `data/auction.js`; views never hardcode listing data.

## Open items

- **"Change the icon for vehicle details"** — pending: which element / which icon.
- **Activity sheet** verified-check and reply marks still use FontAwesome — no
  attached equivalent exists in the icon folder yet.
