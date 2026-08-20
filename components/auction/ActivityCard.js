/**
 * "Live auction activities" widget — three compact pages (Recent · Bid history
 * · Comments) swiped horizontally, the segmented indicator marking the page.
 * Tapping any page opens the full activity sheet on the matching tab.
 */

import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui';
import { color, font, radius, spacing } from '../../theme/tokens';

function Avatar({ initials }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

function BidRow({ item }) {
  return (
    <View style={styles.row}>
      <Avatar initials={item.initials} />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.tag}>
        <Text style={styles.tagText}>{item.tag}</Text>
      </View>
      <Text style={styles.amount}>{item.amount}</Text>
    </View>
  );
}

function CommentRow({ item }) {
  return (
    <View style={styles.row}>
      <Avatar initials={item.initials} />
      <Text style={styles.comment} numberOfLines={1}>
        {item.text}
      </Text>
    </View>
  );
}

export default function ActivityCard({ activity, onOpen }) {
  const pages = activity.pages;
  const [width, setWidth] = useState(0);
  const indexRef = useRef(0);

  return (
    <Card style={styles.root}>
      <ScrollTracker
        onIndex={(i) => (indexRef.current = i)}
        onWidth={setWidth}
        width={width}
      >
        {pages.map((page, i) => (
          <Pressable
            key={page.key}
            style={[styles.page, width ? { width } : null]}
            onPress={() => onOpen?.(i)}
            accessibilityRole="button"
            accessibilityLabel={`${page.heading}. Open activity`}
          >
            <View style={styles.header}>
              <View style={styles.headingRow}>
                <Text style={styles.heading}>{page.heading}</Text>
                {page.subheading ? <Text style={styles.subheading}>{page.subheading}</Text> : null}
              </View>
              <View style={styles.dots}>
                {pages.map((_, j) => (
                  <View key={j} style={[styles.dot, j === i && styles.dotActive]} />
                ))}
              </View>
            </View>
            {page.type === 'bid' ? <BidRow item={page} /> : <CommentRow item={page} />}
          </Pressable>
        ))}
      </ScrollTracker>
    </Card>
  );
}

/** Horizontal pager that reports the settled page index and its measured width. */
function ScrollTracker({ children, onIndex, onWidth, width }) {
  return (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onLayout={(e) => onWidth(e.nativeEvent.layout.width)}
      onMomentumScrollEnd={(e) => {
        if (width) onIndex(Math.round(e.nativeEvent.contentOffset.x / width));
      }}
    >
      {children}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  page: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[1],
    flexShrink: 1,
  },
  heading: {
    ...font.subheadlineEmphasized,
    color: color.text.labelPrimary,
  },
  subheading: {
    ...font.footnoteRegular,
    color: 'rgba(60,60,67,0.6)',
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
  name: {
    ...font.footnoteEmphasized,
    color: color.text.labelPrimary,
    flexShrink: 1,
  },
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: color.background.neutralRegular,
  },
  tagText: {
    ...font.caption2Emphasized,
    color: color.text.labelPrimary,
  },
  amount: {
    ...font.calloutEmphasized,
    color: color.text.labelPrimary,
    marginLeft: 'auto',
  },
  comment: {
    ...font.subheadlineRegular,
    color: color.text.labelPrimary,
    flexShrink: 1,
  },
});
