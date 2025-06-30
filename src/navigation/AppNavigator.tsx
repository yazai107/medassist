import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MedicationScreen from '../screens/MedicationScreen';
import OcrScreen from '../screens/OcrScreen';
import SymptomCheckScreen from '../screens/SymptomCheckScreen';
import SymptomHistoryScreen from '../screens/SymptomHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SettingsIcon from '../components/SettingsIcon';
import ChatbotScreen from '../screens/ChatbotScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Início',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Configurações')} style={{ marginRight: 16 }}>
                <SettingsIcon size={26} color="#888" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Medicamentos"
          component={MedicationScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Configurações')} style={{ marginRight: 16 }}>
                <SettingsIcon size={26} color="#888" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Adicionar por Foto"
          component={OcrScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Configurações')} style={{ marginRight: 16 }}>
                <SettingsIcon size={26} color="#888" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Autoavaliação"
          component={SymptomCheckScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Configurações')} style={{ marginRight: 16 }}>
                <SettingsIcon size={26} color="#888" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Histórico de Sintomas"
          component={SymptomHistoryScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Configurações')} style={{ marginRight: 16 }}>
                <SettingsIcon size={26} color="#888" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Configurações"
          component={SettingsScreen}
        />
        <Stack.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{
            title: 'Chat Médico',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 