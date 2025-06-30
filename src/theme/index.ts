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
  },
}; 