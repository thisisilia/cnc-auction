/**
 * Video surface and its control bar — Figma 2:7979 (in the gallery sheet) and
 * the same bar inside the fullscreen viewer, 2:8256.
 *
 * The still stands in for the walkaround footage until a real video URL is
 * wired; the controls are drawn so the chrome is right and the play state,
 * scrub position and expand action are already behaving. Swapping the Image
 * for expo-video later leaves this layout untouched.
 *
 * The glyphs are drawn from views rather than pulled from an icon set: the
 * comp's player chrome has no matching entries in the designer's Icons/ folder,
 * and inventing a lookalike from another family would read as a different
 * player. These are simple enough shapes to be faithful.
 */

import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, spacing } from '../../theme/tokens';

const BAR = '#f7f9f7';

function PlayPause({ playing, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={playing ? 'Pause' : 'Play'}
      onPress={onPress}
      style={({ pressed }) => [styles.control, pressed && styles.pressed]}
    >
      {playing ? (
        <View style={styles.pause}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </View>
      ) : (
        <View style={styles.playTriangle} />
      )}
    </Pressable>
  );
}

/** The four rising bars of the volume control. */
function Volume({ onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volume"
      onPress={onPress}
      style={({ pressed }) => [styles.control, styles.volume, pressed && styles.pressed]}
    >
      {[4, 7, 10, 13].map((h) => (
        <View key={h} style={[styles.volumeBar, { height: h }]} />
      ))}
    </Pressable>
  );
}

function Gear() {
  return (
    <View style={styles.gear}>
      <View style={styles.gearRing} />
      <View style={styles.gearCore} />
    </View>
  );
}

/** Four corner brackets — the expand-to-fullscreen affordance. */
function Expand() {
  return (
    <View style={styles.expand}>
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />
    </View>
  );
}

export default function VideoPlayer({
  source,
  progress = 0.18,
  buffered = 0.42,
  style,
  showExpand = true,
  onExpand,
  onToggleCaptions,
  onSettings,
}) {
  const [playing, setPlaying] = useState(true);

  return (
    <View style={[styles.root, style]}>
      <Image
        source={source}
        style={styles.frame}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <View style={styles.controls}>
        <PlayPause playing={playing} onPress={() => setPlaying((p) => !p)} />

        <View style={styles.track}>
          <View style={[styles.buffered, { width: `${buffered * 100}%` }]} />
          <View style={[styles.played, { width: `${progress * 100}%` }]} />
        </View>

        <Volume />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Captions"
          onPress={onToggleCaptions}
          style={({ pressed }) => [styles.cc, pressed && styles.pressed]}
        >
          <Text style={styles.ccLabel}>CC</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Playback settings"
          onPress={onSettings}
          style={({ pressed }) => [styles.control, pressed && styles.pressed]}
        >
          <Gear />
        </Pressable>

        {showExpand ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Expand to fullscreen"
            onPress={onExpand}
            style={({ pressed }) => [styles.control, pressed && styles.pressed]}
          >
            <Expand />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: color.background.inverseBold,
  },
  frame: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[2],
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  control: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pause: {
    flexDirection: 'row',
    gap: 3,
  },
  pauseBar: {
    width: 3.5,
    height: 13,
    borderRadius: 1,
    backgroundColor: BAR,
  },
  playTriangle: {
    marginLeft: 2,
    width: 0,
    height: 0,
    borderTopWidth: 6.5,
    borderBottomWidth: 6.5,
    borderLeftWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: BAR,
  },
  // Three layers: unplayed track, buffered ahead, then played.
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  buffered: {
    ...StyleSheet.absoluteFillObject,
    right: undefined,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  played: {
    ...StyleSheet.absoluteFillObject,
    right: undefined,
    backgroundColor: color.systemBlue,
  },
  volume: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
  },
  volumeBar: {
    width: 2.5,
    borderRadius: 1,
    backgroundColor: color.systemBlue,
  },
  cc: {
    paddingHorizontal: 3,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: BAR,
  },
  ccLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    color: BAR,
  },
  gear: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: BAR,
    borderStyle: 'dashed',
  },
  gearCore: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: BAR,
  },
  expand: {
    width: 15,
    height: 15,
  },
  corner: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderColor: BAR,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
  pressed: {
    opacity: 0.6,
  },
});
