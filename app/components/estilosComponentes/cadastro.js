import { StyleSheet } from 'react-native';
import estilos from '../../estilos/styles'; // Importando as cores do arquivo global

const estilosCadastro = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: 0,
  },
  modalView: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: estilos.CORES.fundoModal,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: estilos.CORES.corPrimaria,
    marginBottom: 20,
    textAlign: 'center',
  },

  // Estilos dos campos
  campoContainer: {
    width: '100%',
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  campoLabel: {
    fontSize: 16,
    color: estilos.CORES.textoPrincipal,
    marginBottom: 6,
  },
  campoInput: {
    backgroundColor: estilos.CORES.fundoPrincipal,
    borderWidth: 1,
    borderColor: estilos.CORES.bordaInput,
    borderRadius: 8,
    padding: 12,
    color: estilos.CORES.textoPrincipal,
    width: '100%',
    height: 48,
    fontSize: 16,
    textAlignVertical: 'center', // Centraliza o texto verticalmente
    includeFontPadding: false, // Remove o padding padrão da fonte
    paddingTop: 0, // Remove padding superior
    paddingBottom: 0, // Remove padding inferior
  },
  campoSenhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: estilos.CORES.fundoPrincipal,
    borderWidth: 1,
    borderColor: estilos.CORES.bordaInput,
    borderRadius: 8,
    width: '100%',
    height: 48, // Altura fixa em vez de min/max height
  },
  campoSenhaInput: {
    flex: 1,
    padding: 12,
    color: estilos.CORES.textoPrincipal,
    fontSize: 16,
    height: 48, // Altura fixa
    textAlignVertical: 'center', // Centraliza o texto verticalmente
    includeFontPadding: false, // Remove o padding padrão da fonte
    paddingTop: 0, // Remove padding superior
    paddingBottom: 0, // Remove padding inferior
  },
  iconeOlho: {
    padding: 12,
    height: 48, // Altura fixa para o ícone
    justifyContent: 'center', // Centraliza o ícone verticalmente
    alignItems: 'center', // Centraliza o ícone horizontalmente
  },

  // Estilos dos botões
  modalBotoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  botaoCancelar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: estilos.CORES.corPrimaria,
    marginRight: 10,
    flex: 0.4,
  },
  textoBotaoCancelar: {
    color: estilos.CORES.corPrimaria,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  botaoAcao: {
    backgroundColor: estilos.CORES.corPrimariaEscura,
    flex: 0.6,
  },
  textoBotaoAcao: {
    color: estilos.CORES.textoPrincipal,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  botaoModal: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPressionado: {
    opacity: 0.2,
  },

  // Estilos de mensagens de erro
  mensagemErro: {
    color: estilos.CORES.corPrimaria,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});

export default estilosCadastro;
