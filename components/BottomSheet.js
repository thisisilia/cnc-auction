import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Keyboard,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { USE_NATIVE_DRIVER } from '../theme/animation';
import { color, spacing } from '../theme/tokens';

/** Sheets never grow taller than this, even on large screens. */
const MAX_SHEET_HEIGHT = 790;

/**
 * Scrim + slide-up container shared by every sheet in the app.
 *
 * Rendered as an absolute overlay inside the app frame rather than in a native
 * Modal: a Modal portals to the viewport root, which on web would escape the
 * letterboxed phone frame and stretch the scrim across the whole browser.
 *
 * Sizing: the sheet hugs its content. `topInset` caps it a fixed gap below the
 * top edge; `fill` additionally makes it *occupy* that full height, for steps
 * whose children need a bounded height to scroll within.
 *
 * Sheets sit at the bottom of the frame, exactly where a raised keyboard lands,
 * so the container tracks the keyboard and lifts clear of it — any sheet with a
 * text field gets this without opting in. KeyboardAvoidingView is no help here:
 * it measures against the window, and this sheet is an in-frame overlay.
 */
export default function BottomSheet({
  visible,
  onClose,
  children,
  maxHeightRatio = 0.9,
  topInset,
  fill = false,
  // Hide the grab handle when another sheet is stacked on top, so the two don't
  // read as competing handles (the iOS stacked-sheet look).
  hideGrabber = false,
  // Override the space below the content (defaults to the safe-area inset). Used
  // by tall sheets that need to claw back room on short screens.
  bottomInset,
}) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const [frameHeight, setFrameHeight] = useState(0);
  // Kept mounted for the duration of the close animation, then torn down so the
  // sheet is not left in the accessibility tree while invisible.
  const [mounted, setMounted] = useState(visible);

  // Guards the open animation so it runs exactly once per open — a re-measured
  // frame (e.g. keyboard) must not restart the slide (which would bounce it).
  const openedRef = useRef(false);

  useEffect(() => {
    if (visible) setMounted(true);
    else openedRef.current = false;
  }, [visible]);

  useEffect(() => {
    if (visible) {
      // Hold the slide-up until the frame is measured, so a `fill` sheet is
      // already at its final height before it moves — otherwise it resizes
      // mid-slide (a jump). Only ever start it once.
      if (openedRef.current || !frameHeight) return;
      openedRef.current = true;
      Animated.timing(progress, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, frameHeight, progress]);

  // Lift clear of the keyboard. The `will` events lead the animation on iOS;
  // Android only emits `did`. On web neither fires and the height stays 0.
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const subs = [
      Keyboard.addListener(show, (e) => setKeyboardHeight(e.endCoordinates?.height ?? 0)),
      Keyboard.addListener(hide, () => setKeyboardHeight(0)),
    ];
    return () => subs.forEach((sub) => sub.remove());
  }, []);

  // Android's hardware back should dismiss the sheet, not exit the app.
  useEffect(() => {
    if (!visible || Platform.OS !== 'android') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [900, 0] });

  // Drag the grabber down to dismiss. Without this the only way out of a tall
  // sheet is the sliver of scrim above it, which the grabber already implies
  // shouldn't be necessary.
  const drag = useRef(new Animated.Value(0)).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dy > 4 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) drag.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
          const dismiss = g.dy > 80 || g.vy > 0.5;
          if (dismiss) {
            onClose();
            drag.setValue(0);
          } else {
            Animated.spring(drag, { toValue: 0, useNativeDriver: USE_NATIVE_DRIVER, bounciness: 0 }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(drag, { toValue: 0, useNativeDriver: USE_NATIVE_DRIVER, bounciness: 0 }).start();
        },
      }),
    [drag, onClose]
  );

  if (!mounted) return null;

  // A cap lets short sheets hug their content. `fill` swaps it for a fixed
  // height, which is what lets flex children expand (and pins the step's action
  // button to the bottom). Either way the sheet never exceeds MAX_SHEET_HEIGHT.
  const available =
    frameHeight && topInset != null ? frameHeight - topInset - keyboardHeight : null;
  let sizing;
  if (available != null) {
    const height = Math.min(available, MAX_SHEET_HEIGHT);
    sizing = { [fill ? 'height' : 'maxHeight']: height };
  } else {
    const cap = frameHeight ? Math.min(frameHeight * maxHeightRatio, MAX_SHEET_HEIGHT) : null;
    sizing = { maxHeight: cap ?? `${maxHeightRatio * 100}%` };
  }

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.overlay]}
      pointerEvents={visible ? 'auto' : 'none'}
      onLayout={(e) => setFrameHeight(e.nativeEvent.layout.height)}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: progress }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          sizing,
          {
            marginBottom: keyboardHeight,
            // The home-indicator gap is the keyboard's problem once it is up.
            // Tighter bottom padding across all sheets so content doesn't get
            // cut off on short screens; still clears a little of the safe area.
            paddingBottom: keyboardHeight
              ? spacing[4]
              : bottomInset != null
                ? bottomInset
                : Math.min(insets.bottom || spacing[4], spacing[5]),
            transform: [{ translateY }, { translateY: drag }],
          },
        ]}
        accessibilityViewIsModal
      >
        {/* Padded hit area — a bare 4px grabber is too small to grab. */}
        <View style={styles.grabberHitArea} {...panResponder.panHandlers}>
          <View style={[styles.grabber, hideGrabber && styles.grabberHidden]} />
        </View>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Lift above sibling content: a sheet rendered inline (e.g. a date picker
  // inside the middle of a form) must still paint over the fields after it.
  overlay: {
    zIndex: 1000,
  },
  scrim: {
    backgroundColor: color.overlay.scrim,
  },
  sheet: {
    marginTop: 'auto',
    backgroundColor: color.background.neutralWhite,
    borderTopLeftRadius: spacing[8],
    borderTopRightRadius: spacing[8],
    paddingTop: spacing[4],
    alignItems: 'center',
  },
  // Negative margins cancel the padding, so the touch target grows without
  // moving anything. The extra 12px below only ever overlaps the following
  // section's own top padding, never a control.
  grabberHitArea: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: spacing[1],
    paddingBottom: spacing[3],
    marginTop: -spacing[1],
    marginBottom: -spacing[3],
  },
  grabber: {
    width: 70,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d9d9d9',
  },
  grabberHidden: {
    backgroundColor: 'transparent',
  },
});
