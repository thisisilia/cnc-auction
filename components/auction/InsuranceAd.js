/**
 * The Car & Classic Insurance promo.
 *
 * The creative is a single 361x310 export from Figma: its headline is set in
 * a licensed display face and sits on a dotted purple field, neither of which
 * survives being rebuilt in views. The call to action is therefore a
 * transparent hit target laid over the button drawn into the artwork, sized as
 * a fraction of the card so it tracks the image at any width.
 */

import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SectionHeading } from '../ui';
import { radius, spacing } from '../../theme/tokens';

const CARD_WIDTH = 361;
const CARD_HEIGHT = 310;
// Button "Get a quote in minutes" — 329x48 at (16, 246) inside the artwork.
const CTA = {
  left: `${(16 / CARD_WIDTH) * 100}%`,
  top: `${(246 / CARD_HEIGHT) * 100}%`,
  width: `${(329 / CARD_WIDTH) * 100}%`,
  height: `${(48 / CARD_HEIGHT) * 100}%`,
};

export default function InsuranceAd({ insurance, onGetQuote }) {
  return (
    <View>
      <SectionHeading>{insurance.heading}</SectionHeading>
      <View style={styles.card}>
        <Image
          source={require('../../assets/figma/ad-insurance.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityLabel="Classic car insurance. For car people. By car people. Online specialist insurance, for the cars we love."
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={insurance.ctaLabel}
          onPress={onGetQuote}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing[4],
    aspectRatio: CARD_WIDTH / CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cta: {
    position: 'absolute',
    ...CTA,
    borderRadius: radius.full,
  },
  pressed: {
    opacity: 0.7,
  },
});
