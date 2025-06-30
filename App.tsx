import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function Main() {
  const { isDark, theme } = useThemeContext();
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}
