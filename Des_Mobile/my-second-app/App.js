import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { 
  Button, 
  Provider as PaperProvider, 
  TextInput, 
  Card, 
  Chip,
  Surface,
  IconButton,
  MD3LightTheme
} from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
  },
};

function AppContent() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);

  const buscarCep = () => {
    const cleanValue = cep.replace(/\D/g, '');
    if (cleanValue.length === 8) {
      let url = `https://viacep.com.br/ws/${cleanValue}/json/`;
      fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Dados do CEP:', data);
        if (data.erro) {
          Alert.alert('Erro', 'CEP não encontrado!');
          setEndereco(null);
        } else {
          setEndereco(data);
        }
      });
    } else {
      Alert.alert('Atenção', 'Digite um CEP válido com 8 dígitos!');
    }
  };

  const formatCep = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return cleaned.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  };

  const handleCepChange = (text) => {
    const formatted = formatCep(text);
    setCep(formatted);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F2F8', padding: 20, paddingTop: 60 }}>
      <Surface style={{ padding: 20, marginBottom: 20, borderRadius: 12, elevation: 2 }}>
        <TextInput
          label="Digite o CEP"
          placeholder="00000-000"
          value={cep}
          onChangeText={handleCepChange}
          keyboardType="numeric"
          maxLength={9}
          mode="outlined"
          left={<TextInput.Icon icon="map-marker" />}
          style={{ backgroundColor: 'transparent' }}
        />
      </Surface>

      {endereco && (
        <Card style={{ marginBottom: 20, borderRadius: 12, elevation: 3 }}>
          <Card.Title 
            title="Endereço Encontrado" 
            left={(props) => <IconButton {...props} icon="check-circle" iconColor="#4CAF50" />}
          />
          <Card.Content>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Chip icon="map-marker" style={{ marginBottom: 8 }}>CEP: {endereco.cep}</Chip>
              {endereco.logradouro && (
                <Chip icon="road" style={{ marginBottom: 8 }}>Rua: {endereco.logradouro}</Chip>
              )}
              {endereco.bairro && (
                <Chip icon="home-city" style={{ marginBottom: 8 }}>Bairro: {endereco.bairro}</Chip>
              )}
              <Chip icon="city" style={{ marginBottom: 8 }}>Cidade: {endereco.localidade}</Chip>
              <Chip icon="map" style={{ marginBottom: 8 }}>Estado: {endereco.uf}</Chip>
            </View>
          </Card.Content>
        </Card>
      )}

      <Button 
        mode="contained" 
        onPress={buscarCep}
        style={{ borderRadius: 8, marginTop: 10 }}
        icon="magnify"
      >
        Buscar CEP
      </Button>
    </View>
  )
}



export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppContent />
    </PaperProvider>
  );
}