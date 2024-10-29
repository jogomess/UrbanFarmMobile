import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EmployeeScreen from '../screens/EmployeeScreen';
import ProductScreen from '../screens/ProductScreen';
import SupplierScreen from '../screens/SupplierScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterEmployeeScreen from '../screens/RegisterEmployeeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Definir os tipos das rotas da aplicação
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Employee: undefined;
  Product: undefined;
  Supplier: undefined;
  RegisterEmployee: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Home',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen 
          name="Employee" 
          component={EmployeeScreen} 
          options={{ title: 'Funcionários' }}
        />
        <Stack.Screen 
          name="Product" 
          component={ProductScreen} 
          options={{ title: 'Produtos' }}
        />
        <Stack.Screen 
          name="Supplier" 
          component={SupplierScreen} 
          options={{ title: 'Fornecedores' }}
        />
        <Stack.Screen name="RegisterEmployee" 
          component={RegisterEmployeeScreen} 
          options={{ title: 'Cadastrar Colaborador' }} 
        />
        <Stack.Screen name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Esqueci Minha Senha' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
