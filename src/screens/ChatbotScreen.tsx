import React, { useRef, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Animated, ActivityIndicator, Pressable } from 'react-native';
import { Text, TextInput, Button, useTheme, Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente de botão animado reutilizável
function AnimatedButton({ onPress, children, style, disabled }: any) {
  const [hovered, setHovered] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
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

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
}

async function fetchAIResponse(message: string): Promise<string> {
  try {
    const apiKey = await AsyncStorage.getItem('huggingface_api_key');
    if (!apiKey) {
      return 'É necessário configurar sua HuggingFace API Key nas Configurações para usar o chatbot.';
    }
    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputs: message }),
    });
    if (response.status === 401) {
      return 'Sua API Key está incorreta ou não tem acesso. Atualize nas Configurações.';
    }
    if (response.status === 404) {
      return 'O modelo de IA está temporariamente indisponível. Tente novamente mais tarde.';
    }
    const data = await response.json();
    if (data.generated_text) {
      return data.generated_text;
    }
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    return 'Não foi possível obter resposta do chatbot.';
  } catch (e) {
    return 'Erro ao conectar ao chatbot. Verifique sua conexão e tente novamente.';
  }
}

export default function ChatbotScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Sou seu assistente médico virtual. Como posso ajudar?', fromUser: false },
  ]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const anim = useRef(new Animated.Value(0)).current;

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: colors.background }}>
        <Text variant="titleLarge">Função indisponível no navegador</Text>
        <Text>O chatbot médico só funciona no app mobile (Android/iOS) devido a restrições de segurança da API.</Text>
      </View>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, fromUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start();
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    // Chama IA
    const aiText = await fetchAIResponse(userMsg.text);
    const aiMsg: Message = { id: Date.now().toString() + '-ai', text: aiText, fromUser: false };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
    // Leitura por voz (opcional)
    Speech.speak(aiText, { language: 'pt-BR' });
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.primary }] }>
        <IconButton icon="close" size={24} onPress={() => navigation.goBack()} style={{ marginLeft: 0 }} />
        <Text style={styles.headerTitle}>Chat Médico</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <Animated.View style={{
            opacity: item.fromUser ? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] }) : 1,
            transform: [{ scale: item.fromUser ? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) : 1 }],
          }}>
            <Card style={[styles.messageCard, item.fromUser ? styles.userMsg : styles.botMsg, { backgroundColor: item.fromUser ? colors.primary : colors.surface, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6 }] }>
              <Text style={{ color: item.fromUser ? '#fff' : colors.onSurface }}>{item.text}</Text>
            </Card>
          </Animated.View>
        )}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 8 }} /> : null}
      />
      <View style={[styles.inputBar, { backgroundColor: colors.elevation.level2 }] }>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Digite sua mensagem..."
          style={styles.input}
          mode="outlined"
          outlineColor={colors.primary}
          activeOutlineColor={colors.primary}
          placeholderTextColor={colors.onSurface}
          editable={!loading}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <IconButton
          icon="send"
          size={28}
          onPress={handleSend}
          disabled={loading || !input.trim()}
          style={{ marginLeft: 0, marginRight: 2, backgroundColor: loading || !input.trim() ? colors.surface : colors.primary, borderRadius: 22 }}
          iconColor={loading || !input.trim() ? colors.onSurface : '#fff'}
          animated
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  messageCard: {
    marginBottom: 12,
    maxWidth: '85%',
    borderRadius: 16,
    elevation: 2,
    padding: 10,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#1976d2',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 8,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    fontSize: 16,
  },
  sendBtn: {
    borderRadius: 12,
    elevation: 2,
    minWidth: 80,
    overflow: 'hidden',
  },
  sendBtnInner: {
    borderRadius: 12,
    minHeight: 44,
    backgroundColor: '#1976d2',
  },
}); 