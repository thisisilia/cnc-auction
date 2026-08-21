# Changelog

Releases of the Car & Classic auction detail page. Each entry mirrors the
[GitHub release](https://github.com/thisisilia/cnc-auction/releases) of the same
tag; the deployed build lives at https://cnc-auction-azure.vercel.app/

## v1.1.0

Media viewers, a working comment thread, and a pass over typography.

### Media

- **Video player** (Figma `2:7979`) — its own chrome, with an expand control
- **Fullscreen viewer** (`2:8256` video, `2:8289` photo) — one component for both,
  since the comps differ only in what sits in the middle. Share and save keep the
  hero's 12pt corner rather than going full-radius, so the same control does not
  change shape between the two places it appears
- **Gallery sheet** — one height across both tabs, a `Title3/Emphasized` heading,
  and a category jump that measures live geometry at tap time. On web `onLayout`
  fires on size changes but not position shifts, so cached offsets went stale and
  the jump landed short
- **Hero** — glass chrome (white 70% over a backdrop blur, `#1E1F1E` glyphs) across
  the badges, the play button and share/save; video badge left and images badge
  right; the standalone photo counter folded into the images badge; the indicator
  capped at three dots on a sliding window; one page per photo, and tapping one
  opens the gallery at that photo

### Live auction activities

- **Comment composer** — send sits inside the field and only appears once there is
  something to send, so the resting state stays the placeholder the comp shows
- **Replies** — Reply opens the composer against that comment, and what you post
  lands in the thread rather than vanishing
- **Thread line** — runs unbroken from the parent's avatar, down past its body and
  Reply link, and turns in at the reply's avatar. It was a fixed 32pt elbow before,
  which left the stroke starting in mid-air under a comment of any length; the rail
  is now sized from the last reply's measured position so it also stops at the end
  of the thread instead of trailing past it
- **Bid rows** (`2:6742`) — bid runs grouped in Recent, and Recent's own bid card
  (`2:6799`) styled separately from Bid history
- **Counts** — the widget and the sheet it opens now share one counting function, so
  they cannot disagree. A reply is written by someone and appears in the thread, so
  it counts as a comment
- Bid amounts at `Callout/Emphasized` (16/21); a verified badge beside the name;
  names at `Footnote/Emphasized` and bodies at `Footnote/Regular`, matched between
  bids and comments

### Icons

- `reply` now comes from `Icons/Icon/Regular/reply.svg`, and `file-lines` is gone
  with the card that used it — the last two FontAwesome glyphs, and the gap noted
  against v1.0.0. Every icon on the page is now the designer's own
- `comment` unified on `Icons/Icon/Regular/comment.svg` everywhere it appears

### Typography

- SF Pro Display named explicitly on every text style, rather than inherited
- `title3Emphasized` added — the gallery heading had been spreading `undefined`,
  which is silent, and rendering at the browser default
- `bodyRegular` removed: unused, and its tracking ran the wrong way
- Contact me at `Footnote/Emphasized` on an 8pt corner

### Scrolling

- Eased wheel scrolling on web via GSAP's ScrollToPlugin, driving the existing
  ScrollView. ScrollSmoother is deliberately not used — it drives window scroll,
  which the letterboxed phone frame does not have
- Animations route through one `USE_NATIVE_DRIVER` flag; react-native-web has no
  native animated module, and `Animated.loop` with `useNativeDriver: true` silently
  froze the pulse rings fully expanded

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
