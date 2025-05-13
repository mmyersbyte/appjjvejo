import 'dotenv/config';
import http from 'node:http';
import { URL } from 'node:url';
import conectaNaDataBase from './config/dbConnect.js';
const conexao = await conectaNaDataBase();

conexao.on('error', (erro) => {
  console.error('Erro de conexão', erro);
});

conexao.once('open', () => {
  console.log('Conexão com o Mongo');
});
const server = http.createServer();

server.addListener('request', (request, response) => {
  const urlObject = new URL(`http://${request.headers.host}${request.url}`);
  console.log(urlObject);

  if (urlObject.pathname === '/' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write('olá');
    response.end();
    return;
  }
});

server.listen(8022, () => {
  console.log('Servidor RODANDO');
});
