import AddFilme from '../models/AddFilme.js';

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
 * Função para cadastrar um novo filme
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 */
export async function cadastrarFilme(req, res) {
  try {
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

    // Criar um novo filme
    const novoFilme = new AddFilme({
      nomeFilme: dadosFilme.nomeFilme,
      imagemFilme: dadosFilme.imagemFilme || '',
      dataAssistir: dadosFilme.dataAssistir || null,
      descricao: dadosFilme.descricao || '',
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
 * Função para obter todos os filmes cadastrados
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 */
export async function getFilmes(req, res) {
  try {
    // Buscar todos os filmes no banco de dados
    const filmes = await AddFilme.find();

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

    // Buscar e deletar o filme pelo ID
    const filmeRemovido = await AddFilme.findByIdAndDelete(id);

    // Verificar se o filme foi encontrado
    if (!filmeRemovido) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Filme não encontrado',
        })
      );
      return;
    }

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

    // Buscar e atualizar o filme
    const filmeAtualizado = await AddFilme.findByIdAndUpdate(
      id,
      { $set: dadosFilme },
      { new: true, runValidators: true }
    );

    // Verificar se o filme foi encontrado
    if (!filmeAtualizado) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Filme não encontrado',
        })
      );
      return;
    }

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
