/**
 * Sticky action bar — Figma "Sticky", node 2:5732.
 *
 * The countdown strip sits on the subtle fill with the reserve chip opposite,
 * and the two actions sit below on white. It slides in once the in-page "Place
 * a bid" has scrolled past, then follows scroll direction — the same behaviour
 * as the CNC vehicle page's Sell bar, so the two feel like one product.
 *
 * The dot pulses rather than sitting static, which is what marks the countdown
 * as live. The animation is opacity + scale only, so it can run on the native
 * driver and never blocks the scroll thread.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Button } from '../ui';
import { color, font, radius, spacing } from '../../theme/tokens';

/**
 * A live dot with a halo pulsing out of it, on a 1.6s loop. `reduceMotion`
 * leaves the plain dot in place for anyone who has asked the OS for less
 * animation.
 */
export function PulsingDot({ size = 12, dotColor = color.systemRed, reduceMotion = false }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => {
      loop.stop();
      pulse.setValue(0);
    };
  }, [pulse, reduceMotion]);

  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] });
  const haloOpacity = pulse.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 0.45, 0],
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {reduceMotion ? null : (
        <Animated.View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: dotColor,
            opacity: haloOpacity,
            transform: [{ scale: haloScale }],
          }}
        />
      )}
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
  bottomInset = 0,
  onLayout,
  onRequestViewing,
  onPlaceBid,
  reduceMotion = false,
}) {
  return (
    <Animated.View
      onLayout={onLayout}
      style={[styles.root, { transform: [{ translateY }], paddingBottom: bottomInset }]}
    >
      <View style={styles.countdownRow}>
        <View style={styles.countdown}>
          <PulsingDot reduceMotion={reduceMotion} />
          <Text style={styles.countdownLabel}>{auction.countdown}</Text>
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
    paddingVertical: spacing[2],
  },
  action: {
    flex: 1,
  },
});
