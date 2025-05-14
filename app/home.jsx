import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalAdicionarFilme from './components/modalAdicionarFilme';
import styles from './estilos/stylesHome';
import { getUser, logout } from './services/authService';
import { cadastrarFilme, listarFilmes } from './services/filmeService';

export default function Home({ onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const dadosUsuario = await getUser();
        setUsuario(dadosUsuario);
      } catch (erro) {
        console.log('Deu ruim ao pegar dados do usuário:', erro);
      }
    };

    carregarUsuario();
  }, []);

  // Efeito para carregar a lista de filmes ao iniciar
  useEffect(() => {
    buscarFilmes();
  }, []);

  // Função para buscar filmes da API
  const buscarFilmes = async () => {
    try {
      setCarregando(true);
      const filmesCarregados = await listarFilmes();

      // Mapear dados para garantir compatibilidade com o componente
      const filmesFormatados = filmesCarregados.map((filme) => ({
        id: filme._id,
        nome: filme.nomeFilme,
        imagem:
          filme.imagemFilme ||
          'https://i.pinimg.com/736x/37/1d/09/371d09b7cceed0256e8ad4f01b9fa9d8.jpg',
        dataLancamento: filme.dataAssistir || new Date().toISOString(),
        descricao: filme.descricao || '',
      }));

      setFilmes(filmesFormatados);
    } catch (erro) {
      console.error('Erro ao buscar filmes:', erro);
      Alert.alert('Erro', 'Não foi possível carregar os filmes.');
    } finally {
      setCarregando(false);
    }
  };

  const fazerLogout = async () => {
    try {
      await logout();

      if (onLogout) {
        onLogout();
      } else {
        alert('Função de logout não configurada corretamente');
      }
    } catch (erro) {
      console.log('Ops! Erro ao fazer logout:', erro);
      alert('Não consegui te deslogar. Tenta de novo!');
    }
  };

  const adicionarNovoFilme = async (novoFilme) => {
    try {
      // Preparar dados no formato esperado pela API
      const dadosFilmeAPI = {
        nomeFilme: novoFilme.nome,
        imagemFilme: novoFilme.imagem,
        dataAssistir: novoFilme.dataLancamento,
        descricao: novoFilme.descricao,
      };

      // Chamar a API para cadastrar o filme
      const filmeAdicionado = await cadastrarFilme(dadosFilmeAPI);

      // Atualizar a lista de filmes após o cadastro
      await buscarFilmes();

      Alert.alert('Sucesso', 'Filme adicionado com sucesso!', [{ text: 'OK' }]);

      return true;
    } catch (erro) {
      console.error('Erro ao adicionar filme:', erro);
      Alert.alert(
        'Erro',
        'Não foi possível adicionar o filme. Tente novamente.',
        [{ text: 'OK' }]
      );
      throw erro;
    }
  };

  const renderizarFilme = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      key={item.id}
    >
      <ImageBackground
        source={{ uri: item.imagem }}
        style={styles.cartao}
        imageStyle={styles.imagemCartao}
      >
        <View style={styles.gradienteCartao}>
          <Text style={styles.tituloCartao}>{item.nome}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  // Espaçador entre os itens da lista
  const ItemSeparator = () => <View style={{ height: 16 }} />;

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Header */}
      <View style={styles.cabecalho}>
        <View style={styles.infoUsuario}>
          <Text style={styles.saudacao}>Olá {usuario?.nome || 'Usuário'}</Text>
          <Text style={styles.biografia}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
          </Text>
        </View>
        <View style={styles.perfilContainer}>
          <Image
            source={{
              uri: 'https://i.pinimg.com/736x/57/ca/8f/57ca8fc8ed53388ae9032a4df7f06234.jpg',
            }}
            style={styles.imagemPerfil}
          />

          {/* Botão de logout abaixo da foto de perfil */}
          <TouchableOpacity
            style={styles.botaoLogout}
            onPress={fazerLogout}
          >
            <FontAwesome
              name='sign-out'
              size={16}
              color='#EEEEEE'
            />
            <Text style={styles.textoLogout}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separador} />

      {/* Main Content */}
      <View style={[styles.principal, { flex: 1 }]}>
        <FlatList
          data={filmes}
          renderItem={renderizarFilme}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }} // Espaço para não esconder o último item atrás do botão
          style={{ flex: 1 }} // Para ocupar todo o espaço disponível
          extraData={filmes} // Força a atualização da lista quando o estado muda
          refreshing={carregando}
          onRefresh={buscarFilmes}
        />
      </View>

      {/* BOTÃO PARA ADICIONAR NOVO FILME */}
      <TouchableOpacity
        style={styles.botaoAddFilme}
        activeOpacity={0.7}
        onPress={() => setModalVisivel(true)}
      >
        <FontAwesome
          name='plus'
          size={20}
          color='#EEEEEE'
          style={styles.iconeAddFilme}
        />
        <Text style={styles.textoAddFilme}>Novo Filme</Text>
      </TouchableOpacity>

      {/* Modal para adicionar novo filme */}
      <ModalAdicionarFilme
        visivel={modalVisivel}
        aoFechar={() => setModalVisivel(false)}
        aoAdicionar={adicionarNovoFilme}
      />
    </SafeAreaView>
  );
}
