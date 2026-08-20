/**
 * The 36px strip under the hero: a live dot and countdown on the left, the
 * reserve status as an outlined pill on the right.
 */

import { StyleSheet, Text, View } from 'react-native';
import { PulsingDot } from './StickyBar';
import { useCountdown } from './useCountdown';
import { color, font, radius, spacing } from '../../theme/tokens';

export default function TimeBar({ countdown, reserveStatus, reduceMotion = false }) {
  // Same live, pulsing countdown as the sticky bar (seeded from the same value).
  const live = useCountdown(countdown);
  return (
    <View style={styles.root}>
      <View style={styles.countdown}>
        <PulsingDot dotColor={color.systemBlue} reduceMotion={reduceMotion} />
        <Text style={styles.countdownLabel}>{live}</Text>
      </View>
      <View style={styles.reservePill}>
        <Text style={styles.reserveLabel}>{reserveStatus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 36,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.background.neutralSubtle,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: color.systemBlue,
  },
  countdownLabel: {
    ...font.subheadlineEmphasized,
    color: color.text.labelPrimary,
  },
  reservePill: {
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: color.border.gray3,
  },
  reserveLabel: {
    ...font.caption1Regular,
    color: color.text.labelPrimary,
  },
});
