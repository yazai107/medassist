import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Pressable, ScrollView } from 'react-native';
import { Text, useTheme, TextInput, Button, Snackbar } from 'react-native-paper';
import ThemeSlider from '../components/ThemeSlider';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('huggingface_api_key').then(key => {
      if (key) {
        setApiKey(key);
        setSavedKey(key);
      }
    });
  }, []);

  const handleSaveKey = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('huggingface_api_key', apiKey.trim());
      setSavedKey(apiKey.trim());
      setSnackbarMessage('API Key salva com sucesso!');
      setSnackbarError(false);
      setSnackbarVisible(true);
    } catch {
      setSnackbarMessage('Não foi possível salvar a API Key.');
      setSnackbarError(true);
      setSnackbarVisible(true);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.card}>
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
          <Text variant="titleLarge" style={{ marginBottom: 16, textAlign: 'center' }}>Configurações</Text>
          <AnimatedButton>
            <ThemeSlider />
          </AnimatedButton>
          <Text style={{ marginTop: 32, color: colors.onSurface, textAlign: 'center' }}>MedAssist v1.0</Text>
          <Text style={{ color: colors.onSurface, textAlign: 'center', marginBottom: 16 }}>Desenvolvido por Gabriel Minervini</Text>
          <View style={styles.apiKeySection}>
            <Text style={{ color: colors.primary, fontWeight: 'bold', marginBottom: 4, marginTop: 8, textAlign: 'center' }}>HuggingFace API Key</Text>
            <TextInput
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Cole sua HuggingFace API Key aqui"
              secureTextEntry
              style={{ marginBottom: 8, backgroundColor: (colors as any).inputBackground, minWidth: 220, maxWidth: 280, height: 44, alignSelf: 'center', color: (colors as any).inputText }}
              mode="outlined"
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
              placeholderTextColor={colors.onSurface + '99'}
              theme={{ colors: { background: (colors as any).inputBackground, text: (colors as any).inputText, primary: colors.primary, placeholder: colors.onSurface + '99' } }}
            />
            <Button mode="contained" onPress={handleSaveKey} loading={loading} disabled={loading || !apiKey.trim() || apiKey.trim() === savedKey} style={{ alignSelf: 'center', marginBottom: 4 }}>
              Salvar API Key
            </Button>
            <Text style={{ color: colors.onSurface, fontSize: 12, marginTop: 4, textAlign: 'center', marginBottom: 0 }}>
              Sua chave é salva apenas localmente e usada para acessar a IA do diagnóstico e do chatbot.
            </Text>
          </View>
        </ScrollView>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2500}
          style={{ backgroundColor: snackbarError ? colors.error : colors.primary, borderRadius: 12, marginBottom: 16 }}
          action={snackbarError ? { label: 'OK', onPress: () => setSnackbarVisible(false) } : undefined}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>{snackbarMessage}</Text>
        </Snackbar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 24,
    elevation: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    alignItems: 'center',
    maxHeight: 540,
  },
  apiKeySection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
}); 