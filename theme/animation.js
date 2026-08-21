/**
 * react-native-web has no native animated module, so asking for the native
 * driver there logs a warning and falls back to JS — and the fallback is not
 * always faithful: `Animated.loop` parks on its end frame instead of
 * restarting, which is what once left the countdown pulse frozen fully
 * expanded.
 *
 * Every animation should use this rather than a bare `true`, so device keeps
 * the native driver and web asks for what it can actually deliver.
 */

import { Platform } from 'react-native';

export const USE_NATIVE_DRIVER = Platform.OS !== 'web';
