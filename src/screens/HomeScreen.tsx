import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Easing, ScrollView, Dimensions, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definir os tipos das rotas da aplicação
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Employee: undefined;
  Product: undefined;
  Supplier: undefined;
};

// Definir as props da HomeScreen
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Fornecedor = {
  id: string;
  nome: string;
  email: string;
};

type Produto = {
  id: string;
  nome: string;
  categoria: string;
};

type Funcionario = {
  id: string;
  nome: string;
  funcao: string;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [saudacao, setSaudacao] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState(1); // Simulação do nível de acesso do usuário

  // Dados de exemplo para Fornecedores, Produtos e Funcionários
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

  useEffect(() => {
    // Animação inicial
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();

    // Definir saudação com base no horário atual
    const horaAtual = new Date().getHours();
    if (horaAtual < 12) {
      setSaudacao('Bom dia!');
    } else if (horaAtual < 18) {
      setSaudacao('Boa tarde!');
    } else {
      setSaudacao('Boa noite!');
    }
  }, []);

  // Renderizar Item
  const renderItem = ({ item, type }: { item: Fornecedor | Produto | Funcionario; type: string }) => (
    <TouchableOpacity onPress={() => handleNavigate(item.id, type)}>
      <Animated.View style={[styles.card, { opacity: animatedValue }]}>
        <Text style={styles.cardTitle}>
          {type} - {item.nome}
        </Text>
        <Text style={styles.cardSubtitle}>
          {type === 'Fornecedor'
            ? `Email: ${(item as Fornecedor).email}`
            : type === 'Produto'
            ? `Categoria: ${(item as Produto).categoria}`
            : `Função: ${(item as Funcionario).funcao}`}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );

  // Função para navegação
  const handleNavigate = (id: string, type: string) => {
    if (type === 'Fornecedor') {
      navigation.navigate('Supplier');
    } else if (type === 'Produto') {
      navigation.navigate('Product');
    } else if (type === 'Funcionário') {
      // Verifica se o nível de acesso é 1 antes de permitir a navegação para Employee
      if (nivelAcesso === 1) {
        navigation.navigate('Employee');
      } else {
        Alert.alert('Acesso Negado', 'Você não tem permissão para acessar esta seção.');
      }
    }
  };

  // Função para logout
  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.saudacao}>{saudacao}, bem-vindo à Urban Farm!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Estamos aqui por você!</Text>
        <Text style={styles.infoText}>We are here for you!</Text>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco
  },
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288D1', // Azul
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#dc143c', // Vermelho
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#ffffff', // Fundo branco para o container "Estamos aqui por você"
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
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
    color: '#0288D1',
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
