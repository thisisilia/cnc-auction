/**
 * Design tokens mirrored from the Figma library "Car - Classic - Design",
 * as used by the Auction page (F8MOAGWXseU0ZudUHndgdR, node 2:5207).
 * Names follow the Figma variable paths so designs and code stay traceable.
 */

import { Platform } from 'react-native';

export const color = {
  text: {
    neutralBold: '#1e1f1e',
    neutralRegular: '#5d605d',
    brandPrimaryRegular: '#14955d',
    brandPrimaryBold: '#012413',
    inverseBold: '#f7f9f7',
    // iOS "Labels/Primary" — the auction page sets most copy in this rather
    // than semantic/text/neutral/bold, so it is kept as its own token.
    labelPrimary: '#333333',
  },
  icon: {
    neutralBold: '#1e1f1e',
    neutralRegular: '#5d605d',
    inverseBold: '#f7f9f7',
    brandPrimaryRegular: '#14955d',
    labelPrimary: '#333333',
  },
  background: {
    neutralWhite: '#ffffff',
    neutralSubtle: '#f7f9f7',
    neutralRegular: '#eff1ef',
    brandPrimaryRegular: '#14955d',
    inverseBold: '#1e1f1e',
    // Not from Figma: fills the gutter beside the phone frame on web only.
    pageBackdrop: '#e8ebe8',
  },
  border: {
    neutralSubtle: '#eff1ef',
    neutralRegular: '#cbd1cb',
    brandPrimaryRegular: '#14955d',
    // iOS "Grays/Gray 3" — the reserve-status pill outline.
    gray3: '#c7c7cc',
  },
  overlay: {
    // semantic/color/overlay/neutral/bold/default — the hero chrome pills.
    // Figma pairs it with a 50px background blur, which RN cannot render, so
    // the alpha is raised slightly to keep white glyphs legible over photos.
    neutralBold: 'rgba(51, 51, 51, 0.48)',
    neutralSubtle: 'rgba(51, 51, 51, 0.10)',
  },
  // iOS "Colors/Blue" — the live-countdown dot.
  systemBlue: '#007aff',
};

/** Frame width of the Figma artboard (iPhone 14/15 Pro). */
export const layout = {
  frameWidth: 393,
  /** Horizontal gutter every section on the page sits inside. */
  gutter: 16,
};

export const spacing = {
  none: 0,
  xxs: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const size = {
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

/**
 * SF Pro Display is the iOS system font, so ordinary Text inherits it without
 * naming it. Roboto Flex ("semantic/font/family/body") backs the Body/* ramp
 * in Figma; it is deliberately not wired up here, because it ships
 * variable-only and iOS flattens fontWeight once an explicit fontFamily is
 * set. The system font carries the same metrics closely enough at these sizes.
 */
export const fontFamily = {
  display: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }),
};

export const font = {
  title2Emphasized: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  headlineEmphasized: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  bodyRegular: { fontSize: 17, lineHeight: 24, fontWeight: '400', letterSpacing: 0.4 },
  calloutRegular: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
  calloutEmphasized: { fontSize: 16, lineHeight: 21, fontWeight: '600' },
  subheadlineRegular: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  subheadlineEmphasized: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
  footnoteRegular: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  footnoteEmphasized: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption1Regular: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  caption1Emphasized: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  caption2Emphasized: { fontSize: 11, lineHeight: 13, fontWeight: '600' },
  // Body/* ramp — lineHeight is 1.5x in Figma.
  bodyLgEmphasized: { fontSize: 18, lineHeight: 27, fontWeight: '600' },
  bodyMdEmphasized: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  bodyMdRegular: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodySmEmphasized: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
  bodySmRegular: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
  bodyXsRegular: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
};
