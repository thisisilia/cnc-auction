/**
 * Gallery: a tall lead image with a play button, and a scrolling strip of
 * labelled thumbnails beneath it.
 */

import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PlayButton from '../PlayButton';
import { SectionHeading } from '../ui';
import { color, font, layout, radius, spacing } from '../../theme/tokens';

const LEAD = require('../../assets/figma/hero.jpg');
const THUMB = require('../../assets/figma/thumb.jpg');

export default function Gallery({ gallery, onPlay, onSelectThumbnail }) {
  return (
    <View>
      <SectionHeading>{gallery.heading}</SectionHeading>

      <View style={styles.lead}>
        <Image
          source={LEAD}
          style={styles.leadImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Play walkaround video"
          onPress={onPlay}
          style={({ pressed }) => [styles.play, pressed && styles.pressed]}
        >
          <PlayButton size={50} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.strip}
        contentContainerStyle={styles.stripContent}
      >
        {gallery.thumbnails.map((thumb, i) => (
          <Pressable
            key={`${thumb.category}-${i}`}
            accessibilityRole="button"
            accessibilityLabel={`View ${thumb.label} photos`}
            onPress={() => onSelectThumbnail?.(thumb.category)}
            style={({ pressed }) => [styles.thumb, pressed && styles.pressed]}
          >
            <Image
              source={THUMB}
              style={styles.thumbImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
            <Text style={styles.thumbLabel}>{thumb.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginTop: spacing[4],
    height: 262,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leadImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  play: {
    width: 50,
    height: 50,
  },
  strip: {
    marginTop: spacing[4],
    // Let the strip bleed to both page edges while its first card stays on
    // the 16pt gutter, so thumbnails scroll off-screen rather than clipping.
    marginHorizontal: -layout.gutter,
  },
  stripContent: {
    paddingHorizontal: layout.gutter,
    gap: spacing[4],
  },
  thumb: {
    width: 140,
  },
  thumbImage: {
    width: 140,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: color.background.neutralRegular,
  },
  thumbLabel: {
    ...font.subheadlineEmphasized,
    color: color.text.labelPrimary,
    marginTop: spacing[2],
  },
  pressed: {
    opacity: 0.7,
  },
});
