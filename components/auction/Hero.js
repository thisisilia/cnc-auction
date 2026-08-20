/**
 * The 393x295 hero: the listing photo full-bleed, with translucent chrome
 * floating over it — back / share / save along the top, a play button in the
 * middle, and the photo and video counts pinned to the bottom corners.
 *
 * Figma pairs the pill fills with a 50px background blur. React Native has no
 * portable backdrop filter, so `color.overlay.neutralBold` carries a little
 * extra alpha instead to keep the white glyphs legible over a bright photo.
 */

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { color, font, radius, spacing } from '../../theme/tokens';

const HERO_HEIGHT = 295;
const PILL = 34;

function ChromeButton({ glyph, faName, glyphColor, label, count, onPress }) {
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
      {glyph ? (
        <Icon name={glyph} size={24} color={glyphColor ?? color.icon.inverseBold} />
      ) : (
        <FontAwesome6 name={faName} size={17} color={color.icon.inverseBold} iconStyle="solid" />
      )}
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
  topInset = 0,
  saved = false,
  onBack,
  onShare,
  onSave,
  onPlay,
  onOpenPhotos,
  onOpenVideos,
}) {
  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/figma/hero.jpg')}
        style={styles.heroImage}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <View style={[styles.header, { top: topInset + spacing[2] }]}>
        <ChromeButton faName="chevron-left" label="Go back" onPress={onBack} />
        <View style={styles.headerRight}>
          <ChromeButton glyph="HeroShare" label="Share listing" onPress={onShare} />
          <ChromeButton
            glyph={saved ? 'HeroSaveFilled' : 'HeroSave'}
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

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Play walkaround video"
        onPress={onPlay}
        style={({ pressed }) => [styles.play, pressed && styles.pressed]}
      >
        <FontAwesome6
          name="play"
          size={22}
          color={color.icon.inverseBold}
          iconStyle="solid"
          style={styles.playGlyph}
        />
      </Pressable>

      <View style={styles.counts}>
        <CountPill
          glyph="HeroImages"
          count={auction.photoCount}
          label={`View all ${auction.photoCount} photos`}
          onPress={onOpenPhotos}
        />
        <CountPill
          glyph="HeroVideos"
          count={auction.videoCount}
          label={`View ${auction.videoCount} video`}
          onPress={onOpenVideos}
        />
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
  heroImage: {
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
    position: 'absolute',
    alignSelf: 'center',
    top: (HERO_HEIGHT - 64) / 2,
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The glyph's own bearing sits it left of centre inside the circle.
  playGlyph: {
    marginLeft: 3,
  },
  counts: {
    position: 'absolute',
    bottom: 16,
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
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
  pressed: {
    opacity: 0.7,
  },
});
