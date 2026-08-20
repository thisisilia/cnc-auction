/**
 * "Interest in this vehicle?" — viewer count, the car's location, the
 * consignment specialist, and the two ways to reach them.
 */

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { Button, Card } from '../ui';
import { color, font, radius, size, spacing } from '../../theme/tokens';

export default function InterestCard({ interest, onContact, onRequestViewing }) {
  return (
    <Card style={styles.root}>
      <Text style={styles.heading}>{interest.heading}</Text>
      <Text style={styles.description}>{interest.description}</Text>

      <View style={styles.locationRow}>
        <Image
          source={require('../../assets/figma/flag-uk.png')}
          style={styles.flag}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.locationLabel}>
          <Text style={styles.locationText}>{interest.location}</Text>
          <Icon name="LocationDot" size={16} color={color.icon.neutralBold} />
        </View>
      </View>

      <View style={styles.specialistRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{interest.specialistInitials}</Text>
        </View>
        <View style={styles.specialistDetails}>
          <Text style={styles.specialistName}>{interest.specialistName}</Text>
          <Text style={styles.specialistRole}>{interest.specialistRole}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onContact}
          style={({ pressed }) => [styles.contactButton, pressed && styles.pressed]}
        >
          <Icon name="WhatsApp" size={15} color={color.icon.neutralBold} />
          <Text style={styles.contactLabel}>{interest.contactAction}</Text>
        </Pressable>
      </View>

      <Button
        label={interest.viewingAction}
        style={styles.viewingButton}
        onPress={onRequestViewing}
        icon={
          <FontAwesome6 name="eye" size={18} color={color.icon.labelPrimary} iconStyle="solid" />
        }
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: spacing[4],
  },
  heading: {
    ...font.bodyMdEmphasized,
    color: color.text.labelPrimary,
  },
  description: {
    ...font.bodySmRegular,
    color: color.text.labelPrimary,
    marginTop: spacing[1],
  },
  locationRow: {
    marginTop: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    // Keeps the rule hugging the label instead of filling the row.
    alignSelf: 'flex-start',
  },
  flag: {
    width: size[6],
    height: size[6],
  },
  // The location reads as a link in the comp: a hairline under the label and
  // its pin, sized to that content rather than run across the whole card.
  locationLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingBottom: spacing[1],
    borderBottomWidth: 1,
    borderBottomColor: color.border.neutralRegular,
  },
  locationText: {
    ...font.subheadlineRegular,
    color: '#333',
  },
  specialistRow: {
    marginTop: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatar: {
    width: size[8],
    height: size[8],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: color.border.neutralRegular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...font.caption1Emphasized,
    color: color.text.labelPrimary,
  },
  specialistDetails: {
    flex: 1,
  },
  specialistName: {
    ...font.bodySmEmphasized,
    color: color.text.labelPrimary,
  },
  specialistRole: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  contactButton: {
    height: size[8],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: radius.full,
    backgroundColor: color.background.neutralRegular,
  },
  contactLabel: {
    ...font.bodySmRegular,
    color: color.text.labelPrimary,
  },
  viewingButton: {
    marginTop: spacing[6],
  },
  pressed: {
    opacity: 0.7,
  },
});
