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

export default function Home({ onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filmes, setFilmes] = useState([
    {
      id: '1',
      nome: 'Aventura Espacial',
      imagem:
        'https://i.pinimg.com/736x/37/1d/09/371d09b7cceed0256e8ad4f01b9fa9d8.jpg',
      dataLancamento: new Date().toISOString(),
      descricao: 'Uma aventura pelo espaço sideral.',
    },
    {
      id: '2',
      nome: 'Drama Científico',
      imagem:
        'https://i.pinimg.com/736x/37/1d/09/371d09b7cceed0256e8ad4f01b9fa9d8.jpg',
      dataLancamento: new Date().toISOString(),
      descricao: 'Um drama sobre descobertas científicas.',
    },
  ]);

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
      // TODO: Fazer uma chamada de API para salvar o filme
      // Por enquanto vamos apenas adicionar localmente

      // Gerar ID único usando timestamp ao invés do comprimento do array
      const novoId = Date.now().toString();

      const novoArrayFilmes = [
        ...filmes,
        {
          id: novoId,
          ...novoFilme,
        },
      ];

      // Atualizar o estado com o novo array de filmes
      setFilmes(novoArrayFilmes);

      // Verificar se o estado foi atualizado corretamente
      console.log('Filme adicionado:', novoArrayFilmes);

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
