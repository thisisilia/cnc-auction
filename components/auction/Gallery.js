/**
 * Gallery: a tall lead image with a play button, and a scrolling strip of
 * labelled thumbnails beneath it.
 */

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
          <FontAwesome6
            name="play"
            size={18}
            color={color.icon.inverseBold}
            iconStyle="solid"
            style={styles.playGlyph}
          />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.strip}
        contentContainerStyle={styles.stripContent}
      >
        {gallery.thumbnails.map((label, i) => (
          <Pressable
            key={`${label}-${i}`}
            accessibilityRole="button"
            onPress={() => onSelectThumbnail?.(i)}
            style={({ pressed }) => [styles.thumb, pressed && styles.pressed]}
          >
            <Image
              source={THUMB}
              style={styles.thumbImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
            <Text style={styles.thumbLabel}>{label}</Text>
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
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playGlyph: {
    marginLeft: 3,
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
    ...font.bodyXsRegular,
    color: color.text.labelPrimary,
    marginTop: spacing[2],
  },
  pressed: {
    opacity: 0.7,
  },
});
