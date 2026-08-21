/**
 * The 393x295 hero: a horizontally paged carousel of the listing's media, with
 * translucent chrome floating over it — back / share / save along the top, and
 * the photo and video counts pinned to the bottom corners.
 *
 * The video is the first page and carries the play button; the photos follow,
 * so swiping right past the video walks the gallery. The counts stay put over
 * the pager rather than riding with it, matching the comp.
 *
 * The indicator shows at most three dots: with a photo per page a full set
 * would be a smear, so it slides a three-dot window along the run while the
 * photo badge switches from the total to the position within it.
 *
 * Figma pairs the pill fills with a 50px background blur. React Native has no
 * portable backdrop filter, so `color.overlay.neutralBold` carries a little
 * extra alpha instead to keep the white glyphs legible over a bright photo.
 */

import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Icon } from '../Icon';
import PlayButton from '../PlayButton';
import { color, font, layout, radius, spacing } from '../../theme/tokens';

const HERO_HEIGHT = 295;
const PILL = 34;
/** Most dots the indicator ever shows, however many pages there are. */
const DOTS = 3;

function ChromeButton({ glyph, glyphColor, glyphSize = 24, label, count, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chromeButton,
        count != null && styles.chromeButtonWide,
        pressed && styles.pressed,
      ]}
    >
      <Icon name={glyph} size={glyphSize} color={glyphColor ?? color.icon.inverseBold} />
      {count != null ? <Text style={styles.chromeCount}>{count}</Text> : null}
    </Pressable>
  );
}

/**
 * The photo/video counts, pinned to the hero's bottom corners. Each one opens
 * the gallery sheet on its own tab.
 */
function CountPill({ glyph, count, label, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.countPill, pressed && styles.pressed]}
    >
      <Icon name={glyph} size={16} color={color.icon.inverseBold} />
      <Text style={styles.countText}>{count}</Text>
    </Pressable>
  );
}

export default function Hero({
  auction,
  media,
  topInset = 0,
  saved = false,
  onBack,
  onShare,
  onSave,
  onPlay,
  onOpenPhotos,
  onOpenVideos,
}) {
  // The pager sizes its pages to the measured frame, so it stays correct in the
  // letterboxed web build as well as on a device. The window width seeds it so
  // pages are never zero-width on the first render — at zero they collapse to
  // their content and the scroller settles a page or two in, which parks the
  // hero on the wrong slide.
  const { width: windowWidth } = useWindowDimensions();
  const [measured, setMeasured] = useState(0);
  const width = measured || Math.min(windowWidth, layout.frameWidth);
  const [page, setPage] = useState(0);

  const current = media[page];
  const onPhoto = current?.type === 'photo';
  const photoCount = media.filter((m) => m.type === 'photo').length;

  // A three-dot window that only slides once the run reaches its ends, so the
  // active dot sits centre except at the very start and finish.
  const dotCount = Math.min(DOTS, media.length);
  const first = Math.max(0, Math.min(page - Math.floor(dotCount / 2), media.length - dotCount));
  const dotWindow = Array.from({ length: dotCount }, (_, i) => first + i);

  return (
    <View style={styles.root} onLayout={(e) => setMeasured(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // Tracked on every frame rather than on momentum end alone: a trackpad
        // swipe or a programmatic scroll on web never fires a momentum event,
        // which would leave the indicator stuck on the page it started from.
        scrollEventThrottle={16}
        onScroll={(e) => {
          if (!width) return;
          const next = Math.round(e.nativeEvent.contentOffset.x / width);
          setPage((prev) => (prev === next ? prev : next));
        }}
      >
        {media.map((item) => (
          <View key={item.key} style={[styles.page, { width }]}>
            <Image
              source={item.source}
              style={styles.pageImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
            {item.type === 'video' ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Play walkaround video"
                onPress={onPlay}
                style={({ pressed }) => [styles.play, pressed && styles.pressed]}
              >
                <PlayButton size={64} />
              </Pressable>
            ) : (
              // The photo itself opens the gallery, not just the badge over it.
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View photo ${item.index} full screen`}
                onPress={onOpenPhotos}
                style={StyleSheet.absoluteFill}
              />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.header, { top: topInset + spacing[2] }]} pointerEvents="box-none">
        <ChromeButton glyph="ChevronLeft" label="Go back" onPress={onBack} />
        <View style={styles.headerRight}>
          <ChromeButton glyph="HeroShare" glyphSize={16} label="Share listing" onPress={onShare} />
          <ChromeButton
            glyph={saved ? 'HeroSaveFilled' : 'HeroSave'}
            glyphSize={16}
            glyphColor={saved ? color.systemRed : color.icon.inverseBold}
            label={
              saved
                ? `Saved, ${auction.saveCount + 1} saves. Tap to unsave`
                : `Save listing, ${auction.saveCount} saves`
            }
            count={saved ? auction.saveCount + 1 : auction.saveCount}
            onPress={onSave}
          />
        </View>
      </View>

      <View style={styles.counts} pointerEvents="box-none">
        <CountPill
          glyph="HeroVideos"
          count={auction.videoCount}
          label={`View ${auction.videoCount} video`}
          onPress={onOpenVideos}
        />

        {/* One pill: the photo count until you swipe into the photos, then the
            position within them. A separate counter alongside it read as two
            badges saying the same thing. */}
        <CountPill
          glyph="HeroImages"
          count={onPhoto ? `${current.index} / ${photoCount}` : auction.photoCount}
          label={
            onPhoto
              ? `Photo ${current.index} of ${photoCount}. View all photos`
              : `View all ${auction.photoCount} photos`
          }
          onPress={onOpenPhotos}
        />
      </View>

      <View style={styles.dots} pointerEvents="none">
        {dotWindow.map((index) => (
          <View key={index} style={[styles.dot, index === page && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: HERO_HEIGHT,
    backgroundColor: color.background.inverseBold,
    overflow: 'hidden',
  },
  page: {
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  chromeButton: {
    width: PILL,
    height: PILL,
    borderRadius: radius.lg,
    backgroundColor: color.overlay.neutralBold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chromeButtonWide: {
    width: 64,
    flexDirection: 'row',
    gap: spacing[1],
  },
  chromeCount: {
    ...font.subheadlineEmphasized,
    color: color.text.inverseBold,
  },
  play: {
    width: 64,
    height: 64,
  },
  counts: {
    position: 'absolute',
    bottom: 16,
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countPill: {
    height: 29,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: radius.md,
    backgroundColor: color.overlay.neutralBold,
  },
  countText: {
    ...font.caption2Emphasized,
    color: color.text.inverseBold,
  },
  // Page indicator, centred between the two count pills.
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    height: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  dotActive: {
    backgroundColor: color.background.neutralWhite,
  },
  pressed: {
    opacity: 0.7,
  },
});
