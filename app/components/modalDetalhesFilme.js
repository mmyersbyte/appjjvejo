import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import estilosAdicionarFilme from './estilosComponentes/adicionarFilme'; // Reusando estilos do modal existente

/**
 * Modal para exibir, editar e excluir um filme
 * @param {boolean} visivel - Estado de visibilidade do modal
 * @param {object} filme - Dados do filme a ser exibido/editado
 * @param {function} aoFechar - Função executada ao fechar o modal
 * @param {function} aoEditar - Função executada ao editar um filme
 * @param {function} aoDeletar - Função executada ao deletar um filme
 */
const ModalDetalhesFilme = ({
  visivel,
  filme,
  aoFechar,
  aoEditar,
  aoDeletar,
}) => {
  // Estados principais
  const [modoEdicao, setModoEdicao] = useState(false);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);

  // Estados para formulário de edição
  const [nomeFilme, setNomeFilme] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [dataAssistir, setDataAssistir] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({
    nomeFilme: '',
    geral: '',
  });

  // Solicitar permissões ao montar o componente
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Precisamos de permissão para acessar suas imagens!');
        }
      })();
    }
  }, []);

  // Inicializar formulário quando o filme mudar
  useEffect(() => {
    if (filme) {
      setNomeFilme(filme.nome || '');
      // Inicializar imagemSelecionada com base na URL da imagem existente
      if (filme.imagem) {
        setImagemSelecionada({ uri: filme.imagem });
      } else {
        setImagemSelecionada(null);
      }
      setDataAssistir(
        filme.dataLancamento ? new Date(filme.dataLancamento) : null
      );
      setDescricao(filme.descricao || '');
    }
  }, [filme]);

  // Formatar data para exibição
  const formatarData = (data) => {
    if (!data) return 'Data não definida';

    const dataObj = typeof data === 'string' ? new Date(data) : data;

    return `${dataObj.getDate().toString().padStart(2, '0')}/${(
      dataObj.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${dataObj.getFullYear()}`;
  };

  // Função para abrir o seletor de data
  const abrirDatePicker = () => {
    Keyboard.dismiss();
    setMostrarDatePicker(true);
  };

  // Função para atualizar a data selecionada
  const aoMudarData = (evento, dataSelecionada) => {
    setMostrarDatePicker(Platform.OS === 'ios');
    if (evento.type === 'set' || evento.type === 'dismissed') {
      if (dataSelecionada) {
        setDataAssistir(dataSelecionada);
      }
    }
  };

  // Função para selecionar imagem da galeria
  const selecionarImagem = async () => {
    try {
      // Fechar o teclado se estiver aberto
      Keyboard.dismiss();

      // Abrir a galeria
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [16, 9],
      });

      if (
        !resultado.canceled &&
        resultado.assets &&
        resultado.assets.length > 0
      ) {
        setImagemSelecionada(resultado.assets[0]);
      }
    } catch (erro) {
      console.error('Erro ao selecionar imagem:', erro);
      alert('Não foi possível selecionar a imagem. Tente novamente.');
    }
  };

  // Função para remover a imagem selecionada
  const removerImagem = () => {
    setImagemSelecionada(null);
  };

  // Função para validar os campos
  const validarCampos = () => {
    const novosErros = {
      nomeFilme: '',
      geral: '',
    };
    let valido = true;

    // Validar nome do filme (obrigatório)
    if (!nomeFilme.trim()) {
      novosErros.nomeFilme = 'O nome do filme é obrigatório';
      valido = false;
    }

    setErros(novosErros);
    return valido;
  };

  // Função para salvar edição do filme
  const salvarEdicao = async () => {
    // Validação dos campos
    if (!validarCampos()) {
      return;
    }

    try {
      setCarregando(true);

      // Preparar dados do filme editado
      const filmeEditado = {
        nome: nomeFilme.trim(),
        imagem:
          imagemSelecionada?.uri ||
          'https://via.placeholder.com/300x150?text=Sem+Imagem',
        dataLancamento: dataAssistir ? dataAssistir.toISOString() : null,
        descricao: descricao.trim(),
      };

      // Chamar a função de callback para editar o filme
      if (aoEditar) {
        await aoEditar(filme.id, filmeEditado);
      }

      // Fechar modo de edição e o modal
      setModoEdicao(false);

      // Exibir confirmação
      Alert.alert('Sucesso', 'Filme atualizado com sucesso!', [
        { text: 'OK', onPress: aoFechar },
      ]);
    } catch (erro) {
      console.error('Erro ao editar filme:', erro);
      setErros({
        ...erros,
        geral: 'Erro ao editar filme. Tente novamente.',
      });
    } finally {
      setCarregando(false);
    }
  };

  // Função para confirmar exclusão
  const confirmarExclusao = () => {
    setConfirmacaoExclusao(true);
  };

  // Função para executar a exclusão
  const executarExclusao = async () => {
    try {
      setCarregando(true);

      // Chamar a função de callback para deletar o filme
      if (aoDeletar) {
        await aoDeletar(filme.id);
      }

      // Fechar o modal após excluir
      setConfirmacaoExclusao(false);

      // Exibir confirmação
      Alert.alert('Sucesso', 'Filme excluído com sucesso!', [
        { text: 'OK', onPress: aoFechar },
      ]);
    } catch (erro) {
      console.error('Erro ao excluir filme:', erro);
      Alert.alert('Erro', 'Não foi possível excluir o filme. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar edição ou exclusão
  const cancelarOperacao = () => {
    setModoEdicao(false);
    setConfirmacaoExclusao(false);
  };

  // Dimensões da tela para ajustar o modal
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = width < 375 || height < 667;

  // Renderizar confirmação de exclusão
  if (confirmacaoExclusao) {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={visivel}
        onRequestClose={aoFechar}
      >
        <TouchableWithoutFeedback onPress={cancelarOperacao}>
          <View style={estilosAdicionarFilme.centeredView}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={[estilosAdicionarFilme.modalView, { padding: 20 }]}>
                <Text style={estilosAdicionarFilme.modalTitulo}>
                  Confirmar Exclusão
                </Text>

                <Text style={styles.mensagemConfirmacao}>
                  Tem certeza que deseja excluir o filme "{filme?.nome}"?
                </Text>

                <View style={estilosAdicionarFilme.modalBotoesContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      estilosAdicionarFilme.botaoModal,
                      estilosAdicionarFilme.botaoCancelar,
                      pressed && estilosAdicionarFilme.botaoPressionado,
                    ]}
                    onPress={cancelarOperacao}
                  >
                    <Text style={estilosAdicionarFilme.textoBotaoCancelar}>
                      Cancelar
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      estilosAdicionarFilme.botaoModal,
                      styles.botaoExcluir,
                      pressed && estilosAdicionarFilme.botaoPressionado,
                    ]}
                    onPress={executarExclusao}
                    disabled={carregando}
                  >
                    <Text style={estilosAdicionarFilme.textoBotaoAcao}>
                      {carregando ? 'Excluindo...' : 'Excluir'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // Renderizar modo de edição
  if (modoEdicao) {
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
            style={estilosAdicionarFilme.centeredView}
          >
            <View
              style={[
                estilosAdicionarFilme.modalView,
                isSmallScreen && { padding: 15 },
              ]}
            >
              {/* Título do modal */}
              <Text style={estilosAdicionarFilme.modalTitulo}>
                Editar Filme
              </Text>

              {/* Mensagem de erro geral */}
              {erros.geral ? (
                <Text style={estilosAdicionarFilme.mensagemErro}>
                  {erros.geral}
                </Text>
              ) : null}

              {/* Campo de nome do filme (obrigatório) */}
              <View style={estilosAdicionarFilme.campoContainer}>
                <Text style={estilosAdicionarFilme.campoLabel}>
                  Nome do Filme
                </Text>
                <TextInput
                  style={estilosAdicionarFilme.campoInput}
                  placeholder='Nome do filme'
                  placeholderTextColor='#999'
                  value={nomeFilme}
                  onChangeText={(texto) => {
                    setNomeFilme(texto);
                    if (erros.nomeFilme) {
                      setErros({ ...erros, nomeFilme: '' });
                    }
                  }}
                  maxLength={100}
                  multiline={false}
                />
                {erros.nomeFilme ? (
                  <Text style={estilosAdicionarFilme.mensagemErro}>
                    {erros.nomeFilme}
                  </Text>
                ) : null}
              </View>

              {/* Seletor de imagem */}
              <View style={estilosAdicionarFilme.campoContainer}>
                <Text style={estilosAdicionarFilme.campoLabel}>
                  Imagem do Filme
                </Text>
                <TouchableOpacity
                  style={estilosAdicionarFilme.botaoSelecionarImagem}
                  onPress={selecionarImagem}
                  activeOpacity={0.7}
                >
                  <Text
                    style={estilosAdicionarFilme.textoBotaoSelecionarImagem}
                  >
                    Selecionar imagem do dispositivo
                  </Text>
                </TouchableOpacity>

                {/* Preview da imagem */}
                {imagemSelecionada && (
                  <View style={estilosAdicionarFilme.previewContainer}>
                    <Image
                      source={{ uri: imagemSelecionada.uri }}
                      style={estilosAdicionarFilme.previewImagem}
                      resizeMode='cover'
                    />
                    <TouchableOpacity
                      style={estilosAdicionarFilme.botaoRemoverImagem}
                      onPress={removerImagem}
                    >
                      <Text
                        style={estilosAdicionarFilme.textoBotaoRemoverImagem}
                      >
                        Remover
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Campo de data */}
              <View style={estilosAdicionarFilme.campoContainer}>
                <Text style={estilosAdicionarFilme.campoLabel}>
                  Quando vou assistir?
                </Text>
                <TouchableOpacity
                  onPress={abrirDatePicker}
                  style={estilosAdicionarFilme.datePickerContainer}
                >
                  <Text
                    style={
                      dataAssistir
                        ? estilosAdicionarFilme.datePickerText
                        : estilosAdicionarFilme.datePickerPlaceholder
                    }
                  >
                    {dataAssistir
                      ? formatarData(dataAssistir)
                      : 'Selecione a data'}
                  </Text>
                </TouchableOpacity>
                {mostrarDatePicker && (
                  <DateTimePicker
                    value={dataAssistir || new Date()}
                    mode='date'
                    display='default'
                    onChange={aoMudarData}
                  />
                )}
              </View>

              {/* Campo de descrição */}
              <View style={estilosAdicionarFilme.campoContainer}>
                <Text style={estilosAdicionarFilme.campoLabel}>Descrição</Text>
                <TextInput
                  style={estilosAdicionarFilme.campoTextArea}
                  placeholder='Descrição do filme...'
                  placeholderTextColor='#999'
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={144}
                  textAlignVertical='top'
                />
              </View>

              {/* Botões de ação */}
              <View style={estilosAdicionarFilme.modalBotoesContainer}>
                <Pressable
                  style={({ pressed }) => [
                    estilosAdicionarFilme.botaoModal,
                    estilosAdicionarFilme.botaoCancelar,
                    pressed && estilosAdicionarFilme.botaoPressionado,
                  ]}
                  onPress={cancelarOperacao}
                >
                  <Text style={estilosAdicionarFilme.textoBotaoCancelar}>
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    estilosAdicionarFilme.botaoModal,
                    estilosAdicionarFilme.botaoAcao,
                    pressed && estilosAdicionarFilme.botaoPressionado,
                  ]}
                  onPress={salvarEdicao}
                  disabled={carregando}
                >
                  <Text style={estilosAdicionarFilme.textoBotaoAcao}>
                    {carregando ? 'Salvando...' : 'Salvar'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // Renderizar visualização de detalhes (modo padrão)
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visivel}
      onRequestClose={aoFechar}
    >
      <TouchableWithoutFeedback onPress={aoFechar}>
        <View style={estilosAdicionarFilme.centeredView}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[estilosAdicionarFilme.modalView, styles.modalViewDetails]}
            >
              {/* Cabeçalho com título e botão de fechar */}
              <View style={styles.headerContainer}>
                <Text style={estilosAdicionarFilme.modalTitulo}>
                  Detalhes do Filme
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={aoFechar}
                >
                  <FontAwesome
                    name='times'
                    size={22}
                    color='#444'
                  />
                </TouchableOpacity>
              </View>

              {/* Imagem do filme */}
              <View style={styles.imagemContainer}>
                <Image
                  source={{ uri: filme?.imagem }}
                  style={styles.imagemFilme}
                  resizeMode='cover'
                />
              </View>

              {/* Dados do filme */}
              <View style={styles.infoContainer}>
                <Text style={styles.tituloFilme}>{filme?.nome}</Text>

                <View style={styles.dataContainer}>
                  <FontAwesome
                    name='calendar'
                    size={16}
                    color='#777'
                  />
                  <Text style={styles.dataText}>
                    {filme?.dataLancamento
                      ? formatarData(filme.dataLancamento)
                      : 'Data não definida'}
                  </Text>
                </View>

                <Text style={styles.descricaoLabel}>Descrição:</Text>
                <Text style={styles.descricaoFilme}>
                  {filme?.descricao || 'Sem descrição disponível.'}
                </Text>
              </View>

              {/* Botões de ação */}
              <View style={styles.botoesAcaoContainer}>
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoEditar]}
                  onPress={() => setModoEdicao(true)}
                >
                  <FontAwesome
                    name='edit'
                    size={18}
                    color='#fff'
                  />
                  <Text style={styles.textoBotaoAcao}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoExcluir]}
                  onPress={confirmarExclusao}
                >
                  <FontAwesome
                    name='trash'
                    size={18}
                    color='#fff'
                  />
                  <Text style={styles.textoBotaoAcao}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Estilos específicos para este modal
const styles = StyleSheet.create({
  modalViewDetails: {
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  closeButton: {
    padding: 5,
  },
  imagemContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  imagemFilme: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tituloFilme: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dataText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 8,
  },
  descricaoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  descricaoFilme: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  botoesAcaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  botaoAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
  },
  botaoEditar: {
    backgroundColor: '#4CAF50',
  },
  botaoExcluir: {
    backgroundColor: '#f44336',
  },
  textoBotaoAcao: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mensagemConfirmacao: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
});

export default ModalDetalhesFilme;
