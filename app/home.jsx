import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá Usuário</Text>
        <Image
          source={{ uri: 'https://via.placeholder.com/48' }}
          style={styles.profileImage}
        />
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Main Content */}
      <View style={styles.main}>
        {/* Card 1 */}
        <ImageBackground
          source={{ uri: 'https://via.placeholder.com/300x150' }}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <Text style={styles.cardTitle}>Aventura Espacial</Text>
        </ImageBackground>

        {/* Card 2 */}
        <ImageBackground
          source={{ uri: 'https://via.placeholder.com/300x150' }}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <Text style={styles.cardTitle}>Drama Científico</Text>
        </ImageBackground>
      </View>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greeting: {
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: '#222',
  },
  cardImage: {
    resizeMode: 'cover',
    opacity: 0.8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
