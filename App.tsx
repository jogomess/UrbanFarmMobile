import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator'; // Ajuste o caminho conforme a estrutura das pastas

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
