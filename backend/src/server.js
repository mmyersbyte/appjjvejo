import 'dotenv/config';
import http from 'node:http';
import conectaNaDataBase from './config/dbConnect.js'; // Função para conectar ao MongoDB
import {
  configurarCORS,
  lidarComPreflightCORS,
} from './middlewares/corsMiddleware.js'; // Middleware de CORS
import processarRotas from './routes/index.js'; // Sistema de roteamento

const conexao = await conectaNaDataBase();

// Configura listeners para eventos da conexão com o banco de dados
conexao.on('error', (erro) => {
  console.error('DEU RUIM!!:', erro);
});

conexao.once('open', () => {
  console.log('CONECTADO AO ATLAS');
});

const server = http.createServer();

server.addListener('request', (request, response) => {
  try {
    // Aplica middleware de CORS em todas as requisições
    configurarCORS(response);

    // Trata requisições preflight do CORS (método OPTIONS)
    if (lidarComPreflightCORS(request, response)) {
      return; // Se foi uma requisição OPTIONS, encerra o processamento
    }

    // Encaminha a requisição para o sistema de roteamento
    processarRotas(request, response);
  } catch (error) {
    // Tratamento de erro
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
  console.log(` Server rodando na porta ${PORT}`);
});
