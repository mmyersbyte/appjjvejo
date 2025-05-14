import { FontAwesome } from '@expo/vector-icons';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  return (
    <SafeAreaView style={estilos.contenedor}>
      {/* Header */}
      <View style={estilos.cabecalho}>
        <View style={estilos.infoUsuario}>
          <Text style={estilos.saudacao}>Olá Usuário</Text>
          <Text style={estilos.biografia}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
            justo in magna tincidunt faucibus. Nulla facilisi. Vivamus eget
            lectus vel nisi.
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://i.pinimg.com/736x/57/ca/8f/57ca8fc8ed53388ae9032a4df7f06234.jpg',
          }}
          style={estilos.imagemPerfil}
        />
      </View>

      {/* Separator */}
      <View style={estilos.separador} />

      {/* Main Content */}
      <View style={estilos.principal}>
        {/* Card 1 */}
        <TouchableOpacity activeOpacity={0.9}>
          <ImageBackground
            source={{
              uri: 'https://i.pinimg.com/736x/37/1d/09/371d09b7cceed0256e8ad4f01b9fa9d8.jpg',
            }}
            style={estilos.cartao}
            imageStyle={estilos.imagemCartao}
          >
            <View style={estilos.gradienteCartao}>
              <Text style={estilos.tituloCartao}>Aventura Espacial</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Card 2 */}
        <TouchableOpacity activeOpacity={0.9}>
          <ImageBackground
            source={{
              uri: 'https://i.pinimg.com/736x/37/1d/09/371d09b7cceed0256e8ad4f01b9fa9d8.jpg',
            }}
            style={estilos.cartao}
            imageStyle={estilos.imagemCartao}
          >
            <View style={estilos.gradienteCartao}>
              <Text style={estilos.tituloCartao}>Drama Científico</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      {/* Floating Button */}
      <TouchableOpacity
        style={estilos.botaoFlutuante}
        activeOpacity={0.7}
      >
        <FontAwesome
          name='plus'
          size={24}
          color='#fff'
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoUsuario: {
    flex: 1,
    marginRight: 16,
  },
  saudacao: {
    fontSize: 28,
    color: '#FF3B30',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  biografia: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  imagemPerfil: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  separador: {
    height: 1,
    backgroundColor: '#333',
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
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  botaoFlutuante: {
    position: 'absolute',
    bottom: 24,
    right: 24, // Changed from left to right
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
