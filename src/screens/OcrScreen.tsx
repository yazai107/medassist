import React from 'react';
import { View, Platform } from 'react-native';
import { Text } from 'react-native-paper';

export default function OcrScreen(props: any) {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text variant="titleLarge">Função indisponível no navegador</Text>
        <Text>O reconhecimento por foto só funciona em dispositivos Android/iOS.</Text>
      </View>
    );
  }
  // Importa dinamicamente o componente nativo para evitar crash no web
  const NativeOcrScreen = require('./OcrScreen.native').default;
  return <NativeOcrScreen {...props} />;
} 