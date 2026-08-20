/**
 * Listing title, the current bid, and the bids / comments / watching counts.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { color, font, spacing } from '../../theme/tokens';

export default function BidSummary({ auction }) {
  return (
    <View>
      <Text style={styles.title}>{auction.title}</Text>

      <View style={styles.bidBlock}>
        <Text style={styles.bidLabel}>{auction.currentBidLabel}</Text>
        <Text style={styles.bidValue}>{auction.currentBid}</Text>
      </View>

      <View style={styles.stats}>
        {auction.stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <View style={styles.statIcon}>
              <Icon name={stat.icon} size={13.5} color={color.icon.neutralRegular} />
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
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
    gap: spacing[2],
  },
  // Figma seats each 13.5px glyph in an 18px box so the labels align.
  statIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    ...font.footnoteRegular,
    color: color.text.neutralRegular,
  },
});
