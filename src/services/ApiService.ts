import axios from 'axios';

const API_URL = 'http://10.0.2.2:5078'; // Aponte para a URL da sua API

export const ApiService = {
  login: async (email: string, senha: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/Funcionarios/login`, { email, senha });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao fazer login');
    }
  },

  getProdutos: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Produtos`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar produtos');
    }
  },

  // Outros métodos de API, como getFuncionarios, etc.
};