import { URL } from 'node:url';
import {
  loginUsuario,
  registrarUsuario,
} from '../controllers/authController.js';

/**
 * Função que processa rotas relacionadas à autenticação
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @param {URL} urlObj - Objeto URL parseado da requisição
 * @returns {Boolean} - Retorna true se a rota foi encontrada e processada, false caso contrário
 */
export function processarRotasAuth(req, res, urlObj) {
  // Rota para registro de novos usuários
  if (urlObj.pathname === '/api/auth/registrar' && req.method === 'POST') {
    registrarUsuario(req, res);
    return true;
  }

  // Rota para login de usuários
  if (urlObj.pathname === '/api/auth/login' && req.method === 'POST') {
    loginUsuario(req, res);
    return true;
  }

  // Nenhuma rota encontrada
  return false;
}
