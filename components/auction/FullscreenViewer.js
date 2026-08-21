/**
 * Fullscreen media viewer — Figma 2:8256 (video) and 2:8289 (photo).
 *
 * One component for both: the comps differ only in what sits in the middle,
 * so the black field, the header (title, "n of m", share, save, close) and the
 * horizontal paging are shared. Photos open it by tapping a thumbnail in the
 * gallery sheet; the video opens it from the player's expand control.
 *
 * Rendered as an in-frame overlay rather than a Modal, for the same reason as
 * BottomSheet: a Modal portals to the viewport root, which on web would escape
 * the letterboxed phone frame and black out the whole browser.
 */

import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { color, font, layout, radius, spacing } from '../../theme/tokens';

function Chip({ glyph, glyphColor, count, label, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, count != null && styles.chipWide, pressed && styles.pressed]}
    >
      <Icon name={glyph} size={16} color={glyphColor ?? color.icon.inverseBold} />
      {count != null ? <Text style={styles.chipCount}>{count}</Text> : null}
    </Pressable>
  );
}

export default function FullscreenViewer({
  visible,
  onClose,
  title,
  items = [],
  initialIndex = 0,
  saved = false,
  saveCount = 0,
  onSave,
  onShare,
  renderItem,
}) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [measured, setMeasured] = useState(0);
  const width = measured || Math.min(windowWidth, layout.frameWidth);
  const [page, setPage] = useState(initialIndex);
  const scrollRef = useRef(null);

  // Each open honours the thumbnail that triggered it. The offset is applied
  // once a width is known, otherwise it lands on page 0.
  useEffect(() => {
    if (!visible) return undefined;
    setPage(initialIndex);
    const id = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: initialIndex * width, animated: false });
    }, 30);
    return () => clearTimeout(id);
  }, [visible, initialIndex, width]);

  if (!visible) return null;

  return (
    <View
      style={styles.root}
      onLayout={(e) => setMeasured(e.nativeEvent.layout.width)}
      accessibilityViewIsModal
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          if (!width) return;
          const next = Math.round(e.nativeEvent.contentOffset.x / width);
          setPage((prev) => (prev === next ? prev : next));
        }}
      >
        {items.map((item, index) => (
          <View key={item.key ?? index} style={[styles.page, { width }]}>
            {renderItem ? (
              renderItem(item, index)
            ) : (
              <Image
                source={item.source}
                style={styles.media}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.header, { paddingTop: insets.top + spacing[4] }]} pointerEvents="box-none">
        <View style={styles.heading}>
          <Text style={styles.title}>{items[page]?.title ?? title}</Text>
          <Text style={styles.position}>{`${page + 1} of ${items.length}`}</Text>
        </View>

        <View style={styles.actions}>
          <Chip glyph="HeroShare" label="Share" onPress={onShare} />
          <Chip
            glyph={saved ? 'HeroSaveFilled' : 'HeroSave'}
            glyphColor={saved ? color.systemRed : color.icon.inverseBold}
            count={saved ? saveCount + 1 : saveCount}
            label={saved ? 'Saved. Tap to unsave' : 'Save listing'}
            onPress={onSave}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            style={({ pressed }) => [styles.chip, styles.close, pressed && styles.pressed]}
          >
            <View style={styles.closeGlyph}>
              <View style={[styles.closeBar, styles.closeBarA]} />
              <View style={[styles.closeBar, styles.closeBarB]} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const CHIP = 34;

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    // Above the sheet it opens from.
    zIndex: 1100,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  heading: {
    flex: 1,
  },
  title: {
    ...font.calloutEmphasized,
    color: color.text.inverseBold,
  },
  position: {
    ...font.bodyXsRegular,
    color: color.text.inverseBold,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  chip: {
    height: CHIP,
    minWidth: CHIP,
    paddingHorizontal: spacing[1],
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  chipWide: {
    flexDirection: 'row',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
  },
  chipCount: {
    ...font.subheadlineEmphasized,
    color: color.text.inverseBold,
  },
  close: {
    width: CHIP,
  },
  // Drawn from two bars so the viewer needs no extra icon font.
  closeGlyph: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBar: {
    position: 'absolute',
    width: 14,
    height: 1.6,
    borderRadius: 1,
    backgroundColor: color.icon.inverseBold,
  },
  closeBarA: { transform: [{ rotate: '45deg' }] },
  closeBarB: { transform: [{ rotate: '-45deg' }] },
  pressed: {
    opacity: 0.6,
  },
});
