/**
 * Full live-auction activity sheet, opened from the widget. Three tabs — Recent
 * (interleaved), Bid history (bids only) and Comment (comments only) — over a
 * sticky "Place a bid" action.
 */

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '../BottomSheet';
import SendButton from '../SendButton';
import { countBids, countComments } from './activityCounts';
import { Icon } from '../Icon';
import { color, font, radius, spacing } from '../../theme/tokens';

const LABEL_PRIMARY = '#333';
/** One avatar size for every comment, parent or reply, so the column aligns. */
const AVATAR = 24;
const VERIFIED = '#34a14f';
const LABEL_SECONDARY = 'rgba(60,60,67,0.6)';
// 2:6742 sets the bid card on the neutral subtle fill, not a brand tint — the
// green belongs to the Bid tag alone.
const BID_TINT = color.background.neutralSubtle;

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
        <Text style={[styles.tabBadgeLabel, active && styles.tabBadgeLabelActive]}>{count}</Text>
      </View>
      {active ? <View style={styles.tabUnderline} /> : null}
    </Pressable>
  );
}

/**
 * One bid, on a single line — Figma 2:6742. Bidder and tag hug the left, the
 * amount takes the middle and the time sits right, so a column of them lines
 * the amounts up against each other.
 */
function isPreBid(tag) {
  return /pre/i.test(tag ?? '');
}

function BidRow({ item }) {
  const pre = isPreBid(item.tag);
  return (
    <View style={styles.bidRow}>
      <Avatar initials={item.initials} />
      <Text style={styles.bidName} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={[styles.bidTag, pre && styles.bidTagPre]}>
        <Text style={[styles.bidTagLabel, pre && styles.bidTagLabelPre]}>{item.tag}</Text>
      </View>
      <Text style={styles.bidAmount}>{item.amount}</Text>
      <Text style={styles.bidTime}>{item.time}</Text>
    </View>
  );
}

/**
 * A bid as the Recent tab shows it — Figma 2:6799. Two lines on a brand tint:
 * bidder, verification and time above; amount and tag below. Bid history keeps
 * the denser single-line rows, since a column of them is read by comparing
 * amounts rather than by scanning events.
 */
function RecentBid({ item }) {
  const pre = isPreBid(item.tag);
  return (
    <View style={styles.recentBid}>
      {/* Avatar beside a content column, the same shape as a comment, so the
          amount lines up under the name rather than under the avatar. */}
      <Avatar initials={item.initials} size={AVATAR} />
      <View style={styles.recentBidContent}>
        <View style={styles.recentBidTop}>
          <Text style={styles.bidName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.verified ? <Icon name="Verified" size={14} color={VERIFIED} /> : null}
          <Text style={styles.bidTime}>{item.time}</Text>
        </View>
        <View style={styles.recentBidBottom}>
          <Text style={styles.recentBidAmount}>{item.amount}</Text>
          <View style={[styles.bidTag, pre && styles.bidTagPre]}>
            <Text style={[styles.bidTagLabel, pre && styles.bidTagLabelPre]}>{item.tag}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** The rows share one card, divided by hairlines rather than gaps. */
function BidHistory({ items }) {
  return (
    <View style={styles.bidCard}>
      {items.map((item, i) => (
        <View key={item.id}>
          {i > 0 ? <View style={styles.bidDivider} /> : null}
          <BidRow item={item} />
        </View>
      ))}
    </View>
  );
}

/**
 * A comment and its thread. Avatar and content sit side by side so the body and
 * the Reply link line up under the name rather than under the avatar — the
 * whole block reads as one column hanging off the name.
 *
 * Replies nest inside that column and carry an elbow from the parent's avatar
 * across to their own, so a thread stays legible without indenting far enough
 * to squeeze the text.
 */
function CommentBlock({ item, nested, onReply }) {
  return (
    <View style={styles.commentRow}>
      {nested ? <View style={styles.threadElbow} /> : null}
      <Avatar initials={item.initials} size={AVATAR} />
      <View style={styles.commentContent}>
        <View style={styles.commentHead}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.verified ? <Icon name="Verified" size={14} color={VERIFIED} /> : null}
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.commentBody}>{item.text}</Text>
        <Pressable
          style={styles.reply}
          accessibilityRole="button"
          accessibilityLabel={`Reply to ${item.name}`}
          onPress={() => onReply?.(item)}
        >
          <Icon name="Reply" size={18} color={color.text.neutralRegular} />
          <Text style={styles.replyLabel}>Reply</Text>
        </Pressable>
        {item.replies?.map((r) => (
          <View key={r.id} style={styles.replyBlock}>
            <CommentBlock item={r} nested onReply={onReply} />
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Comment composer — Figma 387:3138. Avatar, a rounded field and the paperclip;
 * the send button only appears once there is something to send, so the resting
 * state stays the quiet placeholder the comp shows.
 */
function CommentComposer({ value, onChange, onSend, autoFocus, onFocus, label = 'Add a comment' }) {
  return (
    <View style={styles.composer}>
      <Avatar initials="IT" size={34} />
      <View style={styles.field}>
        <View style={styles.fieldText}>
          {value ? <Text style={styles.fieldLabel}>{label}</Text> : null}
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onFocus={onFocus}
            autoFocus={autoFocus}
            placeholder="Add a comment"
            placeholderTextColor={color.text.neutralRegular}
            accessibilityLabel="Add a comment"
            returnKeyType="send"
            onSubmitEditing={onSend}
            multiline={false}
          />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Attach a photo" style={styles.attach}>
          <Icon name="Attach" size={24} color={color.text.labelPrimary} />
        </Pressable>
        {value.trim() ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send comment"
            onPress={onSend}
            style={styles.send}
          >
            <SendButton size={30} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function AuctionActivitySheet({ visible, onClose, activity, primaryAction = 'Place a bid', initialTab = 0 }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(TABS[initialTab]?.key ?? 'recent');
  // Each open honours the widget page it was tapped from, so swiping the widget
  // to Bid history / Comment and tapping lands on that tab — even on reopen.
  useEffect(() => {
    if (visible) setTab(TABS[initialTab]?.key ?? 'recent');
  }, [visible, initialTab]);
  // The feed is held locally so a comment or reply posted here appears in the
  // thread and in the counts, rather than the composer clearing to nothing.
  const [feed, setFeed] = useState(activity?.feed ?? []);
  useEffect(() => {
    setFeed(activity?.feed ?? []);
  }, [activity]);
  // The composer takes over the footer while a comment is being written; the
  // Comment tab shows it at rest too.
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');
  // Which comment the draft is answering, if any.
  const [replyTarget, setReplyTarget] = useState(null);

  /** Appends `reply` under the comment with `id`, at whatever depth it sits. */
  const addReply = (items, id, reply) =>
    items.map((item) => {
      if (item.id === id) return { ...item, replies: [...(item.replies ?? []), reply] };
      if (item.replies?.length) {
        return { ...item, replies: addReply(item.replies, id, reply) };
      }
      return item;
    });

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const posted = {
      id: `local-${feed.length}-${text.length}-${replyTarget?.id ?? 'root'}`,
      type: 'comment',
      initials: 'IT',
      name: 'You',
      time: 'Just now',
      verified: false,
      text,
    };
    setFeed((prev) =>
      replyTarget ? addReply(prev, replyTarget.id, posted) : [posted, ...prev]
    );
    setDraft('');
    setReplyTarget(null);
    setComposing(false);
  };

  // Replying opens the composer focused and remembers who is being answered,
  // so sending files it under that comment rather than as a new thread.
  const replyTo = (item) => {
    setReplyTarget(item);
    setDraft((prev) => (prev ? prev : `@${item.name} `));
    setComposing(true);
  };
  useEffect(() => {
    if (!visible) {
      setComposing(false);
      setDraft('');
      setReplyTarget(null);
    }
  }, [visible]);
  // Changing tab leaves the composer, so Recent and Bid history go back to
  // their own footers. The draft survives — it is only out of sight, and
  // reopening the composer picks it back up rather than losing what was typed.
  useEffect(() => {
    setComposing(false);
  }, [tab]);

  const counts = {
    recent: feed.length,
    bids: countBids(feed),
    comments: countComments(feed),
  };

  const items =
    tab === 'bids'
      ? feed.filter((i) => i.type === 'bid')
      : tab === 'comments'
      ? feed.filter((i) => i.type === 'comment')
      : feed;

  return (
    <BottomSheet visible={visible} onClose={onClose} topInset={40} fill bottomInset={0}>
      <View style={styles.sheet}>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TabButton key={t.key} tab={t} count={counts[t.key]} active={tab === t.key} onPress={() => setTab(t.key)} />
          ))}
        </View>

        <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
          {tab === 'bids' ? (
            <BidHistory items={items} />
          ) : (
            items.map((item) =>
              item.type === 'bid' ? (
                <RecentBid key={item.id} item={item} />
              ) : (
                <CommentBlock key={item.id} item={item} onReply={replyTo} />
              )
            )
          )}
        </ScrollView>

        <View
          style={[
            styles.footer,
            // The comp sets the composer on a subtle bar so the white field
            // reads as a field rather than as more sheet.
            (composing || tab === 'comments') && styles.footerComposing,
            { paddingBottom: (insets.bottom || 0) + spacing[8] },
          ]}
        >
          {composing || tab === 'comments' ? (
            <CommentComposer
              value={draft}
              onChange={setDraft}
              onSend={send}
              autoFocus={composing}
              onFocus={() => setComposing(true)}
              label={replyTarget ? `Replying to ${replyTarget.name}` : 'Add a comment'}
            />
          ) : (
            <>
              <Pressable style={styles.cta} accessibilityRole="button" accessibilityLabel={primaryAction}>
                <Text style={styles.ctaLabel}>{primaryAction}</Text>
              </Pressable>
              {/* Bid history is about bidding alone, so it keeps the one action. */}
              {tab === 'recent' ? (
                <Pressable
                  style={styles.commentBtn}
                  accessibilityRole="button"
                    accessibilityLabel="Add a comment"
                  onPress={() => setComposing(true)}
                >
                  <Icon name="Comment" size={32} color={color.text.labelPrimary} />
                </Pressable>
              ) : null}
            </>
          )}
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
  tabLabel: { ...font.calloutEmphasized, color: color.text.tabInactive },
  tabLabelActive: { color: color.text.tabActive },
  tabBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background.neutralMuted,
  },
  tabBadgeLabel: { ...font.footnoteEmphasized, color: LABEL_PRIMARY },
  // The selected tab's badge inverts onto the active colour.
  tabBadgeActive: { backgroundColor: color.background.tabActive },
  tabBadgeLabelActive: { color: color.text.inverseBold },
  tabUnderline: { position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, borderRadius: 2, backgroundColor: color.background.tabActive },
  feed: { flex: 1 },
  feedContent: { paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[4] },
  bidCard: {
    backgroundColor: BID_TINT,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[3],
  },
  bidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
  },
  // Inset from the card's padding, as the comp draws it.
  bidDivider: {
    height: 1,
    backgroundColor: color.background.neutralMuted,
  },
  bidName: { ...font.footnoteEmphasized, color: LABEL_PRIMARY, flexShrink: 1 },
  recentBid: {
    flexDirection: 'row',
    gap: spacing[2],
    backgroundColor: color.background.brandPrimarySubtle,
    borderRadius: radius.lg,
    padding: spacing[3],
  },
  recentBidContent: { flex: 1, gap: spacing[1] },
  recentBidTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recentBidBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  recentBidAmount: { ...font.calloutEmphasized, color: LABEL_PRIMARY },
  // The amount takes the slack so a column of rows aligns on it.
  bidAmount: { ...font.calloutEmphasized, color: LABEL_PRIMARY, flex: 1, textAlign: 'right' },
  bidTime: { ...font.bodyXsRegular, color: color.text.neutralRegular, minWidth: 52, textAlign: 'right' },
  bidTag: { backgroundColor: color.background.successBold, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  bidTagLabel: { ...font.caption2Emphasized, color: color.text.inverseBold },
  bidTagPre: { backgroundColor: color.background.gray4 },
  bidTagLabelPre: { color: LABEL_PRIMARY },
  commentRow: { flexDirection: 'row', gap: spacing[2] },
  commentContent: { flex: 1, gap: spacing[1] },
  commentHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { ...font.footnoteEmphasized, color: LABEL_PRIMARY, flexShrink: 1 },
  time: { ...font.footnoteRegular, color: LABEL_SECONDARY },
  commentBody: { ...font.footnoteRegular, color: LABEL_PRIMARY },
  reply: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2 },
  replyLabel: { ...font.footnoteEmphasized, color: color.text.neutralRegular },
  replyBlock: { marginTop: spacing[3] },
  // The elbow runs down from the parent's avatar and turns in under the
  // reply's, which is what makes the nesting readable at this indent.
  threadElbow: {
    position: 'absolute',
    // Sits in the parent avatar's column, dropping from above the reply and
    // turning in under its avatar.
    left: -(AVATAR / 2 + spacing[2]),
    top: -spacing[5],
    width: AVATAR / 2 + spacing[2],
    height: spacing[5] + AVATAR / 2,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: color.border.neutralRegular,
    borderBottomLeftRadius: spacing[3],
  },
  avatar: { backgroundColor: color.text.brandPrimaryBold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...font.caption2Emphasized, color: color.text.inverseBold },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingHorizontal: spacing[4], paddingTop: spacing[3] },
  cta: { flex: 1, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: color.background.brandPrimaryRegular },
  ctaLabel: { ...font.calloutEmphasized, color: color.text.inverseBold },
  // Figma 2:7052: a 48 square holding the 32pt icon on an 8pt inset.
  commentBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background.neutralSubtle,
  },
  footerComposing: { backgroundColor: color.background.neutralSubtle },
  composer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  field: {
    flex: 1,
    // Grows a little to seat the send button without cramping it.
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing[4],
    paddingRight: spacing[1.5],
    paddingVertical: spacing[1],
    // 12, not a full pill: the field grows to two lines while typing and a
    // pill corner reads as a lozenge at that height.
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralWhite,
  },
  fieldText: { flex: 1, justifyContent: 'center' },
  fieldLabel: { ...font.caption1Regular, color: color.text.neutralRegular },
  input: {
    flex: 1,
    ...font.subheadlineRegular,
    color: LABEL_PRIMARY,
    // Strips the focus ring react-native-web puts on a web input.
    outlineStyle: 'none',
  },
  attach: { paddingHorizontal: spacing[2] },
  send: { marginLeft: spacing[1] },
});
