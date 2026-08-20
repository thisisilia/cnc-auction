/**
 * The bulleted highlights list and its "Read more" disclosure.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Button, SectionHeading } from '../ui';
import { color, font, spacing } from '../../theme/tokens';

export default function Highlights({ highlights, onReadMore }) {
  return (
    <View>
      <SectionHeading>{highlights.heading}</SectionHeading>
      <View style={styles.list}>
        {highlights.bullets.map((bullet) => (
          <View key={bullet} style={styles.item}>
            <Text style={styles.bullet}>{'•'}</Text>
            <Text style={styles.text}>{bullet}</Text>
          </View>
        ))}
      </View>
      <Button
        label={highlights.readMore}
        variant="outline"
        style={styles.button}
        onPress={onReadMore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing[4],
  },
  item: {
    flexDirection: 'row',
    paddingLeft: spacing[2],
  },
  bullet: {
    ...font.bodyMdRegular,
    color: color.text.labelPrimary,
    width: 16,
  },
  text: {
    ...font.bodyMdRegular,
    color: color.text.labelPrimary,
    flex: 1,
  },
  button: {
    marginTop: spacing[4],
  },
});
