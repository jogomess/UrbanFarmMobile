import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ForgotPassword: undefined;
  Login: undefined;
};

type ForgotPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  // Função para atualizar senha
  const handleResetPassword = async () => {
    if (!email || !novaSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const resetRequest = {
      email,
      senhaHash: novaSenha, // Hash da senha deve ser implementado no backend
    };

    try {
      const response = await fetch('http://10.0.2.2:5078/api/Funcionarios/resetPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetRequest),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a senha. Verifique o email informado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão ao atualizar a senha.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Esqueci Minha Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Atualizar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0288D1',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#0288D1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ForgotPasswordScreen;
