/**
 * Configura os cabeçalhos CORS na resposta
 * @param {Object} res - Objeto de resposta HTTP
 */
export function configurarCORS(res) {
  // Permite acesso de qualquer origem (*)
  // Em produção, você pode querer limitar isso para origens específicas
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Métodos HTTP permitidos
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );

  // Cabeçalhos permitidos nas requisições
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  // Permite envio de cookies em requisições cross-origin (necessário para algumas autenticações)
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Tempo (em segundos) que o resultado da requisição preflight pode ser cacheado
  res.setHeader('Access-Control-Max-Age', '86400');
}

/**
 * Processa requisições OPTIONS (preflight)
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Boolean} - Retorna true se a requisição era OPTIONS e foi tratada
 */
export function lidarComPreflightCORS(req, res) {
  if (req.method === 'OPTIONS') {
    // Responde com status 204 (No Content) para requisições preflight
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}
