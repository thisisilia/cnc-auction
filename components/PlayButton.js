/**
 * Play button, from the designer's Icons/Play Button.svg.
 *
 * Unlike the glyphs in Icon.js this is a complete control — it carries its own
 * 60%-black disc as well as the triangle — so callers place it and set a size
 * rather than supplying a background. Drawn on a 64pt grid and scaled from
 * there, which keeps the triangle's optical centring at every size.
 */

import Svg, { Path, Rect } from 'react-native-svg';

export default function PlayButton({
  size = 64,
  style,
  fill = 'black',
  fillOpacity = 0.6,
  glyph = 'white',
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
      <Rect width={64} height={64} rx={32} fill={fill} fillOpacity={fillOpacity} />
      <Path
        d="M26.1358 19.0867C25.2222 18.5451 24.0741 18.5272 23.142 19.0331C22.2099 19.539 21.6296 20.4912 21.6296 21.5267V42.4754C21.6296 43.5109 22.2099 44.4631 23.142 44.969C24.0741 45.4748 25.2222 45.451 26.1358 44.9154L43.9136 34.4411C44.7963 33.9233 45.3333 33.0009 45.3333 32.001C45.3333 31.0012 44.7963 30.0847 43.9136 29.561L26.1358 19.0867Z"
        fill={glyph}
      />
    </Svg>
  );
}
