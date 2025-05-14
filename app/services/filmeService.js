/**
 * Serviço para gerenciar operações relacionadas a filmes
 * Fornece métodos para criar, listar, atualizar e excluir filmes
 */

import api from './api';

/**
 * Busca todos os filmes cadastrados
 * @returns {Promise} Promise que resolve para um array de filmes
 */
export const listarFilmes = async () => {
  try {
    const resposta = await api.get('/api/filmes');
    return resposta.data.filmes;
  } catch (erro) {
    console.error('Erro ao listar filmes:', erro);
    throw erro;
  }
};

/**
 * Cadastra um novo filme
 * @param {Object} dadosFilme - Dados do filme a ser cadastrado
 * @param {string} dadosFilme.nomeFilme - Nome do filme (obrigatório)
 * @param {string} dadosFilme.imagemFilme - URL da imagem do filme
 * @param {string} dadosFilme.dataAssistir - Data quando pretende assistir
 * @param {string} dadosFilme.descricao - Descrição do filme
 * @returns {Promise} Promise que resolve para o filme cadastrado
 */
export const cadastrarFilme = async (dadosFilme) => {
  try {
    const resposta = await api.post('/api/filmes', dadosFilme);
    return resposta.data.filme;
  } catch (erro) {
    console.error('Erro ao cadastrar filme:', erro);
    throw erro;
  }
};

/**
 * Atualiza um filme existente
 * @param {string} id - ID do filme a ser atualizado
 * @param {Object} dadosFilme - Dados do filme a serem atualizados
 * @returns {Promise} Promise que resolve para o filme atualizado
 */
export const atualizarFilme = async (id, dadosFilme) => {
  try {
    const resposta = await api.put(`/api/filmes/${id}`, dadosFilme);
    return resposta.data.filme;
  } catch (erro) {
    console.error('Erro ao atualizar filme:', erro);
    throw erro;
  }
};

/**
 * Exclui um filme
 * @param {string} id - ID do filme a ser excluído
 * @returns {Promise} Promise que resolve para a mensagem de sucesso
 */
export const excluirFilme = async (id) => {
  try {
    const resposta = await api.delete(`/api/filmes/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao excluir filme:', erro);
    throw erro;
  }
};

/**
 * Busca um filme específico pelo ID
 * @param {string} id - ID do filme a ser buscado
 * @returns {Promise} Promise que resolve para o filme encontrado
 */
export const buscarFilmePorId = async (id) => {
  try {
    const resposta = await api.get(`/api/filmes/${id}`);
    return resposta.data.filme;
  } catch (erro) {
    console.error('Erro ao buscar filme:', erro);
    throw erro;
  }
};
