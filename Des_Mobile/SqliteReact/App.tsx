import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { CriaBanco, criaTabela, insereDados, dropTabela, selectTodos } from './Conf/Bd';
import { useEffect } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';
 
export default function App() {
async function Main() {
  const db = await CriaBanco();
  if (db) {
    //dropTabela(db);
    criaTabela(db);
    //insereDados(db, "José", "jose@fatec.com");
    const registro = selectTodos(db);

    for(const linhas of registro) {
      console.log(linhas.ID_US, linhas.NOME_US, linhas.EMAIL_US);
    }
  }
}
 
  useEffect(() => {
    Main();
  }, []);
 
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});