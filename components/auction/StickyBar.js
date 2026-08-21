/**
 * Sticky action bar — Figma "Sticky", node 2:5732.
 *
 * The countdown strip sits on the subtle fill with the reserve chip opposite,
 * and the two actions sit below on white. It slides in once the in-page "Place
 * a bid" has scrolled past, then follows scroll direction — the same behaviour
 * as the CNC vehicle page's Sell bar, so the two feel like one product.
 *
 * The dot pulses rather than sitting static, which is what marks the countdown
 * as live. The animation is opacity + scale only, so on device it runs on the
 * native driver and never blocks the scroll thread.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Button } from '../ui';
import { useCountdown } from './useCountdown';
import { USE_NATIVE_DRIVER } from '../../theme/animation';
import { color, font, radius, spacing } from '../../theme/tokens';

/**
 * A live dot with rings pulsing out of it, ported from the GSAP tween:
 *
 *   gsap.to(".ring", { scale: 1.75, opacity: 0, duration: 2,
 *                      stagger: { each: 0.5, repeat: -1 } }).time(2)
 *
 * Each ring runs the same 2s scale-and-fade; `each: 0.5` offsets successive
 * rings by half a second, and `repeat: -1` on the stagger loops each ring
 * independently — so with a 2s duration and 0.5s spacing, four rings keep the
 * sequence continuous. `.time(2)` seeks the timeline two seconds in so the
 * pattern is already running on first paint rather than starting empty; the
 * `delay` below is that same seek, expressed as a per-ring offset.
 */
const RING_COUNT = 4;
const RING_DURATION = 2000;
const RING_STAGGER = 500;

function Ring({ size, dotColor, index }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: RING_DURATION,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      { resetBeforeIteration: true }
    );
    // Stand in for .time(2): each ring enters already offset into the cycle,
    // so the group is mid-sequence on the first frame.
    const id = setTimeout(() => loop.start(), index * RING_STAGGER);
    return () => {
      clearTimeout(id);
      loop.stop();
    };
  }, [t, index]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: dotColor,
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.75] }) }],
      }}
    />
  );
}

/**
 * `reduceMotion` leaves the plain dot in place for anyone who has asked the OS
 * for less animation.
 */
export function PulsingDot({ size = 10, dotColor = color.pulseRed, reduceMotion = false }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {reduceMotion
        ? null
        : Array.from({ length: RING_COUNT }).map((_, index) => (
            <Ring key={index} size={size} dotColor={dotColor} index={index} />
          ))}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dotColor,
        }}
      />
    </View>
  );
}

export default function StickyBar({
  auction,
  translateY,
  opacity,
  pointerEvents = 'auto',
  bottomInset = 0,
  onLayout,
  onRequestViewing,
  onPlaceBid,
  reduceMotion = false,
}) {
  const countdown = useCountdown(auction.countdown);
  return (
    <Animated.View
      onLayout={onLayout}
      pointerEvents={pointerEvents}
      style={[
        styles.root,
        {
          transform: [{ translateY }],
          opacity,
          // 24 below the buttons, per the comp's 112pt Sticky (36 countdown +
          // 8 + 44 button + 24). On a device the home-indicator inset is
          // larger, so it wins.
          paddingBottom: Math.max(bottomInset, spacing[6]),
        },
      ]}
    >
      <View style={styles.countdownRow}>
        <View style={styles.countdown}>
          <PulsingDot reduceMotion={reduceMotion} />
          <Text style={styles.countdownLabel}>{countdown}</Text>
        </View>
        <View style={styles.reserveChip}>
          <Text style={styles.reserveLabel}>{auction.reserveStatus}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Request a viewing"
          variant="outline"
          style={styles.action}
          onPress={onRequestViewing}
        />
        <Button
          label={auction.primaryAction}
          variant="primary"
          style={styles.action}
          onPress={onPlaceBid}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.background.neutralWhite,
  },
  countdownRow: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    backgroundColor: color.background.neutralSubtle,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  countdownLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  reserveChip: {
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: color.border.gray3,
  },
  reserveLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  action: {
    flex: 1,
    // Sticky bottom CTAs use a 12px corner (large in-page buttons stay 16px).
    borderRadius: radius.lg,
  },
});
