import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Animated } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SYMPTOMS } from './SymptomCheckScreen';

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

export default function SymptomHistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem('symptomHistory').then(data => {
      if (data) setHistory(JSON.parse(data));
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text variant="titleLarge" style={{ marginBottom: 16, color: colors.onBackground }}>Histórico de Sintomas</Text>
      <FlatList
        data={history}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <AnimatedButton style={styles.card}>
            <Card style={[styles.cardInner, { backgroundColor: colors.surface }]} mode="elevated">
              <Card.Title title={new Date(item.date).toLocaleString('pt-BR')} titleStyle={{ color: colors.onSurface, fontSize: 15, fontWeight: '600' }} />
              <Card.Content>
                <Text style={{ color: colors.onSurface, fontSize: 13, marginBottom: 2 }}>
                  Sintomas: {item.symptoms?.map((s: string) => {
                    const found = SYMPTOMS.find((sym: { key: string; label: string }) => sym.key === s);
                    return found ? found.label : s;
                  }).join(', ') || '-'}
                </Text>
                <Text style={{ color: colors.onSurface, fontSize: 13 }}>
                  Resultado: {item.result}
                </Text>
              </Card.Content>
            </Card>
          </AnimatedButton>
        )}
        ListEmptyComponent={<Text style={{ color: colors.onSurface, textAlign: 'center', marginTop: 32 }}>Nenhum histórico encontrado.</Text>}
        contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 22,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  cardInner: {
    borderRadius: 22,
    elevation: 3,
    overflow: 'hidden',
  },
}); 