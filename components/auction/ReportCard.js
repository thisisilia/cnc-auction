/**
 * The AA inspection report promo.
 */

import { Image, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from '../ui';
import { color, font, size, spacing } from '../../theme/tokens';

export default function ReportCard({ report, onReadReport }) {
  return (
    <Card style={styles.root}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/figma/badge-aa.png')}
          style={styles.badge}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <Text style={styles.heading}>{report.heading}</Text>
      </View>
      <Text style={styles.description}>{report.description}</Text>
      <Button
        label={report.action}
        variant="outline"
        style={styles.button}
        onPress={onReadReport}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  badge: {
    width: size[6],
    height: size[6],
  },
  heading: {
    ...font.bodyLgEmphasized,
    color: color.text.labelPrimary,
  },
  description: {
    ...font.bodyMdRegular,
    color: color.text.labelPrimary,
    marginTop: spacing[2],
  },
  button: {
    marginTop: spacing[2],
  },
});
