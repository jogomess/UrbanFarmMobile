import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definir o tipo das rotas possíveis
type RootStackParamList = {
  Supplier: undefined;
  Product: undefined;
};

// Atribuir o tipo ao `props` de ProductScreen
type ProductScreenProps = NativeStackScreenProps<RootStackParamList, 'Product'>;

type Produto = {
  produtoID: number;
  nomeProduto: string;
  categoria: string;
  preco: number;
  quantidade: number;
  fornecedorID: number;
  dataCadastro: string;
};

const ProductScreen: React.FC<ProductScreenProps> = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoID, setProdutoID] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [fornecedorID, setFornecedorID] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5078/api/Produtos');
      setProdutos(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os produtos.');
    }
  };

  const handleAddProduto = async () => {
    try {
      const newProduto = {
        nomeProduto,
        categoria,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        fornecedorID: parseInt(fornecedorID),
        dataCadastro: new Date().toISOString(),
      };
      await axios.post('http://10.0.2.2:5078/api/Produtos', newProduto);
      fetchProdutos();
      clearForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o produto.');
    }
  };

  const handleUpdateProduto = async () => {
    if (!produtoID) {
      Alert.alert('Erro', 'Produto ID é necessário para atualização.');
      return;
    }
    try {
      const updatedProduto = {
        produtoID: parseInt(produtoID),
        nomeProduto,
        categoria,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        fornecedorID: parseInt(fornecedorID),
        dataCadastro: new Date().toISOString(),
      };
      await axios.put(`http://10.0.2.2:5078/api/Produtos/${produtoID}`, updatedProduto);
      fetchProdutos();
      clearForm();
      setIsUpdateMode(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    }
  };

  const handleDeleteProduto = async (id: number) => {
    try {
      await axios.delete(`http://10.0.2.2:5078/api/Produtos/${id}`);
      fetchProdutos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o produto.');
    }
  };

  const handleSelectProdutoForUpdate = (item: Produto) => {
    setProdutoID(item.produtoID.toString());
    setNomeProduto(item.nomeProduto);
    setCategoria(item.categoria);
    setPreco(item.preco.toString());
    setQuantidade(item.quantidade.toString());
    setFornecedorID(item.fornecedorID.toString());
    setIsUpdateMode(true);
  };

  const clearForm = () => {
    setProdutoID('');
    setNomeProduto('');
    setCategoria('');
    setPreco('');
    setQuantidade('');
    setFornecedorID('');
  };

  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nomeProduto}</Text>
      <Text>Categoria: {item.categoria}</Text>
      <Text>Preço: {item.preco}</Text>
      <Text>Quantidade: {item.quantidade}</Text>
      <Text>Fornecedor ID: {item.fornecedorID}</Text>
      <TouchableOpacity style={styles.updateButton} onPress={() => handleSelectProdutoForUpdate(item)}>
        <Text style={styles.buttonText}>Selecionar Produto para Atualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProduto(item.produtoID)}>
        <Text style={styles.buttonText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos</Text>

      {isUpdateMode && (
        <TextInput
          style={styles.input}
          placeholder="Produto ID (para atualização)"
          value={produtoID}
          editable={false}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={categoria}
        onChangeText={setCategoria}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fornecedor ID"
        value={fornecedorID}
        onChangeText={setFornecedorID}
        keyboardType="numeric"
      />

      {isUpdateMode ? (
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProduto}>
          <Text style={styles.buttonText}>Atualizar Produto</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduto}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.produtoID.toString()}
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

export default ProductScreen;
