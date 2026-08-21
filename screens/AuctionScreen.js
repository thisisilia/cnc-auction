/**
 * Auction detail page — Figma "Auction page", node 2:5207.
 *
 * The comp is a single 393pt column: a full-bleed hero, a countdown strip,
 * then everything else stacked inside a 16pt gutter. Section spacing follows
 * the comp's own rhythm (32pt between blocks inside the listing card, 40pt
 * between the standalone sections below it).
 *
 * Two pieces of chrome ride the scroll:
 *  - the sticky header (2:6651) fades in as the hero leaves, and its tabs jump
 *    to the anchored sections;
 *  - the sticky action bar (2:5732) appears once the in-page "Place a bid" has
 *    gone by, then follows scroll direction using the same armed/accumulator
 *    logic as the CNC vehicle page's Sell bar.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityCard from '../components/auction/ActivityCard';
import AuctionActivitySheet from '../components/auction/AuctionActivitySheet';
import BidSummary from '../components/auction/BidSummary';
import BuyerGuide from '../components/auction/BuyerGuide';
import Gallery from '../components/auction/Gallery';
import FullscreenViewer from '../components/auction/FullscreenViewer';
import GallerySheet from '../components/auction/GallerySheet';
import VideoPlayer from '../components/auction/VideoPlayer';
import Hero from '../components/auction/Hero';
import Highlights from '../components/auction/Highlights';
import InsuranceAd from '../components/auction/InsuranceAd';
import InterestCard from '../components/auction/InterestCard';
import ReportCard from '../components/auction/ReportCard';
import SpecGrid from '../components/auction/SpecGrid';
import StickyBar from '../components/auction/StickyBar';
import StickyHeader, { HEADER_BAR, TAB_ROW } from '../components/auction/StickyHeader';
import { useSmoothScroll } from '../components/useSmoothScroll';
import TimeBar from '../components/auction/TimeBar';
import { Button } from '../components/ui';
import { auction } from '../data/auction';
import { USE_NATIVE_DRIVER } from '../theme/animation';
import { color, layout, spacing } from '../theme/tokens';

const HERO_HEIGHT = 295;

/**
 * Overview is the top of the page; the other three map onto real sections.
 * FAQ points at "Buying with Car & Classic" — the comp has no separate FAQ
 * block, and that card stack is the page's question-and-answer content.
 */
/**
 * Hero carousel: the walkaround video first, then the listing photos, so
 * swiping on past the video walks the gallery. One committed image stands in
 * for every frame until a real listing supplies its own URLs.
 */
const HERO_PHOTO = require('../assets/figma/hero.jpg');

/**
 * The walkaround video first, then one page per listing photo, so the counter
 * over the carousel ("3 of 34") matches the photo count on the badge. Every
 * page points at the one committed image until a listing supplies its own.
 */
const HERO_MEDIA = [
  { key: 'video', type: 'video', source: HERO_PHOTO },
  ...Array.from({ length: auction.photoCount }, (_, i) => ({
    key: `photo-${i + 1}`,
    type: 'photo',
    index: i + 1,
    source: HERO_PHOTO,
  })),
];

/**
 * Every listing photo in one run, category after category — the fullscreen
 * viewer pages through this rather than a single category's slice.
 */
const ALL_PHOTOS = auction.gallerySheet.categories.flatMap((category) =>
  Array.from({ length: category.count }, (_, i) => ({
    key: `${category.key}-${i}`,
    title: category.label,
    source: HERO_PHOTO,
  }))
);

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'faq', label: 'FAQ' },
];

export default function AuctionScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastY = useRef(0);

  // Eased wheel scrolling on web; a no-op on device, which has its own inertia.
  // Suspended while a sheet is open so the sheet's scroller keeps the wheel.
  const [saved, setSaved] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [sheetCategory, setSheetCategory] = useState(null);
  // { items, index, title } while the fullscreen viewer is open.
  const [viewer, setViewer] = useState(null);
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityTab, setActivityTab] = useState(0);
  const openActivity = (tab) => {
    setActivityTab(tab);
    setActivityOpen(true);
  };

  // Section offsets, measured against `body` rather than the page. `bodyY` is
  // what converts them to page scroll, and both re-fire as images finish
  // loading and reflow the column — so nothing here is a fixed guess.
  const anchors = useRef({ overview: 0, highlights: 0, gallery: 0, faq: 0 });
  const bodyY = useRef(0);
  // Y of the in-page "Place a bid", which is what arms the sticky bar.
  const bidY = useRef(0);
  const pageY = (key) => anchors.current[key] + bodyY.current;

  // Suppresses the scroll-derived active tab while a tab tap scrolls the page.
  const tabLock = useRef(false);
  const tabLockTimer = useRef(null);
  useEffect(() => () => clearTimeout(tabLockTimer.current), []);

  const [barActive, setBarActive] = useState(false);
  const [barHeight, setBarHeight] = useState(120);
  const barArmed = useRef(false);
  const barAccum = useRef(0);
  const bar = useRef(new Animated.Value(0)).current;

  const headerTop = insets.top;
  const headerHeight = headerTop + spacing[3] + HEADER_BAR + spacing[3] + TAB_ROW + spacing[1];

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((on) => {
      if (alive) setReduceMotion(!!on);
    });
    return () => {
      alive = false;
    };
  }, []);

  // The header takes over as the hero's last 60pt scroll away, so the
  // translucent hero chrome and the solid bar never overlap.
  const handoff = HERO_HEIGHT - headerHeight;
  const headerOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [Math.max(handoff - 60, 0), Math.max(handoff, 1)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY, handoff]
  );

  const [headerShown, setHeaderShown] = useState(false);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: USE_NATIVE_DRIVER,
    listener: (e) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const y = contentOffset.y;
      const dy = y - lastY.current;
      lastY.current = y;

      const shown = y > Math.max(handoff - 60, 0);
      setHeaderShown((prev) => (prev === shown ? prev : shown));

      // Active tab = the last anchor the reading position has passed. The
      // reading position is the viewport top plus the header that covers it.
      // FAQ is the last section, so it can never be scrolled to the top — the
      // page runs out first. Hitting the bottom *is* being in it, which also
      // makes tapping the FAQ tab settle on FAQ rather than snapping back.
      const atBottom =
        contentSize.height > 0 &&
        y + layoutMeasurement.height >= contentSize.height - 4;
      const probe = y + headerHeight + 1;
      const current = ['faq', 'gallery', 'highlights'].find(
        (key) => anchors.current[key] > 0 && probe >= pageY(key)
      );
      const next = atBottom ? TABS[TABS.length - 1].key : (current ?? 'overview');
      if (!tabLock.current) setActiveTab((prev) => (prev === next ? prev : next));

      // The sticky bar arms once the in-page bid button is gone, then hides on
      // a sustained scroll down and returns on any scroll up. The accumulator
      // keeps a stray pixel from flipping it.
      const threshold = bidY.current > 0 ? bidY.current + bodyY.current - headerHeight : null;
      const past = threshold != null && y > threshold;
      if (!past) {
        barArmed.current = false;
        barAccum.current = 0;
        setBarActive(false);
      } else if (!barArmed.current) {
        barArmed.current = true;
        barAccum.current = 0;
        setBarActive(true);
      } else if (atBottom) {
        // At the end of the page the reserved space is only justified while
        // the bar is filling it — hiding it there is what reads as a gap.
        barAccum.current = 0;
        setBarActive(true);
      } else {
        if ((dy > 0 && barAccum.current < 0) || (dy < 0 && barAccum.current > 0)) {
          barAccum.current = 0;
        }
        barAccum.current += dy;
        if (barAccum.current > 48) setBarActive(false);
        else if (barAccum.current < -32) setBarActive(true);
      }
    },
  });

  useEffect(() => {
    Animated.timing(bar, {
      toValue: barActive ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [barActive, bar]);

  const barTranslate = bar.interpolate({
    inputRange: [0, 1],
    // Generous clearance: on a device the safe-area inset makes the bar taller
    // than the height onLayout last reported, and a translate sized to that
    // stale value leaves a sliver of the bar showing above the fold.
    outputRange: [barHeight + 96, 0],
  });
  // Opacity settles it regardless of what the height measured: even if the
  // translate falls short, a hidden bar is not painted and cannot be tapped.
  const barOpacity = bar.interpolate({
    inputRange: [0, 0.05, 1],
    outputRange: [0, 1, 1],
  });

  const goToTab = (key) => {
    setActiveTab(key);
    // Hold the tap's choice while the animated scroll runs. Without this the
    // scroll listener recomputes the active tab on every frame of the way, so
    // the underline skips through the tabs it passes before settling — which
    // is the flicker on tapping Overview, the longest journey of the four.
    tabLock.current = true;
    clearTimeout(tabLockTimer.current);
    tabLockTimer.current = setTimeout(() => {
      tabLock.current = false;
    }, 650);
    const target = key === 'overview' ? 0 : Math.max(pageY(key) - headerHeight, 0);
    scrollRef.current?.scrollTo({ y: target, animated: true });
  };

  const anchor = (key) => (e) => {
    anchors.current[key] = e.nativeEvent.layout.y;
  };

  useSmoothScroll(scrollRef, { enabled: sheet == null });

  const toggleSave = () => setSaved((prev) => !prev);

  const openSheet = (tab, category = null) => {
    setSheetCategory(category);
    setSheet(tab);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={headerShown ? 'dark-content' : 'light-content'} translucent backgroundColor="transparent" />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        // Reserve exactly the sticky bar — no more. The bar is pinned visible
        // at the foot of the page, so the reserve is always covered by it and
        // never shows as empty space below the last card. The bar carries the
        // safe-area inset in its own height, so adding insets.bottom here
        // would count it twice.
        contentContainerStyle={{ paddingBottom: barHeight }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        <Hero
          auction={auction}
          media={HERO_MEDIA}
          topInset={insets.top}
          saved={saved}
          onSave={toggleSave}
          onOpenPhotos={() => openSheet('photos')}
          onOpenVideos={() => openSheet('video')}
          onPlay={() => openSheet('video')}
        />
        <TimeBar countdown={auction.countdown} reserveStatus={auction.reserveStatus} reduceMotion={reduceMotion} />

        <View
          style={styles.body}
          onLayout={(e) => {
            bodyY.current = e.nativeEvent.layout.y;
          }}
        >
          <BidSummary auction={auction} />

          <View style={styles.block}>
            <ActivityCard activity={auction.activity} onOpen={openActivity} />
          </View>

          <View
            style={styles.block}
            onLayout={(e) => {
              bidY.current = e.nativeEvent.layout.y;
            }}
          >
            <Button label={auction.primaryAction} variant="primary" height={48} />
          </View>

          <View style={styles.block}>
            <SpecGrid specs={auction.specs} />
          </View>

          <View style={styles.block} onLayout={anchor('highlights')}>
            <Highlights
              highlights={auction.highlights}
              expanded={highlightsOpen}
              onToggle={() => setHighlightsOpen((prev) => !prev)}
            />
          </View>

          <View style={styles.block}>
            <InterestCard interest={auction.interest} />
          </View>

          <View style={styles.section}>
            <ReportCard report={auction.report} />
          </View>

          <View style={styles.section}>
            <InsuranceAd insurance={auction.insurance} />
          </View>

          <View style={styles.section} onLayout={anchor('gallery')}>
            <Gallery
              gallery={auction.gallery}
              onPlay={() => openSheet('video')}
              onSelectThumbnail={(category) => openSheet('photos', category)}
            />
          </View>

          <View style={styles.section} onLayout={anchor('faq')}>
            <BuyerGuide buyerGuide={auction.buyerGuide} />
          </View>
        </View>
      </ScrollView>

      <StickyHeader
        tabs={TABS}
        activeTab={activeTab}
        onSelectTab={goToTab}
        saved={saved}
        saveCount={auction.saveCount}
        onSave={toggleSave}
        opacity={headerOpacity}
        topInset={insets.top}
        pointerEvents={headerShown ? 'auto' : 'none'}
      />

      <StickyBar
        auction={auction}
        translateY={barTranslate}
        opacity={barOpacity}
        pointerEvents={barActive ? 'auto' : 'none'}
        bottomInset={insets.bottom}
        reduceMotion={reduceMotion}
        onLayout={(e) => setBarHeight(e.nativeEvent.layout.height)}
        onPlaceBid={() => {}}
        onRequestViewing={() => {}}
      />

      <GallerySheet
        onOpenPhoto={(category, index) =>
          setViewer({
            kind: 'photo',
            title: category.label,
            // Offset into the flattened run, so swiping past the last Interior
            // photo continues into Engine rather than dead-ending. Each frame
            // carries its own category, which is what retitles the header.
            index: ALL_PHOTOS.findIndex((p) => p.key === `${category.key}-${index}`),
            items: ALL_PHOTOS,
          })
        }
        onExpandVideo={() =>
          setViewer({
            kind: 'video',
            title: 'Videos',
            index: 0,
            items: [{ key: 'video', title: 'Videos', source: HERO_PHOTO }],
          })
        }
        visible={sheet != null}
        onClose={() => setSheet(null)}
        gallery={auction.gallerySheet}
        initialTab={sheet ?? 'photos'}
        focusCategory={sheetCategory}
        saved={saved}
        onSave={toggleSave}
      />

      <FullscreenViewer
        visible={viewer != null}
        onClose={() => setViewer(null)}
        title={viewer?.title}
        items={viewer?.items ?? []}
        initialIndex={viewer?.index ?? 0}
        saved={saved}
        saveCount={auction.saveCount}
        onSave={toggleSave}
        renderItem={
          viewer?.kind === 'video'
            ? (item) => (
                <VideoPlayer source={item.source} style={styles.viewerVideo} showExpand={false} />
              )
            : undefined
        }
      />

      <AuctionActivitySheet
        visible={activityOpen}
        onClose={() => setActivityOpen(false)}
        activity={auction.activity}
        primaryAction={auction.primaryAction}
        initialTab={activityTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  scroll: {
    flex: 1,
  },
  body: {
    paddingHorizontal: layout.gutter,
    paddingTop: spacing[4],
  },
  block: {
    marginTop: spacing[8],
  },
  section: {
    marginTop: spacing[8],
  },
  // The fullscreen video keeps the comp's 16:9 letterbox on the black field.
  viewerVideo: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 0,
  },
});
