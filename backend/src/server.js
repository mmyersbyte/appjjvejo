import 'dotenv/config';
import http from 'node:http';
import { URL } from 'node:url';
import conectaNaDataBase from './config/dbConnect.js';
import {
  loginUsuario,
  registrarUsuario,
} from './controllers/authController.js';

const conexao = await conectaNaDataBase();

conexao.on('error', (erro) => {
  console.error('Erro de conexão', erro);
});

conexao.once('open', () => {
  console.log('Conexão com o Mongo');
});

const server = http.createServer();

// Habilitar CORS para desenvolvimento
const configurarCabecalhosCORS = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

server.addListener('request', (request, response) => {
  // Configurar CORS para todas as requisições
  configurarCabecalhosCORS(response);

  // Tratamento especial para requisições OPTIONS (preflight do CORS)
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const urlObject = new URL(`http://${request.headers.host}${request.url}`);
  console.log(`${request.method} ${urlObject.pathname}`);

  // Rotas da API
  try {
    // Rota inicial
    if (urlObject.pathname === '/' && request.method === 'GET') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          mensagem: 'OIII',
        })
      );
      return;
    }

    // Rota de registro
    if (
      urlObject.pathname === '/api/auth/registrar' &&
      request.method === 'POST'
    ) {
      registrarUsuario(request, response);
      return;
    }

    // Rota de login
    if (urlObject.pathname === '/api/auth/login' && request.method === 'POST') {
      loginUsuario(request, response);
      return;
    }

    // Rota não encontrada
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Rota não encontrada',
      })
    );
  } catch (error) {
    console.error('Erro no servidor:', error);
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
});

const PORT = process.env.PORT || 8022;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
