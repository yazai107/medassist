import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Button, Text, useTheme, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ChatIcon from '../components/ChatIcon';
import { Pressable } from 'react-native';

// Componente de botão animado reutilizável
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

// Botão flutuante de chat com animação clean e hover
function FloatingChatButton({ onPress }: { onPress: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: hovered ? 1.12 : 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 7,
    }).start();
  }, [hovered]);
  return (
    <Pressable
      style={styles.fabChat}
      onPress={onPress}
      accessibilityRole="button"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => Animated.spring(scale, { toValue: 1.18, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <ChatIcon size={28} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

type Nav = StackNavigationProp<any>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>MedAssist</Text>
      <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="elevated">
        <AnimatedButton onPress={() => navigation.navigate('Medicamentos')} style={styles.button}>
          <Button mode="contained" style={styles.buttonInner} labelStyle={[styles.buttonLabel, { color: colors.onPrimary }] }>
            Meus Remédios
          </Button>
        </AnimatedButton>
        <AnimatedButton onPress={() => navigation.navigate('Adicionar por Foto')} style={styles.button}>
          <Button mode="contained" style={styles.buttonInner} labelStyle={[styles.buttonLabel, { color: colors.onPrimary }] }>
            Adicionar Remédio por Foto
          </Button>
        </AnimatedButton>
        <AnimatedButton onPress={() => navigation.navigate('Autoavaliação')} style={styles.button}>
          <Button mode="contained" style={styles.buttonInner} labelStyle={[styles.buttonLabel, { color: colors.onPrimary }] }>
            Autoavaliação de Sintomas
          </Button>
        </AnimatedButton>
        <AnimatedButton onPress={() => navigation.navigate('Histórico de Sintomas')} style={styles.button}>
          <Button mode="contained" style={styles.buttonInner} labelStyle={[styles.buttonLabel, { color: colors.onPrimary }] }>
            Histórico de Sintomas
          </Button>
        </AnimatedButton>
      </Card>
      <FloatingChatButton onPress={() => navigation.navigate('Chatbot')} />
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
  title: {
    marginBottom: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 26,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    padding: 20,
    borderRadius: 24,
    elevation: 4,
    marginBottom: 16,
    boxShadow: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  button: {
    marginVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonInner: {
    borderRadius: 14,
    elevation: 2,
    minHeight: 48,
    backgroundColor: '#1976d2',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  fabChat: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#1976d2',
    borderRadius: 32,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    boxShadow: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    transitionDuration: '200ms',
  },
}); 