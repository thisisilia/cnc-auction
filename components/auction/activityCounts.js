/**
 * The counts shown against the activity feed, in one place so the widget and
 * the sheet it opens can never disagree about them.
 *
 * A reply is a comment: it is written by someone, it appears in the thread, and
 * a reader counting what is on screen counts it. So the comment total walks the
 * nested replies rather than only the top-level entries.
 */

export function countComments(feed = []) {
  const walk = (items = []) =>
    items.reduce((total, item) => total + 1 + walk(item.replies), 0);
  return walk(feed.filter((item) => item.type === 'comment'));
}

/**
 * Recent shows the bids and the comments interleaved, replies included — so its
 * count is the two totals added, not the number of top-level feed rows. Counting
 * rows both hid the replies already on screen and left the tally unchanged when
 * a new reply was posted into a thread.
 */
export function countRecent(feed = []) {
  return countBids(feed) + countComments(feed);
}

export function countBids(feed = []) {
  return feed.filter((item) => item.type === 'bid').length;
}

export function countBidders(feed = []) {
  return new Set(feed.filter((item) => item.type === 'bid').map((item) => item.name)).size;
}
