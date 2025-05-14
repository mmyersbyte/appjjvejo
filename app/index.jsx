'use client';

import { FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ModalCadastro from './components/modalCadastro';
import ModalLogin from './components/modalLogin';
import estilos from './estilos/styles';
import Home from './home';
import {
  getUser,
  initAuth,
  isAuthenticated,
  logout,
} from './services/authService';

export default function Index() {
  // Estados para controlar a visibilidade dos modais
  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalCadastroVisivel, setModalCadastroVisivel] = useState(false);

  // Estados para controlar a autenticação
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Efeito para verificar autenticação ao iniciar
  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        // Inicializa o serviço de autenticação
        await initAuth();

        // Verifica se o usuário está autenticado
        const estaAutenticado = await isAuthenticated();
        setAutenticado(estaAutenticado);

        // Se estiver autenticado, busca os dados do usuário
        if (estaAutenticado) {
          const dadosUsuario = await getUser();
          setUsuario(dadosUsuario);
        }
      } catch (erro) {
        console.error('Erro ao verificar autenticação:', erro);
      } finally {
        setCarregando(false);
      }
    };

    verificarAutenticacao();
  }, []);

  // Funções para abrir e fechar os modais
  const abrirModalLogin = () => {
    setModalLoginVisivel(true);
  };

  const fecharModalLogin = () => {
    setModalLoginVisivel(false);
  };

  const abrirModalCadastro = () => {
    setModalCadastroVisivel(true);
  };

  const fecharModalCadastro = () => {
    setModalCadastroVisivel(false);
  };

  // Funções de callback para login e cadastro
  const aoLogar = (usuarioLogado) => {
    setUsuario(usuarioLogado);
    setAutenticado(true);
    console.log('Usuário logado:', usuarioLogado);
    // Redirecionar para a tela principal ou atualizar a interface
  };

  const aoCadastrar = (usuarioCadastrado) => {
    setUsuario(usuarioCadastrado);
    setAutenticado(true);
    console.log('Usuário cadastrado:', usuarioCadastrado);
    // Redirecionar para a tela principal ou atualizar a interface
  };

  // Função para fazer logout
  const fazerLogout = async () => {
    try {
      await logout();
      setUsuario(null);
      setAutenticado(false);
    } catch (erro) {
      console.error('Erro ao fazer logout:', erro);
    }
  };

  // Renderização condicional baseada no estado de autenticação
  if (carregando) {
    return (
      <View style={estilos.container}>
        <LottieView
          source={require('./assets/icon.json')}
          autoPlay
          loop
          style={estilos.animacao}
        />
        <Text style={estilos.subtitulo}>Carregando...</Text>
      </View>
    );
  }

  // Se o usuário estiver autenticado, redireciona para a Home
  if (autenticado && usuario) {
    return <Home />;
  }

  // Se não estiver autenticado, mostra a tela de login/cadastro
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Já Já Vejo!</Text>

      <Text style={estilos.subtitulo}>
        Uma lista pra guardar todos os{' '}
        <Text style={estilos.subdiferente}>filmes</Text> que você vai esquecer
        de assistir.
      </Text>

      <LottieView
        source={require('./assets/icon.json')}
        autoPlay
        loop
        style={estilos.animacao}
      />

      <Text style={estilos.subtitulo2}>
        Comece agora! Escolha como deseja entrar. Esqueceu sua senha?{' '}
        <Text style={estilos.esqueci}>Clique aqui</Text>
      </Text>

      {/* Botão de Login */}
      <Pressable
        style={({ pressed }) => [
          estilos.botao,
          pressed && estilos.botaoPressionado,
        ]}
        onPress={abrirModalLogin}
      >
        <View style={estilos.linhaBotao}>
          <View style={estilos.iconeEsquerdo}>
            <FontAwesome
              name='user'
              size={24}
              color='white'
            />
          </View>
          <View style={estilos.textoCentral}>
            <Text style={estilos.textoBotao}>Login</Text>
          </View>
          <View style={estilos.iconeDireito} />
        </View>
      </Pressable>

      {/* Botaozin de Cadastro */}
      <Pressable
        style={({ pressed }) => [
          estilos.botao,
          pressed && estilos.botaoPressionado,
        ]}
        onPress={abrirModalCadastro}
      >
        <View style={estilos.linhaBotao}>
          <View style={estilos.iconeEsquerdo}>
            <FontAwesome
              name='user-plus'
              size={24}
              color='white'
            />
          </View>
          <View style={estilos.textoCentral}>
            <Text style={estilos.textoBotao}>Cadastre-se</Text>
          </View>
          <View style={estilos.iconeDireito} />
        </View>
      </Pressable>

      {/* Modais DE Logim eCadatolefkde */}
      <ModalLogin
        visivel={modalLoginVisivel}
        aoFechar={fecharModalLogin}
        aoLogar={aoLogar}
      />

      <ModalCadastro
        visivel={modalCadastroVisivel}
        aoFechar={fecharModalCadastro}
        aoCadastrar={aoCadastrar}
      />
    </View>
  );
}
