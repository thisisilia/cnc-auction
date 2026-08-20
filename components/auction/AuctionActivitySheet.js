/**
 * Full live-auction activity sheet, opened from the widget. Three tabs — Recent
 * (interleaved), Bid history (bids only) and Comment (comments only) — over a
 * sticky "Place a bid" action.
 */

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '../BottomSheet';
import { color, font, radius, spacing } from '../../theme/tokens';

const LABEL_PRIMARY = '#333';
const LABEL_SECONDARY = 'rgba(60,60,67,0.6)';
const BID_TINT = 'rgba(20,149,93,0.10)';

const TABS = [
  { key: 'recent', label: 'Recent' },
  { key: 'bids', label: 'Bid history' },
  { key: 'comments', label: 'Comment' },
];

function Avatar({ initials, size = 24 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

function TabButton({ tab, count, active, onPress }) {
  return (
    <Pressable style={styles.tab} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: active }}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
      <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
        <Text style={styles.tabBadgeLabel}>{count}</Text>
      </View>
      {active ? <View style={styles.tabUnderline} /> : null}
    </Pressable>
  );
}

function BidCard({ item }) {
  return (
    <View style={styles.bidCard}>
      <View style={styles.bidTop}>
        <Avatar initials={item.initials} />
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.bidBottom}>
        <Text style={styles.bidAmount}>{item.amount}</Text>
        <View style={styles.bidTag}>
          <Text style={styles.bidTagLabel}>{item.tag}</Text>
        </View>
      </View>
    </View>
  );
}

function CommentBlock({ item, nested }) {
  return (
    <View style={[styles.comment, nested && styles.commentNested]}>
      <View style={styles.commentHead}>
        <Avatar initials={item.initials} size={nested ? 22 : 24} />
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {item.verified ? (
          <FontAwesome6 name="circle-check" size={14} color={color.background.brandPrimaryRegular} iconStyle="solid" />
        ) : null}
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.commentBody}>{item.text}</Text>
      <Pressable style={styles.reply} accessibilityRole="button" accessibilityLabel="Reply">
        <FontAwesome6 name="reply" size={13} color={color.text.neutralRegular} iconStyle="solid" />
        <Text style={styles.replyLabel}>Reply</Text>
      </Pressable>
      {item.replies?.map((r) => (
        <CommentBlock key={r.id} item={r} nested />
      ))}
    </View>
  );
}

export default function AuctionActivitySheet({ visible, onClose, activity, primaryAction = 'Place a bid', initialTab = 0 }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(TABS[initialTab]?.key ?? 'recent');
  const feed = activity?.feed ?? [];

  const counts = {
    recent: feed.length,
    bids: feed.filter((i) => i.type === 'bid').length,
    comments: feed.filter((i) => i.type === 'comment').length,
  };

  const items =
    tab === 'bids'
      ? feed.filter((i) => i.type === 'bid')
      : tab === 'comments'
      ? feed.filter((i) => i.type === 'comment')
      : feed;

  return (
    <BottomSheet visible={visible} onClose={onClose} topInset={40} fill>
      <View style={styles.sheet}>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TabButton key={t.key} tab={t} count={counts[t.key]} active={tab === t.key} onPress={() => setTab(t.key)} />
          ))}
        </View>

        <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
          {items.map((item) =>
            item.type === 'bid' ? <BidCard key={item.id} item={item} /> : <CommentBlock key={item.id} item={item} />
          )}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: (insets.bottom || 0) + spacing[8] }]}>
          <Pressable style={styles.cta} accessibilityRole="button" accessibilityLabel={primaryAction}>
            <Text style={styles.ctaLabel}>{primaryAction}</Text>
          </Pressable>
          <Pressable style={styles.commentBtn} accessibilityRole="button" accessibilityLabel="Add a comment">
            <FontAwesome6 name="comment" size={20} color={color.text.labelPrimary} iconStyle="regular" />
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, alignSelf: 'stretch' },
  tabs: {
    flexDirection: 'row',
    gap: spacing[5],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: color.border.neutralSubtle,
  },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: spacing[3] },
  tabLabel: { ...font.calloutEmphasized, color: color.text.neutralRegular },
  tabLabelActive: { color: LABEL_PRIMARY },
  tabBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background.neutralRegular,
  },
  tabBadgeActive: { backgroundColor: color.background.inverseBold },
  tabBadgeLabel: { ...font.caption2Emphasized, color: color.text.inverseBold },
  tabUnderline: { position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, borderRadius: 2, backgroundColor: color.background.inverseBold },
  feed: { flex: 1 },
  feedContent: { paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[4] },
  bidCard: { backgroundColor: BID_TINT, borderRadius: radius.lg, padding: spacing[3], gap: 6 },
  bidTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bidBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bidAmount: { ...font.calloutEmphasized, color: LABEL_PRIMARY },
  bidTag: { backgroundColor: color.background.brandPrimaryRegular, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  bidTagLabel: { ...font.caption2Emphasized, color: color.text.inverseBold },
  comment: { gap: 4 },
  commentNested: { marginLeft: spacing[6], paddingLeft: spacing[3], borderLeftWidth: 1, borderLeftColor: color.border.neutralSubtle },
  commentHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { ...font.footnoteEmphasized, color: LABEL_PRIMARY, flexShrink: 1 },
  time: { ...font.footnoteRegular, color: LABEL_SECONDARY },
  commentBody: { ...font.subheadlineRegular, color: LABEL_PRIMARY },
  reply: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2 },
  replyLabel: { ...font.footnoteRegular, color: color.text.neutralRegular },
  avatar: { backgroundColor: color.text.brandPrimaryBold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...font.caption2Emphasized, color: color.text.inverseBold },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingHorizontal: spacing[4], paddingTop: spacing[3] },
  cta: { flex: 1, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: color.background.brandPrimaryRegular },
  ctaLabel: { ...font.calloutEmphasized, color: color.text.inverseBold },
  commentBtn: { width: 52, height: 52, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: color.background.neutralSubtle },
});
