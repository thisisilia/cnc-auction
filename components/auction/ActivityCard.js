/**
 * "Live auction activities" widget — three states (Recent · Bid history ·
 * Comments). Swiping left/right swaps only the content (heading + row) with a
 * quick fade; the segmented indicator stays put and just marks the page. It is a
 * gesture, not a carousel, so neighbouring pages are never revealed mid-swipe.
 * Tapping opens the full activity sheet on the matching tab.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  indexRef.current = index;
  const opacity = useRef(new Animated.Value(1)).current;
  const animating = useRef(false);

  // Swap to the next/previous page (dir = +1 / -1): fade the content out, switch,
  // fade it back in. The indicator is outside this fade, so it never blinks.
  const swipe = useCallback(
    (dir) => {
      if (animating.current) return;
      const next = Math.max(0, Math.min(pages.length - 1, indexRef.current + dir));
      if (next === indexRef.current) return;
      animating.current = true;
      Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
        setIndex(next);
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start(() => {
          animating.current = false;
        });
      });
    },
    [opacity, pages.length]
  );

  // Keep the latest swipe in a ref so the once-created responder always calls it.
  const swipeRef = useRef(swipe);
  swipeRef.current = swipe;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dx <= -40) swipeRef.current(1);
        else if (g.dx >= 40) swipeRef.current(-1);
      },
    })
  ).current;

  // Web: a two-finger horizontal trackpad swipe (a wheel event with dominant
  // deltaX) pages the widget too. Touch/native keeps the PanResponder swipe.
  const innerRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const node = innerRef.current;
    if (!node || !node.addEventListener) return undefined;
    let accum = 0;
    let cooling = false;
    let resetTimer = null;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical → let the page scroll
      e.preventDefault();
      if (cooling) return;
      accum += e.deltaX;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accum = 0;
      }, 180);
      if (Math.abs(accum) > 30) {
        swipeRef.current(accum > 0 ? 1 : -1);
        accum = 0;
        cooling = true;
        setTimeout(() => {
          cooling = false;
        }, 400);
      }
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  const page = pages[index];

  return (
    <Card style={styles.root}>
      <View ref={innerRef} style={styles.inner} {...pan.panHandlers}>
        <Pressable
          onPress={() => onOpen?.(indexRef.current)}
          accessibilityRole="button"
          accessibilityLabel={`${page.heading}. Open activity`}
        >
          <View style={styles.header}>
            <Animated.View style={[styles.headingRow, { opacity }]}>
              <Text style={styles.heading}>{page.heading}</Text>
              {page.subheading ? <Text style={styles.subheading}>{page.subheading}</Text> : null}
            </Animated.View>
            <View style={styles.dots}>
              {pages.map((_, i) => (
                <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
              ))}
            </View>
          </View>

          <Animated.View style={[styles.content, { opacity }]}>
            {page.type === 'bid' ? <BidRow item={page} /> : <CommentRow item={page} />}
          </Animated.View>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  inner: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[4],
    // Stop the web build turning a horizontal drag into a text selection, so the
    // swipe gesture is free to claim it.
    userSelect: 'none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    marginTop: spacing[4],
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
