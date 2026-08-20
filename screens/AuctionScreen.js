/**
 * Auction detail page — Figma "Auction page", node 2:5207.
 *
 * The comp is a single 393pt column: a full-bleed hero, a countdown strip,
 * then everything else stacked inside a 16pt gutter. Section spacing follows
 * the comp's own rhythm (32pt between blocks inside the listing card, 40pt
 * between the standalone sections below it).
 */

import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityCard from '../components/auction/ActivityCard';
import BidSummary from '../components/auction/BidSummary';
import BuyerGuide from '../components/auction/BuyerGuide';
import Gallery from '../components/auction/Gallery';
import Hero from '../components/auction/Hero';
import Highlights from '../components/auction/Highlights';
import InsuranceAd from '../components/auction/InsuranceAd';
import InterestCard from '../components/auction/InterestCard';
import ReportCard from '../components/auction/ReportCard';
import SpecGrid from '../components/auction/SpecGrid';
import TimeBar from '../components/auction/TimeBar';
import { Button } from '../components/ui';
import { auction } from '../data/auction';
import { color, layout, spacing } from '../theme/tokens';

export default function AuctionScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        <Hero auction={auction} topInset={insets.top} />
        <TimeBar countdown={auction.countdown} reserveStatus={auction.reserveStatus} />

        <View style={styles.body}>
          <BidSummary auction={auction} />

          <View style={styles.block}>
            <ActivityCard activity={auction.latestActivity} />
          </View>

          <View style={styles.block}>
            <Button label={auction.primaryAction} variant="primary" height={48} />
          </View>

          <View style={styles.block}>
            <SpecGrid specs={auction.specs} />
          </View>

          <View style={styles.block}>
            <Highlights highlights={auction.highlights} />
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

          <View style={styles.section}>
            <Gallery gallery={auction.gallery} />
          </View>

          <View style={styles.section}>
            <BuyerGuide buyerGuide={auction.buyerGuide} />
          </View>
        </View>
      </ScrollView>
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
});
