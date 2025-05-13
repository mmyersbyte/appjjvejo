import { StyleSheet } from 'react-native';

// Vars de cores padronizadas
const CORES = {
  fundoPrincipal: '#1D1616',
  corPrimaria: '#D84040',
  corPrimariaEscura: '#8E1616',
  textoPrincipal: '#EEEEEE',
  fundoModal: '#2A2121',
  bordaInput: '#444',
  textoSecundario: '#CCCCCC',
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoPrincipal,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: CORES.corPrimaria,
  },
  subtitulo: {
    fontSize: 18,
    textAlign: 'center',
    color: CORES.textoPrincipal,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  subdiferente: {
    color: CORES.corPrimaria,
    fontWeight: 'bold',
    fontSize: 18,
  },
  animacao: {
    width: '100%',
    height: 400,
    marginBottom: 10,
  },
  subtitulo2: {
    fontSize: 16,
    textAlign: 'center',
    color: CORES.textoPrincipal,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  esqueci: {
    color: CORES.corPrimaria,
  },
  botao: {
    backgroundColor: CORES.corPrimariaEscura,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: '86%',
  },
  botaoPressionado: {
    opacity: 0.2,
  },
  linhaBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconeEsquerdo: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCentral: {
    flex: 1,
    alignItems: 'center',
  },
  iconeDireito: {
    width: 50,
  },
  textoBotao: {
    color: CORES.textoPrincipal,
    fontWeight: '600',
    fontSize: 16,
  },

  // Exportando as cores para uso direto
  CORES,
});

export default estilos;
