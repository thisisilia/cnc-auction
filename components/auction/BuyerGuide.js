/**
 * "Buying with Car & Classic" — four tonal cards, each with a brand-green
 * icon tile.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { Card, SectionHeading } from '../ui';
import { color, font, radius, size, spacing } from '../../theme/tokens';

export default function BuyerGuide({ buyerGuide, onSelectCard }) {
  return (
    <View>
      <SectionHeading>{buyerGuide.heading}</SectionHeading>
      <View style={styles.list}>
        {buyerGuide.cards.map((card, i) => (
          <Pressable
            key={card.heading}
            accessibilityRole="button"
            onPress={() => onSelectCard?.(i)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Card style={styles.card}>
              <View style={styles.iconTile}>
                <Icon name={card.icon} size={size[8]} color={color.icon.inverseBold} />
              </View>
              <View style={styles.details}>
                <Text style={styles.heading}>{card.heading}</Text>
                <Text style={styles.description}>{card.description}</Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing[4],
    gap: spacing[3],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  iconTile: {
    width: size[10],
    height: size[10],
    borderRadius: radius.lg,
    backgroundColor: color.background.brandPrimaryRegular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  heading: {
    ...font.bodyMdEmphasized,
    color: color.text.labelPrimary,
  },
  description: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    marginTop: spacing[1],
  },
  pressed: {
    opacity: 0.7,
  },
});
