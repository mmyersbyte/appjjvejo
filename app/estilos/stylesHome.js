import { StyleSheet } from 'react-native';

// Color palette
const CORES = {
  fundoPrincipal: '#1D1616',
  corPrimaria: '#D84040',
  corPrimariaEscura: '#8E1616',
  textoPrincipal: '#EEEEEE',
  fundoModal: '#2A2121',
  bordaInput: '#444',
  textoSecundario: '#CCCCCC',
};

export { CORES };

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: CORES.fundoPrincipal,
    paddingTop: 30,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8, // reduzido para colocar saudação mais no topo
  },
  infoUsuario: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'flex-start', // garante saudação no topo
  },
  saudacao: {
    fontSize: 28,
    color: CORES.corPrimaria,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  biografia: {
    fontSize: 14,
    color: CORES.textoSecundario,
    lineHeight: 20,
  },
  perfilContainer: {
    flexDirection: 'row', // foto e botão lado a lado
    alignItems: 'center',
  },
  imagemPerfil: {
    width: 90,
    height: 90,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: CORES.corPrimaria,
  },
  separador: {
    height: 1,
    backgroundColor: CORES.bordaInput,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  principal: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cartao: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  imagemCartao: {
    resizeMode: 'cover',
  },
  gradienteCartao: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  tituloCartao: {
    color: CORES.textoPrincipal,
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  botaoLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.corPrimaria,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 10, // espaçamento à esquerda da foto
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textoLogout: {
    color: CORES.textoPrincipal,
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoAddFilme: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    height: 56,
    borderRadius: 50,
    backgroundColor: CORES.corPrimaria,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconeAddFilme: {
    marginRight: 10,
  },
  textoAddFilme: {
    color: CORES.textoPrincipal,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
