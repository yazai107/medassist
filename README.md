# MedAssist

Aplicativo completo para lembrete de medicamentos com reconhecimento por foto (OCR) e autoavaliação de sintomas com IA simples.

## Funcionalidades

- Cadastro de remédios com horário e notificações push
- Adição de remédio por foto da embalagem (OCR)
- Leitura dos horários por voz
- Autoavaliação de sintomas com lógica de decisão
- Histórico de sintomas
- Temas claro e escuro automáticos

## Telas
- **Início**: Acesso rápido às principais funções
- **Meus Remédios**: Lista, cadastro e exclusão de remédios
- **Adicionar por Foto**: Usa câmera e OCR para identificar nome do remédio
- **Autoavaliação de Sintomas**: Checklist e resultado lógico (ex: "provável gripe", "procure um médico")
- **Histórico de Sintomas**: Visualização dos últimos checkups

## Instalação

```sh
npm install
```

## Execução em desenvolvimento

```sh
npm run android # ou npm start para abrir o Expo Go
```

## Build do APK (Android)

```sh
npm install -g eas-cli # se necessário
npx eas build -p android --profile preview
```

O APK será gerado na nuvem e o link aparecerá no terminal.

## Publicação no GitHub

1. Crie um repositório e faça push do projeto:
```sh
git init
git remote add origin <URL_DO_SEU_REPO>
git add .
git commit -m "MedAssist v1"
git push -u origin master
```

## Dependências principais
- React Native (Expo)
- react-native-paper
- expo-camera
- expo-mlkit-ocr
- expo-notifications
- expo-speech
- @react-native-async-storage/async-storage
- @react-navigation/native, @react-navigation/stack

## Temas
O app alterna automaticamente entre tema claro e escuro conforme o sistema.

## Licença
MIT 