/**
 * Eased wheel scrolling for the web build.
 *
 * ScrollSmoother is deliberately not used here: it drives the *document*
 * scroll through a #smooth-wrapper / #smooth-content pair, and this page
 * scrolls inside a react-native-web ScrollView — a nested element with
 * `overflow-y: auto`. Handing the document to ScrollSmoother would mean
 * rebuilding the app shell and forking every scroll-driven behaviour (sticky
 * header, sticky bar, tab anchors) between web and native.
 *
 * ScrollToPlugin animates any element's scrollTop, so the same eased feel
 * lands on the existing container instead. Because it moves the real
 * scrollTop, ordinary scroll events still fire and every existing listener
 * keeps working untouched.
 *
 * Only wheel input is intercepted. Touch and trackpad-on-mobile already carry
 * the platform's own inertia, and taking those over makes scrolling feel worse,
 * not better.
 */

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const DURATION = 0.7;
const EASE = 'power3.out';

/** True when `el` can still absorb `delta` in its own scroll axis. */
function absorbs(el, delta) {
  if (!el || el.nodeType !== 1) return false;
  const style = window.getComputedStyle(el);
  const scrollable = /(auto|scroll)/.test(style.overflowY + style.overflow);
  if (!scrollable || el.scrollHeight <= el.clientHeight + 1) return false;
  const max = el.scrollHeight - el.clientHeight;
  return delta > 0 ? el.scrollTop < max - 1 : el.scrollTop > 1;
}

export function useSmoothScroll(scrollRef, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return undefined;

    const node =
      scrollRef?.current?.getScrollableNode?.() ?? scrollRef?.current?.getScrollableNode ?? null;
    if (!node || typeof node.addEventListener !== 'function') return undefined;

    // Tracks where the scroll is heading rather than where it is, so a second
    // wheel tick during the ease adds to the destination instead of restarting
    // from the current position — that is what makes it feel like momentum.
    let target = node.scrollTop;
    let animating = false;

    const onWheel = (e) => {
      // A sheet, or one of the horizontal photo rows, gets first refusal.
      for (let el = e.target; el && el !== node; el = el.parentElement) {
        if (absorbs(el, e.deltaY)) return;
      }
      // Pinch-zoom and horizontal swipes are not ours to smooth.
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const max = node.scrollHeight - node.clientHeight;
      if (max <= 0) return;

      if (!animating) target = node.scrollTop;
      const next = Math.max(0, Math.min(target + e.deltaY, max));
      // Let the browser handle it once we are pinned at either end, so the
      // page does not swallow overscroll gestures.
      if (next === target && (next === 0 || next === max)) return;

      e.preventDefault();
      target = next;
      animating = true;
      gsap.to(node, {
        duration: DURATION,
        ease: EASE,
        overwrite: true,
        scrollTo: { y: target, autoKill: false },
        onComplete: () => {
          animating = false;
        },
      });
    };

    // Non-passive so preventDefault is honoured.
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', onWheel);
      gsap.killTweensOf(node);
    };
  }, [scrollRef, enabled]);
}
