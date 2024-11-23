import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definir o tipo das rotas possíveis
type RootStackParamList = {
  Venda: undefined;
};

// Atribuir o tipo ao `props` de VendaScreen
type VendaScreenProps = NativeStackScreenProps<RootStackParamList, 'Venda'>;

type Venda = {
  vendaID: string;
  produtoID: string;
  fornecedorID: string;
  quantidade: number;
  precoVenda: number;
  dataVenda: string;
  cliente: string;
};

type Produto = {
  produtoID: number;
  nomeProduto: string;
  categoria: string;
  preco: number;
  quantidade: number;
  fornecedorID: string;
};

const VendaScreen: React.FC<VendaScreenProps> = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendaID, setVendaID] = useState('');
  const [produtoID, setProdutoID] = useState('');
  const [fornecedorID, setFornecedorID] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [cliente, setCliente] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVendas();
    fetchProdutos();
  }, []);

  const fetchVendas = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://10.0.2.2:5078/api/Vendas');
      setVendas(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter as vendas.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProdutos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://10.0.2.2:5078/api/Produtos');
      setProdutos(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os produtos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVenda = async () => {
    if (!produtoID || !quantidade || !precoVenda) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const produtoSelecionado = produtos.find((produto) => produto.produtoID.toString() === produtoID);
    if (produtoSelecionado && parseInt(quantidade) > produtoSelecionado.quantidade) {
      Alert.alert('Erro', 'Quantidade solicitada maior do que o estoque disponível.');
      return;
    }

    const newVenda = {
      vendaID: vendaID ? parseInt(vendaID) : 0, // Adiciona vendaID e assegura que seja um número
      produtoID: parseInt(produtoID),
      fornecedorID,
      quantidade: parseInt(quantidade),
      precoVenda: parseFloat(precoVenda),
      dataVenda: new Date().toISOString().split('.')[0] + 'Z',
      cliente,
    };

    try {
      setIsLoading(true);
      await axios.post('http://10.0.2.2:5078/api/Vendas', { ...newVenda, dataVenda: new Date().toISOString() });
      fetchVendas();
      Alert.alert('Sucesso', 'Venda registrada com sucesso!');
      clearVendaForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a venda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVenda = async () => {
    if (!vendaID) {
      Alert.alert('Erro', 'Venda ID é necessário para atualização.');
      return;
    }

    const updatedVenda = {
      vendaID: parseInt(vendaID),
      produtoID: parseInt(produtoID),
      fornecedorID: parseInt(fornecedorID),

      quantidade: parseInt(quantidade),
      precoVenda: parseFloat(precoVenda),
      dataVenda: new Date().toISOString().split('.')[0] + 'Z',
      cliente,
    };

    try {
      setIsLoading(true);
      await axios.put(`http://10.0.2.2:5078/api/Vendas/${vendaID}`, updatedVenda);
      fetchVendas();
      Alert.alert('Sucesso', 'Venda atualizada com sucesso!');
      clearVendaForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a venda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVenda = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://10.0.2.2:5078/api/Vendas/${id}`);
      fetchVendas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar a venda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduto = (produto: Produto) => {
    setProdutoID(produto.produtoID.toString());
    setFornecedorID(produto.fornecedorID.toString());
    setQuantidade('');
    setPrecoVenda(''); // Remover o preço do produto ao selecionar
  };

  const handleSelectVenda = (venda: Venda) => {
    setVendaID(venda.vendaID);
    setProdutoID(venda.produtoID.toString());
    setFornecedorID(venda.fornecedorID.toString());
    setQuantidade(venda.quantidade.toString());
    setPrecoVenda(venda.precoVenda.toString());
    setCliente(venda.cliente);
  };

  const clearVendaForm = () => {
    setVendaID('');
    setProdutoID('');
    setFornecedorID('');
    setQuantidade('');
    setPrecoVenda('');
    setCliente('');
  };

  const renderVendaItem = ({ item }: { item: Venda }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Venda ID: {item.vendaID}</Text>
      <Text>Produto ID: {item.produtoID}</Text>
      <Text>Fornecedor ID: {item.fornecedorID}</Text>
      <Text>Quantidade: {item.quantidade}</Text>
      <Text>Preço Venda: {item.precoVenda}</Text>
      <Text>Data Venda: {item.dataVenda}</Text>
      <Text>Cliente: {item.cliente}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteVenda(item.vendaID)}>
        <Text style={styles.buttonText}>Deletar Venda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateButton} onPress={() => handleSelectVenda(item)}>
        <Text style={styles.buttonText}>Editar Venda</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProdutoItem = ({ item }: { item: Produto }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectProduto(item)}>
      <Text style={styles.cardTitle}>{item.nomeProduto}</Text>
      <Text>Categoria: {item.categoria}</Text>
      <Text>Preço: {item.preco}</Text>
      <Text>Quantidade: {item.quantidade}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      <Text style={styles.title}>Registrar Venda</Text>
      <TextInput
        style={styles.input}
        placeholder="Venda ID (para atualização)"
        value={vendaID}
        editable={!!vendaID}
      />
      <TextInput
        style={styles.input}
        placeholder="Produto ID"
        value={produtoID}
        onChangeText={setProdutoID}
      />
      <TextInput
        style={styles.input}
        placeholder="Fornecedor ID"
        value={fornecedorID}
        onChangeText={setFornecedorID}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade Vendida"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço Venda"
        value={precoVenda}
        onChangeText={setPrecoVenda}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cliente (Opcional)"
        value={cliente}
        onChangeText={setCliente}
      />
      <TouchableOpacity style={styles.addButton} onPress={vendaID ? handleUpdateVenda : handleAddVenda}>
        
        <Text style={styles.buttonText}>{vendaID ? 'Atualizar Venda' : 'Registrar Venda'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Produtos Disponíveis</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.produtoID.toString()}
        renderItem={renderProdutoItem}
        contentContainerStyle={styles.flatListContainer}
      />

      <Text style={styles.title}>Vendas Registradas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.vendaID}
        renderItem={renderVendaItem}
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
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
    paddingBottom: 40,
    flexGrow: 1
  },
});

export default VendaScreen;
