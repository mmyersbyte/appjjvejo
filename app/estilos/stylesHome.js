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

// Export the color palette for use in other files if needed
export { CORES };

// Create and export the styles
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
    paddingVertical: 12,
  },
  infoUsuario: {
    flex: 1,
    marginRight: 16,
  },
  saudacao: {
    fontSize: 28,
    color: CORES.corPrimaria,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  biografia: {
    fontSize: 14,
    color: CORES.textoSecundario,
    lineHeight: 20,
  },
  imagemPerfil: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
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
  perfilContainer: {
    alignItems: 'center',
  },
  botaoLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.corPrimaria,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 8,
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
    borderRadius: 12,
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
