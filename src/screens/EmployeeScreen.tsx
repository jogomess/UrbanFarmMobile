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
  senhaHash: string;
  dataCadastro: string;
  nivelAcesso: number;
};

const EmployeeScreen: React.FC<EmployeeScreenProps> = ({ navigation }) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [funcionarioID, setFuncionarioID] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState(0); // Assumir o nível de acesso do usuário logado
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    // Assumindo que o nível de acesso é obtido de algum lugar (por exemplo, API ou armazenamento local)
    setNivelAcesso(1); // Simulação: ajustar conforme necessário
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
    if (nivelAcesso !== 1) {
      Alert.alert('Acesso Negado', 'Você não tem permissão para adicionar funcionários.');
      return;
    }
    try {
      const newFuncionario = {
        nome,
        cpf,
        dataNascimento,
        email,
        funcao,
        senhaHash,
        nivelAcesso: parseInt(nivelAcesso.toString()),
        dataCadastro: new Date().toISOString(),
      };
      await axios.post('http://10.0.2.2:5078/api/Funcionarios', newFuncionario);
      fetchFuncionarios();
      clearForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o funcionário.');
    }
  };

  const handleUpdateFuncionario = async () => {
    if (nivelAcesso !== 1) {
      Alert.alert('Acesso Negado', 'Você não tem permissão para atualizar funcionários.');
      return;
    }
    if (!funcionarioID) {
      Alert.alert('Erro', 'ID do Funcionário é necessário para atualização.');
      return;
    }
    try {
      const updatedFuncionario = {
        funcionarioID: parseInt(funcionarioID),
        nome,
        cpf,
        dataNascimento,
        email,
        funcao,
        senhaHash,
        nivelAcesso: parseInt(nivelAcesso.toString()),
        dataCadastro: new Date().toISOString(),
      };
      await axios.put(`http://10.0.2.2:5078/api/Funcionarios/${funcionarioID}`, updatedFuncionario);
      fetchFuncionarios();
      clearForm();
      setIsUpdateMode(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o funcionário.');
    }
  };

  const handleDeleteFuncionario = async (id: number) => {
    if (nivelAcesso !== 1) {
      Alert.alert('Acesso Negado', 'Você não tem permissão para deletar funcionários.');
      return;
    }
    try {
      await axios.delete(`http://10.0.2.2:5078/api/Funcionarios/${id}`);
      fetchFuncionarios();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o funcionário.');
    }
  };

  const handleSelectFuncionarioForUpdate = (item: Funcionario) => {
    if (nivelAcesso !== 1) {
      Alert.alert('Acesso Negado', 'Você não tem permissão para atualizar funcionários.');
      return;
    }
    setFuncionarioID(item.funcionarioID.toString());
    setNome(item.nome);
    setCpf(item.cpf);
    setDataNascimento(item.dataNascimento);
    setEmail(item.email);
    setFuncao(item.funcao);
    setSenhaHash(item.senhaHash);
    setNivelAcesso(item.nivelAcesso);
    setIsUpdateMode(true);
  };

  const clearForm = () => {
    setFuncionarioID('');
    setNome('');
    setCpf('');
    setDataNascimento('');
    setEmail('');
    setFuncao('');
    setSenhaHash('');
    setNivelAcesso(0);
  };

  const renderItem = ({ item }: { item: Funcionario }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text>CPF: {item.cpf}</Text>
      <Text>Data de Nascimento: {item.dataNascimento}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Função: {item.funcao}</Text>
      <Text>Nível de Acesso: {item.nivelAcesso}</Text>
      {nivelAcesso === 1 && (
        <>
          <TouchableOpacity style={styles.updateButton} onPress={() => handleSelectFuncionarioForUpdate(item)}>
            <Text style={styles.buttonText}>Selecionar Funcionário para Atualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteFuncionario(item.funcionarioID)}>
            <Text style={styles.buttonText}>Deletar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  if (nivelAcesso !== 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Acesso Negado</Text>
        <Text>Você não tem permissão para acessar esta seção.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funcionários</Text>

      {isUpdateMode && (
        <TextInput
          style={styles.input}
          placeholder="ID do Funcionário (para atualização)"
          value={funcionarioID}
          editable={false}
        />
      )}
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
        placeholder="Senha"
        value={senhaHash}
        onChangeText={setSenhaHash}
      />
      <TextInput
        style={styles.input}
        placeholder="Nível de Acesso"
        value={nivelAcesso.toString()}
        onChangeText={(value) => setNivelAcesso(Number(value))}
        keyboardType="numeric"
      />

      {isUpdateMode ? (
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateFuncionario}>
          <Text style={styles.buttonText}>Atualizar Funcionário</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddFuncionario}>
          <Text style={styles.buttonText}>Adicionar Funcionário</Text>
        </TouchableOpacity>
      )}

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
  updateButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
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
