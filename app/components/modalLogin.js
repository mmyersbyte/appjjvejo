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
import { login } from '../services/authService'; // Importando o serviço de autenticação
import estilosLogin from './estilosComponentes/login'; // Importando os estilos específicos do login

/**
 * Modal de Login
 * @param {boolean} visivel - Estado de visibilidade do modal
 * @param {function} aoFechar - Função executada ao fechar o modal
 * @param {function} aoLogar - Função executada ao realizar login
 */
const ModalLogin = ({ visivel, aoFechar, aoLogar }) => {
  // Estados para controle dos campos e visibilidade da senha
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({
    email: '',
    senha: '',
    geral: '',
  });

  // Função para alternar a visibilidade da senha
  const alternarVisibilidadeSenha = () => {
    setSenhaVisivel(!senhaVisivel);
  };

  // Função para validar o email
  const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  // Função para validar os campos
  const validarCampos = () => {
    const novosErros = {
      email: '',
      senha: '',
      geral: '',
    };
    let valido = true;

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

    setErros(novosErros);
    return valido;
  };

  // Função para limpar os campos e erros
  const limparCampos = () => {
    setEmail('');
    setSenha('');
    setErros({
      email: '',
      senha: '',
      geral: '',
    });
  };

  // Função para realizar o login
  const realizarLogin = async () => {
    // Validação dos campos
    if (!validarCampos()) {
      return;
    }

    try {
      setCarregando(true);

      // Chama o serviço de autenticação para fazer login
      const resultado = await login(email, senha);

      // Chama a função de callback passada como prop
      if (aoLogar) {
        aoLogar(resultado.usuario);
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
            : 'Erro ao realizar login. Verifique suas credenciais.';

        setErros({
          ...erros,
          geral: mensagemErro,
        });
      } else {
        // Erro de rede ou outro
        setErros({
          ...erros,
          geral: 'Falha na conexão. Verifique sua internet e tente novamente.',
        });
      }
      console.error('Erro no login:', erro);
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
          style={estilosLogin.centeredView}
        >
          <View
            style={[estilosLogin.modalView, isSmallScreen && { padding: 15 }]}
          >
            {/* Título do modal */}
            <Text style={estilosLogin.modalTitulo}>Login</Text>

            {/* Mensagem de erro geral */}
            {erros.geral ? (
              <Text style={estilosLogin.mensagemErro}>{erros.geral}</Text>
            ) : null}

            {/* Campo de email */}
            <View style={estilosLogin.campoContainer}>
              <Text style={estilosLogin.campoLabel}>Email</Text>
              <TextInput
                style={estilosLogin.campoInput}
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
                <Text style={estilosLogin.mensagemErro}>{erros.email}</Text>
              ) : null}
            </View>

            {/* Campo de senha */}
            <View style={estilosLogin.campoContainer}>
              <Text style={estilosLogin.campoLabel}>Senha</Text>
              <View style={estilosLogin.campoSenhaContainer}>
                <TextInput
                  style={estilosLogin.campoSenhaInput}
                  placeholder='Sua senha'
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
                  style={estilosLogin.iconeOlho}
                >
                  <FontAwesome
                    name={senhaVisivel ? 'eye-slash' : 'eye'}
                    size={20}
                    color={estilos.CORES.corPrimaria}
                  />
                </Pressable>
              </View>
              {erros.senha ? (
                <Text style={estilosLogin.mensagemErro}>{erros.senha}</Text>
              ) : null}
            </View>

            {/* Botões de ação */}
            <View style={estilosLogin.modalBotoesContainer}>
              <Pressable
                style={({ pressed }) => [
                  estilosLogin.botaoModal,
                  estilosLogin.botaoCancelar,
                  pressed && estilosLogin.botaoPressionado,
                ]}
                onPress={aoFechar}
              >
                <Text style={estilosLogin.textoBotaoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  estilosLogin.botaoModal,
                  estilosLogin.botaoAcao,
                  pressed && estilosLogin.botaoPressionado,
                ]}
                onPress={realizarLogin}
                disabled={carregando}
              >
                <Text style={estilosLogin.textoBotaoAcao}>
                  {carregando ? 'Entrando...' : 'Entrar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalLogin;
