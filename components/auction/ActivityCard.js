/**
 * "Live auction activities" — the most recent bid, with page dots standing in
 * for the carousel of earlier activity.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui';
import { color, font, radius, spacing } from '../../theme/tokens';

export default function ActivityCard({ activity, pageCount = 3, page = 0 }) {
  return (
    <Card style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.heading}>{activity.heading}</Text>
        <View style={styles.dots}>
          {Array.from({ length: pageCount }, (_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{activity.bidderInitials}</Text>
        </View>
        <Text style={styles.bidder}>{activity.bidder}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{activity.tag}</Text>
        </View>
        <Text style={styles.amount}>{activity.amount}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    ...font.caption1Regular,
    color: color.text.labelPrimary,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: color.background.neutralRegular,
  },
  dotActive: {
    width: 18,
    backgroundColor: color.background.inverseBold,
  },
  row: {
    marginTop: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: color.text.brandPrimaryBold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...font.caption2Emphasized,
    color: color.text.inverseBold,
  },
  bidder: {
    ...font.bodySmEmphasized,
    color: color.text.labelPrimary,
  },
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: color.background.neutralRegular,
  },
  tagText: {
    ...font.caption1Emphasized,
    color: color.text.labelPrimary,
  },
  amount: {
    ...font.bodySmEmphasized,
    color: color.text.labelPrimary,
    marginLeft: 'auto',
  },
});
