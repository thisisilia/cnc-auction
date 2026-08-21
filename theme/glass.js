/**
 * The translucent chrome that floats over the hero photo: white at 70% with a
 * blur behind it, so the dark glyphs stay legible over a bright or busy image.
 *
 * The blur is web-only. React Native has no portable backdrop filter, and
 * `backdropFilter` is not a valid RN style key — passing it on a device logs a
 * warning and does nothing, so it is kept behind a Platform check. On iOS the
 * faithful version is a BlurView behind the control; the 70% fill alone reads
 * close enough until that is wired.
 */

import { Platform } from 'react-native';

export const GLASS = {
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  ...Platform.select({
    web: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' },
    default: {},
  }),
};
