import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Provider as PaperProvider, 
  TextInput, 
  Button, 
  Card, 
  Text,
  Surface,
  useTheme,
  Colors
} from 'react-native-paper';

export default function App() {
  const [cep, setCep] = useState('');
  const [cepData, setCepData] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscaCep = (value) => {
    if (!value || value.length < 8) {
      alert('Digite um CEP válido');
      return;
    }

    setLoading(true);
    let url = `https://viacep.com.br/ws/${value}/json/`;
    fetch(url)
      .then((response) => { return response.json()})
      .then((data) => { 
        console.log(data);
        if (data.erro) {
          alert('CEP não encontrado');
          setCepData(null);
        } else {
          setCepData(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP');
        setLoading(false);
      })
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <Surface style={styles.header}>
            <Text style={styles.title}>Consulta de CEP</Text>
            <Text style={styles.subtitle}>
              Digite um CEP para buscar informações do endereço
            </Text>
          </Surface>

          <Card style={styles.inputCard}>
            <Card.Content>
              <TextInput
                label="Digite o CEP"
                value={cep}
                onChangeText={setCep}
                mode="outlined"
                placeholder="Ex: 12345-678"
                keyboardType="numeric"
                maxLength={9}
                style={styles.input}
                left={<TextInput.Icon icon="map-marker" />}
              />
              
              <Button
                mode="contained"
                onPress={() => buscaCep(cep)}
                loading={loading}
                disabled={loading || !cep}
                style={styles.button}
                icon="magnify"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </Card.Content>
          </Card>

          {cepData && (
            <Card style={styles.resultCard}>
              <Card.Content>
                <Text style={styles.resultTitle}>Dados do Endereço</Text>
                
                <View style={styles.dataRow}>
                  <Text style={styles.label}>CEP:</Text>
                  <Text style={styles.value}>{cepData.cep}</Text>
                </View>
                
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Logradouro:</Text>
                  <Text style={styles.value}>{cepData.logradouro}</Text>
                </View>
                
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Bairro:</Text>
                  <Text style={styles.value}>{cepData.bairro}</Text>
                </View>
                
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Cidade:</Text>
                  <Text style={styles.value}>{cepData.localidade}</Text>
                </View>
                
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Estado:</Text>
                  <Text style={styles.value}>{cepData.uf}</Text>
                </View>
                
                <View style={styles.dataRow}>
                  <Text style={styles.label}>DDD:</Text>
                  <Text style={styles.value}>{cepData.ddd}</Text>
                </View>
                
                {cepData.complemento && (
                  <View style={styles.dataRow}>
                    <Text style={styles.label}>Complemento:</Text>
                    <Text style={styles.value}>{cepData.complemento}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 40,
  },
  header: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1976d2',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  inputCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 4,
  },
  resultCard: {
    borderRadius: 12,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1976d2',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
});
