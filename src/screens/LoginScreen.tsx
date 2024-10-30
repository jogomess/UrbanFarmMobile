import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';

// Definir o tipo das rotas possíveis
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  RegisterEmployee: undefined;
  ForgotPassword: undefined;
};

// Atribuir o tipo ao `props` de LoginScreen
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const screenAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(screenAnimatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:5078/api/Funcionarios/login', {
        Email: email,
        Senha: senha,
      });

      if (response.status === 200) {
        // Navegar para a tela Home após o login bem-sucedido
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
    Animated.timing(animatedValue, {
      toValue: mostrarSenha ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    transform: [
      {
        rotate: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const screenAnimatedStyle = {
    opacity: screenAnimatedValue,
    transform: [
      {
        scale: screenAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, screenAnimatedStyle]}>
      {/* Logo da Urban Farm */}
      <Image source={require('../../assets/Captura_de_tela_2024-10-16_165655-removebg-preview.png.png')} style={styles.logo} />

      {/* Campo de Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Campo de Senha */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputSenha}
          placeholder="Senha"
          placeholderTextColor="#888"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity onPress={toggleMostrarSenha} style={styles.toggleButton}>
          <Animated.Text style={[styles.toggleButtonText, animatedStyle]}>{mostrarSenha ? '🙈' : '👁️'}</Animated.Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão "Esqueci minha senha" */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha?</Text>
      </TouchableOpacity>

      {/* Botão "Cadastrar" */}
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegisterEmployee')}>
        <Text style={styles.registerButtonText}>Cadastrar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  inputSenha: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  toggleButton: {
    paddingHorizontal: 10,
  },
  toggleButtonText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0288D1',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#0288D1',
    fontSize: 16,
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#ffffff',
    borderColor: '#0288D1',
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#0288D1',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
