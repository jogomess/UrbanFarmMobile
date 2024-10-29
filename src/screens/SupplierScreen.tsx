import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definir o tipo das rotas possíveis
type RootStackParamList = {
  Supplier: undefined;
};

// Atribuir o tipo ao `props` de SupplierScreen
type SupplierScreenProps = NativeStackScreenProps<RootStackParamList, 'Supplier'>;

type Fornecedor = {
  fornecedorID: number;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
};

const SupplierScreen: React.FC<SupplierScreenProps> = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5078/api/Fornecedores');
      setFornecedores(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os fornecedores.');
    }
  };

  const handleAddFornecedor = async () => {
    try {
      const newFornecedor = { nome, cnpj, endereco, telefone, email };
      await axios.post('http://10.0.2.2:5078/api/Fornecedores', newFornecedor);
      fetchFornecedores();
      setNome('');
      setCnpj('');
      setEndereco('');
      setTelefone('');
      setEmail('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o fornecedor.');
    }
  };

  const handleUpdateFornecedor = async (id: number) => {
    try {
      const updatedFornecedor = { nome, cnpj, endereco, telefone, email };
      await axios.put(`http://10.0.2.2:5078/api/Fornecedores/${id}`, updatedFornecedor);
      fetchFornecedores();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o fornecedor.');
    }
  };

  const handleDeleteFornecedor = async (id: number) => {
    try {
      await axios.delete(`http://10.0.2.2:5078/api/Fornecedores/${id}`);
      fetchFornecedores();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o fornecedor.');
    }
  };

  const renderItem = ({ item }: { item: Fornecedor }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text>CNPJ: {item.cnpj}</Text>
      <Text>Endereço: {item.endereco}</Text>
      <Text>Telefone: {item.telefone}</Text>
      <Text>Email: {item.email}</Text>
      <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateFornecedor(item.fornecedorID)}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteFornecedor(item.fornecedorID)}>
        <Text style={styles.buttonText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fornecedores</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddFornecedor}>
        <Text style={styles.buttonText}>Adicionar Fornecedor</Text>
      </TouchableOpacity>

      <FlatList
        data={fornecedores}
        keyExtractor={(item) => item.fornecedorID.toString()}
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

export default SupplierScreen;
