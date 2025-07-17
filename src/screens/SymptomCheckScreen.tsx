import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Animated, Linking, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Button, Checkbox, Text, useTheme, TextInput, Card, Modal, Portal } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

// Lista extensa de sintomas baseada no arquivo fornecido e complementada com fontes públicas
export const SYMPTOMS = [
  // Gerais
  { key: 'fever', label: 'Febre' },
  { key: 'chills', label: 'Calafrios' },
  { key: 'sweating', label: 'Sudorese' },
  { key: 'fatigue', label: 'Fadiga' },
  { key: 'excessive_tiredness', label: 'Cansaço excessivo' },
  { key: 'loss_of_appetite', label: 'Perda de apetite' },
  { key: 'weight_loss', label: 'Perda de peso' },
  { key: 'weight_gain', label: 'Ganho de peso' },
  { key: 'malaise', label: 'Mal-estar geral' },
  { key: 'body_swelling', label: 'Inchaço corporal' },
  { key: 'fainting_feeling', label: 'Sensação de desmaio' },
  { key: 'pallor', label: 'Palidez' },
  { key: 'weakness', label: 'Fraqueza' },
  // Neurológico
  { key: 'headache', label: 'Dor de cabeça' },
  { key: 'migraine', label: 'Enxaqueca' },
  { key: 'dizziness', label: 'Tontura' },
  { key: 'vertigo', label: 'Vertigem' },
  { key: 'tingling', label: 'Formigamento' },
  { key: 'numbness', label: 'Dormência' },
  { key: 'disorientation', label: 'Desorientação' },
  { key: 'seizures', label: 'Convulsões' },
  { key: 'syncope', label: 'Síncope' },
  { key: 'tremors', label: 'Tremores' },
  { key: 'slurred_speech', label: 'Fala arrastada' },
  { key: 'paralysis', label: 'Paralisia' },
  { key: 'aphasia', label: 'Afasia' },
  { key: 'ataxia', label: 'Ataxia' },
  { key: 'paresthesia', label: 'Parestesias' },
  // Respiratório
  { key: 'shortness_breath', label: 'Falta de ar (dispneia)' },
  { key: 'dry_cough', label: 'Tosse seca' },
  { key: 'productive_cough', label: 'Tosse produtiva' },
  { key: 'wheezing', label: 'Chiado no peito' },
  { key: 'chest_pain_breath', label: 'Dor torácica ao respirar' },
  { key: 'hemoptysis', label: 'Hemoptise (sangue ao tossir)' },
  { key: 'tachypnea', label: 'Taquipneia' },
  { key: 'apnea', label: 'Apneia' },
  { key: 'noisy_breathing', label: 'Respiração ruidosa' },
  // Digestivo
  { key: 'nausea', label: 'Náusea' },
  { key: 'vomit', label: 'Vômito' },
  { key: 'diarrhea', label: 'Diarreia' },
  { key: 'constipation', label: 'Constipação' },
  { key: 'abdominal_pain', label: 'Dor abdominal' },
  { key: 'heartburn', label: 'Azia' },
  { key: 'acid_reflux', label: 'Refluxo ácido' },
  { key: 'abdominal_swelling', label: 'Inchaço abdominal' },
  { key: 'flatulence', label: 'Flatulência' },
  { key: 'blood_in_stool', label: 'Sangue nas fezes' },
  { key: 'melena', label: 'Melena (fezes negras)' },
  { key: 'hematochezia', label: 'Hematoquezia' },
  { key: 'pyrosis', label: 'Pirose (queimação)' },
  { key: 'dysphagia', label: 'Disfagia' },
  { key: 'tenesmus', label: 'Tenesmo' },
  // Cardiovascular
  { key: 'chest_pain', label: 'Dor no peito' },
  { key: 'palpitations', label: 'Palpitações' },
  { key: 'arrhythmias', label: 'Arritmias' },
  { key: 'fatigue_exertion', label: 'Fadiga aos esforços' },
  { key: 'hypotension', label: 'Hipotensão' },
  { key: 'hypertension', label: 'Hipertensão' },
  { key: 'claudication', label: 'Claudicação intermitente' },
  { key: 'feet_swelling', label: 'Inchaço nos pés' },
  { key: 'cyanosis', label: 'Cianose' },
  { key: 'dizziness_standing', label: 'Tontura ao levantar' },
  // Urinário/Genital
  { key: 'dysuria', label: 'Dor ao urinar (disúria)' },
  { key: 'hematuria', label: 'Urina com sangue (hematúria)' },
  { key: 'dark_urine', label: 'Urina escura' },
  { key: 'urinary_urgency', label: 'Urgência urinária' },
  { key: 'polyuria', label: 'Poliúria' },
  { key: 'oliguria', label: 'Oligúria' },
  { key: 'urinary_incontinence', label: 'Incontinência urinária' },
  { key: 'urinary_retention', label: 'Retenção urinária' },
  { key: 'pelvic_pain', label: 'Dor pélvica' },
  { key: 'genital_discharge', label: 'Corrimento genital' },
  { key: 'erectile_dysfunction', label: 'Disfunção erétil' },
  { key: 'abnormal_vaginal_bleeding', label: 'Sangramento vaginal anormal' },
  { key: 'menstrual_changes', label: 'Alterações menstruais' },
  // Musculoesquelético
  { key: 'joint_pain', label: 'Dor nas articulações' },
  { key: 'muscle_pain', label: 'Dor muscular' },
  { key: 'morning_stiffness', label: 'Rigidez matinal' },
  { key: 'muscle_spasms', label: 'Espasmos musculares' },
  { key: 'muscle_weakness', label: 'Fraqueza muscular' },
  { key: 'joint_swelling', label: 'Inchaço nas articulações' },
  { key: 'movement_difficulty', label: 'Dificuldade de movimento' },
  { key: 'limited_range_motion', label: 'Limitação de amplitude articular' },
  // Pele e Anexos
  { key: 'itching', label: 'Coceira (prurido)' },
  { key: 'skin_rash', label: 'Erupções cutâneas' },
  { key: 'redness', label: 'Vermelhidão' },
  { key: 'blisters', label: 'Bolhas' },
  { key: 'open_wounds', label: 'Feridas abertas' },
  { key: 'scaling', label: 'Descamação' },
  { key: 'spontaneous_bruising', label: 'Hematomas espontâneos' },
  { key: 'dry_skin', label: 'Pele seca' },
  { key: 'urticaria', label: 'Urticária' },
  { key: 'skin_spots', label: 'Manchas' },
  { key: 'alopecia', label: 'Alopecia (queda de cabelo)' },
  // Sentidos
  { key: 'blurred_vision', label: 'Visão embaçada' },
  { key: 'double_vision', label: 'Visão dupla' },
  { key: 'vision_loss', label: 'Perda de visão' },
  { key: 'photophobia', label: 'Fotofobia' },
  { key: 'eye_pain', label: 'Dor ocular' },
  { key: 'tinnitus', label: 'Zumbido' },
  { key: 'hearing_loss', label: 'Perda auditiva' },
  { key: 'ear_pain', label: 'Otalgia (dor de ouvido)' },
  { key: 'ear_fullness', label: 'Sensação de ouvido tampado' },
  { key: 'loss_of_smell', label: 'Perda de olfato' },
  { key: 'loss_of_taste', label: 'Perda de paladar' },
  // Mentais/Psiquiátricos
  { key: 'deep_sadness', label: 'Tristeza profunda' },
  { key: 'anhedonia', label: 'Anedonia (perda de prazer)' },
  { key: 'anxiety', label: 'Ansiedade' },
  { key: 'panic', label: 'Pânico' },
  { key: 'irritability', label: 'Irritabilidade' },
  { key: 'insomnia', label: 'Insônia' },
  { key: 'suicidal_ideation', label: 'Ideação suicida' },
  { key: 'delusions', label: 'Delírios' },
  { key: 'hallucinations', label: 'Alucinações' },
  { key: 'depersonalization', label: 'Despersonalização' },
  { key: 'mood_changes', label: 'Alterações de humor' },
  { key: 'attention_deficit', label: 'Déficit de atenção' },
  // Endócrino/Metabólico
  { key: 'cold_intolerance', label: 'Intolerância ao frio' },
  { key: 'heat_intolerance', label: 'Intolerância ao calor' },
  { key: 'excessive_thirst', label: 'Sede excessiva (polidipsia)' },
  { key: 'excessive_hunger', label: 'Fome excessiva (polifagia)' },
  { key: 'fine_tremors', label: 'Tremores finos' },
  { key: 'moist_skin', label: 'Pele úmida' },
  { key: 'lethargy', label: 'Letargia' },
  { key: 'irregular_menstruation', label: 'Menstruação irregular' },
  { key: 'gynecomastia', label: 'Ginecomastia' },
  { key: 'hirsutism', label: 'Hirsutismo' },
  // Extras comuns
  { key: 'runny_nose', label: 'Coriza' },
  { key: 'sneezing', label: 'Espirros' },
  { key: 'rash', label: 'Manchas na pele' },
  { key: 'back_pain', label: 'Dor nas costas' },
  { key: 'shoulder_pain', label: 'Dor no ombro' },
  { key: 'neck_pain', label: 'Dor no pescoço' },
  { key: 'leg_pain', label: 'Dor nas pernas' },
  { key: 'foot_pain', label: 'Dor nos pés' },
  { key: 'hand_pain', label: 'Dor nas mãos' },
  { key: 'tooth_pain', label: 'Dor de dente' },
  { key: 'hoarseness', label: 'Rouquidão' },
  { key: 'difficulty_swallowing', label: 'Dificuldade para engolir' },
  { key: 'cold_sweat', label: 'Suor frio' },
  { key: 'increased_appetite', label: 'Aumento de apetite' },
  // ... adicione mais conforme necessário
];

// Consulta LLM gratuita (HuggingFace) para diagnóstico baseado em sintomas
async function fetchDiagnosisFromLLM(symptoms: string[]): Promise<string | null> {
  try {
    const apiKey = await AsyncStorage.getItem('huggingface_api_key');
    if (!apiKey) {
      return 'É necessário configurar sua HuggingFace API Key nas Configurações para usar o diagnóstico.';
    }
    const prompt = `Você é um médico. Com base nos sintomas: ${symptoms.join(', ')}. Liste as doenças mais prováveis, explique o porquê e cite fontes médicas (sites, livros, PDFs, guidelines). Responda em português, seja preciso e objetivo.`;
    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    });
    if (response.status === 401) {
      return 'Sua API Key está incorreta ou não tem acesso. Atualize nas Configurações.';
    }
    if (response.status === 404) {
      return 'O modelo de IA para diagnóstico está temporariamente indisponível. Tente novamente mais tarde.';
    }
    const data = await response.json();
    if (data.generated_text) {
      return data.generated_text;
    }
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    return 'Não foi possível obter resposta do diagnóstico.';
  } catch (e) {
    return 'Erro ao conectar ao diagnóstico. Verifique sua conexão e tente novamente.';
  }
}

// Novo componente de botão animado reutilizável
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

export default function SymptomCheckScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text variant="titleLarge">Função indisponível no navegador</Text>
        <Text>O diagnóstico por IA só funciona no app mobile (Android/iOS) devido a restrições de segurança da API.</Text>
      </View>
    );
  }

  const [checked, setChecked] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [external, setExternal] = useState<{text: string, url?: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { colors } = useTheme();
  const anim = React.useRef(new Animated.Value(0)).current;
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<{fromUser: boolean, text: string}[]>([]);

  // Busca dinâmica
  const filteredSymptoms = useMemo(() => {
    if (!search.trim()) return SYMPTOMS;
    return SYMPTOMS.filter(s => s.label.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleToggle = (key: string) => {
    setChecked(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setChatVisible(true);
    setChatMessages(prev => [...prev, { fromUser: true, text: checked.map(k => SYMPTOMS.find(s => s.key === k)?.label || k).join(', ') }]);
    let diagnosis = '';
    if (checked.length > 0) {
      diagnosis = (await fetchDiagnosisFromLLM(checked.map(k => SYMPTOMS.find(s => s.key === k)?.label || k))) || '';
    }
    if (!diagnosis) {
      diagnosis = 'Não foi possível obter um diagnóstico preciso no momento. Tente novamente mais tarde ou procure um médico.';
    }
    setChatMessages(prev => [...prev, { fromUser: false, text: diagnosis }]);
    setResult(diagnosis);
    setLoading(false);
    Speech.speak(diagnosis, { language: 'pt-BR' });
    const history = await AsyncStorage.getItem('symptomHistory');
    const arr = history ? JSON.parse(history) : [];
    arr.unshift({ date: new Date().toISOString(), symptoms: checked, result: diagnosis });
    await AsyncStorage.setItem('symptomHistory', JSON.stringify(arr));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text variant="titleLarge" style={{ marginBottom: 8 }}>Autoavaliação de Sintomas</Text>
        <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="elevated">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar sintoma..."
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" />}
          />
          <ScrollView style={{ maxHeight: 260 }} contentContainerStyle={{ paddingBottom: 8 }}>
            {filteredSymptoms.map(s => (
              <AnimatedButton key={s.key} onPress={() => handleToggle(s.key)} style={{ marginBottom: 2 }}>
                <Checkbox.Item
                  label={s.label}
                  status={checked.includes(s.key) ? 'checked' : 'unchecked'}
                  onPress={() => handleToggle(s.key)}
                  style={styles.checkbox}
                  labelStyle={{ color: colors.onSurface, fontSize: 15 }}
                />
              </AnimatedButton>
            ))}
          </ScrollView>
        </Card>
        {result ? (
          <Card style={[styles.resultCard, { backgroundColor: colors.surface }]} mode="elevated">
            <Text variant="bodyLarge" style={{ color: colors.onSurface }}>{result}</Text>
          </Card>
        ) : null}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 16 }} />
        ) : null}
      </ScrollView>
      <AnimatedButton
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.fabButton, loading && { opacity: 0.7 }]}
      >
        <Button
          mode="contained"
          style={styles.fabButtonInner}
          labelStyle={{ fontSize: 17, fontWeight: 'bold', letterSpacing: 0.2 }}
          loading={loading}
          disabled={loading}
        >
          Avaliar
        </Button>
      </AnimatedButton>
      {/* Modal de chat animado para diagnóstico */}
      <Portal>
        <Modal visible={chatVisible} onDismiss={() => setChatVisible(false)} contentContainerStyle={{ backgroundColor: colors.surface, margin: 24, borderRadius: 18, padding: 18, elevation: 6 }}>
          <View style={{ maxHeight: 340 }}>
            {chatMessages.map((msg, idx) => (
              <Animated.View key={idx} style={{ alignSelf: msg.fromUser ? 'flex-end' : 'flex-start', backgroundColor: msg.fromUser ? colors.primary : colors.background, borderRadius: 14, marginBottom: 8, padding: 10, maxWidth: '90%', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 }}>
                <Text style={{ color: msg.fromUser ? '#fff' : colors.onSurface }}>{msg.text}</Text>
              </Animated.View>
            ))}
          </View>
          <Button mode="contained" onPress={() => setChatVisible(false)} style={{ marginTop: 12, borderRadius: 12 }}>
            Fechar
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    borderRadius: 18,
    elevation: 3,
    marginBottom: 12,
    padding: 8,
  },
  searchInput: {
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  checkbox: {
    borderRadius: 10,
    marginVertical: 0,
    marginLeft: -8,
  },
  resultCard: {
    borderRadius: 16,
    elevation: 2,
    padding: 16,
    marginBottom: 12,
  },
  fabButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  fabButtonInner: {
    borderRadius: 18,
    elevation: 4,
    minWidth: 160,
    paddingVertical: 10,
    backgroundColor: '#1976d2',
  },
}); 