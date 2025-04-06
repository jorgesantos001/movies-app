import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_READ_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDZlNTgyZmQzZDc0YzE1NGRiYTgwNjE1YWFiOTIwMCIsIm5iZiI6MTc0MzU0NzMzNC43NjgsInN1YiI6IjY3ZWM2YmM2ZjVhZTcxNDM1ZGFhZDA5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AK7MsyPB6pq4OfyeJ0pRIMJflgN_wKM_laD3_Ghztyk";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Cards() {
  const [searchText, setSearchText] = useState('');
  const [cards, setCards] = useState([]);
  const navigation = useNavigation();

  const handleAddMovie = async () => {
    if (!searchText) {
      Alert.alert('Digite o nome de um filme para buscar.');
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
            Accept: 'application/json',
          },
        }
      )

      const movie = response.data.results[0];

      const newCard = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        status: movie.release_date ? 'Lançado' : 'Desconhecido',
        fullData: movie,
      };

      const alreadyExists = cards.find(item => item.id === movie.id);
      if (alreadyExists) {
        Alert.alert('Filme já adicionado!');
        return;
      }

      setCards([...cards, newCard]);
      setSearchText('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao buscar o filme.');
    }
  };

  const handleDelete = (id) => {
    const updated = cards.filter(card => card.id !== id);
    setCards(updated);
  };

  const handleDetails = (data) => {
    navigation.navigate('Details', { movie: data });
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {item.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.poster}
        />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleDetails(item.fullData)} style={styles.detailsButton}>
          <Text style={styles.buttonText}>VER MAIS DETALHES</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>EXCLUIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adicionar Filmes</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Digite o nome do filme"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
        />
        <Button title="ADD" onPress={handleAddMovie} />
      </View>

      <FlatList
        data={cards}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCard}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum filme adicionado ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1c1c1c',
  },
  header: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  poster: {
    width: 150,
    height: 220,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  status: {
    color: '#ccc',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});
