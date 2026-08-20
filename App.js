/**
 * On web the page is letterboxed to the 393pt Figma artboard so it reads as a
 * phone rather than stretching across the browser; on device it fills the
 * screen as normal.
 */

import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuctionScreen from './screens/AuctionScreen';
import { color, layout } from './theme/tokens';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.backdrop}>
        <View style={styles.frame}>
          <AuctionScreen />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'web' ? color.background.pageBackdrop : undefined,
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? layout.frameWidth : undefined,
    backgroundColor: color.background.neutralWhite,
  },
});
