import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Chaves para armazenamento no AsyncStorage
const TOKEN_KEY = '@App:token';
const USER_KEY = '@App:user';

/**
 * Realiza ologin
 * @param {string} email
 * @param {string} senha
 * @returns {Promise}
 */
export const login = async (email, senha) => {
  try {
    // Faz a requisição de login para o backend
    const response = await api.post('/api/auth/login', { email, senha });

    // Extrai o token e dados do usuário da resposta
    const { token, usuario } = response.data;

    // Armazena o token e usuário no AsyncStorage
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));

    // Configura o token no cabeçalho para próximas requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { usuario, token };
  } catch (error) {
    // Repropaga o erro para ser tratado pelo componente
    throw error;
  }
};

/**
 * Registra um novo usuário
 * @param {string} nome
 * @param {string} email
 * @param {string} senha
 * @returns {Promise} - Promise com dados do usuário registrado e token
 */
export const registrar = async (nome, email, senha) => {
  try {
    // Faz a requisição de registro para o backend
    const response = await api.post('/api/auth/registrar', {
      nome,
      email,
      senha,
    });

    // Extrai o token e dados do usuário da resposta
    const { token, usuario } = response.data;

    // Armazena o token e usuário no AsyncStorage
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));

    // Configura o token no cabeçalho para próximas requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { usuario, token };
  } catch (error) {
    // Repropaga o erro para ser tratado pelo componente
    throw error;
  }
};

/**
 * Realiza o logout do usuário
 * @returns {Promise} - Promise de conclusão do logout
 */
export const logout = async () => {
  // Remove token e usuário do AsyncStorage
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);

  // Remove o token do cabeçalho das requisições
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Verifica se o usuário está autenticado
 * @returns {Promise<boolean>} - Promise com status de autenticação
 */
export const isAuthenticated = async () => {
  // Verifica se existe um token armazenado
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return !!token;
};

/**
 * Recupera o token armazenado
 * @returns {Promise<string>} - Promise com o token
 */
export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

/**
 * @returns {Promise<Object>}
 */
export const getUser = async () => {
  const userStr = await AsyncStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Inicializa o serviço de autenticação
 * Chamada no início da aplicação para configurar o token
 */
export const initAuth = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
