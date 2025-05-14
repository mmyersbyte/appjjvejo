'use client';

import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import estilos from '../estilos/styles'; // Importando as cores globais
import { registrar } from '../services/authService'; // Importando o serviço de autenticação
import estilosCadastro from './estilosComponentes/cadastro'; // Importando os estilos específicos do cadastro

/**
 * Modal de Cadastro
 * @param {boolean} visivel - Estado de visibilidade do modal
 * @param {function} aoFechar - Função executada ao fechar o modal
 * @param {function} aoCadastrar - Função executada ao realizar cadastro
 */
const ModalCadastro = ({ visivel, aoFechar, aoCadastrar }) => {
  // Estados para controle dos campos e visibilidade das senhas
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmacaoSenhaVisivel, setConfirmacaoSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    geral: '',
  });

  // Funções para alternar a visibilidade das senhas
  const alternarVisibilidadeSenha = () => {
    setSenhaVisivel(!senhaVisivel);
  };

  const alternarVisibilidadeConfirmacaoSenha = () => {
    setConfirmacaoSenhaVisivel(!confirmacaoSenhaVisivel);
  };

  // Função para validar o email
  const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  // Função para validar os campos
  const validarCampos = () => {
    const novosErros = {
      nome: '',
      email: '',
      senha: '',
      confirmacaoSenha: '',
      geral: '',
    };
    let valido = true;

    // Validar nome
    if (!nome) {
      novosErros.nome = 'O nome é obrigatório';
      valido = false;
    } else if (nome.length < 3) {
      novosErros.nome = 'O nome deve ter pelo menos 3 caracteres';
      valido = false;
    }

    // Validar email
    if (!email) {
      novosErros.email = 'O email é obrigatório';
      valido = false;
    } else if (!validarEmail(email)) {
      novosErros.email = 'Digite um email válido';
      valido = false;
    }

    // Validar senha
    if (!senha) {
      novosErros.senha = 'A senha é obrigatória';
      valido = false;
    } else if (senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';
      valido = false;
    }

    // Validar confirmação de senha
    if (!confirmacaoSenha) {
      novosErros.confirmacaoSenha = 'A confirmação de senha é obrigatória';
      valido = false;
    } else if (senha !== confirmacaoSenha) {
      novosErros.confirmacaoSenha = 'As senhas não coincidem';
      valido = false;
    }

    setErros(novosErros);
    return valido;
  };

  // Função para limpar os campos e erros
  const limparCampos = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmacaoSenha('');
    setErros({
      nome: '',
      email: '',
      senha: '',
      confirmacaoSenha: '',
      geral: '',
    });
  };

  // Função para realizar o cadastro
  const realizarCadastro = async () => {
    // Validação dos campos
    if (!validarCampos()) {
      return;
    }

    try {
      setCarregando(true);

      // Chama o serviço de autenticação para registrar usuário
      const resultado = await registrar(nome, email, senha);

      // Chama a função de callback passada como prop
      if (aoCadastrar) {
        aoCadastrar(resultado.usuario);
      }

      // Limpa os campos e fecha o modal
      limparCampos();
      aoFechar();
    } catch (erro) {
      // Tratamento de erros específicos da API
      if (erro.response) {
        // Erro retornado pelo servidor
        const mensagemErro =
          erro.response.data && erro.response.data.mensagem
            ? erro.response.data.mensagem
            : 'Erro ao realizar cadastro. Tente novamente.';

        // Verificar se é erro de email já cadastrado
        if (erro.response.status === 409) {
          setErros({
            ...erros,
            email: 'Este email já está cadastrado',
          });
        } else {
          setErros({
            ...erros,
            geral: mensagemErro,
          });
        }
      } else {
        // Erro de rede ou outro
        setErros({
          ...erros,
          geral: 'Falha na conexão. Verifique sua internet e tente novamente.',
        });
      }
      console.error('Erro no cadastro:', erro);
    } finally {
      setCarregando(false);
    }
  };

  // Dimensões da tela para ajustar o modal
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = width < 375 || height < 667;

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visivel}
      onRequestClose={aoFechar}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={estilosCadastro.centeredView}
        >
          <View
            style={[
              estilosCadastro.modalView,
              isSmallScreen && { padding: 15 },
            ]}
          >
            {/* Título do modal */}
            <Text style={estilosCadastro.modalTitulo}>Cadastro</Text>

            {/* Mensagem de erro geral */}
            {erros.geral ? (
              <Text style={estilosCadastro.mensagemErro}>{erros.geral}</Text>
            ) : null}

            {/* Campo de nome */}
            <View style={estilosCadastro.campoContainer}>
              <Text style={estilosCadastro.campoLabel}>Nome</Text>
              <TextInput
                style={estilosCadastro.campoInput}
                placeholder='Seu nome completo'
                placeholderTextColor='#999'
                value={nome}
                onChangeText={(texto) => {
                  setNome(texto);
                  if (erros.nome) {
                    setErros({ ...erros, nome: '' });
                  }
                }}
                maxLength={50} // Limitar o número de caracteres
                multiline={false} // Impedir múltiplas linhas
              />
              {erros.nome ? (
                <Text style={estilosCadastro.mensagemErro}>{erros.nome}</Text>
              ) : null}
            </View>

            {/* Campo de email */}
            <View style={estilosCadastro.campoContainer}>
              <Text style={estilosCadastro.campoLabel}>Email</Text>
              <TextInput
                style={estilosCadastro.campoInput}
                placeholder='Seu email'
                placeholderTextColor='#999'
                keyboardType='email-address'
                autoCapitalize='none'
                value={email}
                onChangeText={(texto) => {
                  setEmail(texto);
                  if (erros.email) {
                    setErros({ ...erros, email: '' });
                  }
                }}
                maxLength={50} // Limitar o número de caracteres
                multiline={false} // Impedir múltiplas linhas
              />
              {erros.email ? (
                <Text style={estilosCadastro.mensagemErro}>{erros.email}</Text>
              ) : null}
            </View>

            {/* Campo de senha */}
            <View style={estilosCadastro.campoContainer}>
              <Text style={estilosCadastro.campoLabel}>Senha</Text>
              <View style={estilosCadastro.campoSenhaContainer}>
                <TextInput
                  style={estilosCadastro.campoSenhaInput}
                  placeholder='Crie uma senha'
                  placeholderTextColor='#999'
                  secureTextEntry={!senhaVisivel}
                  value={senha}
                  onChangeText={(texto) => {
                    setSenha(texto);
                    if (erros.senha) {
                      setErros({ ...erros, senha: '' });
                    }
                  }}
                  maxLength={30} // Limitar o número de caracteres
                  multiline={false} // Impedir múltiplas linhas
                />
                <Pressable
                  onPress={alternarVisibilidadeSenha}
                  style={estilosCadastro.iconeOlho}
                >
                  <FontAwesome
                    name={senhaVisivel ? 'eye-slash' : 'eye'}
                    size={20}
                    color={estilos.CORES.corPrimaria}
                  />
                </Pressable>
              </View>
              {erros.senha ? (
                <Text style={estilosCadastro.mensagemErro}>{erros.senha}</Text>
              ) : null}
            </View>

            {/* Campo de confirmação de senha */}
            <View style={estilosCadastro.campoContainer}>
              <Text style={estilosCadastro.campoLabel}>Confirmar Senha</Text>
              <View style={estilosCadastro.campoSenhaContainer}>
                <TextInput
                  style={estilosCadastro.campoSenhaInput}
                  placeholder='Confirme sua senha'
                  placeholderTextColor='#999'
                  secureTextEntry={!confirmacaoSenhaVisivel}
                  value={confirmacaoSenha}
                  onChangeText={(texto) => {
                    setConfirmacaoSenha(texto);
                    if (erros.confirmacaoSenha) {
                      setErros({ ...erros, confirmacaoSenha: '' });
                    }
                  }}
                  maxLength={30} // Limitar o número de caracteres
                  multiline={false} // Impedir múltiplas linhas
                />
                <Pressable
                  onPress={alternarVisibilidadeConfirmacaoSenha}
                  style={estilosCadastro.iconeOlho}
                >
                  <FontAwesome
                    name={confirmacaoSenhaVisivel ? 'eye-slash' : 'eye'}
                    size={20}
                    color={estilos.CORES.corPrimaria}
                  />
                </Pressable>
              </View>
              {erros.confirmacaoSenha ? (
                <Text style={estilosCadastro.mensagemErro}>
                  {erros.confirmacaoSenha}
                </Text>
              ) : null}
            </View>

            {/* Botões de ação */}
            <View style={estilosCadastro.modalBotoesContainer}>
              <Pressable
                style={({ pressed }) => [
                  estilosCadastro.botaoModal,
                  estilosCadastro.botaoCancelar,
                  pressed && estilosCadastro.botaoPressionado,
                ]}
                onPress={aoFechar}
              >
                <Text style={estilosCadastro.textoBotaoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  estilosCadastro.botaoModal,
                  estilosCadastro.botaoAcao,
                  pressed && estilosCadastro.botaoPressionado,
                ]}
                onPress={realizarCadastro}
                disabled={carregando}
              >
                <Text style={estilosCadastro.textoBotaoAcao}>
                  {carregando ? 'Cadastrando...' : 'Cadastrar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalCadastro;
