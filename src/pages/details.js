import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const API_READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDZlNTgyZmQzZDc0YzE1NGRiYTgwNjE1YWFiOTIwMCIsIm5iZiI6MTc0MzU0NzMzNC43NjgsInN1YiI6IjY3ZWM2YmM2ZjVhZTcxNDM1ZGFhZDA5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AK7MsyPB6pq4OfyeJ0pRIMJflgN_wKM_laD3_Ghztyk';
const BASE_URL = 'https://api.themoviedb.org/3';

export default function Details({ route, navigation }) {
  const { movie } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/movie/${movie.id}`, {
        headers: {
          Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        setMovieDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar detalhes:', err);
        setLoading(false);
      });
  }, [movie.id]);

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating / 2);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < filledStars ? 'star' : 'star-outline'}
          size={20}
          color="#F3A712"
        />
      );
    }

    return <View style={styles.starContainer}>{stars}</View>;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Erro ao carregar os detalhes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          style={styles.poster}
          source={{ uri: `${IMAGE_BASE_URL}${movieDetails.poster_path}` }}
        />

        <Text style={styles.title}>{movieDetails.title}</Text>
        {renderStars(movieDetails.vote_average)}

        <Text style={styles.text}>🎬 Lançamento: {movieDetails.release_date}</Text>
        <Text style={styles.text}>⏱ Duração: {movieDetails.runtime} min</Text>
        <Text style={styles.text}>🔥 Popularidade: {movieDetails.popularity}</Text>
        <Text style={styles.text}>📚 Gêneros: {movieDetails.genres.map(g => g.name).join(', ')}</Text>

        <Text style={styles.overviewTitle}>Sinopse</Text>
        <Text style={styles.overview}>{movieDetails.overview}</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#292F33',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#292F33',
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#F3A712',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    marginVertical: 2,
    textAlign: 'center',
  },
  overviewTitle: {
    fontSize: 20,
    color: '#F3A795',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  overview: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'justify',
    lineHeight: 24,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  favoriteButton: {
    flexDirection: 'row',
    backgroundColor: '#F3A712',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  favoriteText: {
    color: '#292F33',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});
