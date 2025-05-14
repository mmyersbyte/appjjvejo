import jwt from 'jsonwebtoken';
import AddFilme from '../models/AddFilme.js';

// Chave secreta para verificar o JWT (deve ser a mesma usada no authController)
const JWT_SECRET = process.env.JWT_SECRET || 'chave_blablabla';

// Função para extrair o corpo da requisição em uma API HTTP sem frameworks
const extrairCorpo = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let corpo = '';

      req.on('data', (chunk) => {
        corpo += chunk.toString();
      });

      req.on('end', () => {
        try {
          const dadosJSON = JSON.parse(corpo);
          resolve(dadosJSON);
        } catch (error) {
          reject(new Error('Erro ao fazer parse do JSON'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Função para extrair o ID do usuário a partir do token JWT
 * @param {Object} req - Objeto de requisição HTTP
 * @returns {String} ID do usuário ou null se não autenticado
 */
const extrairUsuarioId = (req) => {
  try {
    // Verificar se há token de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null;
    }

    // Formato esperado: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return null;
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id; // ID do usuário está no payload do token
  } catch (error) {
    console.error('Erro ao extrair ID do usuário:', error);
    return null;
  }
};

/**
 * Função para cadastrar um novo filme
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 */
export async function cadastrarFilme(req, res) {
  try {
    // Extrair o ID do usuário do token
    const usuarioId = extrairUsuarioId(req);
    if (!usuarioId) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Usuário não autenticado',
        })
      );
      return;
    }

    // Extrair dados do corpo da requisição
    const dadosFilme = await extrairCorpo(req);

    // Verificar se o campo obrigatório está presente
    if (!dadosFilme.nomeFilme) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'O campo nomeFilme é obrigatório',
        })
      );
      return;
    }

    // Criar um novo filme associado ao usuário atual
    const novoFilme = new AddFilme({
      nomeFilme: dadosFilme.nomeFilme,
      imagemFilme: dadosFilme.imagemFilme || '',
      dataAssistir: dadosFilme.dataAssistir || null,
      descricao: dadosFilme.descricao || '',
      usuario: usuarioId, // Associar ao usuário atual
    });

    // Salvar o filme no banco de dados
    await novoFilme.save();

    // Retornar resposta de sucesso
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: false,
        mensagem: 'Filme cadastrado com sucesso',
        filme: novoFilme,
      })
    );
  } catch (error) {
    console.error('Erro ao cadastrar filme:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
}

/**
 * Função para obter todos os filmes cadastrados do usuário atual
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 */
export async function getFilmes(req, res) {
  try {
    // Extrair o ID do usuário do token
    const usuarioId = extrairUsuarioId(req);
    if (!usuarioId) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Usuário não autenticado',
        })
      );
      return;
    }

    // Buscar apenas os filmes associados ao usuário atual
    const filmes = await AddFilme.find({ usuario: usuarioId });

    // Retornar a lista de filmes
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: false,
        quantidade: filmes.length,
        filmes,
      })
    );
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
}

/**
 * Função para deletar um filme
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @param {String} id - ID do filme a ser deletado
 */
export async function deleteFilme(req, res, id) {
  try {
    // Extrair o ID do usuário do token
    const usuarioId = extrairUsuarioId(req);
    if (!usuarioId) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Usuário não autenticado',
        })
      );
      return;
    }

    // Verificar se o ID foi fornecido
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'ID do filme não fornecido',
        })
      );
      return;
    }

    // Buscar o filme para verificar se pertence ao usuário atual
    const filme = await AddFilme.findById(id);

    // Verificar se o filme existe
    if (!filme) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Filme não encontrado',
        })
      );
      return;
    }

    // Verificar se o filme pertence ao usuário atual
    if (filme.usuario.toString() !== usuarioId) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Você não tem permissão para excluir este filme',
        })
      );
      return;
    }

    // Deletar o filme
    await AddFilme.findByIdAndDelete(id);

    // Retornar resposta de sucesso
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: false,
        mensagem: 'Filme removido com sucesso',
      })
    );
  } catch (error) {
    console.error('Erro ao deletar filme:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
}

/**
 * Função para atualizar os dados de um filme
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @param {String} id - ID do filme a ser atualizado
 */
export async function updateFilme(req, res, id) {
  try {
    // Extrair o ID do usuário do token
    const usuarioId = extrairUsuarioId(req);
    if (!usuarioId) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Usuário não autenticado',
        })
      );
      return;
    }

    // Verificar se o ID foi fornecido
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'ID do filme não fornecido',
        })
      );
      return;
    }

    // Buscar o filme para verificar se pertence ao usuário atual
    const filme = await AddFilme.findById(id);

    // Verificar se o filme existe
    if (!filme) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Filme não encontrado',
        })
      );
      return;
    }

    // Verificar se o filme pertence ao usuário atual
    if (filme.usuario.toString() !== usuarioId) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Você não tem permissão para atualizar este filme',
        })
      );
      return;
    }

    // Extrair dados do corpo da requisição
    const dadosFilme = await extrairCorpo(req);

    // Verificar se há dados para atualizar
    if (Object.keys(dadosFilme).length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Nenhum dado fornecido para atualização',
        })
      );
      return;
    }

    // Garantir que o usuário não seja alterado na atualização
    delete dadosFilme.usuario;

    // Atualizar o filme
    const filmeAtualizado = await AddFilme.findByIdAndUpdate(
      id,
      { $set: dadosFilme },
      { new: true, runValidators: true }
    );

    // Retornar resposta de sucesso
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: false,
        mensagem: 'Filme atualizado com sucesso',
        filme: filmeAtualizado,
      })
    );
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
}
