import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definir o tipo das rotas possíveis
type RootStackParamList = {
  Supplier: undefined;
  Product: undefined;
  Employee: undefined;
};

// Atribuir o tipo ao `props` de EmployeeScreen
type EmployeeScreenProps = NativeStackScreenProps<RootStackParamList, 'Employee'>;

type Funcionario = {
  funcionarioID: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  funcao: string;
  dataCadastro: string;
  nivelAcesso: number;
};

const EmployeeScreen: React.FC<EmployeeScreenProps> = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState('');

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5078/api/Funcionarios');
      setFuncionarios(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os funcionários.');
    }
  };

  const handleAddFuncionario = async () => {
    try {
      const newFuncionario = { nome, cpf, dataNascimento, email, funcao, nivelAcesso: parseInt(nivelAcesso) };
      await axios.post('http://10.0.2.2:5078/api/Funcionarios', newFuncionario);
      fetchFuncionarios();
      setNome('');
      setCpf('');
      setDataNascimento('');
      setEmail('');
      setFuncao('');
      setNivelAcesso('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o funcionário.');
    }
  };

  const handleUpdateFuncionario = async (id: number) => {
    try {
      const updatedFuncionario = { nome, cpf, dataNascimento, email, funcao, nivelAcesso: parseInt(nivelAcesso) };
      await axios.put(`http://10.0.2.2:5078/api/Funcionarios/${id}`, updatedFuncionario);
      fetchFuncionarios();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o funcionário.');
    }
  };

  const handleDeleteFuncionario = async (id: number) => {
    try {
      await axios.delete(`http://10.0.2.2:5078/api/Funcionarios/${id}`);
      fetchFuncionarios();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o funcionário.');
    }
  };

  const renderItem = ({ item }: { item: Funcionario }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text>CPF: {item.cpf}</Text>
      <Text>Data de Nascimento: {item.dataNascimento}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Função: {item.funcao}</Text>
      <Text>Nível de Acesso: {item.nivelAcesso}</Text>
      <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateFuncionario(item.funcionarioID)}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteFuncionario(item.funcionarioID)}>
        <Text style={styles.buttonText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funcionários</Text>

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
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Função"
        value={funcao}
        onChangeText={setFuncao}
      />
      <TextInput
        style={styles.input}
        placeholder="Nível de Acesso"
        value={nivelAcesso}
        onChangeText={setNivelAcesso}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddFuncionario}>
        <Text style={styles.buttonText}>Adicionar Funcionário</Text>
      </TouchableOpacity>

      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.funcionarioID.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#0288D1',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});

export default EmployeeScreen;
