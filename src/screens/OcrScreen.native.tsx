import React, { useState } from 'react';
import { View, StyleSheet, Alert, Animated, Pressable } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import { Camera, CameraType } from 'expo-camera';
import * as MLKitOcr from 'expo-mlkit-ocr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';

function AnimatedButton({ onPress, children, style, disabled }: any) {
  const [hovered, setHovered] = React.useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: hovered ? 1.06 : 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [hovered]);
  return (
    <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
      {React.cloneElement(children, {
        onPress,
        disabled,
        style: [children.props.style, style, { width: '100%' }],
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      })}
    </Animated.View>
  );
}

export default function OcrScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [ocrText, setOcrText] = useState('');
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const navigation = useNavigation();
  const { colors } = useTheme();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      const result = await MLKitOcr.detectFromUri(photo.uri);
      const text = result.map((block: any) => block.text).join(' ');
      setOcrText(text);
      setName(text.split(' ')[0] || '');
    }
  };

  const handleSave = async () => {
    if (!name || !time) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    const newMed = { id: uuidv4(), name, time };
    const meds = await AsyncStorage.getItem('medications');
    const medsArr = meds ? JSON.parse(meds) : [];
    medsArr.push(newMed);
    await AsyncStorage.setItem('medications', JSON.stringify(medsArr));
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <View><Text>Solicitando permissão da câmera...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>Permissão da câmera negada.</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.card}>
        <Text variant="titleLarge" style={{ color: colors.onBackground, marginBottom: 8 }}>Adicionar Remédio por Foto</Text>
        <Camera
          style={styles.camera}
          type={CameraType.back}
          ref={ref => setCameraRef(ref)}
          ratio="16:9"
        />
        <AnimatedButton onPress={handleCapture} style={{ marginVertical: 8 }}>
          <Button mode="contained">Capturar e Ler Embalagem</Button>
        </AnimatedButton>
        <TextInput
          label="Nome do Remédio"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 8 }}
        />
        <TextInput
          label="Horário (HH:mm)"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
          style={{ marginBottom: 8 }}
        />
        <AnimatedButton onPress={handleSave}>
          <Button mode="contained">Salvar</Button>
        </AnimatedButton>
        {ocrText ? <Text style={{ marginTop: 8, color: colors.onBackground }}>Texto detectado: {ocrText}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 24,
    elevation: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
}); 