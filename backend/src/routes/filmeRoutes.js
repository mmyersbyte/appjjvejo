import { URL } from 'node:url';
import {
  cadastrarFilme,
  deleteFilme,
  getFilmes,
  updateFilme,
} from '../controllers/filmeController.js';

/**
 * Função que processa rotas relacionadas aos filmes
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @param {URL} urlObj - Objeto URL parseado da requisição
 * @returns {Boolean} - Retorna true se a rota foi encontrada e processada, false caso contrário
 */
export function processarRotasFilme(req, res, urlObj) {
  // Rota para listar todos os filmes
  if (urlObj.pathname === '/api/filmes' && req.method === 'GET') {
    getFilmes(req, res);
    return true;
  }

  // Rota para cadastrar um novo filme
  if (urlObj.pathname === '/api/filmes' && req.method === 'POST') {
    cadastrarFilme(req, res);
    return true;
  }

  // Rotas que precisam de ID do filme
  const matchFilmeId = urlObj.pathname.match(/^\/api\/filmes\/([^\/]+)$/);

  if (matchFilmeId) {
    const filmeId = matchFilmeId[1];

    // Rota para atualizar filme
    if (req.method === 'PUT') {
      updateFilme(req, res, filmeId);
      return true;
    }

    // Rota para deletar filme
    if (req.method === 'DELETE') {
      deleteFilme(req, res, filmeId);
      return true;
    }
  }

  // Nenhuma rota de filme encontrada
  return false;
}
