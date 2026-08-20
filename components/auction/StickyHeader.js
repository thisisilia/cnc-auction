/**
 * Sticky header — Figma "Header / Auction / Light", node 2:6651.
 *
 * Takes over once the hero has scrolled away: white bar, back chevron, the
 * share and save chips on the right, and a tab row that anchors the page's
 * four sections. The active tab carries the underline.
 *
 * It fades in rather than snapping, so the translucent hero chrome and this
 * bar never both read as the page header at once.
 */

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { color, font, radius, spacing } from '../../theme/tokens';

export const HEADER_BAR = 34;
export const TAB_ROW = 29;

function Chip({ glyph, glyphColor, count, label, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        count != null && styles.chipWide,
        pressed && styles.pressed,
      ]}
    >
      <Icon name={glyph} size={24} color={glyphColor ?? color.icon.neutralBold} />
      {count != null ? <Text style={styles.chipCount}>{count}</Text> : null}
    </Pressable>
  );
}

export default function StickyHeader({
  tabs,
  activeTab,
  onSelectTab,
  onBack,
  onShare,
  onSave,
  saved = false,
  saveCount = 0,
  opacity,
  topInset = 0,
  pointerEvents = 'auto',
}) {
  return (
    <Animated.View
      pointerEvents={pointerEvents}
      style={[styles.root, { opacity, paddingTop: topInset + spacing[3] }]}
    >
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <FontAwesome6
            name="chevron-left"
            size={17}
            color={color.icon.neutralBold}
            iconStyle="solid"
          />
        </Pressable>

        <View style={styles.barRight}>
          <Chip glyph="HeroShare" label="Share listing" onPress={onShare} />
          <Chip
            glyph={saved ? 'HeroSaveFilled' : 'HeroSave'}
            glyphColor={saved ? color.systemRed : color.icon.neutralBold}
            count={saved ? saveCount + 1 : saveCount}
            label={saved ? 'Saved. Tap to unsave' : 'Save listing'}
            onPress={onSave}
          />
        </View>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onSelectTab(tab.key)}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              <View style={[styles.underline, active && styles.underlineActive]} />
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: color.background.neutralWhite,
    paddingBottom: spacing[1],
  },
  bar: {
    height: HEADER_BAR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
  },
  back: {
    width: HEADER_BAR,
    height: HEADER_BAR,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing[2],
  },
  barRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  chip: {
    width: HEADER_BAR,
    height: HEADER_BAR,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background.neutralRegular,
  },
  chipWide: {
    width: 64,
    flexDirection: 'row',
    gap: spacing[1],
  },
  chipCount: {
    ...font.subheadlineEmphasized,
    color: color.text.neutralBold,
  },
  tabs: {
    height: TAB_ROW,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[6],
    paddingHorizontal: spacing[4],
    marginTop: spacing[3],
  },
  tab: {
    alignItems: 'center',
  },
  tabLabel: {
    ...font.calloutRegular,
    color: color.text.neutralRegular,
  },
  tabLabelActive: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  underline: {
    marginTop: spacing[2],
    height: 2,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: color.background.inverseBold,
  },
  pressed: {
    opacity: 0.6,
  },
});
