/**
 * The bulleted highlights list and its "Read more" disclosure.
 *
 * Expanded (Figma 235:2187) the section continues with the description
 * paragraphs, a secondary photo, and the history-and-paperwork list; the
 * button then reads "Read less" and collapses it again.
 */

import { Image, StyleSheet, Text, View } from 'react-native';
import { Button, SectionHeading } from '../ui';
import { color, font, radius, spacing } from '../../theme/tokens';

const SECONDARY = require('../../assets/figma/hero.jpg');

function Bullet({ children }) {
  return (
    <View style={styles.item}>
      <Text style={styles.bullet}>{'•'}</Text>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

export default function Highlights({ highlights, expanded = false, onToggle }) {
  const more = highlights.expanded;
  return (
    <View>
      <SectionHeading>{highlights.heading}</SectionHeading>
      <View style={styles.list}>
        {highlights.bullets.map((bullet) => (
          <Bullet key={bullet}>{bullet}</Bullet>
        ))}
      </View>

      {expanded ? (
        <View style={styles.more}>
          {more.description.map((paragraph) => (
            <Text key={paragraph} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}

          <Image
            source={SECONDARY}
            style={styles.image}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />

          <SectionHeading style={styles.historyHeading}>{more.historyHeading}</SectionHeading>
          <View style={styles.historyList}>
            {more.history.map((line) => (
              <Bullet key={line}>{line}</Bullet>
            ))}
          </View>
        </View>
      ) : null}

      <Button
        label={expanded ? highlights.readLess : highlights.readMore}
        variant="outline"
        style={styles.button}
        onPress={onToggle}
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
  more: {
    marginTop: spacing[4],
  },
  paragraph: {
    ...font.bodyMdRegular,
    color: color.text.labelPrimary,
    marginBottom: spacing[4],
  },
  image: {
    width: '100%',
    height: 192,
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralRegular,
  },
  historyHeading: {
    marginTop: spacing[6],
  },
  historyList: {
    marginTop: spacing[4],
  },
  button: {
    marginTop: spacing[4],
  },
});
