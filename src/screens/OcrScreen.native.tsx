import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Camera } from 'expo-camera';
// import * as MLKitOcr from 'expo-mlkit-ocr';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';

// function AnimatedButton({ onPress, children, style, disabled }: any) { ... }

export default function OcrScreen() {
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // const [cameraRef, setCameraRef] = useState<any>(null);
  // const [ocrText, setOcrText] = useState('');
  // const [name, setName] = useState('');
  // const [time, setTime] = useState('');
  const navigation = useNavigation();
  const { colors } = useTheme();
  React.useEffect(() => {
    AsyncStorage.getItem('test-key');
  }, []);

  // Minimal Camera render for crash test
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Função de OCR e câmera desativada para teste</Text>
      <Text>Todos os módulos nativos estão comentados para rodar no Expo Go/Web.</Text>
      <View style={{ width: 200, height: 120, marginTop: 24, borderRadius: 12, overflow: 'hidden' }}>
        {/* @ts-ignore */}
        <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
}); 