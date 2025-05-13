'use client';

import { FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ModalCadastro from './components/modalCadastro';
import ModalLogin from './components/modalLogin';
import estilos from './estilos/styles';

export default function Index() {
  // Estados para controlar a visibilidade dos modais
  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalCadastroVisivel, setModalCadastroVisivel] = useState(false);

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
  const aoLogar = (usuario) => {
    console.log('Usuário logado:', usuario);
    // Depois vou fazer a lógica para o login veyr
  };

  const aoCadastrar = (usuario) => {
    console.log('Usuário cadastrado:', usuario);
    // Depois vou fazer a lógica para o cadastro veyr
  };

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
