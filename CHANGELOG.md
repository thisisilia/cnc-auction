# Changelog

Releases of the Car & Classic auction detail page. Each entry mirrors the
[GitHub release](https://github.com/thisisilia/cnc-auction/releases) of the same
tag; the deployed build lives at https://cnc-auction-azure.vercel.app/

## v1.0.0

First release. A standalone Expo app built from Figma
([Auction page → Mobile app](https://www.figma.com/design/F8MOAGWXseU0ZudUHndgdR/Auction-page?node-id=2-5207),
file key `F8MOAGWXseU0ZudUHndgdR`, frame `2:5207`), deliberately separate from
the main CNC app.

### The page

Full auction listing: hero carousel, live countdown, bid summary, live-activity
widget, spec grid, expandable highlights, seller card, AA report, insurance
placement, gallery and buying guide.

### Interaction

- **Hero carousel** — walkaround video first, photos after, paged with an indicator
- **Gallery sheet** — one sheet, two tabs; hero badges and the gallery section both
  open it, anchored to the category tapped
- **Sticky header** — fades in as the hero leaves; tabs anchor
  Overview / Highlights / Gallery / FAQ
- **Sticky action bar** — appears once the in-page bid button passes, follows scroll
  direction, pinned at the foot of the page
- **Live activities widget** — swipeable, opens a Recent / Bid history / Comment sheet
- **Save** — toggles to a filled heart in `#FF2D55` and bumps the count
- **Countdown** — ticks live (`50h : 33m : 57s`), shared by the TimeBar and the sticky
  bar, with a pulsing indicator ported from the GSAP ring stagger

### Design system

Icons come from the designer's `Icons/` folder, each registry entry in
`components/Icon.js` naming its source file. Glyphs map onto their source viewBox
so the designer's padding survives and every icon in a row shares one optical
size — which is why call sites pass the viewBox size (18/20/24) rather than the
size of the visible artwork. Tokens in `theme/tokens.js` mirror the Figma library
"Car - Classic - Design".

### Known gaps

- `reply` and `file-lines` are still FontAwesome — no equivalent exists in `Icons/`
- Share has no target wired
- Every photo is the one committed listing image; a real listing would supply its
  own URLs

See [DESIGN_NOTES.md](DESIGN_NOTES.md) for the structural reference behind these.
