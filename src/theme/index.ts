import { MD3LightTheme as LightTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const CustomLightTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: '#1976d2',
    secondary: '#43a047',
    background: '#f5f5f5',
    surface: '#fff',
    text: '#222',
    onBackground: '#222',
    onSurface: '#222',
    onPrimary: '#fff',
    inputBackground: '#fff', // for TextInput
    inputText: '#222', // for TextInput
    outline: '#1976d2',
    elevation: {
      level0: '#fff',
      level1: '#f5f5f5',
      level2: '#f0f0f0',
      level3: '#e0e0e0',
      level4: '#d0d0d0',
      level5: '#c0c0c0',
    },
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#90caf9',
    secondary: '#66bb6a',
    background: '#181a20',
    surface: '#23262f',
    text: '#fff',
    onBackground: '#fff',
    onSurface: '#fff',
    onPrimary: '#23262f',
    inputBackground: '#23262f', // for TextInput
    inputText: '#fff', // for TextInput
    outline: '#90caf9',
    elevation: {
      level0: '#181a20',
      level1: '#23262f',
      level2: '#23262f',
      level3: '#23262f',
      level4: '#23262f',
      level5: '#23262f',
    },
  },
}; 