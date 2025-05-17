/**
 * Configuração da API com Axios
 *
 * Este arquivo configura o cliente Axios para comunicação com o backend.
 * Define a URL base e interceptadores para tratamento de req e res.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Cria uma instância do Axios com configurações personalizadas
const api = axios.create({
  // URL base da API - ajuste para o endereço do seu servidor
  baseURL: 'http://192.168.1.17:8022' || 'https://appjjvejo.onrender.com', // P/ testes locais, uso meu ip local
  // em produção eh o ip render
  // Timeout para requisições
  timeout: 10000,

  // Cabeçalhos padrão
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptador de requisições
api.interceptors.request.use(
  async (config) => {
    // Recuperar token do AsyncStorage
    const token = await AsyncStorage.getItem('@App:token');

    // Se houver token, adiciona aos cabeçalhos
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptador de respostas
api.interceptors.response.use(
  (response) => {
    // Retorna os dados da resposta
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error(
        'Erro do servidor:',
        error.response.status,
        error.response.data
      );

      if (error.response.status === 401) {
        await AsyncStorage.removeItem('@App:token');
        await AsyncStorage.removeItem('@App:user');
        // Aqui poderia redirecionar para login, se necessário
      }
    } else if (error.request) {
      console.error('Erro de rede:', error.request);
    } else {
      console.error('Erro de configuração:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
