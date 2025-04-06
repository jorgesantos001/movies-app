import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Details({ route }) {
  const { movie } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.poster}
        source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.text}>Lançamento: {movie.release_date}</Text>
      <Text style={styles.text}>Popularidade: {movie.popularity}</Text>
      <Text style={styles.text}>Nota Média: {movie.vote_average}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    marginVertical: 5
  },
  overview: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'justify'
  }
});
