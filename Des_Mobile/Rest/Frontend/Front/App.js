import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { useEffect } from "react";

export default function App() {
  const getHostFromExpo = () => {
    const debuggerHost =
      Constants.manifest?.debuggerHost || Constants.expoConfig?.hostUri;
    if (debuggerHost) {
      return debuggerHost.split(":")[0];
    }
    return null;
  };

  const host = getHostFromExpo();
  // const url = "http://10.0.2.2:3000/";
  // const url = "http://192.168.50.54:3000/";
  const url = host ? `http://${host}:3000/` : "http://localhost:3000/";
  const id = "68b8dc3242b070ce2c624af0";

  const ExibirDados = (url) => {
    fetch(`${url}users`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const inserirUser = (url) => {
    fetch(`${url}users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Maria",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deletarUser = (url) => {
    fetch(`${url}users/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateUser = (url) => {
    fetch(`${url}users/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Evellin Lima",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Button title="Exibir Dados" onPress={() => ExibirDados(url)} />
      <StatusBar style="auto" />
      <Button title="Inserir Dados" onPress={() => inserirUser(url)} />
      <StatusBar style="auto" />
      <Button title="Deletar por ID" onPress={() => deletarUser(url)} />
      <StatusBar style="auto" />
      <Button title="Atualizar por ID" onPress={() => updateUser(url)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
