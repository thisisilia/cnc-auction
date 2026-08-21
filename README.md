# CNC Auction

The Car & Classic auction detail page, built from Figma
[Auction page → Mobile app](https://www.figma.com/design/F8MOAGWXseU0ZudUHndgdR/Auction-page?node-id=2-5207)
(node `2:5207`, 393 × 3039).

Expo SDK 57 / React Native 0.86, running on iOS, Android and web.

All scripts run on port **8090**.

```
npm run dev     # web on http://localhost:8090
npm run web     # web on http://localhost:8090
npm run ios
npm run android
```

## Layout

```
screens/AuctionScreen.js     the 393pt column: hero, countdown strip, then
                             every section inside a 16pt gutter
components/auction/*         one file per section of the comp
components/Icon.js           generated from assets/figma/icon-*.svg
components/ui.js             SectionHeading, Button, Card
data/auction.js              all copy and figures, transcribed from the comp
theme/tokens.js              mirrors the Figma "Car - Classic - Design" library
assets/figma/                exports pulled from the Figma file
```

Section geometry was verified against the comp's frame coordinates; every
landmark lands within a few points of its Figma position.

## Where this departs from the comp, and why

- **Status bar.** The comp draws an iOS status bar because it is a phone mock.
  The hero chrome is offset by the real safe-area inset instead, so it sits
  correctly on any device — and flush to the top on web, which has no inset.
- **Backdrop blur.** Figma gives the hero pills a 50px background blur. React
  Native has no portable backdrop filter, so `color.overlay.neutralBold`
  carries slightly more alpha to keep the white glyphs legible over a photo.
- **Insurance promo.** The Car & Classic Insurance card ships as a single
  361 × 310 export. Its headline is set in a licensed display face over a
  dotted field, neither of which survives being rebuilt in views. The call to
  action is a transparent hit target over the button drawn into the artwork,
  positioned as a fraction of the card so it tracks the image at any width.
- **Roboto Flex.** Figma's `Body/*` ramp is Roboto Flex. It ships variable-only,
  and iOS flattens `fontWeight` once an explicit `fontFamily` is set, so the
  ramp inherits the system font — SF Pro on iOS, which carries the same metrics
  closely at these sizes. Wiring the real face means committing static 400/600
  cuts and setting `fontFamily` per weight.
- **Icons.** The bespoke glyphs (vehicle specs, buyer guide, WhatsApp, location
  pin, gavel/comments/eye) are exported vector data from the file. The hero
  chrome, play, file and eye glyphs come from `@expo/vector-icons`
  FontAwesome 6 — the comp sets those as FontAwesome icon-font text nodes, so
  the glyphs are the same artwork.

## Not wired up

Every control is present and pressable but has no handler: bidding, saving,
sharing, video playback, gallery selection, contact and the buyer-guide links
are all `onPress` props waiting for a destination. `data/auction.js` holds the
comp's placeholder listing; point it at a listings API to make the page live.

## Figma access

`get_design_context` and Code Connect were unavailable on the account used to
build this (Dev Mode and Code Connect both need a paid Dev/Full seat), so the
page was built from `get_metadata` geometry, node renders, exported assets and
`get_variable_defs` tokens.
