import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export default function SettingsIcon({ size = 28, color = '#888' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M12 8a4 4 0 100 8 4 4 0 000-8zm0-6v2m0 16v2m8-10h2M2 12H4m15.07-7.07l-1.41 1.41M4.93 19.07l1.41-1.41m12.73 0l1.41 1.41M4.93 4.93L6.34 6.34" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
} 