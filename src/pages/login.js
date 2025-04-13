import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    try {
      const usuariosSalvos = await AsyncStorage.getItem("users");
      const usuarios = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];

      const usuario = usuarios.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.senha === password
      );

      if (usuario) {
        Alert.alert("Login realizado com sucesso!");
        await AsyncStorage.setItem("user", JSON.stringify(usuario));
        navigation.navigate("Cards", { email: usuario.email });
        
        // Limpa os campos após o login bem-sucedido
        setEmail("");
        setPassword("");
        setErrorMessage("");
      } else {
        setErrorMessage("Login incorreto. Verifique seu e-mail e senha.");
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setErrorMessage("Erro interno ao realizar login.");
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleRegister}>
        <Text style={styles.secondaryButtonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#292F33",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    marginBottom: 25,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    width: "80%",
    color: "#fff",
    backgroundColor: "#3A3F45",
  },
  button: {
    backgroundColor: "#00C897",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 25,
    width: "80%",
    alignItems: "center",
    marginTop: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  secondaryButton: {
    borderColor: "#00C897",
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#00C897",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
