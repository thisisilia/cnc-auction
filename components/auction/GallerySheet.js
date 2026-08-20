/**
 * Gallery sheet — Figma "Gallery / Light", node 2:7881 (Video) and 2:8090
 * (Photos). One sheet, two tabs: the hero's video badge opens it on Video and
 * the photo badge opens it on Photos, so `initialTab` is the only difference.
 *
 * Layout per the comp: a pinned header (title, share, save) above a segmented
 * control whose active tab carries a 3px underline on a hairline track, then
 * the tab's own scrolling body.
 *
 * Photos body: a category strip of labelled thumbnails that scrolls
 * horizontally, then one horizontally-scrolling row per category. Both rows
 * run past the right edge, as the comp shows them — that falls out of the
 * horizontal scroll, so only the leading gutter needs setting.
 */

import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomSheet from '../BottomSheet';
import { Icon } from '../Icon';
import { color, font, radius, spacing } from '../../theme/tokens';

const PHOTO = require('../../assets/figma/hero.jpg');
const THUMB = require('../../assets/figma/thumb.jpg');

/** Sheet-header action: the share glyph, and the save heart with its label. */
function HeaderAction({ glyph, glyphColor, label, showLabel, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]}
    >
      <Icon name={glyph} size={24} color={glyphColor ?? color.icon.neutralBold} />
      {showLabel ? <Text style={styles.headerActionLabel}>{label}</Text> : null}
    </Pressable>
  );
}

function Tab({ tab, active, onPress }) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
    >
      <Icon
        name={tab.glyph}
        size={30}
        color={active ? color.icon.neutralBold : color.icon.neutralRegular}
      />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
    </Pressable>
  );
}

function VideoBody() {
  return (
    <View style={styles.body}>
      <View style={styles.videoFrame}>
        <Image source={PHOTO} style={styles.videoImage} resizeMode="cover" />
        <View style={styles.playButton}>
          <View style={styles.playGlyph} />
        </View>
      </View>
    </View>
  );
}

function PhotosBody({ categories }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.photosContent}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {categories.map((category) => (
          <View key={category.key} style={styles.stripItem}>
            <Image source={THUMB} style={styles.stripImage} resizeMode="cover" />
            <Text style={styles.stripLabel}>{category.label}</Text>
          </View>
        ))}
      </ScrollView>

      {categories.map((category) => (
        <View key={category.key} style={styles.category}>
          <Text style={styles.categoryHeading}>{category.label}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
          >
            {Array.from({ length: category.count }).map((_, index) => (
              <Image
                key={index}
                source={PHOTO}
                style={styles.rowImage}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

export default function GallerySheet({
  visible,
  onClose,
  gallery,
  initialTab = 'photos',
  saved = false,
  onSave,
  onShare,
}) {
  const [tab, setTab] = useState(initialTab);

  // Each open honours the badge that triggered it, so opening from the video
  // badge lands on Video even if the sheet was last closed on Photos.
  useEffect(() => {
    if (visible) setTab(initialTab);
  }, [visible, initialTab]);

  return (
    <BottomSheet visible={visible} onClose={onClose} fill topInset={60}>
      <View style={styles.header}>
        <Text style={styles.heading}>{gallery.heading}</Text>
        <View style={styles.headerActions}>
          <HeaderAction glyph="HeroShare" label="Share" onPress={onShare} />
          <HeaderAction
            glyph={saved ? 'HeroSaveFilled' : 'HeroSave'}
            glyphColor={saved ? color.systemRed : color.icon.neutralBold}
            label={saved ? 'Saved' : 'Save'}
            showLabel
            onPress={onSave}
          />
        </View>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {gallery.tabs.map((item) => (
          <Tab
            key={item.key}
            tab={item}
            active={tab === item.key}
            onPress={() => setTab(item.key)}
          />
        ))}
        <View style={styles.track} />
        <View
          style={[
            styles.trackActive,
            { left: spacing[4] + gallery.tabs.findIndex((t) => t.key === tab) * 89 },
          ]}
        />
      </View>

      {tab === 'video' ? <VideoBody /> : <PhotosBody categories={gallery.categories} />}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  heading: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerAction: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[1],
  },
  headerActionLabel: {
    ...font.calloutRegular,
    color: color.text.neutralBold,
  },
  tabs: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: spacing[6],
  },
  tab: {
    width: 65,
    alignItems: 'center',
    paddingBottom: spacing[2],
    gap: spacing[1],
  },
  tabLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  tabLabelActive: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  // The hairline runs the full width; the active segment sits on top of it.
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: color.border.neutralSubtle,
  },
  trackActive: {
    position: 'absolute',
    bottom: 0,
    width: 65,
    height: 3,
    borderRadius: radius.sm,
    backgroundColor: color.background.inverseBold,
  },
  body: {
    alignSelf: 'stretch',
    padding: spacing[4],
  },
  videoFrame: {
    height: 260,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: (260 - 64) / 2,
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: 'rgba(51, 51, 51, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // A CSS triangle: the play glyph is drawn from borders so the sheet needs no
  // extra icon font.
  playGlyph: {
    marginLeft: 5,
    width: 0,
    height: 0,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 18,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: color.icon.inverseBold,
  },
  scroll: {
    alignSelf: 'stretch',
    flex: 1,
  },
  photosContent: {
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  strip: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  stripItem: {
    width: 140,
    gap: spacing[2],
  },
  stripImage: {
    width: 140,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: color.background.neutralRegular,
  },
  stripLabel: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  category: {
    marginTop: spacing[6],
    gap: spacing[3],
  },
  categoryHeading: {
    paddingHorizontal: spacing[4],
    ...font.headlineEmphasized,
    color: color.text.neutralBold,
  },
  row: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  rowImage: {
    width: 281,
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralRegular,
  },
  pressed: {
    opacity: 0.6,
  },
});
