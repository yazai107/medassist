import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function ChatIcon({ size = 32, color = '#1976d2' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20v-2.586A2 2 0 0 1 4.586 16L5 15.586A2 2 0 0 1 6.586 15H20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h0z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <Path d="M8 10h8M8 14h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
} 