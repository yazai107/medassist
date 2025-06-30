import React from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ThemeSlider() {
  const { isDark, toggleTheme } = useThemeContext();
  return (
    <Pressable onPress={toggleTheme} style={[styles.slider, isDark && styles.sliderDark]} accessibilityRole="button">
      <Animated.View style={[styles.thumb, isDark && styles.thumbDark, { left: isDark ? 32 : 2 }]}/>
      <MaterialCommunityIcons name={isDark ? 'weather-night' : 'white-balance-sunny'} size={20} color={isDark ? '#fff' : '#222'} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 16,
  },
  sliderDark: {
    backgroundColor: '#23262f',
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    top: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbDark: {
    backgroundColor: '#181a20',
  },
  icon: {
    position: 'absolute',
    right: 8,
    top: 6,
  },
}); 