/**
 * Listing title, the current bid, and the bids / comments / watching counts.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { countBids, countComments } from './activityCounts';
import { color, font, spacing } from '../../theme/tokens';

export default function BidSummary({ auction }) {
  // Stats carrying a `count` are read off the activity feed; the rest are copy.
  const feed = auction.activity?.feed ?? [];
  const totals = { bids: countBids(feed), comments: countComments(feed) };
  const labelFor = (stat) => {
    if (!stat.count) return stat.label;
    const n = totals[stat.count];
    return `${n} ${n === 1 ? stat.singular : stat.plural}`;
  };

  return (
    <View>
      <Text style={styles.title}>{auction.title}</Text>

      <View style={styles.bidBlock}>
        <Text style={styles.bidLabel}>{auction.currentBidLabel}</Text>
        <Text style={styles.bidValue}>{auction.currentBid}</Text>
      </View>

      <View style={styles.stats}>
        {auction.stats.map((stat) => (
          <View key={stat.icon} style={styles.stat}>
            <Icon name={stat.icon} size={18} color={color.icon.neutralRegular} />
            <Text style={styles.statLabel}>{labelFor(stat)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...font.headlineEmphasized,
    color: color.text.labelPrimary,
  },
  bidBlock: {
    marginTop: spacing[2],
  },
  bidLabel: {
    ...font.caption1Regular,
    color: color.text.neutralRegular,
  },
  bidValue: {
    ...font.title2Emphasized,
    color: color.text.labelPrimary,
  },
  stats: {
    marginTop: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    // Icon-to-text spacing is 2px.
    gap: 2,
  },
  statLabel: {
    ...font.footnoteRegular,
    color: '#5D605D',
  },
});
