/**
 * The two-by-five grid of vehicle facts. Figma fixes the columns at 164.5pt
 * with a 32pt gutter; here they simply share the row so the grid keeps its
 * proportions on wider screens.
 */

import { Image, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { color, font, size, spacing } from '../../theme/tokens';

const BADGES = {
  aa: require('../../assets/figma/badge-aa.png'),
  flag: require('../../assets/figma/flag-uk.png'),
};

function SpecRow({ spec }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        {spec.badge ? (
          <Image
            source={BADGES[spec.badge]}
            style={styles.badge}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Icon name={spec.icon} size={size[6]} color={color.icon.labelPrimary} />
        )}
      </View>
      <Text style={[styles.label, spec.underline && styles.labelUnderline]}>{spec.label}</Text>
    </View>
  );
}

export default function SpecGrid({ specs }) {
  return (
    <View style={styles.root}>
      {specs.map((column, i) => (
        <View key={i} style={styles.column}>
          {column.map((spec) => (
            <SpecRow key={spec.label} spec={spec} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing[8],
  },
  column: {
    flex: 1,
    gap: spacing[3],
  },
  row: {
    height: size[6],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  iconBox: {
    width: size[6],
    height: size[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: size[6],
    height: size[6],
  },
  label: {
    ...font.subheadlineRegular,
    color: color.text.labelPrimary,
    flexShrink: 1,
  },
  labelUnderline: {
    textDecorationLine: 'underline',
  },
});
