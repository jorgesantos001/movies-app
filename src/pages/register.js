import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");
  const [senha, setSenha] = useState("");
  const navigation = useNavigation();

  const handleCadastro = async () => {
    if (!nome || !telefone || !cpf || !email || !curso || !senha) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    const userData = {
      nome,
      telefone,
      cpf,
      email,
      curso,
      senha,
    };

    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      Alert.alert("Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao salvar o usuário");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#ccc"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor="#ccc"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#ccc"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Curso"
        placeholderTextColor="#ccc"
        value={curso}
        onChangeText={setCurso}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#292F33",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: "100%",
    color: "#fff",
  },
  button: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Register;
