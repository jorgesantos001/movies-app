import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const API_READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDZlNTgyZmQzZDc0YzE1NGRiYTgwNjE1YWFiOTIwMCIsIm5iZiI6MTc0MzU0NzMzNC43NjgsInN1YiI6IjY3ZWM2YmM2ZjVhZTcxNDM1ZGFhZDA5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AK7MsyPB6pq4OfyeJ0pRIMJflgN_wKM_laD3_Ghztyk';
const BASE_URL = 'https://api.themoviedb.org/3';

export default function Cards() {
  const [searchText, setSearchText] = useState('');
  const [cards, setCards] = useState([]);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const userEmail = route.params?.email;

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const stored = await AsyncStorage.getItem(`movies_${userEmail}`);
        if (stored) setCards(JSON.parse(stored));

        const user = await AsyncStorage.getItem('user');
        if (user) setUserName(JSON.parse(user).nome);
      } catch (err) {
        console.error('Erro ao carregar os filmes:', err);
      }
    };
    loadMovies();
  }, []);

  const salvarFilmes = async (listaAtualizada) => {
    try {
      await AsyncStorage.setItem(`movies_${userEmail}`, JSON.stringify(listaAtualizada));
    } catch (err) {
      console.error('Erro ao salvar filmes:', err);
    }
  };

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
      );

      const movie = response.data.results[0];
      if (!movie) {
        Alert.alert('Filme não encontrado!');
        return;
      }

      const alreadyExists = cards.find(item => item.id === movie.id);
      if (alreadyExists) {
        Alert.alert('Filme já adicionado!');
        return;
      }

      const novoCard = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        status: movie.release_date ? 'Lançado' : 'Desconhecido',
        fullData: movie,
      };

      const novaLista = [...cards, novoCard];
      setCards(novaLista);
      salvarFilmes(novaLista);
      setSearchText('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao buscar o filme.');
    }
  };

  const handleDelete = (id) => {
    const novaLista = cards.filter(card => card.id !== id);
    setCards(novaLista);
    salvarFilmes(novaLista);
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
          <Text style={styles.detailsText}>DETALHES</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>EXCLUIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Olá, {userName || 'usuário'}! Adicione seus filmes favoritos:</Text>

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
        numColumns={1}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCard}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum filme adicionado ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#1c1c1c' },
  header: { fontSize: 20, color: '#fff', marginBottom: 10, textAlign: 'center' },
  searchContainer: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  input: { flex: 1, backgroundColor: '#333', padding: 10, borderRadius: 8, color: '#fff' },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    marginRight: 8,
    width: '100%',
    height: 380,
    justifyContent: 'flex-start',
  },
  poster: {
    width: 170,
    height: 235,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  status: { color: '#ccc', marginBottom: 8, fontSize: 12 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  detailsButton: {
    backgroundColor: '#00C897',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#c70039',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  detailsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
