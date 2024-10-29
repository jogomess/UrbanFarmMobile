import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  RegisterEmployee: undefined;
  Home: undefined;
};

type RegisterEmployeeScreenProps = NativeStackScreenProps<RootStackParamList, 'RegisterEmployee'>;

const RegisterEmployeeScreen: React.FC<RegisterEmployeeScreenProps> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [senha, setSenha] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState('');

  // Função para cadastrar colaborador
  const handleRegister = async () => {
    if (!nome || !cpf || !dataNascimento || !email || !funcao || !senha || !nivelAcesso) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const novoFuncionario = {
      nome,
      cpf,
      dataNascimento,
      email,
      funcao,
      senhaHash: senha, // Hash da senha deve ser implementado no backend
      dataCadastro: new Date().toISOString(),
      nivelAcesso: parseInt(nivelAcesso, 10),
    };

    try {
      const response = await fetch('http://10.0.2.2:5078/api/Funcionarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoFuncionario),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Colaborador cadastrado com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Houve um problema ao cadastrar o colaborador.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão ao cadastrar o colaborador.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Colaborador</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (AAAA-MM-DD)"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Função"
        value={funcao}
        onChangeText={setFuncao}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Nível de Acesso (1 ou 2)"
        value={nivelAcesso}
        onChangeText={setNivelAcesso}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Cadastrar</Text>
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
  registerButton: {
    backgroundColor: '#0288D1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
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

export default RegisterEmployeeScreen;
