import { StyleSheet } from 'react-native';

// Cores do aplicativo
const CORES = {
  backgroundEscuro: '#202124',
  backgroundClaro: '#303134',
  corPrimaria: '#4285F4',
  corSecundaria: '#EA4335',
  textoPrincipal: '#EEEEEE',
  textoSecundario: '#AAAAAA',
  bordas: '#555555',
};

const estilosAdicionarFilme = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  modalView: {
    width: '100%',
    backgroundColor: CORES.backgroundClaro,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CORES.textoPrincipal,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },

  // Estilos dos campos
  campoContainer: {
    width: '100%',
    marginBottom: 16,
  },
  campoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: CORES.textoPrincipal,
    marginBottom: 6,
  },
  campoInput: {
    width: '100%',
    backgroundColor: CORES.backgroundEscuro,
    borderWidth: 1,
    borderColor: CORES.bordas,
    borderRadius: 8,
    padding: 12,
    color: CORES.textoPrincipal,
    fontSize: 16,
  },
  campoTextArea: {
    width: '100%',
    backgroundColor: CORES.backgroundEscuro,
    borderWidth: 1,
    borderColor: CORES.bordas,
    borderRadius: 8,
    padding: 12,
    color: CORES.textoPrincipal,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  datePickerContainer: {
    width: '100%',
    backgroundColor: CORES.backgroundEscuro,
    borderWidth: 1,
    borderColor: CORES.bordas,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  datePickerText: {
    color: CORES.textoPrincipal,
    fontSize: 16,
  },
  datePickerPlaceholder: {
    color: CORES.textoSecundario,
    fontSize: 16,
  },

  // Estilos do seletor de imagem
  botaoSelecionarImagem: {
    width: '100%',
    backgroundColor: CORES.backgroundEscuro,
    borderWidth: 1,
    borderColor: CORES.bordas,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoSelecionarImagem: {
    color: CORES.textoPrincipal,
    fontSize: 16,
    fontWeight: '500',
  },
  previewContainer: {
    width: '100%',
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CORES.bordas,
  },
  previewImagem: {
    width: '100%',
    height: 160,
    backgroundColor: CORES.backgroundEscuro,
  },
  botaoRemoverImagem: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoBotaoRemoverImagem: {
    color: CORES.textoPrincipal,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Estilos dos botões
  modalBotoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  botaoCancelar: {
    backgroundColor: CORES.corSecundaria,
    marginRight: 12,
  },
  botaoAcao: {
    backgroundColor: CORES.corPrimaria,
  },
  botaoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
  },
  botaoPressionado: {
    opacity: 0.8,
  },
  textoBotaoCancelar: {
    color: CORES.textoPrincipal,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textoBotaoAcao: {
    color: CORES.textoPrincipal,
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Estilos de mensagens de erro
  mensagemErro: {
    color: CORES.corSecundaria,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 2,
    alignSelf: 'flex-start',
  },
});

export default estilosAdicionarFilme;
