import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Animated, Pressable } from 'react-native';
import { Button, Text, Card, useTheme, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

// Componente de botão animado reutilizável
function AnimatedButton({ onPress, children, style, disabled }: any) {
  const [hovered, setHovered] = React.useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: hovered ? 1.06 : 1,
      useNativeDriver: false,
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

interface Medication {
  id: string;
  name: string;
  time: string;
}

export default function MedicationScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const navigation = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem('medications').then(data => {
      if (data) setMedications(JSON.parse(data));
    });
  }, []);

  const addMedication = async () => {
    navigation.navigate('Adicionar por Foto');
  };

  const removeMedication = async (id: string) => {
    const filtered = medications.filter(m => m.id !== id);
    setMedications(filtered);
    await AsyncStorage.setItem('medications', JSON.stringify(filtered));
  };

  const scheduleNotification = async (med: Medication) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora do remédio',
        body: `Tome o medicamento: ${med.name}`,
      },
      trigger: { hour: parseInt(med.time.split(':')[0]), minute: parseInt(med.time.split(':')[1]), repeats: true },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text variant="titleLarge" style={{ marginBottom: 16, color: colors.onBackground }}>Meus Remédios</Text>
      <FlatList
        data={medications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="elevated">
            <Card.Title title={item.name} titleStyle={{ color: colors.onSurface, fontSize: 17, fontWeight: '600' }} subtitle={`Horário: ${item.time}`} subtitleStyle={{ color: colors.onSurface, fontSize: 13 }} />
            <Card.Actions>
              <AnimatedButton onPress={() => removeMedication(item.id)} style={styles.cardButton}>
                <Button mode="outlined" style={styles.cardButtonInner} labelStyle={{ color: colors.primary, fontSize: 13 }}>Excluir</Button>
              </AnimatedButton>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={{ color: colors.onSurface, textAlign: 'center', marginTop: 32 }}>Nenhum remédio cadastrado.</Text>}
        contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
      />
      <AnimatedButton onPress={addMedication} style={styles.fab}>
        <FAB
          icon="plus"
          style={[styles.fabInner, { backgroundColor: colors.primary }]}
          label="Adicionar por Foto"
          color={colors.onPrimary}
        />
      </AnimatedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 18,
    elevation: 3,
    marginBottom: 2,
    boxShadow: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  cardButton: {
    borderRadius: 8,
    marginLeft: 8,
    overflow: 'hidden',
  },
  cardButtonInner: {
    borderRadius: 8,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    zIndex: 10,
  },
  fabInner: {
    borderRadius: 18,
    elevation: 5,
    minWidth: 160,
    paddingVertical: 10,
    backgroundColor: '#1976d2',
  },
}); 