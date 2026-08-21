/**
 * The three primitives the auction page reuses across sections: the section
 * heading, the filled/tonal/outline button, and the tonal surface card.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';

export function SectionHeading({ children, style }) {
  return <Text style={[styles.sectionHeading, style]}>{children}</Text>;
}

/**
 * variant:
 *  - 'primary' — brand green fill, used for the single "Place a bid" action
 *  - 'tonal'   — neutral-regular fill, used for every secondary action
 *  - 'outline' — brand-green hairline on white, used for "Read more"
 */
export function Button({ label, variant = 'tonal', icon, iconAfter, height = 44, style, onPress }) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { height },
        isPrimary && styles.buttonPrimary,
        isOutline && styles.buttonOutline,
        !isPrimary && !isOutline && styles.buttonTonal,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.buttonLabel,
          isPrimary && styles.buttonLabelPrimary,
          isOutline && styles.buttonLabelOutline,
        ]}
      >
        {label}
      </Text>
      {iconAfter}
    </Pressable>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  sectionHeading: {
    ...font.headlineEmphasized,
    color: color.text.labelPrimary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    // Large buttons (Read more, Request viewing, Read full report, Get a quote,
    // Place a bid) use a 16px corner. Sticky-bar CTAs override this to 12px.
    borderRadius: radius.xl,
  },
  buttonPrimary: {
    backgroundColor: color.background.brandPrimaryRegular,
    borderRadius: radius.xl,
  },
  buttonTonal: {
    backgroundColor: color.background.neutralRegular,
  },
  buttonOutline: {
    backgroundColor: color.background.neutralWhite,
    borderWidth: 1,
    borderColor: color.border.brandPrimaryRegular,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonLabel: {
    ...font.calloutEmphasized,
    color: color.text.labelPrimary,
  },
  buttonLabelPrimary: {
    color: color.text.inverseBold,
  },
  buttonLabelOutline: {
    color: color.text.brandPrimaryBold,
  },
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
  },
});
