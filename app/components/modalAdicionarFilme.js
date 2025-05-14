import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import estilosAdicionarFilme from './estilosComponentes/adicionarFilme'; // Importando os estilos específicos

/**
 * Modal para adicionar um novo filme à lista
 * @param {boolean} visivel - Estado de visibilidade do modal
 * @param {function} aoFechar - Função executada ao fechar o modal
 * @param {function} aoAdicionar - Função executada ao adicionar um filme
 */
const ModalAdicionarFilme = ({ visivel, aoFechar, aoAdicionar }) => {
  // Estados para controle dos campos
  const [nomeFilme, setNomeFilme] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [dataLancamento, setDataLancamento] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({
    nomeFilme: '',
    geral: '',
  });

  // Solicitar permissões ao montar o componente
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Precisamos de permissão para acessar suas imagens!');
        }
      }
    })();
  }, []);

  // Formatar a data para exibição
  const formatarData = (data) => {
    if (!data) return '';
    return `${data.getDate().toString().padStart(2, '0')}/${(
      data.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${data.getFullYear()}`;
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
        setDataLancamento(dataSelecionada);
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

  // Função para limpar os campos e erros
  const limparCampos = () => {
    setNomeFilme('');
    setImagemSelecionada(null);
    setDataLancamento(null);
    setDescricao('');
    setErros({
      nomeFilme: '',
      geral: '',
    });
  };

  // Função para adicionar o filme
  const adicionarFilme = async () => {
    // Validação dos campos
    if (!validarCampos()) {
      return;
    }

    try {
      setCarregando(true);

      // Preparar dados do filme no formato esperado pela API
      const novoFilme = {
        nome: nomeFilme.trim(),
        imagem:
          imagemSelecionada?.uri ||
          'https://via.placeholder.com/300x150?text=Sem+Imagem',
        dataLancamento: dataLancamento ? dataLancamento.toISOString() : null,
        descricao: descricao.trim(),
      };

      // Chamar a função de callback para adicionar o filme
      if (aoAdicionar) {
        await aoAdicionar(novoFilme);
      }

      // Limpar campos e fechar o modal
      limparCampos();
      aoFechar();
    } catch (erro) {
      console.error('Erro ao adicionar filme:', erro);
      setErros({
        ...erros,
        geral: 'Erro ao adicionar filme. Tente novamente.',
      });
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
              Adicionar Novo Filme
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
                <Text style={estilosAdicionarFilme.textoBotaoSelecionarImagem}>
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
                    <Text style={estilosAdicionarFilme.textoBotaoRemoverImagem}>
                      Remover
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Campo de data de lançamento (opcional) */}
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
                    dataLancamento
                      ? estilosAdicionarFilme.datePickerText
                      : estilosAdicionarFilme.datePickerPlaceholder
                  }
                >
                  {dataLancamento
                    ? formatarData(dataLancamento)
                    : 'Selecione a data'}
                </Text>
              </TouchableOpacity>
              {mostrarDatePicker && (
                <DateTimePicker
                  value={dataLancamento || new Date()}
                  mode='date'
                  display='default'
                  onChange={aoMudarData}
                />
              )}
            </View>

            {/* Campo de descrição (opcional) */}
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
                maxLength={144} // Ajustado para o limite do schema no backend
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
                onPress={aoFechar}
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
                onPress={adicionarFilme}
                disabled={carregando}
              >
                <Text style={estilosAdicionarFilme.textoBotaoAcao}>
                  {carregando ? 'Adicionando...' : 'Adicionar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalAdicionarFilme;
