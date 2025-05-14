import { URL } from 'node:url';
import { processarRotasAuth } from './authRoutes.js';

/**
 * Processa todas as rotas da aplicação
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Boolean} - Retorna true se alguma rota foi processada, false caso contrário
 */
export default function processarRotas(req, res) {
  try {
    // Converte a URL da req em um obj url para facilitar manipulação
    //Aprendi isso com o Danilo Porto da # KAKAAK
    const urlObj = new URL(`http://${req.headers.host}${req.url}`);
    console.log(`${req.method} ${urlObj.pathname}`); // testes

    // Rota raiz da API
    if (urlObj.pathname === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          mensagem: 'API de autenticação funcionando',
          versao: '1.0.0',
          endpoints: [
            '/api/auth/registrar - POST - Registrar novo usuário',
            '/api/auth/login - POST - Fazer login',
          ],
        })
      );
      return true;
    }

    // Verifica se a rota é de autenticação
    if (processarRotasAuth(req, res, urlObj)) {
      return true;
    }

    // Se chegou até aqui, nenhuma rota foi acjada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Rota não encontrada',
      })
    );
    return true;
  } catch (error) {
    // Tratamento de erro
    console.error('Erro ao processar rota:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
    return true;
  }
}
