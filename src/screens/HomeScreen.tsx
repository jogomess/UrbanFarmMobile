import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Easing, ScrollView, Dimensions, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Fornecedor = { id: string; nome: string; email: string; };
type Produto = { id: string; nome: string; categoria: string; };
type Funcionario = { id: string; nome: string; funcao: string; };
type Venda = { id: string; produto: string; quantidade: number; cliente: string };

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [saudacao, setSaudacao] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState(1);

  const fornecedores: Fornecedor[] = [
    { id: '1', nome: 'Fornecedor A', email: 'fornecedorA@example.com' },
    { id: '2', nome: 'Fornecedor B', email: 'fornecedorB@example.com' },
  ];

  const produtos: Produto[] = [
    { id: '1', nome: 'Produto A', categoria: 'Categoria A' },
    { id: '2', nome: 'Produto B', categoria: 'Categoria B' },
  ];

  const funcionarios: Funcionario[] = [
    { id: '1', nome: 'Funcionario A', funcao: 'Gerente' },
    { id: '2', nome: 'Funcionario B', funcao: 'Analista' },
  ];

  const vendas: Venda[] = [
    { id: '1', produto: 'Produto A', quantidade: 10, cliente: 'Cliente X' },
    { id: '2', produto: 'Produto B', quantidade: 5, cliente: 'Cliente Y' },
  ];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();

    const horaAtual = new Date().getHours();
    setSaudacao(horaAtual < 13 ? 'Bom dia! ' : horaAtual < 18 ? 'Boa tarde! ' : 'Boa noite! ');
  }, []);

  const renderItem = ({ item, type }: { item: Funcionario | Fornecedor | Produto | Venda; type: string }) => (
    <TouchableOpacity onPress={() => handleNavigate(item.id, type)}>
      <Animated.View style={[styles.card, { opacity: animatedValue }]}>
        <Text style={styles.cardTitle}>
          {type} - {type === 'Venda' ? (item as Venda).produto : (item as Fornecedor | Produto | Funcionario).nome}
        </Text>
        <Text style={styles.cardSubtitle}>
          {type === 'Fornecedor' && `Email: ${(item as Fornecedor).email}`}
          {type === 'Produto' && `Categoria: ${(item as Produto).categoria}`}
          {type === 'Funcionário' && `Função: ${(item as Funcionario).funcao}`}
          {type === 'Venda' && `Quantidade: ${(item as Venda).quantidade}, Cliente: ${(item as Venda).cliente}`}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const handleNavigate = (id: string, type: string) => {
    if (type === 'Fornecedor') {
      navigation.navigate('Supplier');
    } else if (type === 'Produto') {
      navigation.navigate('Product');
    } else if (type === 'Funcionário') {
      if (nivelAcesso === 1) {
        navigation.navigate('Employee');
      } else {
        Alert.alert('Acesso Negado', 'Você não tem permissão para acessar esta seção.');
      }
    } else if (type === 'Venda') {
      navigation.navigate('Venda');
    }
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.saudacao}>{saudacao}, bem-vindo à Urban Farm!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Supplier')}>
        <Text style={styles.sectionTitle}>Fornecedores</Text>
      </TouchableOpacity>
      <FlatList
        data={fornecedores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem({ item, type: 'Fornecedor' })}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Product')}>
        <Text style={styles.sectionTitle}>Produtos</Text>
      </TouchableOpacity>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem({ item, type: 'Produto' })}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />

      {nivelAcesso === 1 && (
        <>
          <TouchableOpacity onPress={() => handleNavigate('', 'Funcionário')}>
            <Text style={styles.sectionTitle}>Funcionários</Text>
          </TouchableOpacity>
          <FlatList
            data={funcionarios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderItem({ item, type: 'Funcionário' })}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </>
      )}

      <TouchableOpacity onPress={() => handleNavigate('', 'Venda')}>
        <Text style={styles.sectionTitle}>Vendas</Text>
      </TouchableOpacity>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem({ item, type: 'Venda' })}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff5722',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderColor: '#dc143c',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 20,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#dc143c',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    width: Dimensions.get('window').width * 0.8,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  flatListContainer: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
